import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ClerkHeader from '../../integrations/clerk/header-user.tsx'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = (
    <SignedIn>
      <Link to="/admin/dashboard" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
      <Link to="/admin/profile" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Profile</Link>
      <Link to="/admin/projects" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Projects</Link>
      <Link to="/admin/experiences" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Experiences</Link>
      <Link to="/admin/skills" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Skills</Link>
      <Link to="/admin/case-studies" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Case Studies</Link>
      <Link to="/admin/achievements" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Achievements</Link>
      <Link to="/admin/stats" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }} onClick={() => setMenuOpen(false)}>Stats</Link>
    </SignedIn>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-3 sm:px-4">
      <nav className="page-wrap flex items-center py-2 sm:py-4">
        <h2 className="shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white no-underline"
          >
            <img src="/logo.png" alt="" className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="text-base font-extrabold tracking-tight sm:text-lg">Portfolio CMS</span>
          </Link>
        </h2>

        <div className="hidden flex-1 items-center justify-center gap-x-5 text-sm font-semibold lg:flex">
          {navLinks}
          <SignedOut>
            <Link to="/" className="nav-link text-white" activeProps={{ className: 'nav-link is-active text-white' }}>Home</Link>
          </SignedOut>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2 lg:flex-none">
          <ClerkHeader />
          <button
            className="ml-1 flex items-center justify-center rounded-lg p-1.5 text-white transition hover:bg-(--link-bg-hover) lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-40 border-t border-(--line) bg-(--bg-base) lg:hidden">
            <div className="flex flex-col gap-3 px-3 py-3 text-sm font-semibold">
              {navLinks}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
