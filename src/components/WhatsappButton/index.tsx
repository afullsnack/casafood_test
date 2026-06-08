'use client'
import { callWhatsapp } from '@/utilities/whatsappRedirect'
import { WhatsApp } from '../icons/landing'
import { Button } from '../ui/button'

export default function WhatsappButton() {
  return (
    <Button
      variant="default"
      size="lg"
      className="rounded-full hover:text-secondary w-full md:w-auto"
      onClick={() => {
        if (typeof window !== 'undefined') {
          const formatted = `
            *Let us know how we can be of service today!*
          `
          callWhatsapp({ content: formatted })
          window.open(`example.com`, '_blank', 'noopener,noreferrer')
        }
      }}
    >
      <WhatsApp />
      Chat on WhatsApp
    </Button>
  )
}
