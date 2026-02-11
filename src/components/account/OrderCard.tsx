import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, formatDate } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import type { Order } from '@/lib/data/types'

interface OrderCardProps {
  order: Order
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <Link
                href={`/account/orders/${order.id}`}
                className="text-sm font-semibold text-neutral-900 hover:underline"
              >
                Order #{order.orderNumber}
              </Link>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                  statusColors[order.status]
                )}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Placed on {formatDate(order.createdAt)}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <p className="text-sm font-semibold text-neutral-900">
              {formatPrice(order.total)}
            </p>
            <Link
              href={`/account/orders/${order.id}`}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View Details
            </Link>
          </div>
        </div>

        {order.items.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.productId}
                className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded overflow-hidden"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                <span className="text-xs text-neutral-600">+{order.items.length - 4}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
