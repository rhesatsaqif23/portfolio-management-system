import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Welcome to your Portfolio CMS. Manage your content from here.
        </p>
      </div>

      {user && (
        <section className="island-shell rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <img
              src={user.imageUrl}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                {user.fullName}
              </h2>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="Projects" description="Manage your portfolio projects" href="/admin/projects" />
        <QuickActionCard title="Skills" description="Update your tech stack" href="/admin/skills" />
        <QuickActionCard title="Experiences" description="Edit your career timeline" href="/admin/experiences" />
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="island-shell block rounded-2xl p-5 no-underline transition hover:-translate-y-0.5"
    >
      <h3 className="font-semibold text-[var(--sea-ink)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{description}</p>
    </a>
  )
}
