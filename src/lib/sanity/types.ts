export interface SanityImageAsset {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface SanityCategory {
  _id: string
  name: string
  slug: string
  description?: string
}

export interface SanityProductListItem {
  _id: string
  name: string
  slug: string
  price: number
  currency: string
  image?: SanityImageAsset
  category?: {
    name: string
    slug: string
  }
}

export interface SanityProductOption {
  name: string
  values: string[]
}

export interface SanityVariantOption {
  name: string
  value: string
}

export interface SanityProductVariant {
  _key: string
  name: string
  sku?: string
  price: number
  stock: number
  options?: SanityVariantOption[]
}

export interface SanityProduct {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  images?: SanityImageAsset[]
  productType: 'physical' | 'digital'
  weight?: number
  stock: number
  active: boolean
  featured: boolean
  category?: SanityCategory
  createdAt: string
  hasVariants?: boolean
  options?: SanityProductOption[]
  variants?: SanityProductVariant[]
}
