'use client'

import { Power, PowerOff, RotateCcw } from 'lucide-react'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// ============================================================================
// Hook Implementation
// ============================================================================

export function useUnmount(fn: () => void): void {
  if (typeof fn !== 'function') {
    throw new Error('useUnmount expects a function as argument')
  }

  const fnRef = React.useRef(fn)

  // Keep the function reference up to date
  fnRef.current = fn

  React.useEffect(() => {
    // Return the cleanup function that will be called on unmount
    return () => {
      console.log(`Should only run on unmount`)
      fnRef.current()
    }
  }, [])
}

// ============================================================================
// Demo Component
// ============================================================================

function DemoChild({ onUnmount }: { onUnmount: () => void }) {
  useUnmount(() => {
    onUnmount()
  })

  return (
    <div className="border-2 border-dashed rounded-lg p-4 text-center bg-primary/5">
      <Badge className="text-sm gap-1" variant="default">
        <Power size={14} />
        Child Mounted
      </Badge>
      <p className="text-xs text-muted-foreground mt-2">Will log on unmount</p>
    </div>
  )
}

function UseUnmountDemo() {
  const [isMounted, setIsMounted] = React.useState(true)
  const [unmountCount, setUnmountCount] = React.useState(0)
  const [lastUnmount, setLastUnmount] = React.useState<string | null>(null)

  const handleUnmount = React.useCallback(() => {
    setUnmountCount((c) => c + 1)
    setLastUnmount(new Date().toLocaleTimeString())
  }, [])

  const toggle = () => setIsMounted((m) => !m)

  const reset = () => {
    setIsMounted(true)
    setUnmountCount(0)
    setLastUnmount(null)
  }

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Unmount Hook Demo</h3>
        <p className="text-sm text-muted-foreground">Cleanup on component unmount</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Child Component</Label>
        <div className="min-h-[80px] flex items-center justify-center">
          {isMounted ? (
            <DemoChild onUnmount={handleUnmount} />
          ) : (
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Badge className="text-sm gap-1" variant="secondary">
                <PowerOff size={14} />
                Unmounted
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Controls</Label>
        <div className="grid grid-cols-2 gap-2 min-h-[36px]">
          <Button
            className="text-sm h-9"
            onClick={toggle}
            size="sm"
            variant={isMounted ? 'destructive' : 'default'}
          >
            {isMounted ? 'Unmount' : 'Mount'}
          </Button>
          <Button className="text-sm h-9 gap-1" onClick={reset} size="sm" variant="outline">
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Unmount Events</Label>
          <Badge className="text-xs" variant="outline">
            {unmountCount}
          </Badge>
        </div>
        <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
          <code className="text-xs">
            {lastUnmount ? `Last: ${lastUnmount}` : 'No unmounts yet'}
          </code>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">Callback always has fresh state via ref</div>
      </div>
    </div>
  )
}

export default UseUnmountDemo
