import type { Product } from '@/lib/data/types'

interface ProductJsonLdProps {
  product: Product
  url: string
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} available at our store`,
    image: product.images[0]?.url,
    url,
    offers: product.hasVariants && product.variants && product.variants.length > 0
      ? {
          '@type': 'AggregateOffer',
          lowPrice: Math.min(...product.variants.map((v) => v.price)),
          highPrice: Math.max(...product.variants.map((v) => v.price)),
          priceCurrency: product.currency,
          availability: product.variants.some((v) => v.stock > 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          offerCount: product.variants.length,
        }
      : {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
    ...(product.category && {
      category: product.category.name,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
