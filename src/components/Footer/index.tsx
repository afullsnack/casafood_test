import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon, CasaBrandLogo } from '@/components/icons/logo'
import { Instagram, MapPin } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { ConfectionLeafs } from '../icons/confections'
import { WhatsApp } from '../icons/landing'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = `${currentYear}`
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  const services = [
    {
      title: 'Food Hub',
      url: '/food-hub',
    },
    {
      title: 'Catering Service',
      url: '/catering',
    },
    {
      title: 'Bulk Orders',
      url: '/bulk-orders',
    },
    {
      title: 'Restaurant',
      url: '/restaurant',
    },
    {
      title: 'Pay Small Small',
      url: '/food-hub',
    },
    {
      title: 'Plan an Event',
      url: '/catering',
    },
  ]

  return (
    <footer className="text-sm text-neutral-500 relative bg-footer md:px-34">
      <ConfectionLeafs className="w-64 h-auto absolute top-6 xs:left-6 md:right-6" />
      <ConfectionLeafs className="hidden md:block w-64 h-auto absolute bottom-6 left-6" />
      <div className="container p-6 md:pt-20 w-full overflow-hidden">
        <div className="text-white text-center md:text-left flex flex-col gap-4 md:flex-row md:items-start justify-between">
          <div className="z-50">
            <h1 className="text-sm md:text-lg font-bold">SERVICES</h1>
            <ul>
              {services.map((s) => (
                <li className="my-3" key={s.title}>
                  <a href={s.url}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-sm md:text-lg font-bold">CONTACT</h1>
            <p className="flex items-center justify-center gap-3 my-3">
              <MapPin className="size-4" />
              <span>Lagos, Nigeria</span>
            </p>
            <p className="flex items-center justify-center gap-3 my-3">
              <WhatsApp className="size-4" />
              <span>+234 800 000 0000</span>
            </p>
            <p className="flex items-center justify-center gap-3 my-3">
              <Instagram className="size-4" />
              <span>@casafoodhub</span>
            </p>
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-bold">BUSINESS HOURS</h1>
            <div className="grid items-center md:items-start gap-4 mt-3 px-4 z-20 md:px-0 md:min-w-3xs w-full">
              <div className="flex items-center justify-between">
                <span>Mon - Friday</span>
                <span>8:00am - 8:00pm</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Saturday</span>
                <span>9:00am - 7:00pm</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sunday</span>
                <span>10:00am - 5:00pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container z-50">
        <div className="flex w-full flex-row gap-6 border-t border-neutral-200 py-12 dark:text-white text-sm md:flex-row md:items-center md:justify-between md:gap-12 dark:border-neutral-700">
          <Link className="flex items-center gap-2 text-black md:pt-1 z-50" href="/">
            <CasaBrandLogo className="w-24" />
            <span className="sr-only">{SITE_NAME}</span>
          </Link>
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          {/*<div className="max-w-sm flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>*/}
        </div>
      </div>
    </footer>
  )
}
