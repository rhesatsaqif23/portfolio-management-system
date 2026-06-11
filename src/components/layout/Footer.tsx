import { useMatches } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()
  const matches = useMatches()
  const isAdmin = matches.some((m) => m.routeId.startsWith('/admin'))

  return (
    <footer
      className={`mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)] ${isAdmin ? 'ml-64' : ''}`}
    >
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Portfolio CMS. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
    </footer>
  )
}
