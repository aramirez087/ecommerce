'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, ProductImage } from '@/lib/data/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

function getItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId
}

function matchesItem(item: CartItem, productId: string, variantId?: string): boolean {
  if (variantId) {
    return item.productId === productId && item.variantId === variantId
  }
  return item.productId === productId && !item.variantId
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) =>
            matchesItem(i, item.productId, item.variantId)
          )

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                matchesItem(i, item.productId, item.variantId)
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !matchesItem(i, productId, variantId)),
        }))
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((i) =>
            matchesItem(i, productId, variantId) ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      total: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
