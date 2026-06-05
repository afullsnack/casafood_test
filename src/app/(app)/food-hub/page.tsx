import { PageProductGrid } from '@/components/PageProductGrid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Browse fresh produce and meal kits from our Food Hub.',
  title: 'Food Hub',
}

export default async function FoodHubPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { page: { equals: 'food-hub' } },
      ],
    },
    depth: 1,
  })

  return (
    <PageProductGrid
      context="food-hub"
      products={products.docs as any}
      title="Food Hub"
    />
  )
}
