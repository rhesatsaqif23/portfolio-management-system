import { useMatches } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()
  const matches = useMatches()
  const isAdmin = matches.some((m) => m.routeId.startsWith('/admin'))

  return (
    <footer
      className={`mt-12 border-t border-[var(--line)] px-3 pb-20 pt-6 text-[var(--sea-ink-soft)] md:mt-20 md:px-4 md:pb-14 md:pt-10 ${isAdmin ? 'md:ml-64' : ''}`}
    >
      <div className="page-wrap flex flex-col items-center justify-between gap-3 text-center md:flex-row md:gap-4 md:text-left">
        <p className="m-0 text-xs md:text-sm">
          &copy; {year} Portfolio CMS. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
    </footer>
  )
}
