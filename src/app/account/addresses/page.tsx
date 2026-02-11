'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AddressCard, AddressForm } from '@/components/account'
import type { Address } from '@/lib/data/types'

export default function AddressesPage() {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [session?.user?.id])

  const fetchAddresses = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/account/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (data: Omit<Address, 'id'>) => {
    try {
      const response = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchAddresses()
        setIsAdding(false)
      }
    } catch (error) {
      console.error('Failed to add address:', error)
    }
  }

  const handleUpdateAddress = async (data: Omit<Address, 'id'>) => {
    if (!editingAddress) return

    try {
      const response = await fetch(`/api/account/addresses/${editingAddress.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchAddresses()
        setEditingAddress(null)
      }
    } catch (error) {
      console.error('Failed to update address:', error)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    setDeletingId(addressId)
    try {
      const response = await fetch(`/api/account/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAddresses()
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/account/addresses/${addressId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })

      if (response.ok) {
        await fetchAddresses()
      }
    } catch (error) {
      console.error('Failed to set default address:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse bg-neutral-100 rounded" />
        ))}
      </div>
    )
  }

  if (isAdding || editingAddress) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <AddressForm
            address={editingAddress || undefined}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={() => {
              setIsAdding(false)
              setEditingAddress(null)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Saved Addresses</h2>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-600">You don&apos;t have any saved addresses.</p>
            <Button className="mt-4" onClick={() => setIsAdding(true)}>
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={setEditingAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
              isDeleting={deletingId === address.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
