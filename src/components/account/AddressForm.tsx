'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Address } from '@/lib/data/types'

interface AddressFormProps {
  address?: Address
  onSubmit: (data: Omit<Address, 'id'>) => Promise<void>
  onCancel: () => void
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: address?.name || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Costa Rica',
    isDefault: address?.isDefault || false,
  })

  const inputClassName = cn(
    'w-full border border-neutral-300 px-3 py-2 text-sm',
    'focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed'
  )

  const labelClassName = 'block text-sm font-medium text-neutral-700 mb-1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClassName}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="line1" className={labelClassName}>
          Address Line 1
        </label>
        <input
          id="line1"
          name="line1"
          type="text"
          required
          value={formData.line1}
          onChange={handleChange}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="line2" className={labelClassName}>
          Address Line 2 (Optional)
        </label>
        <input
          id="line2"
          name="line2"
          type="text"
          value={formData.line2}
          onChange={handleChange}
          className={inputClassName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className={labelClassName}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="state" className={labelClassName}>
            Province
          </label>
          <select
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            className={inputClassName}
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
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className={labelClassName}>
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            required
            value={formData.postalCode}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClassName}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            className={inputClassName}
            disabled
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 border-neutral-300 rounded focus:ring-neutral-900"
        />
        <label htmlFor="isDefault" className="text-sm text-neutral-700">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
