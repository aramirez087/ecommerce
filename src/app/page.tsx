import { Hero } from '@/components/home/Hero'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
    </>
  )
}
