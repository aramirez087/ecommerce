import { groq } from 'next-sanity'
import { client } from './client'

export const productsQuery = groq`
  *[_type == "product" && active == true] | order(createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    currency,
    "image": images[0] {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    category-> {
      name,
      "slug": slug.current
    }
  }
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && active == true && category->slug.current == $categorySlug] | order(createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    currency,
    "image": images[0] {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    category-> {
      name,
      "slug": slug.current
    }
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    currency,
    "images": images[] {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    productType,
    weight,
    stock,
    active,
    featured,
    category-> {
      _id,
      name,
      "slug": slug.current,
      description
    },
    createdAt,
    hasVariants,
    options[] {
      name,
      values
    },
    variants[] {
      _key,
      name,
      sku,
      price,
      stock,
      options[] {
        name,
        value
      }
    }
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && active == true && featured == true] | order(createdAt desc)[0...4] {
    _id,
    name,
    "slug": slug.current,
    price,
    currency,
    "image": images[0] {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    category-> {
      name,
      "slug": slug.current
    }
  }
`

export const allProductSlugsQuery = groq`
  *[_type == "product" && active == true].slug.current
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description
  }
`

export const ordersByUserIdQuery = groq`
  *[_type == "order" && userId == $userId] | order(createdAt desc) {
    "id": _id,
    orderNumber,
    status,
    items,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress,
    customerEmail,
    createdAt
  }
`

export async function getOrdersByUserId(userId: string) {
  return client.fetch(ordersByUserIdQuery, { userId })
}

export const searchProductsQuery = groq`
  *[_type == "product" && active == true && (
    name match $query + "*" ||
    description match $query + "*"
  )] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    currency,
    "image": images[0] {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`

export const allCategorySlugsQuery = groq`
  *[_type == "category"].slug.current
`
