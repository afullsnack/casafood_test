import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { ContentWithMedia as ContentWithMediaProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

export const ContentWithMediaBlock: React.FC<
  ContentWithMediaProps & {
    id?: string | number
    className?: string
    actionLabel?: string
    bgImage: string
    onAction?: () => void
  }
> = ({ title, description, backgroundImage, link, className, actionLabel, onAction, bgImage }) => {
  const imageUrl =
    typeof backgroundImage === 'object' && backgroundImage?.url
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${backgroundImage.url}`
      : null

  const href =
    link?.type === 'reference' &&
    typeof link?.reference?.value === 'object' &&
    link.reference.value.slug
      ? `/${link.reference.value.slug}`
      : link?.url || '#'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] dark:border dark:border-gray-300 aspect-auto min-h-126.5',
        className,
      )}
    >
      {/*{bgImage && <img src={bgImage} alt={title || ''} className="object-cover" />}*/}
      <div
        className={cn('absolute inset-0 bg-center bg-cover')}
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />
      <div className="absolute inset-0 z-20 bg-linear-to-b from-black/70 via-black/50 to-transparent" />
      <div className="relative z-40 flex flex-col items-start justify-start h-full p-6">
        {title && <h3 className="text-2xl font-bold text-white mb-2 text-balance">{title}</h3>}
        {description && (
          <p className="text-sm text-white/80 mb-4 line-clamp-3 text-balance">{description}</p>
        )}
        {onAction ? (
          <Button variant="default" size="default" onClick={onAction} className="text-white">
            {actionLabel || 'Book service'}
          </Button>
        ) : (
          <Link href={href}>
            <Button variant="default" size="default">
              Book service
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
