# Product Requirements Document (PRD): Portfolio Content Management System (CMS)

## 1. Product Overview

The Portfolio CMS Dashboard is a standalone, private administrative application designed to serve as the "Back-Office" for a professional portfolio website. It allows the owner to dynamically manage all professional data—including projects, experiences, and technical skills—without modifying the frontend code of the public portfolio.

This system is built using a modern full-stack web ecosystem curated from the Ariverse mentorship program under mentor Ryuko and Syahrul, emphasizing type safety, developer experience, and runtime performance.

### 1.1. Core Philosophy

- **Type Safety End-to-End:** Every layer from the database (Drizzle ORM) through validation (Zod) to the UI (TanStack Form/Start) uses TypeScript inference to eliminate runtime type mismatches.
- **Separation of Concerns:** Business logic, infrastructure adapters, and UI components are strictly separated using Hexagonal Architecture (Ports and Adapters), ensuring testability and future-proofing.
- **Developer Experience First:** Rust-based tooling (Oxc Linter, Oxc Formatter) replaces legacy JavaScript tooling for near-instant feedback loops. Vite-powered Vitest ensures fast test execution.

### 1.2. Target Audience

- **Primary User:** The portfolio owner (a software engineer, designer, or creative professional) who needs to maintain a professional online presence.
- **Secondary Stakeholders:** Recruiters, hiring managers, and collaborators who view the public portfolio pages.

---

## 2. Objectives

### 2.1. Business Objectives

| Objective | Description | Success Metric |
|---|---|---|
| Centralized Management | Provide a single interface to update roles, CVs, and project details. | Time to update profile content reduced from code-deploy cycle (hours) to real-time (seconds). |
| Project Storytelling | Enable creation of in-depth "Case Study" pages for projects, moving beyond simple summaries to detailed technical narratives. | Each project can contain a rich Markdown case study, a media gallery, and external links. |
| Security & Privacy | Ensure the management interface is strictly private and accessible only to the owner. | Zero unauthorized access incidents; all dashboard routes and server functions are protected. |
| High Performance | Leverage Rust-based tooling and the latest React framework for superior developer experience and application speed. | Lighthouse scores > 90; Oxc lint/format operations complete in < 500ms on the full codebase. |

### 2.2. Technical Objectives

- Implement a full-stack application using TanStack Start with Server Functions and RPC communication pattern.
- Use Drizzle ORM for type-safe database interactions with Supabase PostgreSQL.
- Validate all data with Zod schemas shared between frontend forms and backend write operations.
- Manage global UI state with Zustand, avoiding prop-drilling or context hell.
- Build all UI components using shadcn/ui with Radix primitives.
- Use Oxc Linter and Oxc Formatter exclusively for code quality (no ESLint, no Prettier).
- Write and maintain unit tests with Vitest for core business logic and repository adapters.
- Deploy using the Nitro (agnostic) adapter to a production subdomain (e.g., admin.rhesa.dev).

---

## 3. Authentication & Access Control

### 3.1. Identity Provider

- **Clerk** is used as the Authentication-as-a-Service provider.
- Clerk is configured as **login-only**: the sign-up (registration) flow is disabled in the Clerk dashboard settings to prevent unauthorized user creation.
- The owner signs in using their registered email or configured social providers (Google, GitHub).

### 3.2. Authentication Flow

1. **Unauthenticated Access:** Any request to a dashboard route (`/admin/*`) or a protected Server Function triggers a redirect to the `/auth/sign-in` page.
2. **Sign-In Page:** Renders Clerk's prebuilt `<SignIn />` component with a branded, minimal UI.
3. **Post-Authentication:** After successful sign-in, the user is redirected to the dashboard home (`/admin/dashboard`).
4. **Session Management:** Clerk manages session tokens, automatic token refresh, and multi-session handling out of the box.

### 3.3. Route Protection Strategy

- **Client-Side Protection:** Use `<SignedIn>` / `<SignedOut>` wrappers from `@clerk/clerk-react` at the layout level. All admin routes are children of a `<SignedIn>` guard layout route.
- **Server-Side Protection:** Every TanStack Start Server Function that reads or writes sensitive data calls `auth()` from Clerk's backend SDK at the top of its handler. If `userId` is null, the function throws a redirect or returns a 401 error.
- **API Route Protection:** Any classic API route handlers (if used) also validate the session token via Clerk's `verifyToken()` or by reading the `Auth` header.

### 3.4. Data Privacy Considerations

- The database contains no Personally Identifiable Information (PII) beyond what the owner chooses to add to their own profile.
- No public registration means no user accounts, no user data storage, and no GDPR compliance overhead for user data.
- Supabase Row-Level Security (RLS) policies can be added as an additional layer, but the primary access control gate is Clerk authentication.

---

## 4. System Architecture

### 4.1. High-Level Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────┐ │
│  │ TanStack │  │ shadcn/ui │  │  Zustand │  │ TanStack  │ │
│  │  Router  │  │  (Radix)  │  │  (State) │  │   Form    │ │
│  └────┬─────┘  └───────────┘  └──────────┘  └─────┬─────┘ │
│       │                                            │       │
│       └──────────────┬─────────────────────────────┘       │
│                      │ RPC Call (createServerFn)             │
└──────────────────────┼─────────────────────────────────────┘
                       │
┌──────────────────────┼─────────────────────────────────────┐
│         TanStack Start Server (Nitro Adapter)               │
│  ┌───────────────────┴──────────────────────────────────┐  │
│  │              Server Functions Layer                    │  │
│  │   (src/apis/ - RPC-style, type-safe endpoints)        │  │
│  └───────────────────┬──────────────────────────────────┘  │
│                      │                                      │
│  ┌───────────────────┴──────────────────────────────────┐  │
│  │            Domain Layer (src/domain/)                  │  │
│  │   · Zod Schemas & Type Inference                     │  │
│  │   · Business Logic (Ports / Interfaces)              │  │
│  │   · Use Cases (CreateProject, UpdateSkill, etc.)     │  │
│  └───────────────────┬──────────────────────────────────┘  │
│                      │                                      │
│  ┌───────────────────┴──────────────────────────────────┐  │
│  │        Infrastructure Layer (src/infrastructure/)      │  │
│  │   · Drizzle ORM Adapter (Supabase PostgreSQL)         │  │
│  │   · Clerk Auth Adapter                                │  │
│  │   · Supabase Storage Adapter (CV uploads, images)     │  │
│  └───────────────────┬──────────────────────────────────┘  │
│                      │                                      │
└──────────────────────┼─────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │   Supabase      │
              │  (PostgreSQL +  │
              │   Storage)      │
              └─────────────────┘
```

### 4.2. Hexagonal Architecture (Ports and Adapters)

The application follows the Hexagonal Architecture pattern to keep business logic decoupled from external frameworks and infrastructure:

| Layer | Directory | Responsibility | Dependencies |
|---|---|---|---|
| **Domain** | `src/domain/` | Entity definitions, Zod validation schemas, business logic interfaces (Ports), use-case implementations. | Zod only |
| **Application (APIs)** | `src/apis/` | TanStack Start Server Functions. Orchestrates use cases, handles request context, returns typed responses. | Domain, Infrastructure |
| **Infrastructure** | `src/infrastructure/` | Concrete adapters implementing Ports. Database repositories (Drizzle), auth adapters (Clerk), file storage adapters (Supabase). | Drizzle ORM, Clerk SDK, Supabase SDK |
| **UI / Presentation** | `src/routes/`, `src/components/` | React components using shadcn/ui, TanStack Router, Zustand stores. Calls Server Functions via RPC. | All layers above |

### 4.3. Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **RPC over REST** | TanStack Start Server Functions use an RPC pattern. This eliminates manual URL construction, serialization boilerplate, and provides automatic type inference between server and client. |
| **Shared Validation Schemas** | Zod schemas defined in `src/domain/` are used by both TanStack Form (client) and Server Functions (server), ensuring zero duplication and guaranteed type alignment. |
| **Zustand over Context/Redux** | Zustand is lightweight (~1KB), requires no provider wrapping, works outside React components, and is the simplest way to manage global UI state (sidebar open/close, active filters, etc.). |
| **Supabase for Storage** | Supabase Storage provides a simple S3-compatible API for file uploads (CV PDFs, project images) with integrated authentication and RLS policies. |
| **Nitro Adapter for Deployment** | The Nitro adapter makes the build output framework-agnostic, allowing deployment on any Node-compatible host (Render, Fly.io, Railway, VPS) without vendor lock-in. |

---

## 5. Functional Requirements

### 5.1. Profile & Asset Management Module

#### FR-101: Identity Update

- **Description:** The owner can update their full name and dynamic professional titles.
- **Fields:**
  - `full_name` (string, required) — The owner's full display name.
  - `current_role` (string, required) — A short professional title (e.g., "Mobile Developer", "Full-Stack Engineer").
  - The profile is a singleton record: only one profile exists per system instance.
- **UI:** A form on the `/admin/profile` page with pre-populated values. Save triggers an RPC mutation.

#### FR-102: About Me Section

- **Description:** The owner can edit both short-form and long-form biographical content.
- **Fields:**
  - `bio_short` (string, max 280 chars) — A concise bio for profile cards, social previews, and hero sections.
  - `bio_long` (text, optional) — A detailed "About Me" narrative for a dedicated about page, supporting Markdown formatting.
- **UI:** Short bio uses a textarea with a character counter. Long bio uses a larger textarea or a lightweight Markdown editor with preview.

#### FR-103: CV Hosting

- **Description:** The owner can upload, replace, and delete their professional CV as a PDF file.
- **Storage:** Files are stored in Supabase Storage under the `cvs/` bucket.
- **Fields:**
  - `cv_url` (string, generated) — The public URL of the uploaded CV, stored in the profile record.
- **Constraints:**
  - Accepted format: `application/pdf` only.
  - Maximum file size: 10 MB.
  - Only one CV is active at a time; uploading a new version replaces the previous file.
- **UI:** File upload input with drag-and-drop. Progress indicator during upload. Link preview after upload.

### 5.2. Content CRUD Modules

#### FR-201: Tech Stack Manager

- **Description:** Manage a categorized list of technical skills (programming languages, frameworks, tools).
- **Fields:**
  - `id` (uuid, auto-generated)
  - `name` (string, required) — Skill name (e.g., "Kotlin", "React.js", "Docker").
  - `category` (enum, required) — One of: `mobile`, `web`, `backend`, `devops`, `design`, `other`.
  - `icon_url` (string, optional) — URL to an icon representing the skill (SVG or small PNG).
  - `sort_order` (integer, optional) — Display ordering within a category.
- **Operations:** Create, Read, Update, Delete (CRUD).
- **UI:** A table/card view grouped by category. Inline editing or modal form. Drag-to-reorder support.

#### FR-202: Professional Journey Manager

- **Description:** Manage entries for work experience, organizational roles, and volunteer positions.
- **Fields:**
  - `id` (uuid, auto-generated)
  - `org_name` (string, required) — Organization or company name.
  - `role` (string, required) — Job title or role held.
  - `start_date` (date, required)
  - `end_date` (date, optional, null for current positions)
  - `description` (text, optional) — Bullet-point descriptions or a paragraph summary.
  - `type` (enum, required) — One of: `work`, `organization`, `volunteer`, `education`.
  - `sort_order` (integer, optional) — Display ordering (e.g., most recent first).
- **Operations:** CRUD.
- **UI:** Timeline-style list. Each entry expandable to show full description. Form with date pickers and type selector.

#### FR-203: Achievements Tracker

- **Description:** Document awards, certifications, competition wins, and milestones.
- **Fields:**
  - `id` (uuid, auto-generated)
  - `title` (string, required) — Achievement title (e.g., "1st Place at SLASHCOM 2025").
  - `event_name` (string, optional) — The event or competition name.
  - `organizer` (string, optional) — Organizing body or institution.
  - `date` (date, required) — Date of achievement.
  - `description` (text, optional) — Additional context or details.
  - `url` (string, optional) — Link to certification, news article, or proof.
- **Operations:** CRUD.
- **UI:** Card grid with medal/badge visuals. Filterable by year.

### 5.3. Advanced Project Case-Study Builder

The Case-Study Builder is the core feature, enabling rich, blog-style technical narratives for each portfolio project.

#### FR-301: Project Meta-data CRUD

- **Description:** Manage high-level project information.
- **Fields:**
  - `id` (uuid, auto-generated)
  - `title` (string, required) — Project display name.
  - `slug` (string, required, unique) — URL-friendly identifier (e.g., `my-awesome-project`).
  - `description_short` (string, max 300 chars) — A brief tagline for project cards.
  - `thumbnail_url` (string, optional) — URL to a preview image.
  - `is_featured` (boolean, default false) — Whether to highlight this project on the portfolio homepage.
  - `category` (enum, optional) — Project category (e.g., `mobile`, `web`, `machine-learning`).
  - `sort_order` (integer, optional) — Display ordering.
- **Operations:** CRUD.
- **UI:** Form with slug auto-generation from title (editable). Thumbnail upload with crop preview.

#### FR-302: Rich Case Studies

- **Description:** A dedicated editor for writing detailed technical explanations for each project.
- **Fields:**
  - `id` (uuid, auto-generated)
  - `project_id` (uuid, foreign key to `projects`) — One-to-one relationship with projects.
  - `content_markdown` (text, required) — The full case study body in Markdown format.
- **UI:**
  - Split-pane Markdown editor: left side is the editor (textarea or CodeMirror), right side is a live rendered preview.
  - Optional: Support for a rich text (WYSIWYG) mode as an alternative to raw Markdown, with the content stored as Markdown internally.
  - Toolbar for common Markdown actions (headings, bold, italic, lists, code blocks, images, links).

#### FR-303: Media Gallery

- **Description:** Multi-image upload support for project screenshots, architecture diagrams, and demo visuals.
- **Storage:** Images stored in Supabase Storage under the `project-media/` bucket.
- **Fields (stored in case_studies.gallery_jsonb):**
  - `gallery_jsonb` (jsonb, default `[]`) — Array of objects: `{ url: string, caption: string, width: number, height: number }`.
- **Constraints:**
  - Accepted formats: JPEG, PNG, WebP, GIF.
  - Maximum file size per image: 5 MB.
  - Maximum images per gallery: 20.
- **UI:** Grid gallery with upload button. Drag-and-drop reordering. Caption editing on each image. Delete with confirmation.

#### FR-304: Call to Action

- **Description:** External links for each project.
- **Fields (part of projects table or a separate links table):**
  - `github_url` (string, optional) — Repository link.
  - `live_url` (string, optional) — Deployed/demo link.
  - `additional_links` (jsonb, optional) — Array of `{ label: string, url: string }` for extra links (e.g., blog post, case study video).
- **UI:** Input fields for GitHub and Live demo. Dynamic list for additional links with add/remove functionality.

### 5.4. Dashboard & Navigation Module

#### FR-401: Admin Dashboard Home

- **Description:** A landing page after login showing key metrics and shortcuts.
- **Features:**
  - Quick stats: total projects, total skills, total experience entries.
  - Recent activity feed (last 5 edited items).
  - Quick-action buttons: "Add Project", "Update Profile", "Upload CV".
  - System status indicators (database connected, storage available).

#### FR-402: Sidebar Navigation

- **Description:** Persistent sidebar with links to all management modules.
- **Sections:**
  - **Overview:** Dashboard Home.
  - **Profile:** Profile & CV.
  - **Content:** Projects, Experiences, Skills, Achievements.
  - **Settings:** Account settings, API keys (future).
- **Behavior:** Collapsible to icon-only mode on smaller screens. Active route highlighted.

---

## 6. Detailed Data Schema

### 6.1. Entity Relationship Diagram (Textual)

```
 profiles (singleton)
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ full_name (text, not null)             │
 │ current_role (text, not null)          │
 │ bio_short (varchar(280))               │
 │ bio_long (text)                        │
 │ cv_url (text)                          │
 │ image_url (text, nullable)             │
 │ created_at (timestamp, default now())  │
 │ updated_at (timestamp, default now())  │
 └────────────────────────────────────────┘

 skills
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ name (text, not null)                  │
 │ category (skill_category, not null)    │
 │ icon_url (text)                        │
 │ sort_order (integer)                   │
 │ created_at (timestamp, default now())  │
 └────────────────────────────────────────┘

 experiences
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ org_name (text, not null)              │
 │ role (text, not null)                  │
 │ start_date (date, not null)            │
 │ end_date (date, nullable)              │
 │ description (text[], nullable)         │
 │ type (exp_type, not null)              │
 │ image_url (text, nullable)             │
 │ sort_order (integer)                   │
 │ created_at (timestamp, default now())  │
 └────────────────────────────────────────┘

 projects
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ title (text, not null)                 │
 │ slug (text, not null, unique)          │
 │ description_short (varchar(300))       │
 │ thumbnail_url (text)                   │
 │ is_featured (boolean, default false)   │
 │ category (text)                        │
 │ github_url (text)                      │
 │ live_url (text)                        │
 │ additional_links (jsonb)               │
 │ sort_order (integer)                   │
 │ created_at (timestamp, default now())  │
 │ updated_at (timestamp, default now())  │
 └──────────────┬─────────────────────────┘
                │ 1:1
                │
 case_studies   │
 ┌──────────────┴─────────────────────────┐
 │ id (uuid, PK)                          │
 │ project_id (uuid, FK -> projects.id)   │
 │ content_markdown (text, not null)       │
 │ gallery_jsonb (jsonb, default '[]')    │
 │ created_at (timestamp, default now())  │
 │ updated_at (timestamp, default now())  │
 └────────────────────────────────────────┘

 achievements
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ title (text, not null)                 │
 │ event_name (text)                      │
 │ organizer (text)                       │
 │ date (date, not null)                  │
 │ description (text)                     │
 │ url (text)                             │
 │ created_at (timestamp, default now())  │
 └────────────────────────────────────────┘

 stats
 ┌────────────────────────────────────────┐
 │ id (uuid, PK)                          │
 │ key (text, not null, unique)           │
 │ value (text, not null)                 │
 │ category (text)                        │
 │ sub_value (text, nullable)             │
 │ icon (text)                            │
 │ sort_order (integer)                   │
 └────────────────────────────────────────┘
```

### 6.2. PostgreSQL Enums

The following custom enum types are used in the database schema:

| Enum Name | Values | Used By |
|---|---|---|
| `skill_category` | `'mobile'`, `'web'`, `'backend'`, `'devops'`, `'design'`, `'other'`, `'frontend'`, `'database'`, `'deployment'`, `'cloud'`, `'tools'` | `skills.category` |
| `exp_type` | `'work'`, `'organization'`, `'volunteer'`, `'education'` | `experiences.type` |

### 6.3. Indexing Strategy

| Table | Index | Type | Rationale |
|---|---|---|---|
| `projects` | `idx_projects_slug` | UNIQUE B-tree | Fast slug lookups for public portfolio routing. |
| `projects` | `idx_projects_is_featured` | B-tree | Filter featured projects for homepage. |
| `projects` | `idx_projects_sort_order` | B-tree | Ordered listing of projects. |
| `skills` | `idx_skills_category` | B-tree | Filter skills by category. |
| `experiences` | `idx_experiences_type` | B-tree | Filter by experience type. |
| `experiences` | `idx_experiences_start_date` | B-tree | Sort by date (timeline). |
| `achievements` | `idx_achievements_date` | B-tree | Sort by achievement date. |

### 6.4. Zod Validation Schemas (Domain Layer)

Each database entity has a corresponding Zod schema defined in `src/domain/schemas/`. These schemas serve dual purposes:

1. **Server-side validation:** Used inside Server Functions to validate incoming mutation payloads before writing to the database.
2. **Client-side validation:** Used by TanStack Form to validate form inputs in real-time.

Example schema structure:

```typescript
// src/domain/schemas/project.ts
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  descriptionShort: z.string().max(300).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  category: z.enum(["mobile", "web", "backend", "machine-learning", "other"]).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;
```

---

## 7. Non-Functional Requirements

### 7.1. Performance

| Requirement | Target | Measurement |
|---|---|---|
| Page Load (Dashboard) | < 2s Time to Interactive (TTI) | Lighthouse, Web Vitals |
| Server Function Response | < 200ms (cold), < 50ms (hot) | Server-side logging |
| Lint/Format Speed | < 1s for full codebase | `oxlint --time` |
| Test Suite Execution | < 30s for all unit tests | `vitest run --reporter=default` |
| Bundle Size (JS) | < 200kB initial load | Vite bundle analysis |

### 7.2. Security

| Requirement | Implementation |
|---|---|
| Authentication | Clerk with login-only mode. No public registration. |
| Authorization | Server-side `auth()` check in every Server Function. Client-side route guards with `<SignedIn>`. |
| Data Validation | Zod schemas validated on both client and server. |
| File Upload Safety | File type validation (MIME check), size limits, virus scanning (future). |
| XSS Protection | React's built-in escaping. Markdown rendered via a sanitized library. |
| CSRF Protection | TanStack Start Server Functions use POST by default with SameSite cookies. |
| Rate Limiting | Applied on mutation endpoints to prevent abuse (future). |

### 7.3. Availability & Reliability

| Requirement | Target |
|---|---|
| Uptime | > 99.9% (backed by Supabase SLA and hosting provider) |
| Backup | Daily automated PostgreSQL backups via Supabase. |
| Error Handling | All Server Functions have try/catch with structured error responses. Global React Error Boundary. |

### 7.4. Scalability

- The system is designed for a single user (the portfolio owner), so horizontal scaling is not a primary concern.
- The Hexagonal Architecture ensures that if the data volume grows (e.g., hundreds of projects), the database layer can be optimized (pagination, indexing) without touching business logic.

---

## 8. UI/UX Requirements

### 8.1. Design System

- **Base Framework:** shadcn/ui components built on Radix UI primitives.
- **Styling:** Tailwind CSS v4 with CSS variables for theming.
- **Theme Support:** Light and dark mode with system preference detection. Theme toggle in the header.
- **Typography:** System font stack with optional custom fonts (via Tailwind theme configuration).
- **Icons:** lucide-react icon set.

### 8.2. Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header                                                  │
│  [Logo] [Dashboard] [Profile] [Content ▼]  [Theme] [👤] │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │  Main Content Area                            │
│          │                                               │
│  📊 Dash │  ┌─────────────────────────────────────────┐ │
│  👤 Prof │  │  Page Title / Breadcrumb                │ │
│  📁 Proj │  ├─────────────────────────────────────────┤ │
│  💼 Exp  │  │  Content / Forms / Tables / Cards       │ │
│  🛠 Skills│  │                                         │ │
│  🏆 Achiev│  │                                         │ │
│  ⚙️ Setng │  │                                         │ │
│          │  └─────────────────────────────────────────┘ │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│  Footer (minimal, copyright)                             │
└─────────────────────────────────────────────────────────┘
```

### 8.3. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|---|---|---|
| Desktop | > 1024px | Full sidebar + content. |
| Tablet | 768px - 1024px | Collapsible sidebar (icon mode). |
| Mobile | < 768px | Bottom navigation bar or hamburger menu. Full-width content. |

### 8.4. Accessibility

- All shadcn/ui components are built on Radix UI, which provides WAI-ARIA compliant primitives by default.
- Keyboard navigation support for all forms and data tables.
- Focus visible indicators for all interactive elements.
- Color contrast meets WCAG AA standards in both light and dark themes.

---

## 9. Technical Strategy & Tooling

### 9.1. Developer Workflow

| Stage | Tool | Command |
|---|---|---|
| Development Server | Vite (TanStack Start) | `npm run dev` |
| Linting | Oxc Linter | `oxlint .` |
| Formatting | Oxc Formatter | `oxlint --fix .` |
| Type Checking | TypeScript (via Vite) | `npx tsc --noEmit` |
| Database Migrations | Drizzle Kit | `npm run db:generate && npm run db:migrate` |
| Testing | Vitest | `npm run test` |
| Build | Vite (Nitro adapter) | `npm run build` |
| Preview | Node (Nitro server) | `npm run preview` |

### 9.2. Environment Variables (T3Env)

All environment variables are validated at startup using `@t3-oss/env-core` with Zod schemas:

| Variable | Type | Description |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `string` | Clerk frontend API key. |
| `CLERK_SECRET_KEY` | `string` | Clerk backend secret key. |
| `DATABASE_URL` | `string` | Supabase PostgreSQL connection string. |
| `SUPABASE_URL` | `string` | Supabase project URL (for storage). |
| `SUPABASE_SERVICE_KEY` | `string` | Supabase service role key (for storage admin). |
| `VITE_APP_TITLE` | `string` (optional) | Application title. |
| `SERVER_URL` | `string` (optional) | Production server URL for redirects. |

### 9.3. Deployment Pipeline

1. **Build:** `npm run build` produces a Nitro-compatible server in `dist/`.
2. **Deploy:** The `dist/` directory is deployed to the hosting provider (Render, Fly.io, VPS).
3. **Database Migrations:** Run `npm run db:migrate` as a post-deploy step to apply any pending schema changes.
4. **Domain:** The CMS is served on a subdomain (e.g., `admin.rhesa.dev`) with SSL termination at the host level.

---

## 10. Out of Scope (Future Considerations)

| Feature | Rationale |
|---|---|
| Multi-user / Team Collaboration | The system is designed for single-owner use. Multi-user support would require roles, permissions, and audit logging. |
| Public-Facing Portfolio Theme | The CMS manages data only. The public portfolio is a separate frontend that consumes this data via API/Database. |
| AI-Assisted Content Generation | Could be added later using the Hexagonal Architecture without restructuring existing code. |
| Analytics Dashboard | Page view tracking and engagement metrics would require integration with a third-party analytics service. |
| CMS Plugin System | A plugin system is over-engineered for a single-owner use case. |
| Content Versioning / History | Could be added with Drizzle ORM's support for Soft Delete patterns or a dedicated history table. |
| Internationalization (i18n) | The portfolio is assumed to be in a single language (English/Indonesian). i18n can be added if needed. |

---

## 11. Glossary

| Term | Definition |
|---|---|
| **CMS** | Content Management System. |
| **CRUD** | Create, Read, Update, Delete — the four basic operations for persistent storage. |
| **Enum** | A data type consisting of a set of named values. |
| **Hexagonal Architecture** | A software design pattern that isolates business logic from external concerns using ports (interfaces) and adapters (implementations). |
| **ORM** | Object-Relational Mapping — a technique for converting data between type systems in object-oriented languages and relational databases. |
| **Ports and Adapters** | The core concept of Hexagonal Architecture. Ports are interfaces defining contracts; Adapters are concrete implementations for specific technologies. |
| **RPC** | Remote Procedure Call — a pattern where a client calls a function on a server as if it were a local function call. |
| **Server Function** | A TanStack Start concept: a function decorated with `createServerFn` that runs on the server but can be imported and called from client code. |
| **Shadcn/ui** | A collection of design system components distributed as copy-paste source code, built on Radix UI primitives. |
| **T3Env** | A Type-safe environment variable validation library using Zod schemas. |
| **Type Safety** | The property of a programming language or framework that guarantees type consistency across different system layers at compile time. |

---

## 12. Appendix: File Structure Map

Based on the Hexagonal Architecture, the recommended project file structure is:

```
src/
├── apis/                          # TanStack Start Server Functions (RPC layer)
│   ├── profile.ts                 #   Profile CRUD server functions
│   ├── projects.ts                #   Project CRUD server functions
│   ├── experiences.ts             #   Experience CRUD server functions
│   ├── skills.ts                  #   Skill CRUD server functions
│   ├── achievements.ts            #   Achievement CRUD server functions
│   └── storage.ts                 #   File upload server functions
│
├── components/                    # React UI components
│   ├── ui/                        #   shadcn/ui primitives (auto-generated)
│   ├── layout/                    #   Layout components (Sidebar, Header, Footer)
│   ├── forms/                     #   Reusable form components
│   ├── tables/                    #   Data table components
│   └── shared/                    #   Shared UI elements (cards, badges, modals)
│
├── domain/                        # Business logic (Pure TypeScript / Zod)
│   ├── schemas/                   #   Zod validation schemas
│   ├── ports/                     #   Interface definitions (Ports)
│   └── use-cases/                 #   Business logic implementations
│
├── infrastructure/                # External framework adapters
│   ├── db/                        #   Drizzle ORM adapter
│   ├── auth/                      #   Clerk authentication adapter
│   └── storage/                   #   Supabase Storage adapter
│
├── integrations/                  # Framework provider wrappers
│   ├── clerk/                     #   Clerk React integration
│   └── tanstack-query/            #   TanStack Query setup
│
├── routes/                        # TanStack Router file-based routes
│   ├── __root.tsx                 #   Root layout shell
│   ├── index.tsx                  #   Landing / redirect
│   ├── auth/                      #   Authentication routes
│   │   ├── sign-in.tsx            #     Sign-in page
│   │   └── sign-out.tsx           #     Sign-out page (optional)
│   └── admin/                     #   Protected admin dashboard routes
│       ├── route.tsx              #     Admin layout (auth guard)
│       ├── dashboard.tsx          #     Dashboard home
│       ├── profile.tsx            #     Profile editor
│       ├── projects.tsx           #     Projects list
│       ├── projects.$slug.tsx     #     Single project editor
│       ├── experiences.tsx        #     Experience manager
│       ├── skills.tsx             #     Skill manager
│       └── achievements.tsx       #     Achievement manager
│
├── stores/                        # Zustand state stores
│   ├── sidebar.ts                 #   Sidebar state
│   └── ui.ts                      #   General UI state
│
├── lib/                           # Utility functions
│   └── utils.ts                   #   cn() helper
│
├── hooks/                         # Custom React hooks
├── env.ts                         # T3Env validation
├── router.tsx                     # Router configuration
└── styles.css                     # Global styles & Tailwind theme
```

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-09*
*Author: Portfolio Management System Team*
