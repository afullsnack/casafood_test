import { CartView } from '@/components/Cart/CartView'
import React, { Suspense } from 'react'

export const metadata = {
  description: 'Review your Bulk Order cart before checkout.',
  title: 'Bulk Order Cart',
}

export default function BulkOrderCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartView context="bulk-order" />
    </Suspense>
  )
}
