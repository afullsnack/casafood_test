import { WhatsApp } from '@/components/icons/landing'
import { PageProductGrid } from '@/components/PageProductGrid'
import { Button } from '@/components/ui/button'
import WhatsappButton from '@/components/WhatsappButton'
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
      and: [{ _status: { equals: 'published' } }, { page: { equals: 'bulk-order' } }],
    },
    depth: 2,
  })

  return (
    <>
      <PageProductGrid
        context="bulk-order"
        products={products.docs as any}
        pageTitle="BULK MENU"
        pageSubTitle="What Can We Cook for You?"
      />
      <div className="pt-12 pb-24 px-4 md:px-0">
        <section className="container bg-[#4A5A2A] rounded-md flex flex-col md:flex-row items-center justify-between gap-4 text-white p-8">
          <div>
            <h2 className="text-3xl">Not sure what to order?</h2>
            <span className="text-xs text-muted">
              Tell us your guest count, event type, and budget — we'll recommend the right
              combination and quantity for you.
            </span>
          </div>
          <a
            href={encodeURI(`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER!}`)}
            target="_blank"
            className="w-full md:w-auto"
          >
            <Button
              size="lg"
              className="rounded-full hover:text-secondary w-full md:w-auto bg-[#C9A84C] text-white"
            >
              <WhatsApp />
              Chat with Us on WhatsApp
            </Button>
          </a>
        </section>
      </div>
    </>
  )
}
