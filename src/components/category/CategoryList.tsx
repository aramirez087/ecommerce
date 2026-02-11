import { CategoryBadge } from './CategoryBadge'
import type { Category } from '@/lib/data/types'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <CategoryBadge
          key={category.id}
          name={category.name}
          slug={category.slug}
        />
      ))}
    </div>
  )
}
