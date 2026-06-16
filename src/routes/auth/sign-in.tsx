import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isSignedIn, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await navigate({ to: "/admin/dashboard" });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (!isLoaded) return;
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/auth/sso-callback",
        redirectUrlComplete: window.location.origin + "/admin/dashboard",
      });
    } catch {
      setError("Failed to sign in with Google.");
    }
  }

  if (isSignedIn) {
    return (
      <main className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <section className="island-shell w-full max-w-md rounded-2xl text-center">
          <p className="text-xs text-[var(--sea-ink-soft)] md:text-sm">
            You are already signed in.
          </p>
          <a
            href="/admin/dashboard"
            className="mt-4 inline-block rounded-full bg-[var(--sea-ink)] px-5 py-2 text-xs font-semibold text-[var(--sand)] no-underline md:px-6 md:py-2 md:text-sm"
          >
            Go to Dashboard
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <section className="island-shell w-full max-w-md rounded-2xl">
        <div className="mb-4 text-center md:mb-6">
          <h1 className="display-title text-lg font-bold text-(--sea-ink) md:text-2xl">
            Sign In
          </h1>
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)] md:mt-2 md:text-sm">
            Access your Portfolio CMS dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-(--sea-ink) md:text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] md:px-3 md:py-2 md:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-(--sea-ink) md:text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] md:px-3 md:py-2 md:text-sm"
              placeholder="Your password"
            />
          </div>

          {error && <p className="text-xs text-red-600 md:text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--sea-ink)] px-5 py-2 text-xs font-semibold text-[var(--sand)] transition hover:opacity-90 disabled:opacity-50 md:px-6 md:py-2 md:text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-3 flex items-center gap-3 md:my-4">
          <span className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-[10px] text-[var(--sea-ink-soft)] md:text-xs">
            OR
          </span>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)] md:px-6 md:py-2 md:text-sm"
        >
          <svg className="size-4 md:size-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </section>
    </main>
  );
}
