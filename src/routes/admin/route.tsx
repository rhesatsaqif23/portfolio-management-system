import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  User,
  FolderKanban,
  History,
  Code,
  FileText,
  Award,
  BarChart3,
} from 'lucide-react'

const ALLOWED_EMAIL = 'atstsaqif23@gmail.com'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <>
      <SignedIn>
        <AdminGate />
      </SignedIn>
      <SignedOut>
        <div className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
          <section className="island-shell w-full max-w-md rounded-2xl p-6 text-center sm:p-8">
            <h1 className="text-xl font-bold text-[var(--sea-ink)]">Access Denied</h1>
            <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
              You must be signed in to access the admin panel.
            </p>
            <a
              href="/auth/sign-in"
              className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-6 py-2 text-sm font-semibold text-white no-underline"
            >
              Sign In
            </a>
          </section>
        </div>
      </SignedOut>
    </>
  )
}

function AdminGate() {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
  const isAllowed = email === ALLOWED_EMAIL

  if (!isAllowed) {
    return (
      <div className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <section className="island-shell w-full max-w-md rounded-2xl p-6 text-center sm:p-8">
          <h1 className="text-xl font-bold text-[var(--sea-ink)]">Access Restricted</h1>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            This admin panel is restricted to authorized users only.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-6 py-2 text-sm font-semibold text-white no-underline"
          >
            Go Home
          </a>
        </section>
      </div>
    )
  }

  return <AdminShell />
}

function AdminShell() {
  const { user } = useUser()

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 border-r border-[var(--line)] bg-[var(--card)] p-4 sm:block">
        <nav className="space-y-1">
          <SidebarLink to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarLink to="/admin/profile" label="Profile" icon={User} />
          <SidebarLink to="/admin/projects" label="Projects" icon={FolderKanban} />
          <SidebarLink to="/admin/experiences" label="Experiences" icon={History} />
          <SidebarLink to="/admin/skills" label="Skills" icon={Code} />
          <SidebarLink to="/admin/case-studies" label="Case Studies" icon={FileText} />
          <SidebarLink to="/admin/achievements" label="Achievements" icon={Award} />
          <SidebarLink to="/admin/stats" label="Stats" icon={BarChart3} />
        </nav>
      </aside>

      <main className="ml-64 flex-1 overflow-auto">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-3">
          <h2 className="text-sm font-semibold text-[var(--sea-ink)]">
            Welcome, {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
          </h2>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
      activeProps={{ className: 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline bg-[var(--link-bg-hover)] text-[var(--sea-ink)] font-semibold' }}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}
