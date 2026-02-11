import { createClient } from 'next-sanity'
import type { ShippingAddress, OrderItem, Address } from '@/lib/data/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${timestamp}-${random}`
}

export interface CreateOrderInput {
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  customerEmail: string
  userId?: string
}

export interface CreateOrderResult {
  _id: string
  orderNumber: string
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const orderNumber = generateOrderNumber()

  const order = await writeClient.create({
    _type: 'order',
    orderNumber,
    status: 'pending',
    items: input.items.map((item) => ({
      _type: 'orderItem',
      _key: item.productId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    subtotal: input.subtotal,
    shipping: input.shipping,
    tax: input.tax,
    total: input.total,
    shippingAddress: {
      _type: 'shippingAddress',
      name: input.shippingAddress.name,
      line1: input.shippingAddress.line1,
      line2: input.shippingAddress.line2 || '',
      city: input.shippingAddress.city,
      state: input.shippingAddress.state,
      postalCode: input.shippingAddress.postalCode,
      country: input.shippingAddress.country,
    },
    customerEmail: input.customerEmail,
    userId: input.userId,
    createdAt: new Date().toISOString(),
  })

  return {
    _id: order._id,
    orderNumber,
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
  tilopayOrderId?: string
): Promise<void> {
  const patch = writeClient.patch(orderId).set({ status })

  if (tilopayOrderId) {
    patch.set({ tilopayOrderId })
  }

  await patch.commit()
}

export async function getOrderByNumber(orderNumber: string) {
  return writeClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber][0]{
      _id,
      orderNumber,
      status,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      customerEmail,
      tilopayOrderId,
      createdAt
    }`,
    { orderNumber }
  )
}

export async function getOrderById(orderId: string) {
  return writeClient.fetch(
    `*[_type == "order" && _id == $orderId][0]{
      _id,
      orderNumber,
      status,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      customerEmail,
      tilopayOrderId,
      createdAt
    }`,
    { orderId }
  )
}

// User mutations

export interface CreateUserInput {
  email: string
  name: string
  hashedPassword: string
  provider?: string
  image?: string
}

export async function createUser(input: CreateUserInput) {
  const existingUser = await getUserByEmail(input.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const user = await writeClient.create({
    _type: 'user',
    email: input.email,
    name: input.name,
    hashedPassword: input.hashedPassword,
    provider: input.provider || 'credentials',
    image: input.image,
    addresses: [],
    createdAt: new Date().toISOString(),
  })

  return user
}

export async function getUserByEmail(email: string) {
  return writeClient.fetch(
    `*[_type == "user" && email == $email][0]{
      _id,
      email,
      name,
      hashedPassword,
      image,
      provider,
      addresses,
      createdAt
    }`,
    { email }
  )
}

export async function getUserById(userId: string) {
  return writeClient.fetch(
    `*[_type == "user" && _id == $userId][0]{
      _id,
      email,
      name,
      image,
      provider,
      addresses,
      createdAt
    }`,
    { userId }
  )
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string; image?: string }
) {
  return writeClient.patch(userId).set(data).commit()
}

export async function addUserAddress(userId: string, address: Omit<Address, 'id'>) {
  const addressWithId = {
    _type: 'userAddress',
    _key: crypto.randomUUID(),
    id: crypto.randomUUID(),
    ...address,
  }

  // If this is the default address, unset other defaults first
  if (address.isDefault) {
    const user = await getUserById(userId)
    if (user?.addresses?.length) {
      const updatedAddresses = user.addresses.map((addr: Address & { _key?: string }) => ({
        ...addr,
        _type: 'userAddress',
        _key: addr._key || addr.id,
        isDefault: false,
      }))
      await writeClient.patch(userId).set({ addresses: updatedAddresses }).commit()
    }
  }

  return writeClient.patch(userId).append('addresses', [addressWithId]).commit()
}

export async function updateUserAddress(userId: string, addressId: string, data: Partial<Address>) {
  const user = await getUserById(userId)
  if (!user?.addresses) return null

  // If setting as default, unset others
  const updatedAddresses = user.addresses.map((addr: Address & { _key?: string }) => {
    if (addr.id === addressId) {
      return {
        ...addr,
        ...data,
        _type: 'userAddress',
        _key: addr._key || addr.id,
      }
    }
    return {
      ...addr,
      _type: 'userAddress',
      _key: addr._key || addr.id,
      isDefault: data.isDefault ? false : addr.isDefault,
    }
  })

  return writeClient.patch(userId).set({ addresses: updatedAddresses }).commit()
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const user = await getUserById(userId)
  if (!user?.addresses) return null

  const updatedAddresses = user.addresses
    .filter((addr: Address) => addr.id !== addressId)
    .map((addr: Address & { _key?: string }) => ({
      ...addr,
      _type: 'userAddress',
      _key: addr._key || addr.id,
    }))

  return writeClient.patch(userId).set({ addresses: updatedAddresses }).commit()
}
