// Types
export type { Product, ProductListItem, ProductImage, Category } from './types'

// Product functions
export {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getAllProductSlugs,
  searchProducts,
} from './products'

// Category functions
export { getCategories, getCategoryBySlug } from './categories'
