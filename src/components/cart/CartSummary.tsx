'use client'

import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils/formatters'

interface CartSummaryProps {
  showShipping?: boolean
}

export function CartSummary({ showShipping = false }: CartSummaryProps) {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total)

  const subtotal = total()
  const shipping = showShipping ? 0 : null
  const currency = items[0]?.currency || 'USD'

  return (
    <div className="space-y-3 border-t border-neutral-200 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-600">Subtotal</span>
        <span className="font-medium text-neutral-900">{formatPrice(subtotal, currency)}</span>
      </div>

      {showShipping && shipping !== null && (
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Shipping</span>
          <span className="font-medium text-neutral-900">
            {shipping === 0 ? 'Free' : formatPrice(shipping, currency)}
          </span>
        </div>
      )}

      <div className="flex justify-between border-t border-neutral-200 pt-3">
        <span className="text-base font-semibold text-neutral-900">Total</span>
        <span className="text-base font-semibold text-neutral-900">
          {formatPrice(subtotal + (shipping || 0), currency)}
        </span>
      </div>
    </div>
  )
}
