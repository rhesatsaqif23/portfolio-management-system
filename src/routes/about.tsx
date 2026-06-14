import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-10 md:py-12">
      <section className="island-shell rounded-2xl">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)] md:mb-3 md:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-xs leading-6 text-[var(--sea-ink-soft)] md:text-base md:leading-8">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
