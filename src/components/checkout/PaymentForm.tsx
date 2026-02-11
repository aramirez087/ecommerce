'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTilopay } from './TilopayProvider'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/formatters'

interface PaymentFormProps {
  orderId: string
  orderNumber: string
  total: number
  currency: string
  email: string
}

export function PaymentForm({
  orderId,
  orderNumber,
  total,
  currency,
  email,
}: PaymentFormProps) {
  const router = useRouter()
  const { isLoaded, isLoading, createPayment } = useTilopay()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await createPayment({
        amount: total,
        currency,
        orderId,
        orderNumber,
        description: `Order #${orderNumber}`,
        email,
        redirectUrl: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      })

      if (result.success) {
        router.push(`/checkout/success?order=${orderNumber}`)
      } else {
        setError(result.error || 'Payment failed. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Payment system unavailable. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-900">Order Total</h3>
        <p className="text-2xl font-bold text-neutral-900">
          {formatPrice(total, currency)}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(total, currency)}`}
      </Button>

      <p className="text-center text-xs text-neutral-500">
        Secure payment powered by Tilopay
      </p>
    </div>
  )
}
