import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/skills')({
  component: SkillsPage,
})

function SkillsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Skills</h1>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your skills.</p>
    </div>
  )
}
