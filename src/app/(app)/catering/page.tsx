'use client'

import React, { Suspense, useState } from 'react'

import { ContentWithMediaBlock } from '@/blocks/ContentWithMedia/Component'
import { CateringFormModal } from '@/components/CateringFormModal'
import { useNavigationGuard } from '@/hooks/use-navigation-guard'

const services = [
  {
    title: 'Indoor Catering',
    description:
      'Perfect for homes, offices, small gatherings, team lunches, and private indoor events.',
    link: { type: 'custom' as const, url: '/contact' },
  },
  {
    title: 'Outdoor Catering',
    description:
      'Full catering support for weddings, ceremonies, birthdays, corporate events, and large gatherings.',
    link: { type: 'custom' as const, url: '/contact' },
  },
  {
    title: 'Bulk Cooking',
    description:
      'Large-volume food preparation for schools, corporates, private orders, and group feeding needs.',
    link: { type: 'custom' as const, url: '/contact' },
  },
  {
    title: 'Private Chef Services',
    description:
      'A personalized chef experience for private homes, intimate dinners, executive hosting, and exclusive events.',
    link: { type: 'custom' as const, url: '/contact' },
  },
]

const inquiryFlow = [
  {
    title: `Inquiry`,
    description: `Tell us about your event and service needs via the form.`,
  },
  {
    title: `Proposal`,
    description: `We prepare a tailored menu proposal and pricing for your review.`,
  },
  {
    title: `Confirmation`,
    description: `Confirm your booking and pay a deposit to secure your date.`,
  },
  {
    title: `Execution`,
    description: `Casa handles everything — setup, food, and flawless service delivery.`,
  },
]

function CateringPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  useNavigationGuard(true, 'You have unsaved changes')

  return (
    <>
      <div className="pt-16 pb-24">
        <section className="container mb-16 text-center">
          <h1 className="text-3xl font-semibold mb-4">Choose your Catering Service</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl text-center">
            Whether it&apos;s an intimate gathering or a grand celebration — Casa has the right
            service for you.
          </p>
        </section>

        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((service, index) => (
              <ContentWithMediaBlock
                key={index}
                {...service}
                blockType="contentWithMedia"
                onAction={() => setSelectedService(service.title)}
              />
            ))}
          </div>
        </section>
      </div>
      <div className="py-24 items-center flex flex-col">
        <section className="container mb-16 text-center">
          <h4 className="text-[#C9A84C] text-sm">HOW IT WORKS</h4>
          <h1 className="text-2xl font-semibold">From Inquiry to Execution</h1>
        </section>
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 px-4">
            {inquiryFlow.map((flow, i) => (
              <div key={`flow-item-${i + 1}`} className="w-full flex flex-col gap-3">
                <div className="rounded-full size-12 border border-[#C9A84C] bg-[#C9A84C]/40 text-[#C9A84C] flex items-center justify-center">
                  {i + 1}
                </div>
                <h1 className="font-bold">{flow.title}</h1>
                <p>{flow.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CateringFormModal
        open={!!selectedService}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null)
        }}
        serviceName={selectedService || ''}
      />
    </>
  )
}

export default function CateringPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CateringPage />
    </Suspense>
  )
}
