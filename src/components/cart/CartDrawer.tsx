'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { CartEmpty } from './CartEmpty'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-600 hover:text-neutral-900"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="divide-y divide-neutral-200">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-4">
            <CartSummary />
            <div className="mt-4 space-y-2">
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full">Checkout</Button>
              </Link>
              <Link href="/cart" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
