import { cn } from '@/utilities/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

export type Crumb = { label: string; href?: string }

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <li>
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(isLast && 'text-foreground')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && <ChevronRight aria-hidden className="size-3.5 shrink-0" />}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
