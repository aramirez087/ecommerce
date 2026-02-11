import { Suspense } from 'react'
import { Container } from '@/components/layout/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CategoryFilter } from '@/components/category/CategoryFilter'
import { Skeleton } from '@/components/ui/Skeleton'
import { getProducts, getCategories } from '@/lib/data'

export const revalidate = 60

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(params.category),
    getCategories(),
  ])

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Products</h1>
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>
      <ProductGrid products={products} />
    </Container>
  )
}
