'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Container } from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { useCartStore } from '@/lib/store/cart'
import { CartEmpty } from '@/components/cart'
import {
  TilopayProvider,
  CheckoutForm,
  PaymentForm,
  OrderSummary,
  type CheckoutFormData,
} from '@/components/checkout'
import type { OrderItem } from '@/lib/data/types'

type CheckoutStep = 'shipping' | 'payment'

interface OrderData {
  orderId: string
  orderNumber: string
  total: number
  email: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currency = items[0]?.currency || 'USD'

  if (items.length === 0 && !orderData) {
    return (
      <Container className="py-8">
        <CartEmpty />
      </Container>
    )
  }

  const handleShippingSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image?.url,
      }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            name: data.name,
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
          customerEmail: data.email,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order')
      }

      setOrderData({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        total: result.total,
        email: data.email,
      })
      setStep('payment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    if (orderData) {
      router.push(`/checkout/success?order=${orderData.orderNumber}`)
    }
  }

  return (
    <TilopayProvider>
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>
          <div className="mt-4 flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                step === 'shipping' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                  step === 'shipping'
                    ? 'bg-neutral-900 text-white'
                    : step === 'payment'
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-200'
                }`}
              >
                {step === 'payment' ? '✓' : '1'}
              </span>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className="h-px w-8 bg-neutral-200" />
            <div
              className={`flex items-center gap-2 ${
                step === 'payment' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                  step === 'payment' ? 'bg-neutral-900 text-white' : 'bg-neutral-200'
                }`}
              >
                2
              </span>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                {step === 'shipping' && (
                  <CheckoutForm
                    onSubmit={handleShippingSubmit}
                    isSubmitting={isSubmitting}
                    defaultEmail={session?.user?.email || ''}
                  />
                )}
                {step === 'payment' && orderData && (
                  <div>
                    <h2 className="mb-4 text-lg font-semibold text-neutral-900">Payment</h2>
                    <PaymentForm
                      orderId={orderData.orderId}
                      orderNumber={orderData.orderNumber}
                      total={orderData.total}
                      currency={currency}
                      email={orderData.email}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </Container>
    </TilopayProvider>
  )
}
