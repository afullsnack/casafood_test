'use client'

import { Monitor, Moon, Smartphone, Sun } from 'lucide-react'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

// ============================================================================
// Hook Implementation
// ============================================================================

interface UseMediaQueryOptions {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === 'undefined'

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  React.useEffect(() => {
    const matchMedia = window.matchMedia(query)

    const handleChange = () => {
      setMatches(matchMedia.matches)
    }

    handleChange()

    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export type { UseMediaQueryOptions }

// ============================================================================
// Demo Component
// ============================================================================

function UseMediaQueryDemo() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Media Query Demo</h3>
        <p className="text-sm text-muted-foreground">Live responsive detection</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Screen Size</Label>
        <div className="min-h-[50px] flex items-center justify-center">
          <Badge className="text-lg px-4 py-2 gap-2" variant={isMobile ? 'default' : 'secondary'}>
            {isMobile ? <Smartphone size={18} /> : <Monitor size={18} />}
            {isMobile ? 'Mobile' : 'Desktop'}
          </Badge>
        </div>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Color Scheme Preference</Label>
        <div className="min-h-[50px] flex items-center justify-center">
          <Badge className="text-lg px-4 py-2 gap-2" variant={isDarkMode ? 'default' : 'secondary'}>
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            {isDarkMode ? 'Dark' : 'Light'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">All Query States</Label>
        <div className="border rounded p-2 min-h-[40px] flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge className="text-xs" variant="outline">
              Mobile: {isMobile ? 'Yes' : 'No'}
            </Badge>
            <Badge className="text-xs" variant="outline">
              Dark: {isDarkMode ? 'Yes' : 'No'}
            </Badge>
            <Badge className="text-xs" variant="outline">
              Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">Resize window or change system settings</div>
      </div>
    </div>
  )
}

export default UseMediaQueryDemo
