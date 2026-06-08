'use client'

import { CheckoutDetails } from '@/components/checkout/CheckoutDetails'
import { OrderSummary } from '@/components/OrderSummary'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { usePageCart } from '@/providers/PageCart/context'
import type { PageContextValue } from '@/providers/PageCart/context'
import { ArrowLeft, ArrowRight, Truck } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Badge } from '../ui/badge'

const steps = [
  { id: 'review', label: 'Review Order' },
  { id: 'details', label: 'Your Details' },
]

type Props = {
  pageContext?: string
}

export const CheckoutPage: React.FC<Props> = ({ pageContext }) => {
  const { pageItems, pageItemCount, pageSubtotal, setPageContext } = usePageCart()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (pageContext) {
      setPageContext(pageContext as PageContextValue)
    }
  }, [pageContext, setPageContext])

  const cartIsEmpty = !pageItems || pageItems.length === 0

  if (cartIsEmpty) {
    return (
      <div className="prose dark:prose-invert py-12 w-full items-center">
        <p>Your cart is empty.</p>
        <Link href={pageContext ? `/${pageContext}` : '/search'}>Continue shopping?</Link>
      </div>
    )
  }

  return (
    <div className="w-full my-8">
      <button
        type="button"
        onClick={() => setCurrentStep(0)}
        className="flex items-center gap-2 self-start text-sm text-foreground hover:opacity-70 my-8 md:hidden"
      >
        <ArrowLeft className="size-4" />
        Back to Order Review
      </button>
      <Stepper steps={steps} currentStep={currentStep}>
        {currentStep === 0 && (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="font-medium text-3xl mb-6">Review Your Order</h2>
            <div>
              {pageContext == 'bulk-order' && <Truck />}
              <h3>
                {pageContext === 'food-hub'
                  ? 'FOOD ITEMS'
                  : pageContext === 'restaurant'
                    ? 'RESTAURANT ORDER'
                    : 'BULK ORDER REQUEST'}
              </h3>
              {pageContext === 'bulk-order' && <Badge>Quote Pending</Badge>}
            </div>

            <OrderSummary items={pageItems} subtotal={pageSubtotal} pageContext={pageContext} />

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setCurrentStep(1)} className="text-white">
                Continue <ArrowRight className="text-white" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <CheckoutDetails
            itemCount={pageItemCount}
            cartItems={pageItems}
            subtotal={pageSubtotal}
            onBack={() => setCurrentStep(0)}
          />
        )}
      </Stepper>
    </div>
  )
}
