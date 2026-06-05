'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React from 'react'

type Props = {
  open: boolean
  onGoToCheckout: () => void
  onLeaveAnyway: () => void
  onCancel: () => void
}

export function CartExitGuard({ open, onGoToCheckout, onLeaveAnyway, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You have items in your cart</DialogTitle>
          <DialogDescription>
            Would you like to proceed to checkout before leaving this page?
            If you leave now, your cart items will be cleared.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onLeaveAnyway}>
            Leave Anyway
          </Button>
          <Button variant="default" onClick={onGoToCheckout}>
            Go to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
