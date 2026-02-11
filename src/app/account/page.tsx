'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function AccountPage() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(session?.user?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const inputClassName = cn(
    'w-full border border-neutral-300 px-3 py-2 text-sm',
    'focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed'
  )

  const labelClassName = 'block text-sm font-medium text-neutral-700 mb-1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      await update({ name })
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setIsEditing(false)
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>

          {message && (
            <div
              className={cn(
                'mb-4 rounded-lg border p-4',
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              )}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={session?.user?.email || ''}
                  className={inputClassName}
                  disabled
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setName(session?.user?.name || '')
                    setMessage(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-neutral-500">Name</dt>
                <dd className="mt-1 text-sm text-neutral-900">
                  {session?.user?.name || 'Not set'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500">Email</dt>
                <dd className="mt-1 text-sm text-neutral-900">{session?.user?.email}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
