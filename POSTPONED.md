# Postponed Work

This document tracks features planned for future phases with implementation details.

---

## Current Architecture Reference

### Data Flow Pattern
```
Components/Pages → /lib/data/ (domain types) → /lib/sanity/ (CMS adapter) → Sanity API
```
**Key principle:** No component calls Sanity directly. All data flows through `/src/lib/data/`.

### Key Directories
- `/src/lib/data/` - Public API: types.ts, products.ts, categories.ts
- `/src/lib/sanity/` - CMS implementation: client.ts, queries.ts, mappers.ts
- `/src/lib/utils/` - Utilities: cn.ts (classnames), formatters.ts
- `/src/components/` - UI components organized by: ui/, layout/, product/, category/, home/
- `/sanity/schemas/` - CMS schemas: product.ts, category.ts

### Existing Domain Types (`/src/lib/data/types.ts`)
```typescript
Product { id, name, slug, description, price, currency, images, productType, weight, stock, active, featured, category, createdAt }
ProductListItem { id, name, slug, price, currency, image, category }
Category { id, name, slug, description }
ProductImage { url, alt, width, height }
```

---

## Phase 2: Shopping Cart & Checkout

### 2.1 Cart State Management

**Install:** `npm install zustand`

**Create `/src/lib/store/cart.ts`:**
```typescript
interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  currency: string
  quantity: number
  image?: ProductImage
}

interface CartStore {
  items: CartItem[]
  addItem: (product: ProductListItem, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}
```

**Persist to localStorage:** Use zustand's `persist` middleware:
```typescript
import { persist } from 'zustand/middleware'
export const useCartStore = create<CartStore>()(
  persist((set, get) => ({ ... }), { name: 'cart-storage' })
)
```

### 2.2 Cart Components

**Create `/src/components/cart/`:**

| Component | Type | Purpose |
|-----------|------|---------|
| CartProvider.tsx | Client | Hydration wrapper for zustand store |
| CartIcon.tsx | Client | Header icon with item count badge |
| CartDrawer.tsx | Client | Slide-out cart panel |
| CartItem.tsx | Client | Single item with quantity controls |
| CartSummary.tsx | Client | Subtotal, taxes, total display |
| CartEmpty.tsx | Server | Empty cart state |

**Update existing:**
- `/src/components/product/AddToCartButton.tsx` - Connect to cart store
- `/src/components/layout/Header.tsx` - Add CartIcon

### 2.3 Cart Page

**Create `/src/app/cart/page.tsx`:**
- Full cart view with all items
- Quantity adjustments
- Remove items
- Cart summary
- "Continue Shopping" and "Checkout" CTAs
- Empty state when cart is empty

### 2.4 Checkout Flow

**Install:** `npm install stripe @stripe/stripe-js @stripe/react-stripe-js`

**Create Sanity schema `/sanity/schemas/order.ts`:**
```typescript
{
  name: 'order',
  fields: [
    { name: 'orderNumber', type: 'string' },
    { name: 'status', type: 'string', options: { list: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] } },
    { name: 'items', type: 'array', of: [{ type: 'orderItem' }] },
    { name: 'subtotal', type: 'number' },
    { name: 'shipping', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'shippingAddress', type: 'object', fields: [...] },
    { name: 'customerEmail', type: 'string' },
    { name: 'stripePaymentIntentId', type: 'string' },
    { name: 'createdAt', type: 'datetime' },
  ]
}
```

**Create `/src/app/checkout/page.tsx`:**
- Multi-step or single-page checkout
- Shipping address form (use react-hook-form)
- Order summary sidebar
- Stripe Elements for payment

**Create API routes:**
- `/src/app/api/checkout/route.ts` - Create Stripe PaymentIntent, create order in Sanity
- `/src/app/api/webhook/route.ts` - Handle Stripe webhooks (payment_intent.succeeded)

**Create `/src/app/checkout/success/page.tsx`:**
- Order confirmation with order number
- Order details summary
- "Continue Shopping" CTA

**Environment variables to add:**
```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Phase 3: User Accounts

### 3.1 Authentication Setup

**Install:** `npm install next-auth @auth/core`

**Create `/src/app/api/auth/[...nextauth]/route.ts`:**
- Configure providers (Credentials, Google, GitHub)
- JWT strategy for sessions
- Callbacks for session/jwt

**Create Sanity schema `/sanity/schemas/user.ts`:**
```typescript
{
  name: 'user',
  fields: [
    { name: 'email', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'image', type: 'url' },
    { name: 'provider', type: 'string' },
    { name: 'addresses', type: 'array', of: [{ type: 'address' }] },
    { name: 'createdAt', type: 'datetime' },
  ]
}
```

### 3.2 Auth Pages

**Create:**
- `/src/app/auth/signin/page.tsx` - Sign in form
- `/src/app/auth/signup/page.tsx` - Sign up form
- `/src/app/auth/forgot-password/page.tsx` - Password reset request
- `/src/app/auth/reset-password/page.tsx` - Password reset form

### 3.3 User Features

**Create `/src/app/account/` routes:**
- `page.tsx` - Profile overview
- `orders/page.tsx` - Order history list
- `orders/[id]/page.tsx` - Order detail
- `addresses/page.tsx` - Saved addresses management
- `wishlist/page.tsx` - Saved products

**Update order schema:** Add `userId` reference field

---

## Phase 4: Advanced Features

### 4.1 Search

**Option A - Client-side (simple):**
- Filter products in `/products` page using query params
- Add search input to header
- Use existing `getProducts()` with search parameter

**Option B - Sanity's native search:**
- Use GROQ's `match` operator for text search
- Add to queries.ts: `*[_type == "product" && name match $query + "*"]`

**Create:**
- `/src/components/search/SearchInput.tsx` - Debounced search input
- `/src/components/search/SearchResults.tsx` - Results dropdown
- `/src/app/search/page.tsx` - Full search results page

### 4.2 Product Variants

**Update `/sanity/schemas/product.ts`:**
```typescript
{
  name: 'variants',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'name', type: 'string' }, // "Blue / Large"
      { name: 'sku', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'stock', type: 'number' },
      { name: 'options', type: 'array', of: [{ type: 'object', fields: [
        { name: 'name', type: 'string' }, // "Color"
        { name: 'value', type: 'string' }, // "Blue"
      ]}]},
    ]
  }]
}
```

**Create:**
- `/src/components/product/VariantSelector.tsx` - Client component for variant selection
- Update `AddToCartButton` to accept variantId

### 4.3 SEO Enhancements

**Sitemap:** Create `/src/app/sitemap.ts`:
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductSlugs()
  return [
    { url: 'https://...', lastModified: new Date() },
    ...products.map(slug => ({ url: `https://.../products/${slug}` }))
  ]
}
```

**Structured Data:** Add JSON-LD to product pages:
```typescript
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "offers": { "@type": "Offer", "price": product.price }
  })}
</script>
```

---

## Technical Debt

| Task | Priority | Notes |
|------|----------|-------|
| Jest + RTL setup | High | `npm install -D jest @testing-library/react @testing-library/jest-dom` |
| Playwright E2E | Medium | `npm install -D @playwright/test` |
| Error boundaries | High | Wrap main sections to prevent full-page crashes |
| Logging | Medium | Consider Sentry or similar for production |
| Rate limiting | Low | Add to API routes before launch |

---

## Environment Variables Summary

```bash
# Sanity (existing)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Phase 2: Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Phase 3: Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```
