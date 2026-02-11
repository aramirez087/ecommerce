'use client'

import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cart'
import type { ProductListItem, Product } from '@/lib/data/types'

type ProductData = ProductListItem | Product

interface AddToCartButtonProps {
  product: ProductData
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    const image = 'image' in product ? product.image : (product as Product).images?.[0]

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      currency: product.currency,
      image,
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      size="lg"
      className="w-full"
    >
      {disabled ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}
