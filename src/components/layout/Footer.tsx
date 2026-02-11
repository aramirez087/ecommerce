import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/50 bg-[var(--surface)]">
      <Container>
        <div className="py-8 text-center text-xs tracking-[0.1em] text-neutral-600 uppercase">
          <p>&copy; {new Date().getFullYear()} Velvet Toke. Curated smoking essentials.</p>
        </div>
      </Container>
    </footer>
  )
}
