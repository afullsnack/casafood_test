// hooks/useNavigationGuard.ts
import { useEffect, useCallback, useRef } from 'react'

export function useNavigationGuard(
  isDirty: boolean,
  message = 'You have unsaved changes. Leave anyway?',
) {
  const isDirtyRef = useRef(isDirty)
  isDirtyRef.current = isDirty

  useEffect(() => {
    // 1. Browser refresh / tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return
      e.preventDefault()
      e.returnValue = message
    }

    let active = false // guard is inactive until after mount settles
    const timer = setTimeout(() => {
      active = true
    }, 0)

    // 2. Patch pushState / replaceState for SPA navigation
    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    const guard =
      (fn: typeof history.pushState) =>
      (...args: Parameters<typeof history.pushState>) => {
        if (!active) {
          // Next.js internal navigation during mount — let it through
          fn(...args)
          return
        }
        if (window.confirm(message)) {
          fn(...args)
        }
      }

    history.pushState = guard(originalPushState)
    history.replaceState = guard(originalReplaceState)

    // 3. Browser back/forward
    const handlePopState = () => {
      if (!isDirtyRef.current) return
      const confirmed = window.confirm(message)
      if (!confirmed) {
        // Push the current URL back to counteract the popstate
        history.pushState(null, '', window.location.href)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      clearTimeout(timer)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      // window.removeEventListener('beforeunload', handleBeforeUnload)
      // window.removeEventListener('popstate', handlePopState)
    }
  }, []) // stable — reads from ref
}
