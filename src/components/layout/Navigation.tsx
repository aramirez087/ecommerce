import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
]

export function Navigation() {
  return (
    <nav className="flex items-center gap-3 sm:gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[0.68rem] font-semibold tracking-[0.11em] text-neutral-600 uppercase transition-colors hover:text-neutral-900 sm:text-xs"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
