import { getSession } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/sanity/queries'
import { OrderCard } from '@/components/account'
import { Card, CardContent } from '@/components/ui/Card'
import type { Order } from '@/lib/data/types'

export const metadata = {
  title: 'Order History - Velvet Toke',
  description: 'View your order history',
}

export default async function OrdersPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    return null
  }

  const orders = await getOrdersByUserId(session.user.id) as Order[]

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-neutral-600">You haven&apos;t placed any orders yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900">Order History</h2>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
