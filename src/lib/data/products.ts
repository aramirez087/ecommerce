import { client, isSanityConfigured } from '../sanity/client'
import {
  productsQuery,
  productsByCategoryQuery,
  productBySlugQuery,
  featuredProductsQuery,
  allProductSlugsQuery,
  searchProductsQuery,
} from '../sanity/queries'
import { mapProduct, mapProductListItem } from '../sanity/mappers'
import type { SanityProduct, SanityProductListItem } from '../sanity/types'
import type { Product, ProductListItem } from './types'

export async function getProducts(categorySlug?: string): Promise<ProductListItem[]> {
  if (!isSanityConfigured()) return []

  if (categorySlug) {
    const results = await client.fetch<SanityProductListItem[]>(productsByCategoryQuery, {
      categorySlug,
    })
    return results.map(mapProductListItem)
  }

  const results = await client.fetch<SanityProductListItem[]>(productsQuery)
  return results.map(mapProductListItem)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured()) return null

  const result = await client.fetch<SanityProduct | null>(productBySlugQuery, { slug })
  if (!result) return null
  return mapProduct(result)
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  if (!isSanityConfigured()) return []

  const results = await client.fetch<SanityProductListItem[]>(featuredProductsQuery)
  return results.map(mapProductListItem)
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return []

  return client.fetch<string[]>(allProductSlugsQuery)
}

export async function searchProducts(query: string): Promise<ProductListItem[]> {
  if (!isSanityConfigured() || query.length < 2) return []

  const results = await client.fetch<SanityProductListItem[]>(
    searchProductsQuery,
    { query } as Record<string, string>
  )
  return results.map(mapProductListItem)
}
