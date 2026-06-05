import { PageProductGrid } from '@/components/PageProductGrid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Explore our restaurant menu and order online.',
  title: 'Restaurant',
}

export default async function RestaurantPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { page: { equals: 'restaurant' } },
      ],
    },
    depth: 1,
  })

  return (
    <PageProductGrid
      context="restaurant"
      products={products.docs as any}
      title="Restaurant"
    />
  )
}
