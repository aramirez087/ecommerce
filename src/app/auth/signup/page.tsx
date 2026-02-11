import { Container } from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { SignUpForm } from '@/components/auth'

export const metadata = {
  title: 'Create Account - Velvet Toke',
  description: 'Create a new account',
}

export default function SignUpPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Create an account to track orders and save addresses.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
