import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'

export function Hero() {
  return (
    <section className="bg-neutral-50 py-20 lg:py-32">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Discover Quality Products
          </h1>
          <p className="mt-6 text-lg text-neutral-600">
            Explore our curated collection of premium products. Quality craftsmanship meets modern design.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
