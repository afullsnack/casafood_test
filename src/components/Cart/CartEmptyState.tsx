import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

/**
 * Brand-wide empty cart state. The cart is a single shared store, so the empty
 * state offers every entry point (Food Hub, Restaurant, Catering) regardless of
 * which parent page rendered it.
 */
export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-amber-50">
        <ShoppingCart className="size-8 text-amber-500" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Add food items, order a restaurant meal, or book a catering service to get started.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-full bg-secondary px-6 text-white hover:bg-secondary/90">
          <Link href="/food-hub">Shop Food Hub</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-secondary px-6 text-secondary hover:bg-secondary/10 hover:text-secondary"
        >
          <Link href="/restaurant">Order Restaurant</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-secondary px-6 text-secondary hover:bg-secondary/10 hover:text-secondary"
        >
          <Link href="/catering">Book Catering</Link>
        </Button>
      </div>
    </div>
  )
}
