import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { CheckoutDetails } from '@/components/checkout/CheckoutDetails'
import { Stepper } from '@/components/Stepper'

const h = React.createElement

const steps = [
  { id: 'review', label: 'Review Order' },
  { id: 'details', label: 'Your Details' },
]

afterEach(() => cleanup())

describe('Stepper', () => {
  it('renders earlier steps as completed (check) and the current step as its number', () => {
    const { container } = render(h(Stepper, { steps, currentStep: 1, children: h('div', null, 'body') }))

    expect(screen.getByText('Review Order')).toBeTruthy()
    expect(screen.getByText('Your Details')).toBeTruthy()
    expect(screen.getByText('body')).toBeTruthy()

    const items = container.querySelectorAll('li')
    expect(items.length).toBe(2)

    // Completed step: shows a check icon, not the digit "1".
    expect(items[0]!.querySelector('svg')).toBeTruthy()
    expect(items[0]!.textContent).not.toContain('1')

    // Active step: shows its number, no check icon.
    expect(items[1]!.querySelector('svg')).toBeNull()
    expect(items[1]!.textContent).toContain('2')
  })

  it('renders the active first step as its number before progressing', () => {
    const { container } = render(h(Stepper, { steps, currentStep: 0, children: h('div', null, 'body') }))

    const items = container.querySelectorAll('li')
    expect(items[0]!.querySelector('svg')).toBeNull()
    expect(items[0]!.textContent).toContain('1')
  })
})

describe('CheckoutDetails', () => {
  let logSpy: MockInstance

  const renderDetails = (props: { itemCount?: number; subtotal?: number; onBack?: () => void } = {}) =>
    render(
      h(CheckoutDetails, {
        itemCount: 3,
        subtotal: 119000,
        cartItems: [],
        onBack: () => {},
        ...props,
      }),
    )

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('renders the detail fields and order summary', () => {
    renderDetails()

    expect(screen.getByText('Your Details')).toBeTruthy()
    expect(screen.getByText('Full Name *')).toBeTruthy()
    expect(screen.getByText('Phone Number *')).toBeTruthy()
    expect(screen.getByPlaceholderText('Your full name')).toBeTruthy()
    expect(screen.getByPlaceholderText('+234 xxx xxxx xxxx')).toBeTruthy()
    expect(screen.getByText('Food items (3)')).toBeTruthy()
    expect(screen.getByText('₦119,000')).toBeTruthy()
    expect(screen.getByRole('button', { name: /proceed to whatsapp/i })).toBeTruthy()
  })

  it('logs the form values when Proceed to WhatsApp is clicked with valid input', async () => {
    renderDetails()

    fireEvent.change(screen.getByPlaceholderText('Your full name'), {
      target: { value: 'Ada Obi' },
    })
    fireEvent.change(screen.getByPlaceholderText('+234 xxx xxxx xxxx'), {
      target: { value: '08012345678' },
    })
    fireEvent.change(screen.getByPlaceholderText('If different from phone'), {
      target: { value: '08099999999' },
    })
    fireEvent.change(screen.getByPlaceholderText('City, address, or venue'), {
      target: { value: 'Lagos' },
    })

    fireEvent.click(screen.getByRole('button', { name: /proceed to whatsapp/i }))

    await waitFor(() =>
      expect(logSpy).toHaveBeenCalledWith(
        'Checkout details',
        expect.anything(),
        expect.objectContaining({
          fullName: 'Ada Obi',
          phone: '08012345678',
          whatsappNumber: '08099999999',
          location: 'Lagos',
        }),
        expect.anything(),
        expect.anything(),
      ),
    )
  })

  it('blocks logging and surfaces errors when required fields are empty', async () => {
    renderDetails()

    fireEvent.click(screen.getByRole('button', { name: /proceed to whatsapp/i }))

    await waitFor(() => expect(screen.getByText('Full name is required.')).toBeTruthy())
    expect(screen.getByText('Phone number is required.')).toBeTruthy()
    expect(logSpy).not.toHaveBeenCalledWith('Checkout details', expect.anything())
  })

  it('calls onBack when Back to Order Review is clicked', () => {
    const onBack = vi.fn()
    renderDetails({ onBack })

    fireEvent.click(screen.getByRole('button', { name: /back to order review/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
