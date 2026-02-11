import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Image } from '@/components/ui/Image'
import { ProductPrice } from './ProductPrice'
import type { ProductListItem } from '@/lib/data/types'

interface ProductCardProps {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt || product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              fallback="No image"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
        <CardContent>
          {product.category && (
            <p className="mb-1 text-xs text-neutral-500">{product.category.name}</p>
          )}
          <h3 className="font-medium text-neutral-900 line-clamp-2">{product.name}</h3>
          <ProductPrice price={product.price} currency={product.currency} className="mt-2" />
        </CardContent>
      </Card>
    </Link>
  )
}
