import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="groove-glow pointer-events-none absolute -left-28 top-8 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" />
      <div className="groove-glow-delay pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-neutral-200/80 blur-3xl" />
      <Container>
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex rounded-full border border-white/80 bg-white/55 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase backdrop-blur-sm">
            Elevated Smoke Essentials
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Groovy accessories with a premium minimalist edge.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-700">
            Shop curated glassware, grinders, rolling trays, and discreet storage built for a
            clean ritual and a smooth vibe.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/products">
              <Button size="lg">Shop Collection</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg">
                Find Your Setup
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
