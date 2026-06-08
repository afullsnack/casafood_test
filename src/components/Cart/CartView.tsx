'use client'

import { Button } from '@/components/ui/button'
import { usePageCart, type PageContextValue } from '@/providers/PageCart/context'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { CartEmptyState } from './CartEmptyState'
import { CartLineItem } from './CartLineItem'
import { CartOrderSummary } from './CartOrderSummary'
import { Badge } from '../ui/badge'

export function CartView({ context }: { context: PageContextValue }) {
  const { setPageContext, pageItems, pageItemCount, pageSubtotal } = usePageCart()

  useEffect(() => {
    setPageContext(context)
  }, [context, setPageContext])

  const items = pageItems || []

  if (items.length === 0) {
    return (
      <div className="container min-h-[80vh]">
        <CartEmptyState />
      </div>
    )
  }

  return (
    <div className="container min-h-[80vh] pt-12 pb-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Your Cart{' '}
        <span className="text-lg font-normal text-muted-foreground">({pageItemCount} items)</span>
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {context === 'food-hub' ? (
              'Food Items'
            ) : context === 'restaurant' ? (
              <span>
                restaurant order <Badge>{pageItemCount}</Badge>{' '}
              </span>
            ) : (
              <span>
                bulk order request <Badge>Quote Pending</Badge>
              </span>
            )}
          </p>
          <div className="space-y-4">
            {items.map((item, index) => (
              <CartLineItem key={item.id || index} item={item} />
            ))}
          </div>
          <Button asChild variant="outline" className="mt-6 rounded-full px-5">
            <Link href={`/${context}`}>
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="lg:w-[360px] lg:shrink-0">
          <CartOrderSummary
            items={items}
            count={pageItemCount}
            subtotal={pageSubtotal}
            context={context}
          />
        </div>
      </div>
    </div>
  )
}
