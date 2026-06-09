import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <>
      <SignedIn>
        <AdminShell />
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

function AdminShell() {
  const { user } = useUser()

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--line)] bg-[var(--card)] p-4 sm:block">
        <nav className="space-y-1">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Management
          </p>
          <SidebarLink to="/admin/dashboard" label="Dashboard" />
          <SidebarLink to="/admin/profile" label="Profile" />
          <SidebarLink to="/admin/projects" label="Projects" />
          <SidebarLink to="/admin/experiences" label="Experiences" />
          <SidebarLink to="/admin/skills" label="Skills" />
          <SidebarLink to="/admin/achievements" label="Achievements" />
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
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

function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex rounded-lg px-3 py-2 text-sm text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
      activeProps={{ className: 'flex rounded-lg px-3 py-2 text-sm no-underline bg-[var(--link-bg-hover)] text-[var(--sea-ink)] font-semibold' }}
    >
      {label}
    </Link>
  )
}
