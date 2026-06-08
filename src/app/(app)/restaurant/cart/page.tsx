import { CartView } from '@/components/Cart/CartView'
import React, { Suspense } from 'react'

export const metadata = {
  description: 'Review your Restaurant cart before checkout.',
  title: 'Restaurant Cart',
}

export default function RestaurantCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartView context="restaurant" />
    </Suspense>
  )
}
