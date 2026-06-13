# Portfolio Content Management System (CMS)

A private admin dashboard for managing professional portfolio data — projects, experiences, skills, and case studies — built with the **King Je Es** stack. The CMS serves as the back-office for a personal portfolio website, allowing dynamic content management without modifying frontend code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React + Vite + SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Database | Supabase PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Validation | [Zod](https://zod.dev) (shared client/server) |
| Auth | [Clerk](https://clerk.com) (login-only, no public registration) |
| Storage | Supabase Storage (CV, images, icons) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) + [Tailwind CSS v4](https://tailwindcss.com) |
| State | [Zustand](https://zustand.docs.pmnd.rs) |
| Forms | [TanStack Form](https://tanstack.com/form) |
| Linter/Formatter | [Oxc](https://oxc.rs) (no ESLint/Prettier — Rust-based, <500ms full codebase) |
| Testing | [Vitest](https://vitest.dev) |
| Icons | [lucide-react](https://lucide.dev) |
| Env Validation | [T3Env](https://env.t3.gg) (Zod-powered) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |

---

## Architecture

Hexagonal Architecture (Ports & Adapters) keeps business logic decoupled from frameworks. **Domain never imports from Infrastructure or UI.**

### Directory Layout

```
src/
├── apis/               Server Functions (RPC layer)
├── components/         React UI
│   ├── ui/             shadcn/ui primitives
│   ├── forms/          Reusable form components (DateField, FileUpload, GalleryUpload)
│   ├── layout/         Sidebar, Header, ThemeToggle, AppShell
│   └── tables/         DataTable with pagination
├── domain/             Business logic (pure TypeScript + Zod)
│   ├── schemas/        Zod validation schemas
│   ├── ports/          Interface definitions (Ports)
│   └── use-cases/      Business logic implementations
├── infrastructure/     Framework adapters
│   ├── db/             Drizzle ORM schema + repositories
│   ├── auth/           Clerk backend auth adapter
│   └── supabase/       Supabase Storage client
├── routes/             File-based routes (TanStack Router)
│   ├── auth/           Sign-in page
│   └── admin/          Protected dashboard pages
├── stores/             Zustand stores (sidebar state)
├── integrations/       Provider wrappers (Clerk, TanStack Query)
└── lib/                Utilities (cn() helper)
```

### RPC Data Flow

```
Form (TanStack Form) → Zod validate (client) → createServerFn POST
→ Zod re-validate (server) → Use case → Repository → PostgreSQL
→ Typed response back to client
```

All internal data mutations use `createServerFn` (RPC pattern) — no manual `fetch` calls. Zod schemas are defined once in `src/domain/schemas/` and shared between client form validation and server function validators for end-to-end type safety.

### Key Decisions

| Decision | Rationale |
|---|---|
| RPC over REST | No URL construction, automatic type inference across the wire |
| Shared Zod schemas | Single source of truth validated on both client and server |
| Zustand | ~1KB, no provider wrapping, works outside React components |
| Nitro adapter | Framework-agnostic build — deploy anywhere (Render, Fly.io, VPS) |
| Upload-on-save | Files stored as pending state, uploaded to Supabase only on form submit — prevents orphaned files |

---

## Features

### Modules

| Module | Route | Key Capabilities |
|---|---|---|
| Dashboard | `/admin/dashboard` | Quick stats, action shortcuts |
| Profile | `/admin/profile` | Name, title, short/long bio, avatar upload, CV upload/replace/delete |
| Projects | `/admin/projects` | Full CRUD, slug auto-generation, thumbnail upload, featured flag |
| Case Studies | `/admin/case-studies` | Markdown editor per project, media gallery with captions |
| Experiences | `/admin/experiences` | CRUD, multi-point bullet descriptions, date pickers, org logo upload |
| Skills | `/admin/skills` | CRUD, 10 categories (frontend, mobile, backend, database, devops, deployment, cloud, design, tools, other), icon upload |
| Achievements | `/admin/achievements` | CRUD, date pickers, event organizer tracking |
| Stats | `/admin/stats` | CRUD for stat counters displayed on portfolio |

### Automatic Stat Tracking

- Creating/deleting a skill auto-increments/decrements `technologies_explored`
- Creating/deleting a project auto-increments/decrements `projects_shipped`

### Form Components

| Component | Description |
|---|---|
| `DateField` | shadcn Calendar + Popover date picker, outputs `YYYY-MM-DD` |
| `FileUpload` | Single file upload with deferred upload pattern (pending state until form save) |
| `GalleryUpload` | Multi-image grid upload for case study screenshots, caption editing |
| `TextField`, `TextAreaField`, `SelectField` | Standard form field wrappers |

---

## Database

### Tables

- **profiles** — Singleton record (full_name, current_role, bio_short, bio_long, cv_url, image_url)
- **skills** — Categorized tech stack (name, category, icon_url, sort_order)
- **experiences** — Work/education/organization entries (org_name, role, dates, description text[], type, image_url)
- **projects** — Portfolio projects (title, slug, description, thumbnail, links, featured, sort_order)
- **case_studies** — 1:1 with projects (content_markdown, gallery_jsonb)
- **achievements** — Awards and milestones (title, event, organizer, date, description, url)
- **stats** — Key-value counters (key, value, category, sub_value, icon, sort_order)

### Enums

- `skill_category`: mobile, web, frontend, backend, database, devops, deployment, cloud, design, tools, other
- `exp_type`: work, organization, volunteer, education

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (PostgreSQL + Storage)
- A [Clerk](https://clerk.com) application (login-only mode)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment variables
cp .env.example .env.local
# Fill in: VITE_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
#          DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY

# 3. Push database schema
npm run db:push

# 4. Create Supabase storage buckets (8 buckets)
npm run db:setup-storage

# 5. (Optional) Seed demo data
npm run db:seed

# 6. Start development
npm run dev
```

Visit `http://localhost:3000` — sign in with your Clerk account to access `/admin`.

---

## Scripts

### Development

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (client + Nitro SSR server) |
| `npm run preview` | Preview production build (`node dist/server/index.mjs`) |

### Code Quality

| Command | Description |
|---|---|
| `oxlint .` | Lint all files with Oxc Linter |
| `oxlint --fix .` | Lint and auto-format |
| `npx tsc --noEmit` | TypeScript type checking |

### Database

| Command | Description |
|---|---|
| `npm run db:generate` | Generate Drizzle migration SQL |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:seed` | Seed all tables with demo data |
| `npm run db:setup-storage` | Create Supabase storage buckets |

### Testing

| Command | Description |
|---|---|
| `npm run test` | Run all Vitest tests |
| `npm run test:watch` | Run tests in watch mode |

---

## Environment Variables

All validated at startup by `src/env.ts` using T3Env:

| Variable | Required | Description |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (`pk_test_...` or `pk_live_...`) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (`sk_test_...` or `sk_live_...`) |
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service_role key |
| `VITE_APP_TITLE` | No | Application title |
| `SERVER_URL` | No | Production URL for redirects |

---

## Deployment

```bash
npm run build
# Output: dist/client/ (static assets) + dist/server/ (Nitro Node server)
node dist/server/index.mjs
```

### Post-Deploy

1. Run `npm run db:migrate` for schema changes
2. Replace Clerk test keys with production keys
3. Configure production domain under Clerk Dashboard → Domains
4. Set up social providers (Google, GitHub) under Clerk Dashboard → Social Connections

Compatible with Render, Fly.io, Railway, or any Node.js VPS.

---

## Authentication & Security

- **Clerk login-only mode** — registration disabled at the provider level
- **Client-side:** `<SignedIn>` guards wrap all admin routes
- **Server-side:** Every Server Function calls `auth()` and throws on missing user
- **Validation:** Zod schemas on both client and server — no raw data reaches the database
- **File safety:** MIME type validation, size limits, upload-on-save pattern prevents orphaned files

---

*Built with the King Je Es stack. Mentored by Ryuko and Syahrul (Ariverse). Last updated: 2026-06-13.*
