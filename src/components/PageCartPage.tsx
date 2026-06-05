'use client'

import { CartExitGuard } from '@/components/CartExitGuard'
import { DeleteItemButton } from '@/components/Cart/DeleteItemButton'
import { EditItemQuantityButton } from '@/components/Cart/EditItemQuantityButton'
import { OrderSummary } from '@/components/OrderSummary'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { usePageCart } from '@/providers/PageCart/context'
import { useCartExitGuard } from '@/hooks/use-cart-exit-guard'
import type { Product } from '@/payload-types'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

type Props = {
  context: 'food-hub' | 'restaurant' | 'bulk-order'
  title: string
}

export function PageCartPage({ context, title }: Props) {
  const { setPageContext, pageCart, pageItems, pageSubtotal, removePageItem } = usePageCart()
  const { showPrompt, handleGoToCheckout, handleLeaveAnyway, handleCancel } =
    useCartExitGuard(context)

  useEffect(() => {
    setPageContext(context)
  }, [context, setPageContext])

  const isEmpty = !pageItems || pageItems.length === 0

  return (
    <div className="container min-h-[90vh] pt-16 pb-24">
      <CartExitGuard
        open={showPrompt}
        onGoToCheckout={handleGoToCheckout}
        onLeaveAnyway={handleLeaveAnyway}
        onCancel={handleCancel}
      />
      <h1 className="text-3xl font-semibold mb-8">{title} Cart</h1>

      {isEmpty ? (
        <div className="text-center flex flex-col items-center gap-4 py-16">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <p className="text-2xl font-bold">Your cart is empty.</p>
          <Button asChild variant="outline">
            <Link href={`/${context}`}>Browse {title}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ul className="space-y-4">
              {pageItems.map((item, i) => {
                const product = item.product
                if (typeof product !== 'object' || !product || !product.slug)
                  return <React.Fragment key={i} />

                const metaImage =
                  product.meta?.image && typeof product.meta?.image === 'object'
                    ? product.meta.image
                    : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery?.[0]?.image
                    : undefined

                let image = firstGalleryImage || metaImage
                let price = product.priceInUSD

                const isVariant = Boolean(item.variant) && typeof item.variant === 'object'

                if (isVariant && typeof item.variant === 'object') {
                  price = item.variant?.priceInUSD
                }

                return (
                  <li
                    key={i}
                    className="flex items-center gap-4 border rounded-lg p-4 bg-card"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="shrink-0"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                        {image?.url && (
                          <Image
                            alt={image?.alt || product?.title || ''}
                            className="h-full w-full object-cover"
                            height={80}
                            src={image.url}
                            width={80}
                          />
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {product.title}
                      </Link>
                      {isVariant && item.variant && typeof item.variant === 'object' && (
                        <p className="text-sm text-muted-foreground capitalize">
                          {(item.variant as any).options
                            ?.map((o: any) => (typeof o === 'object' ? o.label : null))
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <EditItemQuantityButton item={item as any} type="minus" />
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <EditItemQuantityButton item={item as any} type="plus" />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {typeof price === 'number' && <Price amount={price} />}
                      <div className="mt-2">
                        <DeleteItemButton item={item as any} />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lg:w-80 shrink-0">
            <OrderSummary
              items={pageItems as any}
              subtotal={pageSubtotal}
              currency="USD"
            />
            <Button asChild className="w-full mt-4">
              <Link href={`/checkout?context=${context}`}>Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
