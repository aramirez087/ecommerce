import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <Container className="py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </Container>
  )
}
