import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { CateringForm } from '@/components/forms/CateringForm'

const h = React.createElement

beforeAll(() => {
  // Radix Select relies on these DOM APIs that jsdom does not implement.
  Element.prototype.scrollIntoView = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn(() => false) as never
  Element.prototype.releasePointerCapture = vi.fn() as never
  Element.prototype.setPointerCapture = vi.fn() as never
})

afterEach(() => cleanup())

const openSelect = (placeholder: string) => {
  const trigger = screen.getByText(placeholder).closest('button')!
  fireEvent.keyDown(trigger, { key: 'Enter' })
}

describe('CateringForm', () => {
  let logSpy: MockInstance

  const renderForm = (props: { serviceName?: string; onCancel?: () => void } = {}) =>
    render(h(CateringForm, { onCancel: () => {}, ...props }))

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('renders every design field, select placeholder, and toggle', () => {
    renderForm()

    for (const label of [
      'Full Name *',
      'Phone Number *',
      'WhatsApp Number',
      'Event Type *',
      'Event Date *',
      'Number of Guests *',
      'Event Location *',
      'Type of Service *',
      'Budget Range',
      'Preferred Menu (Optional)',
      'Service Level',
      'Service Staff Needed?',
      'Setup / Logistics Needed?',
      'Additional Notes',
    ]) {
      expect(screen.getByText(label)).toBeTruthy()
    }

    expect(screen.getByText('Select event type')).toBeTruthy()
    expect(screen.getByText('Select service')).toBeTruthy()
    expect(screen.getByText('Select budget range')).toBeTruthy()

    expect(screen.getByRole('button', { name: 'Standard' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Premium' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Proceed to Whatsapp' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy()
  })

  it('prefills Type of Service from the service card title (Private Chef Services -> Private Chef)', () => {
    renderForm({ serviceName: 'Private Chef Services' })
    expect(
      screen.getByText('Private Chef', { selector: '[data-slot="select-value"]' }),
    ).toBeTruthy()
  })

  it('lists the Event Type options from the design', async () => {
    renderForm()
    openSelect('Select event type')

    await waitFor(() => expect(screen.getByRole('option', { name: 'Wedding' })).toBeTruthy())
    for (const opt of [
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
    ]) {
      expect(screen.getByRole('option', { name: opt })).toBeTruthy()
    }
  })

  it('lists the Type of Service options from the design', async () => {
    renderForm()
    openSelect('Select service')

    await waitFor(() => expect(screen.getByRole('option', { name: 'Indoor Catering' })).toBeTruthy())
    for (const opt of ['Indoor Catering', 'Outdoor Catering', 'Bulk Cooking', 'Private Chef']) {
      expect(screen.getByRole('option', { name: opt })).toBeTruthy()
    }
  })

  it('blocks submission and surfaces required errors when empty', async () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Proceed to Whatsapp' }))

    await waitFor(() => expect(screen.getByText('Full name is required.')).toBeTruthy())
    for (const msg of [
      'Phone number is required.',
      'Please select an event type.',
      'Event date is required.',
      'Number of guests is required.',
      'Event location is required.',
      'Please select a service.',
    ]) {
      expect(screen.getByText(msg)).toBeTruthy()
    }
    expect(logSpy).not.toHaveBeenCalledWith('Catering inquiry', expect.anything())
  })

  it('logs the entered values when Proceed to Whatsapp is clicked', async () => {
    renderForm({ serviceName: 'Indoor Catering' })

    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Ada Obi' } })
    fireEvent.change(screen.getByPlaceholderText('+234 xxx xxxx xxxx'), {
      target: { value: '08012345678' },
    })
    fireEvent.change(screen.getByPlaceholderText('Estimated guest count'), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByPlaceholderText('City, address or venue name'), {
      target: { value: 'Lagos' },
    })
    fireEvent.change(document.getElementById('eventDate')!, { target: { value: '2026-07-01' } })

    // Required select driven through Radix.
    openSelect('Select event type')
    await waitFor(() => screen.getByRole('option', { name: 'Wedding' }))
    fireEvent.click(screen.getByRole('option', { name: 'Wedding' }))

    // Toggle a non-default segmented control.
    fireEvent.click(screen.getByRole('button', { name: 'Premium' }))

    fireEvent.click(screen.getByRole('button', { name: 'Proceed to Whatsapp' }))

    await waitFor(() =>
      expect(logSpy).toHaveBeenCalledWith(
        'Catering inquiry',
        expect.objectContaining({
          fullName: 'Ada Obi',
          phone: '08012345678',
          numberOfGuests: 50,
          eventLocation: 'Lagos',
          eventDate: '2026-07-01',
          eventType: 'Wedding',
          typeOfService: 'Indoor Catering',
          serviceLevel: 'Premium',
          needServiceStaff: true,
          needLogistics: true,
        }),
      ),
    )
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn()
    renderForm({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
