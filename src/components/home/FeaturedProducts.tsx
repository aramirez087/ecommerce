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
    <section className="py-16 lg:py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-neutral-600 uppercase">
              Handpicked Collection
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">Featured Pieces</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold tracking-[0.1em] text-neutral-600 uppercase hover:text-neutral-900"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  )
}
