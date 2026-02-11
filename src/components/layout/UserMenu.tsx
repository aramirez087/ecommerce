'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200" />
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
      >
        Sign In
      </Link>
    )
  }

  const initials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
          'bg-neutral-900 text-white hover:bg-neutral-800'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-neutral-200 bg-white shadow-lg">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Order History
            </Link>
            <Link
              href="/account/addresses"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Addresses
            </Link>
          </div>

          <div className="border-t border-neutral-200 py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
