'use client'

import { Message } from '@/components/Message'
import { OrderSummary } from '@/components/OrderSummary'
import { formatNaira, resolveNairaPrice } from '@/utilities/pricing'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePageCart } from '@/providers/PageCart/context'
import { useAuth } from '@/providers/Auth'
import { useTheme } from '@/providers/Theme'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

import { cssVariables } from '@/cssVariables'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { useAddresses, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Address } from '@/payload-types'
import { Checkbox } from '@/components/ui/checkbox'
import { AddressItem } from '@/components/addresses/AddressItem'
import { FormItem } from '@/components/forms/FormItem'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '../ui/badge'
import { ArrowRight } from 'lucide-react'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

const steps = [
  { id: 'review', label: 'Review Order' },
  { id: 'details', label: 'Details & Payment' },
]

type Props = {
  pageContext?: string
}

export const CheckoutPage: React.FC<Props> = ({ pageContext }) => {
  const { user } = useAuth()
  const router = useRouter()
  const { pageCart, pageItems, pageSubtotal, setPageContext } = usePageCart()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<null | string>(null)
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    if (pageContext) {
      setPageContext(pageContext as any)
    }
  }, [pageContext, setPageContext])

  const cartIsEmpty = !pageItems || pageItems.length === 0

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Processing your payment...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

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
      <Stepper steps={steps} currentStep={currentStep}>
        <div className="flex flex-col items-stretch justify-stretch md:flex-row grow gap-10 md:gap-6 lg:gap-8">
          {currentStep === 0 && (
            <div className="w-full max-w-2xl mx-auto">
              <h2 className="font-medium text-3xl mb-6">Review Your Order</h2>
              <div>
                <h3>
                  {pageContext === 'food-hub'
                    ? 'FOOD ITEMS'
                    : pageContext === 'restaurant'
                      ? 'RESTAURANT ORDER'
                      : 'BULK ORDER REQUEST'}
                </h3>
                {pageContext === 'bulk-order' && <Badge>Quote Pending</Badge>}
              </div>

              {/*<div className="flex flex-col gap-4 mb-8">
                {pageItems.map((item, index) => {
                  if (typeof item.product !== 'object' || !item.product) return null
                  const product = item.product
                  const variant = item.variant && typeof item.variant === 'object' ? item.variant : undefined
                  const price = resolveNairaPrice(variant) ?? resolveNairaPrice(product)

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-lg p-4 bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{product.title}</p>
                        {item.variant && typeof item.variant === 'object' && (
                          <p className="text-sm text-muted-foreground capitalize">
                            {item.variant.options
                              ?.map((o) => (typeof o === 'object' ? o.label : null))
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        {typeof price === 'number' && <span>{formatNaira(price)}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>*/}

              <OrderSummary items={pageItems} subtotal={pageSubtotal} pageContext={pageContext} />

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setCurrentStep(1)} className="text-white">
                  Continue <ArrowRight className="text-white" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="basis-full lg:basis-2/3 flex flex-col gap-8 justify-stretch">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-3xl">Contact</h2>
                <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                  Back to Review
                </Button>
              </div>

              {!user && (
                <div className="bg-accent dark:bg-black rounded-lg p-4 w-full flex items-center">
                  <div className="prose dark:prose-invert">
                    <Button asChild className="no-underline text-inherit" variant="outline">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <p className="mt-0">
                      <span className="mx-2">or</span>
                      <Link href="/create-account">create an account</Link>
                    </p>
                  </div>
                </div>
              )}
              {user ? (
                <div className="bg-accent dark:bg-card rounded-lg p-4">
                  <div>
                    <p>{user.email}</p>
                    <p>
                      Not you?{' '}
                      <Link className="underline" href="/logout">
                        Log out
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-accent dark:bg-black rounded-lg p-4">
                  <div>
                    <p className="mb-4">Enter your email to checkout as a guest.</p>
                    <FormItem className="mb-6">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        disabled={!emailEditable}
                        id="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                      />
                    </FormItem>
                    <Button
                      disabled={!email || !emailEditable}
                      onClick={(e) => {
                        e.preventDefault()
                        setEmailEditable(false)
                      }}
                      variant="default"
                    >
                      Continue as guest
                    </Button>
                  </div>
                </div>
              )}

              <h2 className="font-medium text-3xl">Address</h2>

              {billingAddress ? (
                <div>
                  <AddressItem
                    actions={
                      <Button
                        variant="outline"
                        disabled={Boolean(paymentData)}
                        onClick={(e) => {
                          e.preventDefault()
                          setBillingAddress(undefined)
                        }}
                      >
                        Remove
                      </Button>
                    }
                    address={billingAddress}
                  />
                </div>
              ) : user ? (
                <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} />
              ) : (
                <CreateAddressModal
                  disabled={!email || Boolean(emailEditable)}
                  callback={(address) => {
                    setBillingAddress(address)
                  }}
                  skipSubmission={true}
                />
              )}

              <div className="flex gap-4 items-center">
                <Checkbox
                  id="shippingTheSameAsBilling"
                  checked={billingAddressSameAsShipping}
                  disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
                  onCheckedChange={(state) => {
                    setBillingAddressSameAsShipping(state as boolean)
                  }}
                />
                <Label htmlFor="shippingTheSameAsBilling">Shipping is the same as billing</Label>
              </div>

              {!billingAddressSameAsShipping && (
                <>
                  {shippingAddress ? (
                    <div>
                      <AddressItem
                        actions={
                          <Button
                            variant="outline"
                            disabled={Boolean(paymentData)}
                            onClick={(e) => {
                              e.preventDefault()
                              setShippingAddress(undefined)
                            }}
                          >
                            Remove
                          </Button>
                        }
                        address={shippingAddress}
                      />
                    </div>
                  ) : user ? (
                    <CheckoutAddresses
                      heading="Shipping address"
                      description="Please select a shipping address."
                      setAddress={setShippingAddress}
                    />
                  ) : (
                    <CreateAddressModal
                      callback={(address) => {
                        setShippingAddress(address)
                      }}
                      disabled={!email || Boolean(emailEditable)}
                      skipSubmission={true}
                    />
                  )}
                </>
              )}

              {!paymentData && (
                <Button
                  className="self-start"
                  disabled={!canGoToPayment}
                  onClick={(e) => {
                    e.preventDefault()
                    void initiatePaymentIntent('stripe')
                  }}
                >
                  Go to payment
                </Button>
              )}

              {!paymentData?.['clientSecret'] && error && (
                <div className="my-8">
                  <Message error={error} />
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      router.refresh()
                    }}
                    variant="default"
                  >
                    Try again
                  </Button>
                </div>
              )}

              <Suspense fallback={<React.Fragment />}>
                {paymentData && (paymentData as any)?.['clientSecret'] && (
                  <div className="pb-16">
                    <h2 className="font-medium text-3xl">Payment</h2>
                    {error && <p>{`Error: ${error}`}</p>}
                    <Elements
                      options={{
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            borderRadius: '6px',
                            colorPrimary: '#858585',
                            gridColumnSpacing: '20px',
                            gridRowSpacing: '20px',
                            colorBackground:
                              theme === 'dark' ? '#0a0a0a' : cssVariables.colors.base0,
                            colorDanger: cssVariables.colors.error500,
                            colorDangerText: cssVariables.colors.error500,
                            colorIcon:
                              theme === 'dark'
                                ? cssVariables.colors.base0
                                : cssVariables.colors.base1000,
                            colorText: theme === 'dark' ? '#858585' : cssVariables.colors.base1000,
                            colorTextPlaceholder: '#858585',
                            fontFamily: 'Geist, sans-serif',
                            fontSizeBase: '16px',
                            fontWeightBold: '600',
                            fontWeightNormal: '500',
                            spacingUnit: '4px',
                          },
                        },
                        clientSecret: paymentData['clientSecret'] as string,
                      }}
                      stripe={stripe}
                    >
                      <div className="flex flex-col gap-8">
                        <CheckoutForm
                          customerEmail={email}
                          billingAddress={billingAddress}
                          setProcessingPayment={setProcessingPayment}
                        />
                        <Button
                          variant="ghost"
                          className="self-start"
                          onClick={() => setPaymentData(null)}
                        >
                          Cancel payment
                        </Button>
                      </div>
                    </Elements>
                  </div>
                )}
              </Suspense>
            </div>
          )}

          {!cartIsEmpty && currentStep === 1 && (
            <div className="basis-full lg:basis-1/3 lg:pl-8">
              <OrderSummary items={pageItems} subtotal={pageSubtotal} />
            </div>
          )}
        </div>
      </Stepper>
    </div>
  )
}
