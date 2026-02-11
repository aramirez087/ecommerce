'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import type { ProductListItem } from '@/lib/data/types'

interface SearchResultsProps {
  results: ProductListItem[]
  isLoading: boolean
  query: string
  onResultClick?: () => void
  className?: string
}

export function SearchResults({
  results,
  isLoading,
  query,
  onResultClick,
  className,
}: SearchResultsProps) {
  if (!query || query.length < 2) {
    return null
  }

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg',
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      ) : results.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-neutral-500">
          No products found for "{query}"
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                onClick={onResultClick}
                className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-neutral-100">
                  {product.image ? (
                    <Image
                      src={product.image.url}
                      alt={product.image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                  <p className="text-sm text-neutral-600">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
