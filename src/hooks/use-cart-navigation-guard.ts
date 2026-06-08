'use client'

import { usePageCart } from '@/providers/PageCart/context'
import { useRouter } from 'next/navigation'
import { useNavigationGuard } from 'next-navigation-guard'
import { useCallback } from 'react'

type GuardParams = { to: string; type: string }

/**
 * Guards against abandoning a page-scoped cart while it still has items.
 *
 * When the cart (which belongs to a parent page — `food-hub`, `restaurant`,
 * `bulk-order`) has items, the only navigations allowed silently are within the
 * shopping flow:
 *   - the parent page itself and any of its sub-routes (e.g. its `/cart`)
 *   - the checkout flow (`/checkout`)
 *   - product detail pages (`/products/...`)
 *
 * Every other destination — another parent page, the home page, any other
 * route, or leaving the app entirely (`beforeunload`) — arms the prompt.
 *
 * This hooks into Next.js App Router client-side navigation through
 * `next-navigation-guard`, so it fires on SPA transitions (`<Link>` clicks,
 * `router.push/replace`, browser back/forward) as well as full unloads. It is
 * mounted once globally (see `<CartNavigationGuard />`) so it stays armed on the
 * cart, checkout and product routes too — not just the parent page.
 *
 * Reads the active context from the cart provider rather than a prop, so the
 * guard knows which parent page the dirty cart belongs to from any route.
 */
export function useCartNavigationGuard() {
  const { pageItemCount, pageContext, clearPageCart } = usePageCart()
  const router = useRouter()

  const isDirty = pageItemCount > 0 && pageContext !== null

  const enabled = useCallback(
    ({ to, type }: GuardParams) => {
      if (!isDirty || !pageContext) return false
      // Leaving the app (close tab / reload / external) always prompts.
      if (type === 'beforeunload') return true

      let path: string
      try {
        path = new URL(to, window.location.origin).pathname
      } catch {
        path = (to || '').split('?')[0].split('#')[0]
      }

      const withinParent = path === `/${pageContext}` || path.startsWith(`/${pageContext}/`)
      const withinCheckout = path === '/checkout' || path.startsWith('/checkout/')
      const withinProducts = path.startsWith('/products/')

      // Guard (return true) only when the destination is outside the flow.
      return !(withinParent || withinCheckout || withinProducts)
    },
    [isDirty, pageContext],
  )

  // No `confirm` callback -> the guard exposes async accept/reject handles and
  // flips `active` while a navigation is pending, surfaced via the custom modal.
  const { active, accept, reject } = useNavigationGuard({ enabled })

  const handleGoToCheckout = useCallback(() => {
    // Abandon the pending navigation, then route to checkout (whitelisted above
    // so this push is not re-guarded).
    reject()
    if (pageContext) {
      router.push(`/checkout?context=${pageContext}`)
    }
  }, [reject, router, pageContext])

  const handleLeaveAnyway = useCallback(async () => {
    // Clear the cart so the flow ends cleanly, then let the navigation proceed.
    await clearPageCart()
    accept()
  }, [accept, clearPageCart])

  const handleCancel = useCallback(() => {
    reject()
  }, [reject])

  return {
    showPrompt: active,
    handleGoToCheckout,
    handleLeaveAnyway,
    handleCancel,
  }
}
