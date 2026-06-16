import { createFileRoute } from "@tanstack/react-router";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pb-6 pt-10 md:pb-8 md:pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl">
        <div className="pointer-events-none absolute -left-20 -top-24 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)] md:h-56 md:w-56" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)] md:h-56 md:w-56" />
        <p className="island-kicker mb-2 md:mb-3">Portfolio CMS</p>
        <h1 className="display-title text-3xl md:text-4xl mb-4 leading-[1.02] font-bold tracking-tight text-(--sea-ink) md:mb-5">
          Manage your portfolio with ease
        </h1>
        <p className="mb-6 max-w-2xl text-xs text-(--sea-ink-soft) md:mb-8 md:text-lg">
          A private dashboard to manage projects, skills, experiences, and
          achievements without touching code.
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <SignedOut>
            <SignInButton>
              <button className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-xs font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)] md:px-5 md:py-2.5 md:text-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/admin/dashboard"
              className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-xs font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)] md:px-5 md:py-2.5 md:text-sm"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-4 py-2 text-xs font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)] md:px-5 md:py-2.5 md:text-sm"
          >
            Built with TanStack Start
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:mt-8 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [
            "Projects",
            "Create and manage portfolio projects with rich case studies.",
          ],
          ["Skills", "Organize your technical skills by category."],
          ["Experiences", "Document your career and organizational timeline."],
        ].map(([title, desc]) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl"
          >
            <h2 className="mb-1 text-sm font-semibold text-(--sea-ink) md:mb-2 md:text-base">
              {title}
            </h2>
            <p className="m-0 text-[10px] text-(--sea-ink-soft) md:text-sm">
              {desc}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
