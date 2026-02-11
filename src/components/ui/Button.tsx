import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold tracking-[0.02em] transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-white shadow-[0_18px_42px_-24px_rgba(20,49,35,0.95)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-24px_rgba(20,49,35,0.88)]': variant === 'primary',
            'border border-white/70 bg-white/75 text-neutral-900 backdrop-blur-sm hover:bg-white/90': variant === 'secondary',
            'border border-neutral-300/80 bg-transparent text-neutral-800 hover:bg-white/55': variant === 'outline',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-5 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
