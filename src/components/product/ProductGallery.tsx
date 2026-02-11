'use client'

import { useState } from 'react'
import { Image } from '@/components/ui/Image'
import { cn } from '@/lib/utils/cn'
import type { ProductImage } from '@/lib/data/types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 flex items-center justify-center text-neutral-400">
        No images available
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          fallback="No image"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square overflow-hidden bg-neutral-100 border-2 transition-colors',
                index === selectedIndex
                  ? 'border-neutral-900'
                  : 'border-transparent hover:border-neutral-300'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
                fallback=""
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
