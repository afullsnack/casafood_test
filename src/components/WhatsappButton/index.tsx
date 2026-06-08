'use client'
import { WhatsApp } from '../icons/landing'
import { Button } from '../ui/button'

export default function WhatsappButton() {
  const phone = process.env.WA_NUMBER || '9081146028'
  const content = `
    *Let us know how we can be of service today!*
  `
  return (
    <a
      href={encodeURI(`https://wa.me/${phone}${content ? '?text=' + content : ''}`)}
      target="_blank"
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
