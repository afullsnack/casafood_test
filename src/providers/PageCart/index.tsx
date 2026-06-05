'use client'

// import { useEcommerce, useEcommerceConfig } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PageCartContext, type PageContextValue } from './context'
import type { Cart, Product, Variant } from '@/payload-types'
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
        let currentCart = loadCurrentCart()
        if (currentCart) {
          const existingItem = currentCart.items?.find((itemFound) => {
            if (itemFound && itemFound.product && typeof itemFound.product === 'object') {
              return itemFound.id === String(item.product.id)
            }
          })

          if (existingItem) {
            const modifiedItems = currentCart.items?.map((item) =>
              item.id === existingItem.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item,
            )
            currentCart = {
              ...currentCart,
              items: modifiedItems,
            }
          } else {
            currentCart = {
              ...currentCart,
              subtotal: Number(currentCart.subtotal || 0) + Number(item.product.priceInUSD),
              items: [{ ...item, quantity: 1, id: String(item.product.id) }],
            }
          }

          saveToCart(currentCart)
          const refreshed = await getCart()
          setPageCart(refreshed)
        } else {
          throw new Error(`Failed to load cart`)
        }
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

        const itemtoRemove = currentCart.items?.find((item) => item.id === itemId)
        const modifiedItems = currentCart.items?.filter((item) => item.id !== itemId)
        currentCart = {
          ...currentCart,
          items: modifiedItems,
          subtotal:
            Number(currentCart.subtotal) -
            Number(
              typeof itemtoRemove?.product === 'object'
                ? Number(itemtoRemove.product?.priceInUSD) * itemtoRemove.quantity
                : 0,
            ),
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
      clearPageCart,
      isLoading,
      pageContext,
      setPageContext,
    }
  }, [pageCart, addPageItem, removePageItem, clearPageCart, isLoading, pageContext])

  return <PageCartContext.Provider value={value}>{children}</PageCartContext.Provider>
}
