'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'
import type { ProductListItem } from '@/lib/data/types'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      search(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'Enter' && query.length >= 2) {
        router.push(`/search?q=${encodeURIComponent(query)}`)
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, query, router])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  const handleResultClick = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-xl"
      >
        <div className="p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            autoFocus
            placeholder="Search products..."
          />
        </div>
        {query.length >= 2 && (
          <div className="border-t border-neutral-200">
            <div className="max-h-80 overflow-auto">
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
                  {results.slice(0, 5).map((product) => (
                    <li key={product.id}>
                      <a
                        href={`/products/${product.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-neutral-100">
                          {product.image ? (
                            <img
                              src={product.image.url}
                              alt={product.image.alt || product.name}
                              className="h-full w-full object-cover"
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
                            ${product.price.toFixed(2)} {product.currency}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {results.length > 0 && (
              <div className="border-t border-neutral-200 px-4 py-3">
                <a
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  View all results ({results.length})
                </a>
              </div>
            )}
          </div>
        )}
        <div className="border-t border-neutral-200 px-4 py-2 text-xs text-neutral-400">
          Press <kbd className="rounded bg-neutral-100 px-1.5 py-0.5">Enter</kbd> to search all results or{' '}
          <kbd className="rounded bg-neutral-100 px-1.5 py-0.5">Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}
