'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from './Container'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'
import { CartIcon, CartDrawer } from '@/components/cart'
import { SearchDialog } from '@/components/search'

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-neutral-900">
              Store
            </Link>
            <div className="flex items-center gap-4">
              <Navigation />
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <UserMenu />
              <CartIcon onClick={() => setIsCartOpen(true)} />
            </div>
          </div>
        </Container>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
