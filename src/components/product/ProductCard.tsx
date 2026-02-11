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
      <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_64px_-48px_rgba(20,41,29,0.9)]">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              fallback="No image"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
        <CardContent className="space-y-2">
          {product.category && (
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-neutral-600 uppercase">
              {product.category.name}
            </p>
          )}
          <h3 className="line-clamp-2 text-base font-semibold text-neutral-900">{product.name}</h3>
          <ProductPrice price={product.price} currency={product.currency} className="pt-1" />
        </CardContent>
      </Card>
    </Link>
  )
}
