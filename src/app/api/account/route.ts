import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateUser } from '@/lib/sanity/mutations'

export async function PATCH(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    await updateUser(session.user.id, { name })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account update error:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
