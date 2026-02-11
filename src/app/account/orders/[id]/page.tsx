import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getOrderById } from '@/lib/sanity/mutations'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, formatDate } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params
  return {
    title: `Order Details - Store`,
    description: `View order ${id}`,
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getSession()
  const { id } = await params

  if (!session?.user?.id) {
    return null
  }

  const order = await getOrderById(id)

  if (!order || (order.userId && order.userId !== session.user.id)) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Order #{order.orderNumber}
          </h2>
          <p className="text-sm text-neutral-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center self-start rounded-full px-3 py-1 text-sm font-medium capitalize',
            statusColors[order.status as keyof typeof statusColors]
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Order Items</h3>
            <div className="divide-y divide-neutral-200">
              {order.items.map((item: { productId: string; name: string; image?: string; quantity: number; price: number }) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Shipping Address</h3>
              <address className="text-sm text-neutral-600 not-italic">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-600">Subtotal</dt>
                  <dd className="text-neutral-900">{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-600">Shipping</dt>
                  <dd className="text-neutral-900">{formatPrice(order.shipping)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-600">Tax</dt>
                  <dd className="text-neutral-900">{formatPrice(order.tax)}</dd>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-neutral-200 pt-2 mt-2">
                  <dt className="text-neutral-900">Total</dt>
                  <dd className="text-neutral-900">{formatPrice(order.total)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
