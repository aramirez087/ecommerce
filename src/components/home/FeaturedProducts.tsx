import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getFeaturedProducts } from '@/lib/data'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  )
}
