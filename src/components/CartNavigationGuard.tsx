'use client'

import { CartExitGuard } from '@/components/CartExitGuard'
import { useCartNavigationGuard } from '@/hooks/use-cart-navigation-guard'

/**
 * Mounted once at the app root so the page-cart navigation guard stays armed on
 * every route (parent pages, their cart, checkout and product pages), not just
 * the parent page grid.
 */
export function CartNavigationGuard() {
  const { showPrompt, handleGoToCheckout, handleLeaveAnyway, handleCancel } =
    useCartNavigationGuard()

  return (
    <CartExitGuard
      open={showPrompt}
      onGoToCheckout={handleGoToCheckout}
      onLeaveAnyway={handleLeaveAnyway}
      onCancel={handleCancel}
    />
  )
}
