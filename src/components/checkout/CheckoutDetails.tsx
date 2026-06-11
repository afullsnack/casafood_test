'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { WhatsApp } from '@/components/icons/landing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Product, Variant, VariantOption } from '@/payload-types'
import { formatNaira } from '@/utilities/pricing'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const NOTES_MAX = 500

const detailsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  whatsappNumber: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().max(NOTES_MAX).optional(),
})

export type CheckoutDetailsFormData = z.infer<typeof detailsSchema>

const labelClassName = 'text-xs font-bold uppercase tracking-wide text-foreground'

type Props = {
  itemCount: number
  cartItems:
    | {
        product?: (number | null) | Product
        variant?: (number | null) | Variant
        quantity: number
        id?: string | null
      }[]
    | null
    | undefined
  subtotal: number
  onBack: () => void
  context: any
}

export function CheckoutDetails({ itemCount, cartItems, subtotal, onBack, context }: Props) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<CheckoutDetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      whatsappNumber: '',
      location: '',
      notes: '',
    },
  })

  const notesLength = (watch('notes') ?? '').length

  const onSubmit = (data: CheckoutDetailsFormData) => {
    console.log(
      'Checkout details',
      cartItems,
      data,
      Object.entries(data)
        .map(([key, value]) => `- ${key.toUpperCase()} => ${value === '' ? 'NIL' : value}`)
        .join('\n'),
      process.env.NEXT_PUBLIC_WA_NUMBER,
    )

    const phone = process.env.NEXT_PUBLIC_WA_NUMBER!
    const formatted = `*Hello, I would like to confirm the final quote and checkout the following items from section ${context}:*\n
---\n
_Order Items:_\n
${cartItems?.map((item) => `- ${(item.product as Product)?.title} ${typeof item.variant !== 'undefined' ? '(' + ((item.variant as Variant).options[0] as VariantOption).label + ')' : ''}: ${item.quantity}x${(item.product as Product).priceInNGN}`).join('\n')}
---\n
_Checkout Details:_\n${Object.entries(data)
      .map(([key, value]) => `- ${key.toUpperCase()} => ${value === '' ? 'NIL' : value}`)
      .join('\n')}`
    if (typeof window !== 'undefined') {
      window.location.href = encodeURI(`https://wa.me/${phone}?text=${formatted}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6"
    >
      <h2 className="text-3xl font-bold">Your Details</h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <FormItem>
          <label className={labelClassName} htmlFor="fullName">
            Full Name *
          </label>
          <Input
            id="fullName"
            className="h-11"
            placeholder="Your full name"
            {...register('fullName')}
          />
          {errors.fullName && <FormError message={errors.fullName.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="phone">
            Phone Number *
          </label>
          <Input
            id="phone"
            type="tel"
            className="h-11"
            placeholder="+234 xxx xxxx xxxx"
            {...register('phone')}
          />
          {errors.phone && <FormError message={errors.phone.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="whatsappNumber">
            WhatsApp Number
          </label>
          <Input
            id="whatsappNumber"
            type="tel"
            className="h-11"
            placeholder="If different from phone"
            {...register('whatsappNumber')}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="location">
            Delivery / Event Location
          </label>
          <Input
            id="location"
            className="h-11"
            placeholder="City, address, or venue"
            {...register('location')}
          />
        </FormItem>
      </div>

      <FormItem>
        <label className={labelClassName} htmlFor="notes">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          className="min-h-28"
          maxLength={NOTES_MAX}
          placeholder="Any special requests or additional information..."
          {...register('notes')}
        />
        <span className="self-end text-xs text-muted-foreground">
          {notesLength}/{NOTES_MAX}
        </span>
      </FormItem>

      <div className="flex items-center justify-between rounded-lg bg-[#F3EDE1] px-6 py-5">
        <div>
          <p className="font-semibold text-foreground">Order Summary</p>
          <p className="text-sm text-muted-foreground">Food items ({itemCount})</p>
        </div>
        <span className="text-lg font-semibold text-foreground">{formatNaira(subtotal || 0)}</span>
      </div>

      <div className="rounded-lg bg-[#3A4A1E] p-6 text-white">
        <p className="flex items-center gap-2 font-semibold">
          <WhatsApp className="size-4" />
          Ready to confirm via WhatsApp?
        </p>
        <p className="mt-2 text-sm text-white/70">
          Clicking below will open WhatsApp with your order details pre-filled. Our team will
          confirm, discuss payment, and arrange delivery.
        </p>
        <Button
          type="submit"
          size="clear"
          className="mt-5 h-12 w-full rounded-lg bg-[#C9A84C] text-white hover:bg-[#bb9a3e]"
        >
          <WhatsApp className="size-4" />
          Proceed to WhatsApp
        </Button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="hidden md:flex items-center gap-2 self-start text-sm text-foreground hover:opacity-70"
      >
        <ArrowLeft className="size-4" />
        Back to Order Review
      </button>
    </form>
  )
}
