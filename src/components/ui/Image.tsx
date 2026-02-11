'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface ImageProps extends Omit<NextImageProps, 'onError'> {
  fallback?: string
}

export function Image({ className, fallback, alt, ...props }: ImageProps) {
  const [error, setError] = useState(false)

  if (error && fallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-neutral-100 text-neutral-400',
          className
        )}
      >
        <span className="text-sm">{fallback}</span>
      </div>
    )
  }

  return (
    <NextImage
      className={cn(className)}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}
