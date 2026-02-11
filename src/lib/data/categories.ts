import { client, isSanityConfigured } from '../sanity/client'
import { categoriesQuery, categoryBySlugQuery } from '../sanity/queries'
import { mapCategory } from '../sanity/mappers'
import type { SanityCategory } from '../sanity/types'
import type { Category } from './types'

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured()) return []

  const results = await client.fetch<SanityCategory[]>(categoriesQuery)
  return results.map(mapCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSanityConfigured()) return null

  const result = await client.fetch<SanityCategory | null>(categoryBySlugQuery, { slug })
  if (!result) return null
  return mapCategory(result)
}
