'use client'
import { ChevronLeftIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button
      asChild
      variant="ghost"
      className="mb-4"
      onClick={() => {
        router.back()
        // if (typeof window !== 'undefined') {
        //   window.location.href = `/${product.page}`
        // }
      }}
    >
      {/*<Link href="/">*/}
      <div>
        <ChevronLeftIcon />
        All products
      </div>
      {/*</Link>*/}
    </Button>
  )
}
