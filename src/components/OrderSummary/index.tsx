'use client'

import { Media } from '@/components/Media'
import { formatNaira, resolveNairaPrice } from '@/utilities/pricing'
import type { Cart } from '@/payload-types'
import React from 'react'
import { Info } from 'lucide-react'

type Props = {
  items: Cart['items']
  subtotal: number
  pageContext: any
}

export function OrderSummary({ items, subtotal, pageContext }: Props) {
  if (!items || items.length === 0) return null

  return (
    <div className="border-none bg-primary/5 flex flex-col gap-4 rounded-lg p-6">
      <h2 className="text-xl font-medium">Order Summary</h2>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          if (typeof item.product !== 'object' || !item.product) return null

          const {
            product,
            product: { id, meta, title, gallery },
            quantity,
            variant,
          } = item

          if (!quantity) return null

          let image = gallery?.[0]?.image || meta?.image
          let price = resolveNairaPrice(product)

          const isVariant = Boolean(variant) && typeof variant === 'object'

          if (isVariant && typeof variant === 'object') {
            price = resolveNairaPrice(variant)

            const imageVariant = product.gallery?.find((item) => {
              if (!item.variantOption) return false
              const variantOptionID =
                typeof item.variantOption === 'object' ? item.variantOption.id : item.variantOption

              const hasMatch = variant?.options?.some((option) => {
                if (typeof option === 'object') return option.id === variantOptionID
                else return option === variantOptionID
              })

              return hasMatch
            })

            if (imageVariant && typeof imageVariant.image !== 'string') {
              image = imageVariant.image
            }
          }

          return (
            <div className="flex items-start gap-3" key={index}>
              <div className="flex items-stretch justify-stretch h-16 w-16 p-2 rounded-lg border bg-background">
                <div className="relative w-full h-full">
                  {image && typeof image !== 'string' && (
                    <Media className="" fill imgClassName="rounded-lg" resource={image} />
                  )}
                </div>
              </div>
              <div className="flex grow justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{title}</p>
                  {variant && typeof variant === 'object' && (
                    <p className="text-xs font-mono text-primary/50 tracking-widest">
                      {variant.options
                        ?.map((option) => {
                          if (typeof option === 'object') return option.label
                          return null
                        })
                        .join(', ')}
                    </p>
                  )}
                  <h4 className="text-xs text-[#9AAB7A]">
                    Qty: {quantity} x {formatNaira(price as number)}
                  </h4>
                </div>

                {typeof price === 'number' && <span className="text-sm">{formatNaira(price)}</span>}
              </div>
            </div>
          )
        })}
      </div>

      <hr />

      <div className="flex justify-between items-center gap-2">
        {pageContext === 'bulk-order' && <Info className="" />}
        <span className="uppercase text-sm">
          {pageContext === 'food-hub'
            ? 'Food Subtotal'
            : pageContext === 'restaurant'
              ? 'Restaurant Subtotal'
              : 'Delivery date, location, and event details are filled at checkout. Final pricing is confirmed via WhatsApp after your request is reviewed.'}
        </span>
        <span className="text-2xl font-medium">{formatNaira(subtotal || 0)}</span>
      </div>
    </div>
  )
}
