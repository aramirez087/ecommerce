import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="mb-4 h-16 w-16 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h2 className="mb-2 text-xl font-semibold text-neutral-900">Your cart is empty</h2>
      <p className="mb-6 text-neutral-600">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Link href="/products">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  )
}
