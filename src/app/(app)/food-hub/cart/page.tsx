import { CartView } from '@/components/Cart/CartView'
import React, { Suspense } from 'react'

export const metadata = {
  description: 'Review your Food Hub cart before checkout.',
  title: 'Food Hub Cart',
}

export default function FoodHubCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartView context="food-hub" />
    </Suspense>
  )
}
