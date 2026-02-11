import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
]

export function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
