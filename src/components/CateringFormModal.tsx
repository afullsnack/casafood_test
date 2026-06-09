'use client'

import { CateringForm } from '@/components/forms/CateringForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'

interface CateringFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceName: string
}

export function CateringFormModal({ open, onOpenChange, serviceName }: CateringFormModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const formContent = <CateringForm serviceName={serviceName} onCancel={() => onOpenChange(false)} />

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>{'Tell us about your event'}</SheetTitle>
            <SheetDescription>
              Fill in the details below and we&apos;ll prepare a tailored proposal for you.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-8">{formContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{'Tell us about your event'}</DialogTitle>
          <DialogDescription>
            Fill in the details below and we&apos;ll prepare a tailored proposal for you.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
