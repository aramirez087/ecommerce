import { Suspense } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams

  return (
    <Container className="py-16" size="sm">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-neutral-900">
            Thank You for Your Order!
          </h1>

          <p className="mb-6 text-neutral-600">
            Your order has been successfully placed and is being processed.
          </p>

          {order && (
            <div className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-600">Order Number</p>
              <p className="text-lg font-semibold text-neutral-900">{order}</p>
            </div>
          )}

          <p className="mb-8 text-sm text-neutral-600">
            We&apos;ve sent a confirmation email with your order details. If you have
            any questions, please contact our support team.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}

export default function SuccessPage(props: SuccessPageProps) {
  return (
    <Suspense
      fallback={
        <Container className="py-16" size="sm">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
          </div>
        </Container>
      }
    >
      <SuccessContent {...props} />
    </Suspense>
  )
}
