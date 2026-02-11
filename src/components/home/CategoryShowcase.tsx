import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { getCategories } from '@/lib/data'

export async function CategoryShowcase() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="rounded-3xl border border-white/65 bg-white/45 p-6 shadow-[0_30px_70px_-50px_rgba(22,43,32,0.7)] backdrop-blur-sm sm:p-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-neutral-600 uppercase">
            Shop by Mood
          </p>
          <h2 className="text-3xl font-semibold text-neutral-900">Build your ideal setup</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group rounded-2xl border border-white/75 bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/85"
              >
                <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
