'use client'
import { WhatsApp } from '../icons/landing'
import { Button } from '../ui/button'

export default function WhatsappButton() {
  const phone = process.env.NEXT_PUBLIC_WA_NUMBER!
  const content = `
    *Let us know how we can be of service today!*
  `
  return (
    <a
      href={encodeURI(`https://wa.me/${phone}?text=${content}`)}
      target="_blank"
      className="w-full md:w-auto"
    >
      <Button
        variant="default"
        size="lg"
        className="rounded-full hover:text-secondary w-full md:w-auto"
      >
        <WhatsApp />
        Chat on WhatsApp
      </Button>
    </a>
  )
}
