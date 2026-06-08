'use client'

// import { useEcommerce, useEcommerceConfig } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PageCartContext, type PageContextValue } from './context'
import type { Cart, Product, Variant } from '@/payload-types'
import { resolveNairaPrice } from '@/utilities/pricing'
import { getRandomValues, randomBytes } from 'crypto'

const STORAGE_PREFIX = 'pageCart'

function getStorageKey(context: string) {
  return `${STORAGE_PREFIX}:${context}`
}

function loadCurrentCart(cartKey: string = 'cart'): Cart | undefined {
  try {
    const cartStore = localStorage.getItem(cartKey)
    const currentCart = cartStore ? (JSON.parse(cartStore) as Cart) : undefined
    return currentCart
  } catch {
    return undefined
  }
}

function saveToCart(obj: any, cartKey: string = 'cart') {
  localStorage.setItem(cartKey, JSON.stringify({ ...obj }))
}

function clearCurrentCart(cartKey: string = 'cart') {
  localStorage.removeItem(cartKey)
}

function getItemUnitPrice(item: NonNullable<Cart['items']>[number]): number {
  const variant = item.variant
  if (variant && typeof variant === 'object') {
    const variantPrice = resolveNairaPrice(variant)
    if (typeof variantPrice === 'number') return variantPrice
  }
  const product = item.product
  if (product && typeof product === 'object') {
    const productPrice = resolveNairaPrice(product)
    if (typeof productPrice === 'number') return productPrice
  }
  return 0
}

function computeSubtotal(items: Cart['items']): number {
  return (items || []).reduce((sum, item) => sum + getItemUnitPrice(item) * (item.quantity || 0), 0)
}

export function PageCartProvider({ children }: { children: React.ReactNode }) {
  // const { user, cartID: _globalCartID } = useEcommerce()
  // const config = useEcommerceConfig()

  const [pageContext, setPageContext] = useState<PageContextValue | null>(null)
  const [pageCart, setPageCart] = useState<Cart | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  // const baseAPIURL = config.api?.apiRoute || '/api'
  const cartsSlug = 'carts'
  const cartKey = 'cart'

  const cartQuery = useMemo(
    () => ({
      depth: 2,
      populate: {
        products: { slug: true, title: true, gallery: true, inventory: true, page: true },
        variants: { title: true, inventory: true },
      },
    }),
    [],
  )

  useEffect(() => {
    const currentCart = loadCurrentCart()
    if (currentCart) {
      saveToCart({
        ...currentCart,
        pageContext,
      })
    }
  }, [pageContext])

  const getCart = useCallback(
    async (pageContext?: string) => {
      const cart = loadCurrentCart()

      return cart
    },
    [cartKey, cartQuery],
  )

  const createCart = useCallback(
    async (initialData: Record<string, unknown>) => {
      const defaultCart: Cart = {
        id: Math.random(),
        ...initialData,
        currency: null,
        customer: null,
        updatedAt: new Date().toUTCString(),
        createdAt: new Date().toUTCString(),
      }
      try {
        saveToCart(defaultCart)
      } catch (error) {
        console.error(`Failed to add to cart`, { error })
        throw new Error(`Failed to add to cart`)
      } finally {
        const cart = loadCurrentCart()
        return cart
      }
      // const query = qsStringify(cartQuery)
      // const response = await fetch(`${baseAPIURL}/${cartsSlug}?${query}`, {
      //   body: JSON.stringify({
      //     ...initialData,
      //     currency: 'USD',
      //     customer: user?.id,
      //   }),
      //   credentials: 'include',
      //   headers: { 'Content-Type': 'application/json' },
      //   method: 'POST',
      // })
      // if (!response.ok) {
      //   const errorText = await response.text()
      //   throw new Error(`Failed to create cart: ${errorText}`)
      // }
      // const data = await response.json()
      // if (data.error) throw new Error(`Cart creation error: ${data.error}`)
      // return data.doc as Cart
    },
    [cartsSlug, cartQuery],
  )

  const initPageCart = useCallback(
    async (context: PageContextValue) => {
      const cart = await getCart()
      if (cart) {
        try {
          setPageCart(cart)
          return
        } catch {
          console.error(`Failed to setPageCart`)
        }
      }

      const newCart = await createCart({ pageContext: context })

      setPageCart(newCart)
    },
    [createCart, getCart],
  )

  useEffect(() => {
    if (!pageContext) {
      setPageCart(undefined)
      return
    }
    setIsLoading(true)
    initPageCart(pageContext).finally(() => setIsLoading(false))
  }, [pageContext])

  const addPageItem = useCallback(
    async (item: { product: Product; variant?: Variant }, quantity = 1) => {
      if (!pageContext) return

      setIsLoading(true)
      try {
        // const response = await fetch(`${baseAPIURL}/${cartsSlug}/${creds.id}/add-item`, {
        //   body: JSON.stringify({ item, quantity, secret: creds.secret }),
        //   credentials: 'include',
        //   headers: { 'Content-Type': 'application/json' },
        //   method: 'POST',
        // })
        // if (!response.ok) {
        //   const errorText = await response.text()
        //   throw new Error(`Failed to add item: ${errorText}`)
        // }
        // const refreshed = await getCart(creds.id, { secret: creds.secret })
        // setPageCart(refreshed)
        const currentCart = loadCurrentCart()
        if (!currentCart) {
          throw new Error(`Failed to load cart`)
        }

        // Distinct payment-plan variants (e.g. "Pay in Full" vs "Pay Small Small")
        // must be separate line items, so the cart key includes the variant id.
        const itemId = item.variant
          ? `${item.product.id}:${item.variant.id}`
          : String(item.product.id)

        const existingItem = currentCart.items?.find((found) => found.id === itemId)

        const modifiedItems = existingItem
          ? (currentCart.items || []).map((found) =>
              found.id === itemId
                ? { ...found, quantity: (found.quantity || 0) + quantity }
                : found,
            )
          : [...(currentCart.items || []), { ...item, quantity, id: itemId }]

        const updatedCart = {
          ...currentCart,
          items: modifiedItems,
          subtotal: computeSubtotal(modifiedItems),
        }

        saveToCart(updatedCart)
        const refreshed = await getCart()
        setPageCart(refreshed)
      } catch (error) {
        console.error('Error adding item:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [pageContext, cartsSlug, getCart],
  )

  const removePageItem = useCallback(
    async (itemId: string) => {
      if (!pageContext) return
      let currentCart = loadCurrentCart()
      if (!currentCart) return
      setIsLoading(true)
      try {
        // const response = await fetch(`${baseAPIURL}/${cartsSlug}/${creds.id}/remove-item`, {
        //   body: JSON.stringify({ itemID: itemId, secret: creds.secret }),
        //   credentials: 'include',
        //   headers: { 'Content-Type': 'application/json' },
        //   method: 'POST',
        // })
        // if (!response.ok) {
        //   const errorText = await response.text()
        //   throw new Error(`Failed to remove item: ${errorText}`)
        // }

        const modifiedItems = currentCart.items?.filter((item) => item.id !== itemId)
        currentCart = {
          ...currentCart,
          items: modifiedItems,
          subtotal: computeSubtotal(modifiedItems),
        }

        saveToCart(currentCart)

        const refreshed = await getCart()
        setPageCart(refreshed)
      } catch (error) {
        console.error('Error removing item:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [pageContext, cartsSlug, getCart],
  )

  const incrementPageItem = useCallback(
    async (itemId: string) => {
      if (!pageContext) return
      let currentCart = loadCurrentCart()
      if (!currentCart) return
      setIsLoading(true)
      try {
        const modifiedItems = currentCart.items?.map((item) =>
          item.id === itemId ? { ...item, quantity: (item.quantity || 0) + 1 } : item,
        )
        currentCart = {
          ...currentCart,
          items: modifiedItems,
          subtotal: computeSubtotal(modifiedItems),
        }
        saveToCart(currentCart)
        setPageCart(await getCart())
      } catch (error) {
        console.error('Error incrementing item:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [pageContext, getCart],
  )

  const decrementPageItem = useCallback(
    async (itemId: string) => {
      if (!pageContext) return
      let currentCart = loadCurrentCart()
      if (!currentCart) return
      setIsLoading(true)
      try {
        const modifiedItems = currentCart.items
          ?.map((item) =>
            item.id === itemId ? { ...item, quantity: (item.quantity || 0) - 1 } : item,
          )
          .filter((item) => (item.quantity || 0) > 0)
        currentCart = {
          ...currentCart,
          items: modifiedItems,
          subtotal: computeSubtotal(modifiedItems),
        }
        saveToCart(currentCart)
        setPageCart(await getCart())
      } catch (error) {
        console.error('Error decrementing item:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [pageContext, getCart],
  )

  const clearPageCart = useCallback(async () => {
    if (!pageContext) return
    const currentCart = loadCurrentCart()
    if (!currentCart) return
    setIsLoading(true)
    try {
      clearCurrentCart()
      setPageCart(undefined)
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pageContext, cartsSlug])

  const value = useMemo(() => {
    const items = pageCart?.items || []
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const subtotal = pageCart?.subtotal || 0

    return {
      pageCart,
      pageItems: items,
      pageItemCount: count,
      pageSubtotal: subtotal,
      addPageItem,
      removePageItem,
      incrementPageItem,
      decrementPageItem,
      clearPageCart,
      isLoading,
      pageContext,
      setPageContext,
    }
  }, [
    pageCart,
    addPageItem,
    removePageItem,
    incrementPageItem,
    decrementPageItem,
    clearPageCart,
    isLoading,
    pageContext,
  ])

  return <PageCartContext.Provider value={value}>{children}</PageCartContext.Provider>
}
