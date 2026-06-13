import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import ClerkHeader from '../../integrations/clerk/header-user.tsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center py-3 sm:py-4">
        <h2 className="flex-shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white no-underline"
          >
            <img src="/logo.png" alt="" className="h-7 w-7" />
            <span className="text-lg font-extrabold tracking-tight">Portfolio CMS</span>
          </Link>
        </h2>

        <div className="flex flex-1 items-center justify-center gap-x-5 text-sm font-semibold">
          <SignedIn>
            <Link to="/admin/dashboard" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Dashboard</Link>
            <Link to="/admin/profile" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Profile</Link>
            <Link to="/admin/projects" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Projects</Link>
            <Link to="/admin/experiences" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Experiences</Link>
            <Link to="/admin/skills" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Skills</Link>
            <Link to="/admin/case-studies" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Case Studies</Link>
            <Link to="/admin/achievements" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Achievements</Link>
            <Link to="/admin/stats" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Stats</Link>
          </SignedIn>
          <SignedOut>
            <Link to="/" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Home</Link>
          </SignedOut>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ClerkHeader />
        </div>
      </nav>
    </header>
  )
}
