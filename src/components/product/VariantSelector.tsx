'use client'

import { cn } from '@/lib/utils/cn'
import type { ProductOption, ProductVariant, VariantOption } from '@/lib/data/types'

interface VariantSelectorProps {
  options: ProductOption[]
  variants: ProductVariant[]
  selectedOptions: Record<string, string>
  onOptionChange: (optionName: string, value: string) => void
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const isOptionValueAvailable = (optionName: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: value }

    return variants.some((variant) => {
      return variant.options.every((opt) => {
        const selectedValue = testOptions[opt.name]
        return !selectedValue || opt.value === selectedValue
      }) && variant.stock > 0
    })
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name}>
          <label className="block text-sm font-medium text-neutral-900 mb-3">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value
              const isAvailable = isOptionValueAvailable(option.name, value)

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    'px-4 py-2 text-sm border rounded-md transition-colors',
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : isAvailable
                      ? 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900'
                      : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function findVariantByOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | undefined {
  const selectedEntries = Object.entries(selectedOptions)

  if (selectedEntries.length === 0) {
    return undefined
  }

  return variants.find((variant) => {
    return selectedEntries.every(([name, value]) => {
      const variantOption = variant.options.find((opt) => opt.name === name)
      return variantOption?.value === value
    })
  })
}
