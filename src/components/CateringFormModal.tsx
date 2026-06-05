'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import React, { useEffect, useState } from 'react'

import { FormBlock } from '@/blocks/Form/Component'
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
import { getClientSideURL } from '@/utilities/getURL'

interface CateringFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceName: string
}

export function CateringFormModal({ open, onOpenChange, serviceName }: CateringFormModalProps) {
  const [form, setForm] = useState<FormType | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setLoading(true)
    setForm(null)

    fetch(`${getClientSideURL()}/api/forms?where[title][equals]=Catering Inquiry`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          const formDoc = data.docs?.[0]
          if (formDoc) setForm(formDoc)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open])

  const formContent = loading ? (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground">Loading form...</p>
    </div>
  ) : form ? (
    <FormBlock form={form} enableIntro={false} blockType="formBlock" />
  ) : (
    <p className="text-muted-foreground py-8 text-center">
      Form not found. Please create a &quot;Catering Inquiry&quot; form in the admin panel.
    </p>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>{serviceName}</SheetTitle>
            <SheetDescription>Fill out the form to book this service.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-8">{formContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceName}</DialogTitle>
          <DialogDescription>Fill out the form to book this service.</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
