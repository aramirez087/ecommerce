'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'Order History' },
  { href: '/account/addresses', label: 'Addresses' },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href ||
          (link.href !== '/account' && pathname.startsWith(link.href))

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
