import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateUserAddress, deleteUserAddress } from '@/lib/sanity/mutations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    await updateUserAddress(session.user.id, id, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update address:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteUserAddress(session.user.id, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete address:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
