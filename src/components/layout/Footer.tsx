import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="py-8 text-center text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
