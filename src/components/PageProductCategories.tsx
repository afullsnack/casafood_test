'use client'

import { cn } from '@/utilities/cn'
import { LayoutGrid } from 'lucide-react'

export type CategoryFilter = { id: number | string; title: string }

type Props = {
  categories: CategoryFilter[]
  /** Selected category id, or `null` for "All filters" */
  selected: number | string | null
  onSelect: (id: number | string | null) => void
}

const pill =
  'inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors'

export function PageProductCategories({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label="Product categories">
      <button
        type="button"
        role="tab"
        aria-selected={selected === null}
        onClick={() => onSelect(null)}
        className={cn(
          pill,
          'shadow-sm',
          selected === null
            ? 'border-primary bg-card text-primary'
            : 'border-border bg-card text-foreground/70 hover:text-foreground hover:bg-accent',
        )}
      >
        <LayoutGrid className="size-4" />
        All filters
      </button>

      {categories.map((category) => {
        const isActive = selected === category.id
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category.id)}
            className={cn(
              pill,
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground/70 hover:text-foreground hover:bg-accent',
            )}
          >
            {category.title}
          </button>
        )
      })}
    </div>
  )
}
