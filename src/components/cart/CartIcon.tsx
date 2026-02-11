'use client'

import { useCartStore } from '@/lib/store/cart'

interface CartIconProps {
  onClick?: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const itemCount = useCartStore((state) => state.itemCount)
  const count = itemCount()

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-neutral-600 hover:text-neutral-900"
      aria-label={`Shopping cart with ${count} items`}
    >
      <svg
        className="h-6 w-6"
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
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
