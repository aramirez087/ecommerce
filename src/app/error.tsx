'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-neutral-600 mb-8">
          An error occurred while loading this page.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  )
}
