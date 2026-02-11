import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { getCategories } from '@/lib/data'

export async function CategoryShowcase() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group p-6 bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
            >
              <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
