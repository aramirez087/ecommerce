import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById } from '@/lib/sanity/mutations'

interface TilopayWebhookPayload {
  code: string
  description: string
  auth: string
  orderNumber: string
  orderId: string
  total: string
  currency: string
  email: string
  date: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TilopayWebhookPayload

    const { code, orderId, auth } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (code === '1') {
      await updateOrderStatus(orderId, 'paid', auth)

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed',
        orderNumber: order.orderNumber,
      })
    } else {
      await updateOrderStatus(orderId, 'cancelled')

      return NextResponse.json({
        success: false,
        message: 'Payment failed or cancelled',
        orderNumber: order.orderNumber,
      })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
