import { cn } from '@/lib/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-white border border-neutral-200 overflow-hidden', className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-4', className)} {...props} />
  }
)

CardContent.displayName = 'CardContent'

export { Card, CardContent }
