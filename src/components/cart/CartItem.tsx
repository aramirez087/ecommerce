'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils/formatters'
import type { CartItem as CartItemType } from '@/lib/data/types'

interface CartItemProps {
  item: CartItemType
  compact?: boolean
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity, item.variantId)
  }

  const handleRemove = () => {
    removeItem(item.productId, item.variantId)
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-neutral-100">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt || item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-neutral-900 hover:text-neutral-700"
          >
            {item.name}
          </Link>
          {!compact && (
            <span className="font-medium text-neutral-900">
              {formatPrice(item.price * item.quantity, item.currency)}
            </span>
          )}
        </div>

        {item.variantName && (
          <span className="text-sm text-neutral-500">{item.variantName}</span>
        )}

        <span className="text-sm text-neutral-600">
          {formatPrice(item.price, item.currency)} each
        </span>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center border border-neutral-200">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 py-1 text-sm">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-3 py-1 text-neutral-600 hover:bg-neutral-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
