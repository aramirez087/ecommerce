export interface ProductImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface VariantOption {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  name: string
  sku?: string
  price: number
  stock: number
  options: VariantOption[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  images: ProductImage[]
  productType: 'physical' | 'digital'
  weight?: number
  stock: number
  active: boolean
  featured: boolean
  category?: Category
  createdAt: string
  hasVariants: boolean
  options?: ProductOption[]
  variants?: ProductVariant[]
}

export interface ProductListItem {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  image?: ProductImage
  category?: {
    name: string
    slug: string
  }
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  currency: string
  quantity: number
  image?: ProductImage
  variantId?: string
  variantName?: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  customerEmail: string
  tilopayOrderId?: string
  userId?: string
  createdAt: string
}

export interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface User {
  id: string
  email: string
  name: string
  image?: string
  addresses: Address[]
}
