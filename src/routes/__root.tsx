import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

import ClerkProvider from "../integrations/clerk/provider";
import TanstackQueryProvider from "../integrations/tanstack-query/root-provider";
import { Toaster } from "#/components/ui/sonner";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Portfolio CMS",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/logo.png",
        type: "image/png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-(--sea-ink) md:text-4xl">404</h1>
      <p className="mt-2 text-xs text-(--sea-ink-soft) md:text-sm">
        Page not found.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-full bg-(--sea-ink) px-5 py-2 text-xs font-semibold text-(--sand) no-underline md:mt-6 md:px-6 md:text-sm"
      >
        Go Home
      </Link>
    </main>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(74,158,255,0.24)]">
        <ClerkProvider>
          <TanstackQueryProvider>
            <Header />
            {children}
            <Footer />
          </TanstackQueryProvider>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ClerkProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
