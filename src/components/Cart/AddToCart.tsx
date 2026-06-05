'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { usePageCart } from '@/providers/PageCart/context'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { select } from 'payload/shared'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  // const { addItem, cart, isLoading } = useCart()
  const { addPageItem, pageCart, isLoading } = usePageCart()
  const searchParams = useSearchParams()

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      console.log(`Variant ID`, { variantId })

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          if (String(variant.id) === variantId) return variant
        }
        if (String(variant) === variantId) return variant
      })

      console.log(`valid variant`, { validVariant, varType: typeof validVariant })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addPageItem({
        product: product,
        variant: selectedVariant ?? undefined,
      }).then(() => {
        toast.success('Item added to cart.')
      })
      // .catch((error) => {
      //   toast.error(`Failed to add items`, {
      //     description: error?.message,
      //   })
      // })
    },
    [addPageItem, product, selectedVariant],
  )

  const disabled = useMemo<boolean>(() => {
    const existingItem = pageCart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    console.log(`Existing items`, { existingItem, product })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        console.log(`NO Selected variant`, { selectedVariant })
        return true
      }

      if (selectedVariant.inventory === 0) {
        console.log(`Inventory ZERO`)
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, pageCart?.items, product])

  console.log('Disabled button', { disabled })

  return (
    <Button
      aria-label="Add to cart"
      variant={'outline'}
      className={clsx({
        'hover:opacity-90': true,
      })}
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
    >
      Add To Cart
    </Button>
  )
}
