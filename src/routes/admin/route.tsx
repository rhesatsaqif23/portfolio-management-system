import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutDashboard,
  User,
  FolderKanban,
  History,
  Code,
  FileText,
  Award,
  BarChart3,
  PanelLeftClose,
  PanelLeft,
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
          <section className="island-shell w-full max-w-md rounded-2xl text-center">
            <h1 className="text-lg font-bold text-[var(--sea-ink)] md:text-xl">Access Denied</h1>
            <p className="mt-2 text-xs text-[var(--sea-ink-soft)] md:text-sm">
              You must be signed in to access the admin panel.
            </p>
            <a
              href="/auth/sign-in"
              className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-5 py-2 text-xs font-semibold text-[var(--sand)] no-underline md:px-6 md:py-2 md:text-sm"
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
        <section className="island-shell w-full max-w-md rounded-2xl text-center">
          <h1 className="text-lg font-bold text-[var(--sea-ink)] md:text-xl">Access Restricted</h1>
          <p className="mt-2 text-xs text-[var(--sea-ink-soft)] md:text-sm">
            This admin panel is restricted to authorized users only.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-5 py-2 text-xs font-semibold text-[var(--sand)] no-underline md:px-6 md:py-2 md:text-sm"
          >
            Go Home
          </a>
        </section>
      </div>
    )
  }

  return <AdminShell />
}

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/experiences', label: 'Experiences', icon: History },
  { to: '/admin/skills', label: 'Skills', icon: Code },
  { to: '/admin/case-studies', label: 'Case Studies', icon: FileText },
  { to: '/admin/achievements', label: 'Achievements', icon: Award },
  { to: '/admin/stats', label: 'Stats', icon: BarChart3 },
]

function AdminShell() {
  const { user } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className={`fixed bottom-0 left-0 top-16 z-30 w-48 border-r border-[var(--line)] bg-[var(--card)] p-4 transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:block`}>
        <div className="mb-2 flex items-center justify-between md:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Navigation</span>
          <button onClick={() => setSidebarOpen(false)} className="rounded p-1 text-white hover:bg-[var(--link-bg-hover)]">
            <PanelLeftClose className="size-4" />
          </button>
        </div>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} onClick={() => setSidebarOpen(false)} />
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 overflow-auto md:ml-48">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-2">
            <button
              className="rounded p-1 text-white hover:bg-[var(--link-bg-hover)] md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <PanelLeft className="size-4" />
            </button>
            <h2 className="text-xs font-semibold text-white md:text-sm">
              Welcome, {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
            </h2>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-1 overflow-x-auto border-t border-[var(--line)] bg-[var(--card)] px-2 py-1 md:hidden">
        {sidebarLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex shrink-0 flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-white no-underline transition hover:text-[var(--lagoon)]"
            activeProps={{ className: 'flex shrink-0 flex-col items-center gap-0.5 px-2 py-1 text-[10px] no-underline text-[var(--lagoon)]' }}
          >
            <link.icon className="size-4" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

function SidebarLink({ to, label, icon: Icon, onClick }: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white no-underline transition hover:bg-[var(--link-bg-hover)]"
      activeProps={{ className: 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline bg-[var(--link-bg-hover)] text-white font-semibold' }}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  )
}
