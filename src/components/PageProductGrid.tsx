'use client'

import { CartExitGuard } from '@/components/CartExitGuard'
import { PageAddToCart } from '@/components/Cart/PageAddToCart'
import { Grid } from '@/components/Grid'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { usePageCart } from '@/providers/PageCart/context'
import { useCartExitGuard } from '@/hooks/use-cart-exit-guard'
import type { Product } from '@/payload-types'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  context: 'food-hub' | 'restaurant' | 'bulk-order'
  products: Product[]
  title: string
}

export function PageProductGrid({ context, products, title }: Props) {
  const { setPageContext } = usePageCart()
  const { showPrompt, handleGoToCheckout, handleLeaveAnyway, handleCancel } =
    useCartExitGuard(context)

  // useEffect(() => {
  //   console.log(`Page Context`, { context })
  //   setPageContext((_prev) => {
  //     return context
  //   })
  // }, [context, setPageContext])

  return (
    <div className="pt-16 pb-24">
      <CartExitGuard
        open={showPrompt}
        onGoToCheckout={handleGoToCheckout}
        onLeaveAnyway={handleLeaveAnyway}
        onCancel={handleCancel}
      />
      <section className="container mb-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
      </section>

      {products.length === 0 ? (
        <div className="container">
          <p>No products available.</p>
        </div>
      ) : (
        <section className="container">
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </section>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const image =
    product.gallery?.[0]?.image && typeof product.gallery[0]?.image !== 'string'
      ? product.gallery[0]?.image
      : null

  return (
    <div className="group relative flex flex-col border rounded-2xl p-4 bg-primary-foreground">
      <Link className="flex flex-col" href={`/products/${product.slug}`}>
        {image ? (
          <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
            <Media
              className="h-full w-full object-cover"
              imgClassName="transition duration-300 ease-in-out group-hover:scale-102 h-full w-full object-cover"
              resource={image}
            />
          </div>
        ) : null}

        <div className="font-mono text-primary/50 group-hover:text-primary flex justify-between items-center mb-2">
          <span>{product.title}</span>
          {typeof product.priceInUSD === 'number' && <Price amount={product.priceInUSD} />}
        </div>
      </Link>

      <PageAddToCart product={product} />
    </div>
  )
}
