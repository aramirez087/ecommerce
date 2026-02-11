import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_30px_55px_-40px_rgba(23,44,32,0.82)] backdrop-blur-sm',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-5', className)} {...props} />
  }
)

CardContent.displayName = 'CardContent'

export { Card, CardContent }
