'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const eventTypes = [
  'Wedding',
  'Birthday Party',
  'Corporate Event',
  'Office Lunch',
  'School Event',
  'Naming Ceremony',
  'Burial/Funeral',
  'House Warming',
  'Church Event',
  'Others',
] as const

const serviceTypes = [
  'Indoor Catering',
  'Outdoor Catering',
  'Bulk Cooking',
  'Private Chef',
] as const

const budgetRanges = [
  'Under N200,000',
  'N200,000 - N500,000',
  'N500,000 - N1,000,000',
  'N1,000,000 - N3,000,000',
  'Above N3,000,000',
] as const

type ServiceType = (typeof serviceTypes)[number]

const NOTES_MAX = 500

const cateringSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  whatsappNumber: z.string().optional(),
  eventType: z.enum(eventTypes, { error: 'Please select an event type.' }),
  eventDate: z.string().min(1, 'Event date is required.'),
  numberOfGuests: z
    .number({ error: 'Number of guests is required.' })
    .int()
    .positive('Enter a valid guest count.'),
  eventLocation: z.string().min(1, 'Event location is required.'),
  typeOfService: z.enum(serviceTypes, { error: 'Please select a service.' }),
  budgetRange: z.enum(budgetRanges).optional(),
  preferredMenu: z.string().optional(),
  serviceLevel: z.enum(['Standard', 'Premium']),
  needServiceStaff: z.boolean(),
  needLogistics: z.boolean(),
  additionalNotes: z.string().max(NOTES_MAX).optional(),
})

export type CateringFormData = z.infer<typeof cateringSchema>

/** Maps a catering service card title to a `typeOfService` option. */
const serviceNameToOption: Record<string, ServiceType> = {
  'Indoor Catering': 'Indoor Catering',
  'Outdoor Catering': 'Outdoor Catering',
  'Bulk Cooking': 'Bulk Cooking',
  'Private Chef Services': 'Private Chef',
}

const labelClassName = 'text-xs font-bold uppercase tracking-wide text-foreground'
const fieldClassName = 'h-11 w-full rounded-lg bg-muted'

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: readonly { label: string; value: string }[]
}) {
  return (
    <div className="flex h-11 items-center gap-1 rounded-lg bg-muted p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-full flex-1 rounded-md text-sm transition-colors',
              active
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

type Props = {
  serviceName?: string
  onCancel: () => void
}

export const CateringForm: React.FC<Props> = ({ serviceName, onCancel }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<CateringFormData>({
    resolver: zodResolver(cateringSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      whatsappNumber: '',
      eventDate: '',
      eventLocation: '',
      typeOfService: serviceName ? serviceNameToOption[serviceName] : undefined,
      preferredMenu: '',
      serviceLevel: 'Standard',
      needServiceStaff: true,
      needLogistics: true,
      additionalNotes: '',
    },
  })

  const notesLength = (watch('additionalNotes') ?? '').length

  const onSubmit = (data: CateringFormData) => {
    console.log('Catering inquiry', data)

    const phone = process.env.NEXT_PUBLIC_WA_NUMBER!
    const formatted = `Catering Request Details:\n
---\n
${Object.entries(data)
  .map(
    ([key, value]) =>
      `- ${key.toUpperCase()} => ${value === '' ? 'NIL' : typeof value === 'boolean' && value === true ? 'Yes' : typeof value === 'boolean' && value === false ? 'No' : value}`,
  )
  .join('\n')}
      `

    if (typeof window !== 'undefined') {
      window.location.href = encodeURI(`https://wa.me/${phone}?text=${formatted}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
        <FormItem>
          <label className={labelClassName} htmlFor="fullName">
            Full Name *
          </label>
          <Input
            id="fullName"
            className={fieldClassName}
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
            className={fieldClassName}
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
            className={fieldClassName}
            placeholder="If different from phone"
            {...register('whatsappNumber')}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Event Type *</label>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(fieldClassName, 'mb-0')}>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.eventType && <FormError message={errors.eventType.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="eventDate">
            Event Date *
          </label>
          <Input id="eventDate" type="date" className={fieldClassName} {...register('eventDate')} />
          {errors.eventDate && <FormError message={errors.eventDate.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="numberOfGuests">
            Number of Guests *
          </label>
          <Input
            id="numberOfGuests"
            type="number"
            min={1}
            className={fieldClassName}
            placeholder="Estimated guest count"
            {...register('numberOfGuests', { valueAsNumber: true })}
          />
          {errors.numberOfGuests && <FormError message={errors.numberOfGuests.message} />}
        </FormItem>

        <FormItem className="md:col-span-2">
          <label className={labelClassName} htmlFor="eventLocation">
            Event Location *
          </label>
          <Input
            id="eventLocation"
            className={fieldClassName}
            placeholder="City, address or venue name"
            {...register('eventLocation')}
          />
          {errors.eventLocation && <FormError message={errors.eventLocation.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Type of Service *</label>
          <Controller
            control={control}
            name="typeOfService"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(fieldClassName, 'mb-0')}>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.typeOfService && <FormError message={errors.typeOfService.message} />}
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Budget Range</label>
          <Controller
            control={control}
            name="budgetRange"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(fieldClassName, 'mb-0')}>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName} htmlFor="preferredMenu">
            Preferred Menu (Optional)
          </label>
          <Input
            id="preferredMenu"
            className={fieldClassName}
            placeholder="e.g. Jollof rice, Fried chicken..."
            {...register('preferredMenu')}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Service Level</label>
          <Controller
            control={control}
            name="serviceLevel"
            render={({ field }) => (
              <Segmented
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: 'Standard', value: 'Standard' },
                  { label: 'Premium', value: 'Premium' },
                ]}
              />
            )}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Service Staff Needed?</label>
          <Controller
            control={control}
            name="needServiceStaff"
            render={({ field }) => (
              <Segmented
                value={field.value ? 'yes' : 'no'}
                onChange={(value) => field.onChange(value === 'yes')}
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
              />
            )}
          />
        </FormItem>

        <FormItem>
          <label className={labelClassName}>Setup / Logistics Needed?</label>
          <Controller
            control={control}
            name="needLogistics"
            render={({ field }) => (
              <Segmented
                value={field.value ? 'yes' : 'no'}
                onChange={(value) => field.onChange(value === 'yes')}
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
              />
            )}
          />
        </FormItem>

        <FormItem className="md:col-span-2">
          <label className={labelClassName} htmlFor="additionalNotes">
            Additional Notes
          </label>
          <Textarea
            id="additionalNotes"
            className="min-h-24 rounded-lg bg-muted"
            maxLength={NOTES_MAX}
            placeholder="Any special requirements, dietary needs, or additional information..."
            {...register('additionalNotes')}
          />
          <span className="self-end text-xs text-muted-foreground">
            {notesLength}/{NOTES_MAX}
          </span>
        </FormItem>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 md:flex-row md:items-center">
        <Button
          type="button"
          size="clear"
          onClick={onCancel}
          className="h-12 rounded-full bg-muted text-foreground hover:bg-muted/70 md:flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="clear"
          className="h-12 rounded-full bg-secondary text-white hover:bg-secondary/90 md:flex-[1.4]"
        >
          Proceed to Whatsapp
        </Button>
      </div>
    </form>
  )
}
