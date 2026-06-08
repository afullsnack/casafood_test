import type { Product, Variant, VariantOption } from '@/payload-types'

/**
 * Stable identifiers for the "payment plan" variant options. These match the
 * `value` set on the seeded variant options and are how the storefront detects
 * which products offer the "Pay Small Small" (instalment) plan.
 */
export const PAY_IN_FULL = 'pay-in-full'
export const PAY_SMALL_SMALL = 'pay-small-small'

/**
 * Whether a variant represents the "Pay Small Small" (instalment) option.
 * Works with a populated `Variant` (options as objects).
 */
export function variantIsPaySmallSmall(variant?: Variant | number | null): boolean {
  if (!variant || typeof variant !== 'object') return false
  const options = Array.isArray(variant.options) ? variant.options : []
  return options.some((option) => typeof option === 'object' && option?.value === PAY_SMALL_SMALL)
}

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  currency: 'NGN',
  currencyDisplay: 'symbol',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: 'currency',
})

/**
 * Format a whole-naira amount as e.g. `₦78,000`. Amounts are stored as whole
 * naira (the NGN currency is configured with 0 decimals), so no scaling is done.
 */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount)
}

type PriceCarrier = Pick<Product, 'priceInNGN' | 'priceInUSD'> &
  Partial<Pick<Variant, 'priceInNGN' | 'priceInUSD'>>

/**
 * Resolve the naira price for a product or variant. Prefers `priceInNGN`; falls
 * back to `priceInUSD` only so legacy USD-only records still surface a number.
 */
export function resolveNairaPrice(doc?: PriceCarrier | null): number | undefined {
  if (!doc) return undefined
  if (typeof doc.priceInNGN === 'number') return doc.priceInNGN
  if (typeof doc.priceInUSD === 'number') return doc.priceInUSD
  return undefined
}

export type PaymentOption = {
  /** 'pay-in-full' | 'pay-small-small' */
  value: string
  /** Customer-facing label, e.g. "Pay in Full" */
  label: string
  /** The variant backing this option (added to cart when selected) */
  variant: Variant
  /** Naira price of this variant */
  price?: number
}

export type PaymentPlan = {
  options: PaymentOption[]
  /** Price of the "Pay in Full" option — the headline price shown on the card */
  fullPrice?: number
  /** Per-instalment price of the "Pay Small Small" option */
  instalmentPrice?: number
}

function firstPaymentOption(variant: Variant): VariantOption | undefined {
  const options = Array.isArray(variant.options) ? variant.options : []
  return options.find(
    (option): option is VariantOption =>
      typeof option === 'object' &&
      option !== null &&
      (option.value === PAY_IN_FULL || option.value === PAY_SMALL_SMALL),
  )
}

/**
 * Inspect a product's populated variants and, if it carries the payment-plan
 * variant type, return its options ("Pay in Full" first) plus the headline and
 * instalment prices. Returns `null` for products without the plan.
 *
 * Requires the product to be queried with enough depth for `variants.docs` and
 * each variant's `options` to be populated as objects (depth >= 2).
 */
export function getPaymentPlan(product: Product): PaymentPlan | null {
  if (!product.enableVariants) return null

  const variants = product.variants?.docs
  if (!Array.isArray(variants) || variants.length === 0) return null

  const byValue = new Map<string, PaymentOption>()

  for (const variant of variants) {
    if (typeof variant !== 'object' || variant === null) continue
    const option = firstPaymentOption(variant)
    if (!option) continue
    if (byValue.has(option.value)) continue
    byValue.set(option.value, {
      value: option.value,
      label: option.label,
      variant,
      price: resolveNairaPrice(variant),
    })
  }

  if (byValue.size === 0) return null

  const order = [PAY_IN_FULL, PAY_SMALL_SMALL]
  const options = [...byValue.values()].sort(
    (a, b) => order.indexOf(a.value) - order.indexOf(b.value),
  )

  return {
    options,
    fullPrice: byValue.get(PAY_IN_FULL)?.price,
    instalmentPrice: byValue.get(PAY_SMALL_SMALL)?.price,
  }
}

/**
 * Unique, populated categories across a set of products, in first-seen order.
 * Used to build the category filter row.
 */
export function collectCategories(products: Product[]): { id: number | string; title: string }[] {
  const seen = new Map<number | string, string>()
  for (const product of products) {
    const categories = product.categories
    if (!Array.isArray(categories)) continue
    for (const category of categories) {
      if (typeof category !== 'object' || category === null) continue
      if (!seen.has(category.id)) seen.set(category.id, category.title)
    }
  }
  return [...seen.entries()].map(([id, title]) => ({ id, title }))
}

/**
 * Whether a product belongs to the category with the given id.
 */
export function productInCategory(product: Product, categoryId: number | string): boolean {
  const categories = product.categories
  if (!Array.isArray(categories)) return false
  return categories.some((category) =>
    typeof category === 'object' && category !== null
      ? category.id === categoryId
      : category === categoryId,
  )
}
