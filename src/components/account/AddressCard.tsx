import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Address } from '@/lib/data/types'

interface AddressCardProps {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (addressId: string) => void
  onSetDefault: (addressId: string) => void
  isDeleting?: boolean
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
}: AddressCardProps) {
  return (
    <Card className={cn(address.isDefault && 'ring-2 ring-neutral-900')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <address className="text-sm text-neutral-600 not-italic flex-1">
            {address.isDefault && (
              <span className="inline-block mb-2 text-xs font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                Default
              </span>
            )}
            <p className="font-medium text-neutral-900">{address.name}</p>
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
          </address>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(address.id)}
              disabled={isDeleting}
            >
              {isDeleting ? '...' : 'Delete'}
            </Button>
            {!address.isDefault && (
              <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>
                Set Default
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
