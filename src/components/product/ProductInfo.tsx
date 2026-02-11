import { ProductPrice } from './ProductPrice'
import { CategoryBadge } from '@/components/category/CategoryBadge'
import type { Product } from '@/lib/data/types'

interface ProductInfoProps {
  product: Product
  showPrice?: boolean
}

export function ProductInfo({ product, showPrice = true }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {product.category && (
        <CategoryBadge name={product.category.name} slug={product.category.slug} />
      )}
      <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
      {showPrice && (
        <ProductPrice price={product.price} currency={product.currency} size="lg" />
      )}
      {product.description && (
        <p className="text-neutral-600 leading-relaxed">{product.description}</p>
      )}
      {!product.hasVariants && (
        <div className="space-y-2 text-sm text-neutral-500">
          {product.productType === 'physical' && product.weight && (
            <p>Weight: {product.weight}g</p>
          )}
          <p>
            Stock:{' '}
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
