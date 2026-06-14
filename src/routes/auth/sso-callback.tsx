import { createFileRoute } from '@tanstack/react-router'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

export const Route = createFileRoute('/auth/sso-callback')({
  component: SSOCallbackPage,
})

function SSOCallbackPage() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <section className="island-shell w-full max-w-md rounded-2xl text-center">
        <p className="text-xs text-[var(--sea-ink-soft)] md:text-sm">Completing sign-in...</p>
      </section>
      <AuthenticateWithRedirectCallback />
    </main>
  )
}
