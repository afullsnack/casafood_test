'use client'

import type { CartItem } from '@/components/Cart'
import { usePageCart } from '@/providers/PageCart/context'
import { cn } from '@/utilities/cn'
import { formatNaira, resolveNairaPrice, variantIsPaySmallSmall } from '@/utilities/pricing'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartLineItem({ item }: { item: CartItem }) {
  const { incrementPageItem, decrementPageItem, removePageItem, isLoading } = usePageCart()

  const product = item.product
  if (typeof product !== 'object' || !product) return null

  const variant = typeof item.variant === 'object' ? item.variant : undefined
  const unitPrice = resolveNairaPrice(variant) ?? resolveNairaPrice(product)
  const quantity = item.quantity || 0
  const lineTotal = typeof unitPrice === 'number' ? unitPrice * quantity : undefined

  const galleryImage =
    typeof product.gallery?.[0]?.image === 'object' ? product.gallery[0].image : undefined
  const metaImage = typeof product.meta?.image === 'object' ? product.meta.image : undefined
  const image = galleryImage || metaImage

  const href = product.slug ? `/products/${product.slug}` : undefined
  const atMinStock = !variant && product.inventory != null && quantity >= product.inventory
  const atMaxStock =
    variant?.inventory != null
      ? quantity >= variant.inventory
      : product.inventory != null && quantity >= product.inventory

  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
      <ImageBox href={href} src={image?.url} alt={image?.alt || product.title} />

      <div className="min-w-0 flex-1">
        {href ? (
          <Link href={href} className="font-semibold leading-snug hover:underline">
            {product.title}
          </Link>
        ) : (
          <span className="font-semibold leading-snug">{product.title}</span>
        )}
        {typeof unitPrice === 'number' && (
          <p className="mt-0.5 text-sm text-muted-foreground">{formatNaira(unitPrice)}</p>
        )}
        {variantIsPaySmallSmall(item.variant) && (
          <span className="mt-2 inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/70">
            Pay Small Small
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center rounded-lg border">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={isLoading || !item.id}
            onClick={() => item.id && decrementPageItem(item.id)}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-7 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isLoading || !item.id || atMaxStock || atMinStock}
            onClick={() => item.id && incrementPageItem(item.id)}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {typeof lineTotal === 'number' && (
          <span className="min-w-[5rem] text-right font-semibold">{formatNaira(lineTotal)}</span>
        )}

        <button
          type="button"
          aria-label="Remove item"
          disabled={isLoading || !item.id}
          onClick={() => item.id && removePageItem(item.id)}
          className="text-red-500 transition-colors hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </div>
  )
}

function ImageBox({ href, src, alt }: { href?: string; src?: string | null; alt?: string | null }) {
  console.log(`Src image`, { src, href, alt })
  const inner = (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
      {src && (
        <Image alt={alt || ''} className="object-cover" fill sizes="64px" src={src} unoptimized />
      )}
    </div>
  )
  return href ? (
    <Link href={href} className={cn('shrink-0')}>
      {inner}
    </Link>
  ) : (
    inner
  )
}
