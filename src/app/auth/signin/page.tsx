import { Suspense } from 'react'
import { Container } from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { SignInForm } from '@/components/auth'

export const metadata = {
  title: 'Sign In - Store',
  description: 'Sign in to your account',
}

export default function SignInPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Welcome back! Sign in to your account.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-100" />}>
              <SignInForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
