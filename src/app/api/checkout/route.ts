import { NextRequest, NextResponse } from 'next/server'
import { createOrder, type CreateOrderInput } from '@/lib/sanity/mutations'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const session = await getSession()

    const { items, shippingAddress, customerEmail } = body as {
      items: CreateOrderInput['items']
      shippingAddress: CreateOrderInput['shippingAddress']
      customerEmail: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing shipping address or email' },
        { status: 400 }
      )
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shipping = 0
    const tax = 0
    const total = subtotal + shipping + tax

    const orderInput: CreateOrderInput = {
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      customerEmail,
      userId: session?.user?.id,
    }

    const order = await createOrder(orderInput)

    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      total,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
