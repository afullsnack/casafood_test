'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

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
const serviceTypes = ['Indoor Catering', 'Outdoor Catering', 'Bulk Cooking', 'Private Chef'] as const
const budgetRange = [
  'Under N200,000',
  'N200,000 - N500,000',
  'N500,000 - N1,000,000',
  'N1,000,000 - N3,000,000',
  'Above N3,000,000 ',
] as const
const cateringSchema = z.object({
  full_name: z.string().min(3),
  phone: z.string().min(9),
  whatsapp_number: z.string().min(9).optional(),
  event_type: z.enum(eventTypes).default('Wedding'),
  event_date: z.date(),
  number_of_guests: z.number(),
  event_location: z.string(),
  type_of_service: z.enum(serviceTypes).default('Indoor Catering'),
  budget_range: z.enum(budgetRange).default('Under N200,000'),
  prefered_menu: z.string().optional(),
  service_level: z.enum(['Standard', 'Premium']).default('Standard'),
  need_service_staff: z.boolean(),
  need_logistics: z.boolean(),
  additional_note: z.string().max(500).optional(),
})
type FormData = z.infer<typeof cateringSchema>

export const CateringForm: React.FC = () => {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const {
    formState: { errors, isLoading, defaultValues },
    handleSubmit,
    register,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cateringSchema) as any,
    defaultValues: {
      full_name: '',
      phone: '',
      event_type: 'Wedding',
      event_date: new Date(),
      number_of_guests: 0,
      event_location: '',
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        // TOOD: Submit catering form and proceed to whatsapp url
        console.log(`Values from form`, { data })
      } catch (error) {
        console.log(`Error submitting catering form`, { error })
      }
    },
    [router],
  )

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as any))}>
      <Message className="classes.message" error={errorMsg} />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <FormItem>
            <Label>FULL NAME</Label>
            <Input
              id="full_name"
              type="text"
              {...register('full_name', { required: 'Full name is required.' })}
            />
            {errors.full_name && <FormError message={errors.full_name.message} />}
          </FormItem>
          <FormItem>
            <label>PHONE NUMBER</label>
            <Input
              id="phone"
              type="number"
              placeholder="+234 XXX XXXX XXX"
              {...register('phone', { required: 'Phone number is required.' })}
            />
            {errors.phone && <FormError message={errors.phone.message} />}
          </FormItem>
          <FormItem>
            <label>WHATSAPP NUMBER</label>
            <Input
              id="whatsapp_number"
              type="number"
              placeholder="If different from phone"
              {...register('whatsapp_number')}
            />
            {errors.phone && <FormError message={errors.phone.message} />}
          </FormItem>
          <FormItem>
            <label>EVENT TYPE</label>
            <Select>
              <SelectTrigger>
                <SelectValue
                  defaultValue={defaultValues?.event_type}
                  className="w-full"
                  placeholder="Select event type"
                />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.event_type && <FormError message={errors.event_type.message} />}
          </FormItem>
          <FormItem>
            <Label>EVENT DATE</Label>
            <Input
              id="event_date"
              type="date"
              {...register('event_date', { required: 'Pick a date for the event' })}
            />
          </FormItem>
        </div>
        <div></div>
      </div>
    </form>
  )
}
