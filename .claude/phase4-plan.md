# Phase 4: Advanced Features

## Overview
Implement search functionality, product variants, and SEO enhancements including sitemap and structured data.

---

## Part 1: Search

### 1.1 Search Query
**File:** `/src/lib/sanity/queries.ts`

Add search query using GROQ's `match` operator:
```typescript
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
    "image": images[0] { ... }
  }
`
```

### 1.2 Search Components
**Directory:** `/src/components/search/`

| File | Type | Purpose |
|------|------|---------|
| `SearchInput.tsx` | Client | Debounced input with keyboard navigation |
| `SearchResults.tsx` | Client | Dropdown results with product previews |
| `SearchDialog.tsx` | Client | Modal search for mobile/command palette |
| `index.ts` | - | Barrel exports |

### 1.3 Header Integration
**File:** `/src/components/layout/Header.tsx`
- Add search icon/button
- Integrate SearchDialog or inline SearchInput

### 1.4 Search Page
**File:** `/src/app/search/page.tsx`
- Full search results with filters
- Query param: `?q=search-term`
- Empty state and loading states
- Product grid display

### 1.5 Search API Route
**File:** `/src/app/api/search/route.ts`
- Handle search queries server-side
- Return paginated results
- Debounce protection

---

## Part 2: Product Variants

### 2.1 Update Product Schema
**File:** `/sanity/schemas/product.ts`

Add variant fields:
```typescript
defineField({
  name: 'hasVariants',
  title: 'Has Variants',
  type: 'boolean',
  initialValue: false,
}),
defineField({
  name: 'options',
  title: 'Product Options',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'name', type: 'string' }, // "Color", "Size"
      { name: 'values', type: 'array', of: [{ type: 'string' }] }, // ["Red", "Blue"]
    ]
  }],
  hidden: ({ parent }) => !parent?.hasVariants,
}),
defineField({
  name: 'variants',
  title: 'Variants',
  type: 'array',
  of: [{
    type: 'object',
    name: 'productVariant',
    fields: [
      { name: 'name', type: 'string' }, // "Red / Large"
      { name: 'sku', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'stock', type: 'number' },
      { name: 'options', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string' }, // "Color"
          { name: 'value', type: 'string' }, // "Red"
        ]
      }]},
    ]
  }],
  hidden: ({ parent }) => !parent?.hasVariants,
}),
```

### 2.2 Update Types
**File:** `/src/lib/data/types.ts`

```typescript
export interface ProductOption {
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  options: { name: string; value: string }[]
}

// Update Product interface
export interface Product {
  // ... existing fields
  hasVariants: boolean
  options?: ProductOption[]
  variants?: ProductVariant[]
}
```

### 2.3 Variant Components
**Directory:** `/src/components/product/`

| File | Purpose |
|------|---------|
| `VariantSelector.tsx` | Radio/button groups for selecting options |
| `VariantPrice.tsx` | Display price based on selected variant |

### 2.4 Update Product Page
**File:** `/src/app/products/[slug]/page.tsx`
- Show VariantSelector when product has variants
- Update price display based on selection
- Pass selected variant to AddToCartButton

### 2.5 Update Cart
**Files:**
- `/src/lib/store/cart.ts` - Add variantId to CartItem
- `/src/lib/data/types.ts` - Update CartItem interface
- `/src/components/cart/CartItem.tsx` - Display variant info

---

## Part 3: SEO Enhancements

### 3.1 Sitemap
**File:** `/src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  // Get all product slugs
  const products = await client.fetch<string[]>(`*[_type == "product" && active == true].slug.current`)

  // Get all category slugs
  const categories = await client.fetch<string[]>(`*[_type == "category"].slug.current`)

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...products.map(slug => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categories.map(slug => ({
      url: `${baseUrl}/products?category=${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
```

### 3.2 Robots.txt
**File:** `/src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout/', '/api/', '/studio/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### 3.3 Structured Data Component
**File:** `/src/components/seo/ProductJsonLd.tsx`

```typescript
interface ProductJsonLdProps {
  product: Product
  url: string
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.url,
    url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

### 3.4 Breadcrumb JSON-LD
**File:** `/src/components/seo/BreadcrumbJsonLd.tsx`

For product and category pages.

### 3.5 Update Product Page
**File:** `/src/app/products/[slug]/page.tsx`
- Add ProductJsonLd component
- Add BreadcrumbJsonLd component

### 3.6 Open Graph Images
**File:** `/src/app/products/[slug]/opengraph-image.tsx`

Dynamic OG image generation using `next/og`:
```typescript
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch product and generate image
}
```

---

## Implementation Order

### Step 1: Search Foundation
1. Add search query to `/src/lib/sanity/queries.ts`
2. Create `/src/app/api/search/route.ts`
3. Create `/src/components/search/SearchInput.tsx`
4. Create `/src/components/search/SearchResults.tsx`
5. Create `/src/components/search/SearchDialog.tsx`
6. Create `/src/components/search/index.ts`
7. Update `/src/components/layout/Header.tsx` with search
8. Create `/src/app/search/page.tsx`

### Step 2: Product Variants
9. Update `/sanity/schemas/product.ts` with variant fields
10. Update `/src/lib/data/types.ts` with variant types
11. Update `/src/lib/sanity/queries.ts` to include variants
12. Create `/src/components/product/VariantSelector.tsx`
13. Update `/src/app/products/[slug]/page.tsx` for variants
14. Update `/src/lib/store/cart.ts` for variant support
15. Update `/src/components/cart/CartItem.tsx` for variant display

### Step 3: SEO
16. Create `/src/app/sitemap.ts`
17. Create `/src/app/robots.ts`
18. Create `/src/components/seo/ProductJsonLd.tsx`
19. Create `/src/components/seo/BreadcrumbJsonLd.tsx`
20. Create `/src/components/seo/index.ts`
21. Update `/src/app/products/[slug]/page.tsx` with JSON-LD
22. Create `/src/app/products/[slug]/opengraph-image.tsx` (optional)

---

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Files Summary

**New Files (15):**
- `/src/app/api/search/route.ts`
- `/src/app/search/page.tsx`
- `/src/app/sitemap.ts`
- `/src/app/robots.ts`
- `/src/components/search/SearchInput.tsx`
- `/src/components/search/SearchResults.tsx`
- `/src/components/search/SearchDialog.tsx`
- `/src/components/search/index.ts`
- `/src/components/product/VariantSelector.tsx`
- `/src/components/seo/ProductJsonLd.tsx`
- `/src/components/seo/BreadcrumbJsonLd.tsx`
- `/src/components/seo/index.ts`
- `/src/app/products/[slug]/opengraph-image.tsx` (optional)

**Modified Files (8):**
- `/sanity/schemas/product.ts`
- `/src/lib/data/types.ts`
- `/src/lib/sanity/queries.ts`
- `/src/lib/store/cart.ts`
- `/src/components/layout/Header.tsx`
- `/src/app/products/[slug]/page.tsx`
- `/src/components/cart/CartItem.tsx`

---

## Styling Guidelines

Follow existing patterns:
- Use `cn()` utility from `/src/lib/utils/cn.ts`
- Colors: `neutral-900` (text), `neutral-600` (secondary), `neutral-200` (borders)
- Use existing `Button`, `Card` components from `/src/components/ui/`
- Form inputs: `border-neutral-300`, `focus:ring-neutral-900`
- Use `Container` for page layouts

---

## Verification

After implementation:
1. Search for products by name
2. Search for products by description
3. Verify search results show in header dropdown
4. Verify full search page works with query params
5. Create a product with variants in Sanity
6. Select variant options on product page
7. Add variant product to cart
8. Verify cart shows variant info
9. Check `/sitemap.xml` returns valid XML
10. Check `/robots.txt` returns valid content
11. Verify structured data with Google's Rich Results Test
12. Check OG images work when sharing links
