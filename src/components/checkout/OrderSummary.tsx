'use client'

import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils/formatters'
import { Card, CardContent } from '@/components/ui/Card'

export function OrderSummary() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total)

  const subtotal = total()
  const shipping = 0
  const tax = 0
  const orderTotal = subtotal + shipping + tax
  const currency = items[0]?.currency || 'USD'

  return (
    <Card>
      <CardContent>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Order Summary</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-neutral-100">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="text-sm font-medium text-neutral-900">{item.name}</span>
                <span className="text-xs text-neutral-600">Qty: {item.quantity}</span>
                <span className="text-sm font-medium text-neutral-900">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-neutral-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <span className="text-neutral-900">{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Shipping</span>
            <span className="text-neutral-900">{shipping === 0 ? 'Free' : formatPrice(shipping, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Tax</span>
            <span className="text-neutral-900">{formatPrice(tax, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2">
            <span className="font-semibold text-neutral-900">Total</span>
            <span className="font-semibold text-neutral-900">{formatPrice(orderTotal, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
