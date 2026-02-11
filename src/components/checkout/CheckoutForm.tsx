'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { ShippingAddress } from '@/lib/data/types'

export interface CheckoutFormData extends ShippingAddress {
  email: string
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void
  isSubmitting?: boolean
  defaultEmail?: string
}

export function CheckoutForm({ onSubmit, isSubmitting, defaultEmail }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      country: 'Costa Rica',
      email: defaultEmail || '',
    },
  })

  const inputClassName = cn(
    'w-full border border-neutral-300 px-3 py-2 text-sm',
    'focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed'
  )

  const labelClassName = 'block text-sm font-medium text-neutral-700 mb-1'

  const errorClassName = 'text-sm text-red-600 mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Contact Information</h2>
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Shipping Address</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClassName}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={inputClassName}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="line1" className={labelClassName}>
              Address Line 1
            </label>
            <input
              id="line1"
              type="text"
              autoComplete="address-line1"
              className={inputClassName}
              {...register('line1', { required: 'Address is required' })}
            />
            {errors.line1 && <p className={errorClassName}>{errors.line1.message}</p>}
          </div>

          <div>
            <label htmlFor="line2" className={labelClassName}>
              Address Line 2 (Optional)
            </label>
            <input
              id="line2"
              type="text"
              autoComplete="address-line2"
              className={inputClassName}
              {...register('line2')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClassName}>
                City
              </label>
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                className={inputClassName}
                {...register('city', { required: 'City is required' })}
              />
              {errors.city && <p className={errorClassName}>{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="state" className={labelClassName}>
                Province
              </label>
              <select
                id="state"
                autoComplete="address-level1"
                className={inputClassName}
                {...register('state', { required: 'Province is required' })}
              >
                <option value="">Select a province</option>
                <option value="San José">San José</option>
                <option value="Alajuela">Alajuela</option>
                <option value="Cartago">Cartago</option>
                <option value="Heredia">Heredia</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Puntarenas">Puntarenas</option>
                <option value="Limón">Limón</option>
              </select>
              {errors.state && <p className={errorClassName}>{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className={labelClassName}>
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                autoComplete="postal-code"
                className={inputClassName}
                {...register('postalCode', { required: 'Postal code is required' })}
              />
              {errors.postalCode && <p className={errorClassName}>{errors.postalCode.message}</p>}
            </div>

            <div>
              <label htmlFor="country" className={labelClassName}>
                Country
              </label>
              <input
                id="country"
                type="text"
                autoComplete="country-name"
                className={inputClassName}
                disabled
                {...register('country')}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  )
}
