import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface CategoryBadgeProps {
  name: string
  slug: string
  className?: string
}

export function CategoryBadge({ name, slug, className }: CategoryBadgeProps) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors',
        className
      )}
    >
      {name}
    </Link>
  )
}
