import { PageCartPage } from '@/components/PageCartPage'
import React, { Suspense } from 'react'

export const metadata = {
  description: 'Review your Bulk Order cart before checkout.',
  title: 'Bulk Order Cart',
}

export default function BulkOrderCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PageCartPage context="bulk-order" title="Bulk Order" />
    </Suspense>
  )
}
