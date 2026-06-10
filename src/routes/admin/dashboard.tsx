import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
import { Skeleton } from '#/components/ui/skeleton'
import { listProjects, listSkills, listExperiences, listAchievements, listStats } from '#/apis'
import { getProfile } from '#/apis'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function StatCardSkeleton() {
  return (
    <div className="island-shell block rounded-2xl p-5">
      <Skeleton className="h-8 w-16" />
      <div className="mt-1"><Skeleton className="h-5 w-24" /></div>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <a href={href} className="island-shell block rounded-2xl p-5 no-underline transition hover:-translate-y-0.5">
      <p className="text-2xl font-bold text-[var(--sea-ink)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{label}</p>
    </a>
  )
}

function DashboardPage() {
  const { user } = useUser()

  const { data: profile, isLoading: profileLoading } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile() })
  const { data: projects, isLoading: projectsLoading } = useQuery({ queryKey: ['projects'], queryFn: () => listProjects() })
  const { data: skills, isLoading: skillsLoading } = useQuery({ queryKey: ['skills'], queryFn: () => listSkills() })
  const { data: experiences, isLoading: experiencesLoading } = useQuery({ queryKey: ['experiences'], queryFn: () => listExperiences() })
  const { data: achievements, isLoading: achievementsLoading } = useQuery({ queryKey: ['achievements'], queryFn: () => listAchievements() })
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['stats'], queryFn: () => listStats() })

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
            <img src={user.imageUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{user.fullName}</h2>
              <p className="text-sm text-[var(--sea-ink-soft)]">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </section>
      )}

      {profileLoading ? (
        <section className="island-shell rounded-2xl p-5">
          <Skeleton className="mb-3 h-3.5 w-32" />
          <div className="space-y-1">
            {['Name', 'Role', 'Email', 'Location'].map((l) => (
              <p key={l} className="text-sm">
                <Skeleton className="mr-1 inline-block h-4 w-12 align-text-bottom" />
                <Skeleton className="inline-block h-4 w-28 align-text-bottom" />
              </p>
            ))}
          </div>
        </section>
      ) : profile ? (
        <section className="island-shell rounded-2xl p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Profile Summary</h3>
          <div className="space-y-1 text-sm text-[var(--sea-ink-soft)]">
            <p><span className="font-medium text-[var(--sea-ink)]">Name:</span> {profile.fullName}</p>
            <p><span className="font-medium text-[var(--sea-ink)]">Role:</span> {profile.currentRole}</p>
            {profile.email && <p><span className="font-medium text-[var(--sea-ink)]">Email:</span> {profile.email}</p>}
            {profile.location && <p><span className="font-medium text-[var(--sea-ink)]">Location:</span> {profile.location}</p>}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectsLoading ? <StatCardSkeleton /> : <StatCard label="Projects" value={projects?.length ?? 0} href="/admin/projects" />}
        {skillsLoading ? <StatCardSkeleton /> : <StatCard label="Skills" value={skills?.length ?? 0} href="/admin/skills" />}
        {experiencesLoading ? <StatCardSkeleton /> : <StatCard label="Experiences" value={experiences?.length ?? 0} href="/admin/experiences" />}
        {achievementsLoading ? <StatCardSkeleton /> : <StatCard label="Achievements" value={achievements?.length ?? 0} href="/admin/achievements" />}
        {statsLoading ? <StatCardSkeleton /> : <StatCard label="Stats" value={stats?.length ?? 0} href="/admin/stats" />}
      </div>
    </div>
  )
}
