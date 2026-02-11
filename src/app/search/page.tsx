import { Container } from '@/components/layout/Container'
import { ProductGrid } from '@/components/product/ProductGrid'
import { searchProducts } from '@/lib/data'
import type { ProductListItem } from '@/lib/data/types'
import type { Metadata } from 'next'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search: ${q} - Store` : 'Search - Store',
    description: q ? `Search results for "${q}"` : 'Search our products',
  }
}

function SearchPageContent({ query, results }: { query: string; results: ProductListItem[] }) {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Search Products</h1>
        <SearchForm initialQuery={query} />
      </div>

      {query ? (
        <div>
          <p className="text-sm text-neutral-600 mb-6">
            {results.length === 0
              ? `No results found for "${query}"`
              : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>
          <ProductGrid products={results} />
        </div>
      ) : (
        <div className="py-12 text-center text-neutral-500">
          Enter a search term to find products
        </div>
      )}
    </Container>
  )
}

function SearchForm({ initialQuery }: { initialQuery: string }) {
  return (
    <form action="/search" method="get" className="max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search products..."
          className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
      </div>
    </form>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const results = await searchProducts(query)

  return <SearchPageContent query={query} results={results} />
}
