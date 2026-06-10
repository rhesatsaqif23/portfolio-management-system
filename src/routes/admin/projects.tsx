import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your portfolio projects.</p>
    </div>
  )
}
