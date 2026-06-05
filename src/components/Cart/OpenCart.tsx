import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="nav"
      size="clear"
      className="navLink relative flex items-center hover:cursor-pointer"
      {...rest}
    >
      {true ? (
        <>
          <span className="text-lg">{quantity ?? 0}</span>
        </>
      ) : null}
      <ShoppingCart className="size-5" />
    </Button>
  )
}
