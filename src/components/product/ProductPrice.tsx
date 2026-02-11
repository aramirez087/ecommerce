import { formatPrice } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'

interface ProductPriceProps {
  price: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProductPrice({
  price,
  currency = 'USD',
  size = 'md',
  className,
}: ProductPriceProps) {
  return (
    <span
      className={cn(
        'font-semibold text-neutral-900',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-xl': size === 'lg',
        },
        className
      )}
    >
      {formatPrice(price, currency)}
    </span>
  )
}
