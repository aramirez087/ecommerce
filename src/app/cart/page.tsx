import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { CartPageContent } from '@/components/cart'

export const metadata: Metadata = {
  title: 'Shopping Cart - Velvet Toke',
  description: 'Review your shopping cart',
}

export default function CartPage() {
  return (
    <Container className="py-8">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">Shopping Cart</h1>
      <CartPageContent />
    </Container>
  )
}
