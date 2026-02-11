import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductVariantSection } from '@/components/product/ProductVariantSection'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo'
import { getProductBySlug, getAllProductSlugs } from '@/lib/data'

export const revalidate = 60

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} - Store`,
    description: product.description || `Buy ${product.name} at our store`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const productUrl = `${baseUrl}/products/${product.slug}`

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Products', url: `${baseUrl}/products` },
    ...(product.category
      ? [{ name: product.category.name, url: `${baseUrl}/products?category=${product.category.slug}` }]
      : []),
    { name: product.name, url: productUrl },
  ]

  return (
    <>
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="space-y-8">
            <ProductInfo product={product} showPrice={!product.hasVariants} />
            {product.hasVariants && product.variants && product.variants.length > 0 ? (
              <ProductVariantSection product={product} />
            ) : (
              <AddToCartButton product={product} disabled={product.stock === 0} />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
