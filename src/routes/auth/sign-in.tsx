import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <section className="island-shell w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            Access your Portfolio CMS dashboard
          </p>
        </div>
        <SignedOut>
          <SignIn routing="path" path="/auth/sign-in" signUpUrl="" />
        </SignedOut>
        <SignedIn>
          <div className="text-center">
            <p className="text-[var(--sea-ink-soft)]">You are already signed in.</p>
            <a
              href="/admin/dashboard"
              className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-6 py-2 text-sm font-semibold text-white no-underline"
            >
              Go to Dashboard
            </a>
          </div>
        </SignedIn>
      </section>
    </main>
  )
}
