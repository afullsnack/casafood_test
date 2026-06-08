'use client'

import type { CartItem } from '@/components/Cart'
import { WhatsApp } from '@/components/icons/landing'
import { Button } from '@/components/ui/button'
import { formatNaira, variantIsPaySmallSmall } from '@/utilities/pricing'
import { ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'

type Props = {
  items: NonNullable<CartItem[]>
  count: number
  subtotal: number
  context: string
}

export function CartOrderSummary({ items, count, subtotal, context }: Props) {
  const hasPaySmallSmall = items.some((item) => variantIsPaySmallSmall(item.variant))

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Food Items ({count})</span>
        <span className="font-medium">{formatNaira(subtotal)}</span>
      </div>

      {hasPaySmallSmall && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-600">
          <Info className="size-3.5 shrink-0" />
          Pay Small Small terms via WhatsApp
        </p>
      )}

      <div className="my-4 border-t" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Food Subtotal</span>
        <span className="text-lg font-semibold">{formatNaira(subtotal)}</span>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-muted-foreground">
        <WhatsApp className="mt-0.5 shrink-0" />
        <span>
          Final pricing, delivery fees, and catering quotes will be confirmed via WhatsApp.
        </span>
      </div>

      <Button
        asChild
        className="mt-5 h-12 w-full bg-secondary text-white hover:bg-secondary/90"
      >
        <Link href={`/checkout?context=${context}`}>
          <ArrowRight className="size-4" />
          Proceed to Checkout
        </Link>
      </Button>
    </div>
  )
}
