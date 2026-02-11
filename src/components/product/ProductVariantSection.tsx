'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { ProductPrice } from './ProductPrice'
import { VariantSelector, findVariantByOptions } from './VariantSelector'
import { useCartStore } from '@/lib/store/cart'
import type { Product } from '@/lib/data/types'

interface ProductVariantSectionProps {
  product: Product
}

export function ProductVariantSection({ product }: ProductVariantSectionProps) {
  const addItem = useCartStore((state) => state.addItem)

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (!product.options || product.options.length === 0) {
      return {}
    }

    const initial: Record<string, string> = {}
    product.options.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.name] = option.values[0]
      }
    })
    return initial
  })

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }
    return findVariantByOptions(product.variants, selectedOptions)
  }, [product.variants, selectedOptions])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }))
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: selectedVariant.price,
        currency: product.currency,
        image: product.images?.[0],
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      })
    }
  }

  const currentPrice = selectedVariant?.price ?? product.price
  const currentStock = selectedVariant?.stock ?? 0
  const isOutOfStock = currentStock === 0

  return (
    <div className="space-y-6">
      <ProductPrice price={currentPrice} currency={product.currency} size="lg" />

      {product.options && product.options.length > 0 && product.variants && (
        <VariantSelector
          options={product.options}
          variants={product.variants}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      )}

      <div className="text-sm text-neutral-500">
        <span className={currentStock > 0 ? 'text-green-600' : 'text-red-600'}>
          {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
        </span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock || !selectedVariant}
        size="lg"
        className="w-full"
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
