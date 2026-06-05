'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  className?: string
}

export const Search: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())

    if (search.value) {
      newParams.set('q', search.value)
    } else {
      newParams.delete('q')
    }

    router.push(createUrl('/shop', newParams))
  }

  return (
    <form className={cn('relative w-full', className)} onSubmit={onSubmit}>
      <div className="absolute left-0 top-0 ml-2 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
      <input
        autoComplete="off"
        className="w-full z-30 rounded-lg border bg-white px-8 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-400"
        defaultValue={searchParams?.get('q') || ''}
        key={searchParams?.get('q')}
        name="search"
        placeholder="Search food items, catering packages..."
        type="text"
      />
    </form>
  )
}
