import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById, addUserAddress } from '@/lib/sanity/mutations'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserById(session.user.id)

    return NextResponse.json({ addresses: user?.addresses || [] })
  } catch (error) {
    console.error('Failed to get addresses:', error)
    return NextResponse.json({ error: 'Failed to get addresses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    await addUserAddress(session.user.id, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to add address:', error)
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 })
  }
}
