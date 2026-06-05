'use client'

import { usePageCart } from '@/providers/PageCart/context'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useCartExitGuard(pageContext: string | null) {
  const { pageItemCount, clearPageCart } = usePageCart()
  const router = useRouter()
  const showPrompt = useRef<boolean>(false)
  const pendingNavigationRef = useRef<string | null>(null)
  const isDirty = pageItemCount > 0 && pageContext !== null

  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'You have items in your cart.'
    }

    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    const guard =
      (fn: typeof history.pushState) =>
      (...args: Parameters<typeof history.pushState>) => {
        if (pendingNavigationRef.current) return
        pendingNavigationRef.current = String(args[2] || window.location.href)
        showPrompt.current = true
      }

    history.pushState = guard(originalPushState)
    history.replaceState = guard(originalReplaceState)

    const handlePopState = () => {
      if (!isDirty) return
      pendingNavigationRef.current = document.referrer || '/'
      showPrompt.current = true
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty])

  const handleGoToCheckout = useCallback(() => {
    showPrompt.current = false
    pendingNavigationRef.current = null
    if (pageContext) {
      router.push(`/checkout?context=${pageContext}`)
    }
  }, [pageContext, router])

  const handleLeaveAnyway = useCallback(() => {
    showPrompt.current = false
    clearPageCart().then(() => {
      const target = pendingNavigationRef.current
      pendingNavigationRef.current = null
      if (target) {
        router.push(target)
      }
    })
  }, [clearPageCart, router])

  const handleCancel = useCallback(() => {
    showPrompt.current = false
    pendingNavigationRef.current = null
  }, [])

  return {
    showPrompt: showPrompt.current,
    handleGoToCheckout,
    handleLeaveAnyway,
    handleCancel,
  }
}
