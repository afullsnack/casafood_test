import { PageCartPage } from '@/components/PageCartPage'
import React, { Suspense } from 'react'

export const metadata = {
  description: 'Review your Restaurant cart before checkout.',
  title: 'Restaurant Cart',
}

export default function RestaurantCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PageCartPage context="restaurant" title="Restaurant" />
    </Suspense>
  )
}
