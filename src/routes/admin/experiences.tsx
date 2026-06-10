import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/experiences')({
  component: ExperiencesPage,
})

function ExperiencesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Experiences</h1>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your career timeline.</p>
    </div>
  )
}
