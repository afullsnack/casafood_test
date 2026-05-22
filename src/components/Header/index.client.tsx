'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Search } from '@/components/Search'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <header className="relative z-20 border-b">
      <nav className="container">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>

          <Link className="flex items-center" href="/">
            <LogoIcon className="w-8 h-auto" />
          </Link>

          <div className="hidden md:flex flex-1 justify-center px-8">
            {header.showSearch && (
              <div className="w-full max-w-md">
                <Search />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {header.showCart && (
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            )}
          </div>
        </div>

        {menu.length ? (
          <div className="hidden border-t md:block">
            <ul className="flex items-center justify-center gap-8 py-3">
              {menu.map((item) => (
                <li key={item.id}>
                  <CMSLink
                    {...item.link}
                    size={'clear'}
                    className={cn('relative navLink text-sm font-medium', {
                      active:
                        item.link.url && item.link.url !== '/'
                          ? pathname.includes(item.link.url)
                          : false,
                    })}
                    appearance="nav"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
