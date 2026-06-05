import {
  Doc,
  LandingIcon1,
  LandingIcon2,
  LandingIcon3,
  LandingIcon4,
  WhatsApp,
} from '@/components/icons/landing'
import PageTemplate, { generateMetadata } from './[slug]/page'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const processes: Array<{
  title: string
  description: string
  icon: React.ReactNode
}> = [
  {
    title: 'Inquiry',
    description:
      'Reach out via WhatsApp, call or our website. Tell us about your event, order size or catering needs.',
    icon: <LandingIcon1 className="h-auto w-8 text-[#4A5A2A] dark:text-white" />,
  },
  {
    title: 'Menu & Proposal',
    description:
      'We craft a tailored menu and detailed proposal based on your preferences, budget and occasion.',
    icon: <LandingIcon2 className="h-auto w-8 text-[#4A5A2A] dark:text-white" />,
  },
  {
    title: 'Booking Confirmation',
    description:
      'Review and confirm your booking. A deposit secures your date and we begin all preparations.',
    icon: <LandingIcon3 className="h-auto w-8 text-[#4A5A2A] dark:text-white" />,
  },
  {
    title: 'Delivery & Execution',
    description:
      'We handle everything — from setup to service — ensuring a seamless, memorable experience.',
    icon: <LandingIcon4 className="h-auto w-8 text-[#4A5A2A] dark:text-white" />,
  },
]

const experiences: Array<{
  title: string
  description: string
  extra: string
  imgUrl: string
  redirect: string
}> = [
  {
    title: 'Food Hub',
    description: 'Buy quality food items, ingredients and everyday kitchen essentials.',
    extra: 'Explore',
    imgUrl: '/Experiences/Food-Hub.jpg',
    redirect: '/food-hub',
  },
  {
    title: 'Catering Services',
    description: 'Indoor and outdoor catering for weddings, offices and private events.',
    extra: 'Learn More',
    imgUrl: '/Experiences/Catering-Service.jpg',
    redirect: '/catering',
  },
  {
    title: 'Bulk Orders',
    description: 'Large quantity meals for schools, offices and private orders.',
    extra: 'Order Now',
    imgUrl: '/Experiences/Bulk-Orders.jpg',
    redirect: '/bulk-order',
  },
  {
    title: 'Restaurant',
    description: 'Freshly prepared meals in a warm dining atmosphere.',
    extra: 'View Menu',
    imgUrl: '/Experiences/Restaurant.jpg',
    redirect: '/restaurant',
  },
  {
    title: 'Pay Small Small',
    description: 'Flexible payment options for larger food and catering requests.',
    extra: 'Get Started',
    imgUrl: '/Experiences/Pay-Small-Small.jpg',
    redirect: '/food-hub',
  },
  {
    title: 'Plan Your Event',
    description: 'Let Casa handle your next celebration or corporate experience.',
    extra: 'Get Proposal',
    imgUrl: '/Experiences/Plan-Your-Events.jpg',
    redirect: '/catering',
  },
]

export default function HomePage() {
  return (
    <>
      <div className="pt-16 pb-24">
        <section className="container mb-24 text-center">
          <h1 className="text-3xl font-semibold mb-4">What would you like today?</h1>
          <span className="text-sm md:text-lg text-muted-foreground max-w-2xl text-center">
            Choose a Casa Food Hub experience
          </span>
        </section>
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 px-4">
            {experiences.map((ex, i) => (
              <Link href={ex.redirect} prefetch key={ex.title + '-' + i}>
                <div
                  key={`experiences-item-${i + 1}`}
                  className="w-full flex flex-col items-start gap-3 rounded-xl overflow-hidden"
                >
                  <img src={ex.imgUrl} className="object-cover aspect-video w-full" />
                  <h1 className="font-semibold text-center">{ex.title}</h1>
                  <p className="font-extralight text-balance">{ex.description}</p>
                  <div className="flex items-center justify-start gap-3">
                    <span>{ex.extra}</span>
                    <div className="p-2 bg-[#3A4A1E]/40 rounded-full text-white">
                      <ArrowRight className="size-4 " />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="py-24 items-center flex flex-col">
        <section className="container mb-16 text-center flex flex-col items-center gap-1">
          <h4 className="text-primary text-4xl">How Casa Food Hub Works</h4>
          <h1 className="text-lg font-extralight text-muted-foreground">
            Simple, transparent and stress-free from start to finish.
          </h1>
          <div className="w-18 bg-[#C9A84C] h-0.5 rounded-full" />
        </section>
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 px-4">
            {processes.map((process, i) => (
              <div
                key={`process-item-${i + 1}`}
                className="w-full flex flex-col items-center gap-3"
              >
                <div className="relative rounded-full size-18 border-2 border-[#C9A84C] bg-[#FAF7F2]/40 text-[#C9A84C] flex items-center justify-center">
                  <div className="text-xs size-5 flex items-center justify-center rounded-full bg-[#C9A84C] text-white absolute -top-2 right-2">
                    {i + 1}
                  </div>
                  {process.icon}
                </div>
                <h1 className="font-medium text-center">{process.title}</h1>
                <p className="text-center font-extralight text-balance">{process.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="relative mt-18 h-110.5 flex flex-col items-center justify-center bg-[url('/Landing-CTA.jpg')]">
        <div className="absolute inset-0 bg-linear-30 from-[#4A5A2A99] to-[#3A4A1ECC]" />
        <div className="z-50 max-w-full md:max-w-xl flex flex-col items-center justify-center gap-4">
          <h4 className="text-primary-foreground dark:text-primary text-3xl md:text-4xl font-semibold">
            Let's plan your next event
          </h4>
          <span className="text-xl font-extralight text-white text-center max-w-sm text-balance">
            From intimate dinners to grand celebrations — Casa Food Hub brings warmth, flavour and
            elegance to every occasion.
          </span>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4">
            <Button
              variant="default"
              size="lg"
              className="rounded-full hover:text-secondary w-full md:w-auto"
            >
              <WhatsApp />
              Chat on WhatsApp
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border border-white/60 bg-white/30 w-full md:w-auto"
            >
              <Doc />
              Request Proposal
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
// Customise the landing page

export { generateMetadata }
