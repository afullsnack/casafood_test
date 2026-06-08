import { describe, it, expect } from 'vitest'

import type { Product, Variant, VariantOption } from '@/payload-types'
import {
  collectCategories,
  formatNaira,
  getPaymentPlan,
  productInCategory,
  resolveNairaPrice,
  PAY_IN_FULL,
  PAY_SMALL_SMALL,
} from '@/utilities/pricing'

const option = (id: number, value: string, label: string): VariantOption =>
  ({ id, value, label, variantType: 1 }) as unknown as VariantOption

const variant = (id: number, opt: VariantOption, priceInNGN: number): Variant =>
  ({ id, options: [opt], priceInNGN, product: 1 }) as unknown as Variant

const product = (overrides: Partial<Product>): Product => overrides as unknown as Product

describe('formatNaira', () => {
  it('renders whole naira with the ₦ symbol, grouped, no decimals', () => {
    const result = formatNaira(78000)
    expect(result).toContain('₦')
    expect(result).toContain('78,000')
    expect(result).not.toContain('.')
  })

  it('renders zero', () => {
    expect(formatNaira(0)).toContain('₦')
    expect(formatNaira(0)).toContain('0')
  })
})

describe('resolveNairaPrice', () => {
  it('prefers priceInNGN over priceInUSD', () => {
    expect(resolveNairaPrice({ priceInNGN: 35000, priceInUSD: 3499 })).toBe(35000)
  })

  it('falls back to priceInUSD when NGN is missing', () => {
    expect(resolveNairaPrice({ priceInNGN: null, priceInUSD: 3499 })).toBe(3499)
  })

  it('returns undefined when neither is set', () => {
    expect(resolveNairaPrice({ priceInNGN: null, priceInUSD: null })).toBeUndefined()
    expect(resolveNairaPrice(undefined)).toBeUndefined()
  })
})

describe('getPaymentPlan', () => {
  const payInFull = option(10, PAY_IN_FULL, 'Pay in Full')
  const paySmallSmall = option(11, PAY_SMALL_SMALL, 'Pay Small Small')

  it('returns null when variants are disabled', () => {
    expect(getPaymentPlan(product({ enableVariants: false }))).toBeNull()
  })

  it('returns null when no variant carries a payment option', () => {
    const sizeOption = option(99, 'large', 'Large')
    const p = product({
      enableVariants: true,
      variants: { docs: [variant(1, sizeOption, 5000)] },
    })
    expect(getPaymentPlan(p)).toBeNull()
  })

  it('extracts ordered options with full and instalment prices', () => {
    // Intentionally out of order to prove sorting puts "Pay in Full" first.
    const p = product({
      enableVariants: true,
      variants: {
        docs: [variant(2, paySmallSmall, 12000), variant(1, payInFull, 35000)],
      },
    })

    const plan = getPaymentPlan(p)
    expect(plan).not.toBeNull()
    expect(plan!.options.map((o) => o.value)).toEqual([PAY_IN_FULL, PAY_SMALL_SMALL])
    expect(plan!.fullPrice).toBe(35000)
    expect(plan!.instalmentPrice).toBe(12000)
    expect(plan!.options[1]?.variant.id).toBe(2)
  })

  it('ignores unpopulated (id-only) variant references', () => {
    const p = product({
      enableVariants: true,
      variants: { docs: [5 as unknown as Variant] },
    })
    expect(getPaymentPlan(p)).toBeNull()
  })
})

describe('collectCategories', () => {
  it('dedupes populated categories in first-seen order and skips id-only refs', () => {
    const grains = { id: 1, title: 'Grains & Rice' }
    const proteins = { id: 2, title: 'Proteins' }
    const products = [
      product({ categories: [grains, proteins] as Product['categories'] }),
      product({ categories: [grains, 7] as unknown as Product['categories'] }),
      product({ categories: null }),
    ]

    expect(collectCategories(products)).toEqual([
      { id: 1, title: 'Grains & Rice' },
      { id: 2, title: 'Proteins' },
    ])
  })
})

describe('productInCategory', () => {
  const grains = { id: 1, title: 'Grains & Rice' }

  it('matches populated category objects by id', () => {
    expect(productInCategory(product({ categories: [grains] as Product['categories'] }), 1)).toBe(
      true,
    )
  })

  it('matches id-only category references', () => {
    expect(
      productInCategory(product({ categories: [3] as unknown as Product['categories'] }), 3),
    ).toBe(true)
  })

  it('returns false when the category is absent', () => {
    expect(productInCategory(product({ categories: [grains] as Product['categories'] }), 2)).toBe(
      false,
    )
  })
})
