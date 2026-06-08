'use client'

import type { Product } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { WhatsApp } from '@/components/icons/landing'
import { usePageCart } from '@/providers/PageCart/context'
import { cn } from '@/utilities/cn'
import {
  formatNaira,
  getPaymentPlan,
  resolveNairaPrice,
  type PaymentOption,
} from '@/utilities/pricing'
import { Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { VariantSelector } from './VariantSelector'

export function ProductDescription({ product }: { product: Product }) {
  const { addPageItem, isLoading, setPageContext } = usePageCart()

  const plan = useMemo(() => getPaymentPlan(product), [product])
  const [paymentValue, setPaymentValue] = useState<string | undefined>(() => plan?.options[0]?.value)
  const [quantity, setQuantity] = useState(1)

  // Items added from this page belong to the cart of the product's page (Food Hub etc.).
  useEffect(() => {
    if (product.page) setPageContext(product.page)
  }, [product.page, setPageContext])

  const selectedOption = plan?.options.find((option) => option.value === paymentValue)
  const headlinePrice = plan?.fullPrice ?? resolveNairaPrice(product)
  const unitPrice = selectedOption ? resolveNairaPrice(selectedOption.variant) : resolveNairaPrice(product)
  const subtotal = typeof unitPrice === 'number' ? unitPrice * quantity : undefined

  const hasOtherVariants =
    !plan && Boolean(product.enableVariants && product.variants?.docs?.length)
  const outOfStock = selectedOption
    ? selectedOption.variant.inventory === 0
    : product.inventory === 0
  const cartHref = product.page ? `/${product.page}/cart` : '/cart'

  const addToCart = () => {
    addPageItem({ product, variant: selectedOption?.variant }, quantity).then(() => {
      toast.success('Item added to cart.')
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
        {typeof headlinePrice === 'number' && (
          <p className="mt-4 text-3xl font-bold">{formatNaira(headlinePrice)}</p>
        )}
        {product.unit && <p className="mt-1 text-sm text-muted-foreground">{product.unit}</p>}
      </div>

      {product.description ? (
        <RichText
          className="text-muted-foreground"
          data={product.description}
          enableGutter={false}
        />
      ) : null}

      {plan ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Option
          </p>
          <PaymentOptionToggle
            options={plan.options}
            value={paymentValue}
            onChange={setPaymentValue}
          />
        </div>
      ) : hasOtherVariants ? (
        <VariantSelector product={product} />
      ) : null}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quantity
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          {typeof subtotal === 'number' && (
            <span className="text-sm text-muted-foreground">
              Subtotal: <span className="font-semibold text-foreground">{formatNaira(subtotal)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          aria-label="Add to cart"
          className="h-12 flex-1 bg-secondary text-white hover:bg-secondary/90"
          disabled={outOfStock || isLoading}
          onClick={addToCart}
        >
          Add to Cart
        </Button>
        <Button asChild className="h-12 px-6" variant="outline">
          <Link href={cartHref}>View Cart</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-muted-foreground">
        <WhatsApp className="shrink-0" />
        <span>
          After checkout, we&apos;ll confirm your order, discuss delivery, and share payment details
          via WhatsApp.
        </span>
      </div>
    </div>
  )
}

function PaymentOptionToggle({
  options,
  value,
  onChange,
}: {
  options: PaymentOption[]
  value: string | undefined
  onChange: (value: string) => void
}) {
  return (
    <div className="inline-flex rounded-lg border bg-muted p-1" role="radiogroup" aria-label="Payment option">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center rounded-lg border">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
