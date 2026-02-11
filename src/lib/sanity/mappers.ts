import type { Product, ProductListItem, Category, ProductImage, ProductVariant, ProductOption } from '../data/types'
import type { SanityProduct, SanityProductListItem, SanityCategory, SanityImageAsset, SanityProductVariant, SanityProductOption } from './types'

function mapImage(image: SanityImageAsset | undefined): ProductImage | undefined {
  if (!image?.url) return undefined
  return {
    url: image.url,
    alt: image.alt || '',
    width: image.width || 800,
    height: image.height || 800,
  }
}

export function mapCategory(sanityCategory: SanityCategory): Category {
  return {
    id: sanityCategory._id,
    name: sanityCategory.name,
    slug: sanityCategory.slug,
    description: sanityCategory.description,
  }
}

function mapOption(option: SanityProductOption): ProductOption {
  return {
    name: option.name,
    values: option.values || [],
  }
}

function mapVariant(variant: SanityProductVariant): ProductVariant {
  return {
    id: variant._key,
    name: variant.name,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock || 0,
    options: (variant.options || []).map((opt) => ({
      name: opt.name,
      value: opt.value,
    })),
  }
}

export function mapProductListItem(item: SanityProductListItem): ProductListItem {
  return {
    id: item._id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    currency: item.currency || 'USD',
    image: mapImage(item.image),
    category: item.category
      ? {
          name: item.category.name,
          slug: item.category.slug,
        }
      : undefined,
  }
}

export function mapProduct(sanityProduct: SanityProduct): Product {
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    slug: sanityProduct.slug,
    description: sanityProduct.description,
    price: sanityProduct.price,
    currency: sanityProduct.currency || 'USD',
    images: (sanityProduct.images || []).map((img) => mapImage(img)!).filter(Boolean),
    productType: sanityProduct.productType || 'physical',
    weight: sanityProduct.weight,
    stock: sanityProduct.stock || 0,
    active: sanityProduct.active ?? true,
    featured: sanityProduct.featured ?? false,
    category: sanityProduct.category ? mapCategory(sanityProduct.category) : undefined,
    createdAt: sanityProduct.createdAt,
    hasVariants: sanityProduct.hasVariants ?? false,
    options: sanityProduct.options?.map(mapOption),
    variants: sanityProduct.variants?.map(mapVariant),
  }
}
