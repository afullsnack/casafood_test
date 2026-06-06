'use client'
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

          `

          window.open(encodeURI(`https://wa.me/9081146028`), '_blank')
          // window.location.href = encodeURI(`https://wa.me/${process.env.WA_NUMBER}`)
        }
      }}
    >
      <WhatsApp />
      Chat on WhatsApp
    </Button>
  )
}
