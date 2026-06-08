'use client'

import { Grid } from '@/components/Grid'
import { Media } from '@/components/Media'
import { PageProductCategories } from '@/components/PageProductCategories'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/payload-types'
import { usePageCart } from '@/providers/PageCart/context'
import { cn } from '@/utilities/cn'
import {
  collectCategories,
  formatNaira,
  getPaymentPlan,
  productInCategory,
  resolveNairaPrice,
  type PaymentOption,
} from '@/utilities/pricing'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  context: 'food-hub' | 'restaurant' | 'bulk-order'
  products: Product[]
}

export function PageProductGrid({ context, products }: Props) {
  const { setPageContext } = usePageCart()

  const [selectedCategory, setSelectedCategory] = useState<number | string | null>(null)

  useEffect(() => {
    setPageContext(context)
  }, [context, setPageContext])

  const categories = useMemo(() => collectCategories(products), [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) return products
    return products.filter((product) => productInCategory(product, selectedCategory))
  }, [products, selectedCategory])

  return (
    <div className="pt-12 pb-24">
      <section className="container">
        {categories.length > 0 && (
          <PageProductCategories
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        <h1 className="mt-10 mb-8 text-4xl font-bold tracking-tight">All Items</h1>

        {filteredProducts.length === 0 ? (
          <p className="text-muted-foreground">No products available.</p>
        ) : (
          <Grid className="grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </section>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { addPageItem, isLoading } = usePageCart()

  const plan = useMemo(() => getPaymentPlan(product), [product])
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    () => plan?.options[0]?.value,
  )

  const image =
    product.gallery?.[0]?.image && typeof product.gallery[0].image !== 'string'
      ? product.gallery[0].image
      : null

  const price = plan?.fullPrice ?? resolveNairaPrice(product)
  const hasInstalment = typeof plan?.instalmentPrice === 'number'
  const selectedOption = plan?.options.find((option) => option.value === selectedValue)

  const outOfStock = selectedOption
    ? selectedOption.variant.inventory === 0
    : product.inventory === 0

  const addToCart = () => {
    addPageItem({ product, variant: selectedOption?.variant }).then(() => {
      toast.success('Item added to cart.')
    })
  }

  return (
    <div className="group relative flex min-h-[200px] overflow-hidden rounded-2xl border bg-card">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-2/5 max-w-[220px] shrink-0 self-stretch overflow-hidden bg-muted"
      >
        {hasInstalment && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 z-10 bg-card/90 text-foreground shadow-sm backdrop-blur"
          >
            Pay Small Small
          </Badge>
        )}
        {image && (
          <Media
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
            fill
            resource={image}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold leading-snug hover:underline">{product.title}</h3>
        </Link>

        {plan && (
          <PaymentPlanSelector
            options={plan.options}
            value={selectedValue}
            onChange={setSelectedValue}
          />
        )}

        <div className="mt-auto border-t pt-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                {typeof price === 'number' && (
                  <span className="text-lg font-semibold">{formatNaira(price)}</span>
                )}
                {product.unit && (
                  <span className="text-sm text-muted-foreground">{product.unit}</span>
                )}
              </div>
              {hasInstalment && (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  From {formatNaira(plan!.instalmentPrice!)} / instalment
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label="Add to cart"
              disabled={outOfStock || isLoading}
              onClick={addToCart}
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentPlanSelector({
  options,
  value,
  onChange,
}: {
  options: PaymentOption[]
  value: string | undefined
  onChange: (value: string) => void
}) {
  return (
    <div role="radiogroup" aria-label="Payment plan" className="mt-3 flex flex-col gap-2">
      {options.map((option) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2 text-left text-sm"
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                checked ? 'border-green-600' : 'border-muted-foreground/40',
              )}
            >
              {checked && <span className="size-2 rounded-full bg-green-600" />}
            </span>
            <span className={cn(checked ? 'text-foreground' : 'text-muted-foreground')}>
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
