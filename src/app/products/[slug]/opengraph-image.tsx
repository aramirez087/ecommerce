import { ImageResponse } from 'next/og'
import { getProductBySlug } from '@/lib/data'

export const runtime = 'edge'
export const alt = 'Product Image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface ImageProps {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#171717',
            color: '#ffffff',
            fontSize: 48,
          }}
        >
          Product Not Found
        </div>
      ),
      size
    )
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        {product.images[0]?.url && (
          <div
            style={{
              display: 'flex',
              width: '50%',
              height: '100%',
            }}
          >
            <img
              src={product.images[0].url}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 60,
            width: product.images[0]?.url ? '50%' : '100%',
          }}
        >
          {product.category && (
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                color: '#737373',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              {product.category.name}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: 56,
              fontWeight: 700,
              color: '#171717',
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              color: '#171717',
              fontWeight: 600,
            }}
          >
            {price}
          </div>
          {product.stock === 0 && (
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                color: '#dc2626',
                marginTop: 16,
              }}
            >
              Out of Stock
            </div>
          )}
        </div>
      </div>
    ),
    size
  )
}
