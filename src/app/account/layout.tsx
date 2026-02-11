import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Container } from '@/components/layout/Container'
import { AccountSidebar } from '@/components/account'

export const metadata = {
  title: 'My Account - Velvet Toke',
  description: 'Manage your account',
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account')
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <AccountSidebar />
        </aside>
        <main className="lg:col-span-3">{children}</main>
      </div>
    </Container>
  )
}
