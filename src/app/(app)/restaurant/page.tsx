import { PageProductGrid } from '@/components/PageProductGrid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
      and: [{ _status: { equals: 'published' } }, { page: { equals: 'restaurant' } }],
    },
    depth: 2,
  })

  return (
    <PageProductGrid
      context="restaurant"
      products={products.docs as any}
      pageTitle="OUR MENU"
      pageSubTitle="Today's Offerings"
    />
  )
}
