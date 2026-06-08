'use client'

import { createContext, SetStateAction, useContext } from 'react'
import type { Cart, Product, Variant } from '@/payload-types'

export type PageContextValue = 'food-hub' | 'restaurant' | 'bulk-order'

export interface PageCartContextType {
  pageCart: Cart | undefined
  pageItems: Cart['items']
  pageItemCount: number
  pageSubtotal: number
  addPageItem: (item: { product: Product; variant?: Variant }, quantity?: number) => Promise<void>
  removePageItem: (itemId: string) => Promise<void>
  incrementPageItem: (itemId: string) => Promise<void>
  decrementPageItem: (itemId: string) => Promise<void>
  clearPageCart: () => Promise<void>
  isLoading: boolean
  pageContext: PageContextValue | null
  setPageContext: (context: SetStateAction<PageContextValue | null>) => void
}

export const PageCartContext = createContext<PageCartContextType | null>(null)

export function usePageCart(): PageCartContextType {
  const ctx = useContext(PageCartContext)
  if (!ctx) throw new Error('usePageCart must be used within PageCartProvider')
  return ctx
}
