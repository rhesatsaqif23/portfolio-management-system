import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
import { Skeleton } from '#/components/ui/skeleton'
import { listProjects, listSkills, listExperiences, listAchievements, listStats } from '#/apis'
import { getProfile } from '#/apis'
import { useEffect } from 'react'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function StatCardSkeleton() {
  return (
    <div className="island-shell block rounded-2xl">
      <Skeleton className="h-6 w-12 md:h-8 md:w-16" />
      <div className="mt-1"><Skeleton className="h-4 w-20 md:h-5 md:w-24" /></div>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <a href={href} className="island-shell block rounded-2xl no-underline transition hover:-translate-y-0.5">
      <p className="text-lg font-bold text-[var(--sea-ink)] md:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-[var(--sea-ink-soft)] md:text-sm">{label}</p>
    </a>
  )
}

function DashboardPage() {
  const { user } = useUser()

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({ queryKey: ['profile'], queryFn: () => getProfile() })
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({ queryKey: ['projects'], queryFn: () => listProjects() })
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useQuery({ queryKey: ['skills'], queryFn: () => listSkills() })
  const { data: experiences, isLoading: experiencesLoading, error: experiencesError } = useQuery({ queryKey: ['experiences'], queryFn: () => listExperiences() })
  const { data: achievements, isLoading: achievementsLoading, error: achievementsError } = useQuery({ queryKey: ['achievements'], queryFn: () => listAchievements() })
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({ queryKey: ['stats'], queryFn: () => listStats() })

  const queryErrors = [profileError, projectsError, skillsError, experiencesError, achievementsError, statsError].filter(Boolean)
  useEffect(() => { queryErrors.forEach(e => console.error('Query error:', e)) }, [queryErrors])

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-lg font-bold text-[var(--sea-ink)] md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] md:text-sm">
          Welcome to your Portfolio CMS. Manage your content from here.
        </p>
      </div>

      {user && (
        <section className="island-shell rounded-2xl">
          <div className="flex items-center gap-3 md:gap-4">
            <img src={user.imageUrl} alt="" className="size-10 rounded-full object-cover md:size-14" />
            <div>
              <h2 className="text-sm font-semibold text-[var(--sea-ink)] md:text-lg">{user.fullName}</h2>
              <p className="text-xs text-[var(--sea-ink-soft)] md:text-sm">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </section>
      )}

      {profileLoading ? (
        <section className="island-shell rounded-2xl">
          <Skeleton className="mb-3 h-3 w-28 md:h-3.5 md:w-32" />
          <div className="space-y-1">
            {['Name', 'Role', 'Email', 'Location'].map((l) => (
              <div key={l} className="text-xs md:text-sm">
                <Skeleton className="mr-1 inline-block h-3 w-10 align-text-bottom md:h-4 md:w-12" />
                <Skeleton className="inline-block h-3 w-24 align-text-bottom md:h-4 md:w-28" />
              </div>
            ))}
          </div>
        </section>
      ) : profile ? (
        <section className="island-shell rounded-2xl">
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] md:mb-3 md:text-sm">Profile Summary</h3>
          <div className="space-y-1 text-xs text-[var(--sea-ink-soft)] md:text-sm">
            <p><span className="font-medium text-[var(--sea-ink)]">Name:</span> {profile.fullName}</p>
            <p><span className="font-medium text-[var(--sea-ink)]">Role:</span> {profile.currentRole}</p>
            {profile.email && <p><span className="font-medium text-[var(--sea-ink)]">Email:</span> {profile.email}</p>}
            {profile.location && <p><span className="font-medium text-[var(--sea-ink)]">Location:</span> {profile.location}</p>}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {projectsLoading ? <StatCardSkeleton /> : <StatCard label="Projects" value={projects?.length ?? 0} href="/admin/projects" />}
        {skillsLoading ? <StatCardSkeleton /> : <StatCard label="Skills" value={skills?.length ?? 0} href="/admin/skills" />}
        {experiencesLoading ? <StatCardSkeleton /> : <StatCard label="Experiences" value={experiences?.length ?? 0} href="/admin/experiences" />}
        {achievementsLoading ? <StatCardSkeleton /> : <StatCard label="Achievements" value={achievements?.length ?? 0} href="/admin/achievements" />}
        {statsLoading ? <StatCardSkeleton /> : <StatCard label="Stats" value={stats?.length ?? 0} href="/admin/stats" />}
      </div>
    </div>
  )
}
