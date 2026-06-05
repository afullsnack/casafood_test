'use client'

import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

import { usePageCart } from '@/providers/PageCart/context'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

type Props = {
  product: Product
}

export function PageAddToCart({ product }: Props) {
  const { addPageItem, isLoading } = usePageCart()

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      addPageItem({ product: product }).then(() => {
        toast.success('Item added to cart.')
      })
    },
    [addPageItem, product],
  )

  const disabled = product.inventory === 0 || isLoading

  return (
    <Button
      aria-label="Add to cart"
      variant="outline"
      className={clsx({ 'hover:opacity-90': true })}
      disabled={disabled}
      onClick={addToCart}
      type="submit"
    >
      Add To Cart
    </Button>
  )
}
