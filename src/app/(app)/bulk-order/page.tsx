import { PageProductGrid } from '@/components/PageProductGrid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Order in bulk for events, offices, and large gatherings.',
  title: 'Bulk Order',
}

export default async function BulkOrderPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { page: { equals: 'bulk-order' } },
      ],
    },
    depth: 1,
  })

  return (
    <PageProductGrid
      context="bulk-order"
      products={products.docs as any}
      title="Bulk Order"
    />
  )
}
