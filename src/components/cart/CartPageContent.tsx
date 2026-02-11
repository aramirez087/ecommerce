'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { CartEmpty } from './CartEmpty'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export function CartPageContent() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  if (items.length === 0) {
    return <CartEmpty />
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                Cart Items ({items.length})
              </h2>
              <button
                onClick={clearCart}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                Clear Cart
              </button>
            </div>
            <div className="divide-y divide-neutral-200">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Order Summary</h2>
            <CartSummary showShipping />
            <div className="mt-6 space-y-3">
              <Link href="/checkout">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
