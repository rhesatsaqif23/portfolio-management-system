# Core Skills & Instructions for AI Agents

This document defines the granular skills (system prompt instructions) assigned to each AI agent in the Portfolio Management System. Skills are the atomic building blocks of agent behavior — each skill encapsulates a specific technical constraint, workflow pattern, or coding rule derived from the project's tech stack and mentorship guidelines.

---

## Table of Contents

1. [Skill: Hexagonal Separation & Port Definition](#1-skill-hexagonal-separation--port-definition)
2. [Skill: TanStack RPC & Server Functions](#2-skill-tanstack-rpc--server-functions)
3. [Skill: Drizzle-Zod Type Synchronization](#3-skill-drizzle-zod-type-synchronization)
4. [Skill: Oxc-Compliant Coding](#4-skill-oxc-compliant-coding)
5. [Skill: Zustand State Management](#5-skill-zustand-state-management)
6. [Skill: shadcn/ui Component Design](#6-skill-shadcnui-component-design)
7. [Skill: TanStack Form Integration](#7-skill-tanstack-form-integration)
8. [Skill: Authentication & Authorization](#8-skill-authentication--authorization)
9. [Skill: File & Storage Management](#9-skill-file--storage-management)
10. [Skill: Testing with Vitest](#10-skill-testing-with-vitest)
11. [Skill: Migration & Schema Workflow](#11-skill-migration--schema-workflow)
12. [Skill: T3Env & Environment Validation](#12-skill-t3env--environment-validation)

---

## 1. Skill: Hexagonal Separation & Port Definition

**Assigned To:** The Architect (Governor)

### 1.1. Core Instruction

Never allow business logic (services/use cases) to depend on external contexts (e.g., Clerk auth objects or TanStack request contexts). All external communication must go through Port interfaces defined in the domain layer.

### 1.2. Implementation Rules

1. **Define Ports as TypeScript Interfaces.** Ports are placed in `src/domain/ports/` and define the contract that any external adapter must fulfill.

```typescript
// src/domain/ports/IProfileRepository.ts
export interface IProfileRepository {
  getProfile(): Promise<ProfileDTO>;
  updateProfile(data: ProfileUpdateDTO): Promise<ProfileDTO>;
  uploadCV(file: FileUploadDTO): Promise<string>;
}
```

2. **Implement Adapters in Infrastructure.** Concrete implementations of Ports live in `src/infrastructure/` and depend on framework-specific libraries (Drizzle ORM, Clerk SDK, Supabase SDK).

```typescript
// src/infrastructure/db/repositories/drizzleProfileRepository.ts
import { db } from "#/db";
import { profilesTable } from "#/db/schema";
import { IProfileRepository } from "#/domain/ports/IProfileRepository";

export const drizzleProfileRepository: IProfileRepository = {
  async getProfile() {
    const [profile] = await db.select().from(profilesTable).limit(1);
    return profile;
  },
  async updateProfile(data) {
    const [updated] = await db.update(profilesTable)
      .set(data)
      .returning();
    return updated;
  },
  async uploadCV(file) {
    // Supabase Storage logic
    return "https://...";
  },
};
```

3. **Use Dependency Injection.** Server Functions receive Port instances (or import concrete adapters that implement Ports). The domain use case never imports infrastructure directly.

4. **Domain Layer Purity.** The `src/domain/` directory contains ONLY:
   - Zod schemas (no framework imports)
   - TypeScript interfaces (no class implementations)
   - Pure functions (no side effects, no I/O)
   - Zero React imports, zero Drizzle imports, zero Clerk imports.

### 1.3. Accepted Patterns

- `import { IProfileRepository } from "#/domain/ports/...";`
- `import { z } from "zod";` in domain schemas.
- Calling `repository.getProfile()` inside a use case.

### 1.4. Rejected Patterns

- `import { db } from "#/db";` inside a domain use case.
- `import { useUser } from "@clerk/clerk-react";` inside domain logic.
- Passing `Request` or `Response` objects from HTTP into domain functions.
- Using `auth()` from Clerk inside domain functions.

### 1.5. Verification Checklist

- [ ] Does the domain layer import anything from infrastructure?
- [ ] Are all external dependencies injected via interfaces?
- [ ] Can the use case be unit-tested without a database connection?
- [ ] Would the same business logic work if the database changed from PostgreSQL to SQLite?

---

## 2. Skill: TanStack RPC & Server Functions

**Assigned To:** The Full-Stack Specialist

### 2.1. Core Instruction

Use TanStack Start Server Functions for all data mutations and queries. Do not manually write `"use server"` directives or create `/api/` directories. Call functions directly in the client using the RPC pattern provided by TanStack Start.

### 2.2. Implementation Rules

1. **Define Server Functions in `src/apis/`.** Each module file exports named server functions based on the entity (e.g., `src/apis/projects.ts`, `src/apis/profile.ts`).

2. **Use `createServerFn` Correctly.**
   - Always specify `method: 'GET'` for queries and `method: 'POST'` for mutations.
   - Use the `.validator()` method with a Zod schema for input validation.
   - Call `auth()` from Clerk at the top of every protected handler.

```typescript
// src/apis/projects.ts
import { createServerFn } from "@tanstack/react-start";
import { projectSchema } from "#/domain/schemas/project";
import { drizzleProjectRepository } from "#/infrastructure/db/repositories/projectRepository";
import { listProjectsUseCase } from "#/domain/use-cases/listProjects";
import { createProjectUseCase } from "#/domain/use-cases/createProject";

export const listProjects = createServerFn({
  method: "GET",
}).handler(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return listProjectsUseCase(drizzleProjectRepository);
});

export const createProject = createServerFn({
  method: "POST",
})
  .validator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return createProjectUseCase(drizzleProjectRepository, data);
  });
```

3. **Call Server Functions from Client Components.**

```typescript
// src/routes/admin/projects.tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { listProjects, createProject } from "#/apis/projects";

function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createProject({ data }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Component JSX...
}
```

4. **Error Handling Pattern.**
   - Server Functions should throw structured errors or return `{ success: false, error: "message" }`.
   - Client mutations should wrap calls in try/catch and show user-facing toasts on failure.

### 2.3. Accepted Patterns

- `createServerFn({ method: 'GET' })` for read operations.
- `createServerFn({ method: 'POST' })` for write operations.
- `.validator(zodSchema)` for input parsing.
- `auth()` check as first line in handler.

### 2.4. Rejected Patterns

- `"use server"` directive at file top.
- Creating files in `src/routes/api/` for internal RPC.
- Using `fetch()` or `axios` to call internal server functions.
- Using REST-style HTTP methods/URLs for internal communication.
- Skipping auth checks inside Server Functions.

---

## 3. Skill: Drizzle-Zod Type Synchronization

**Assigned To:** The Data Steward (Drizzle/Zod), The Full-Stack Specialist

### 3.1. Core Instruction

Maintain absolute type safety between the database and the frontend. Database schemas defined with Drizzle ORM must have corresponding Zod validation schemas that infer types for frontend forms and Server Function inputs.

### 3.2. Implementation Rules

1. **Define Drizzle Schema First.** The database schema in `src/db/schema.ts` is the single source of truth for column types, constraints, and relationships.

2. **Create Zod Schemas from Drizzle Types.** Zod schemas in `src/domain/schemas/` should match the Drizzle column types but can be stricter (e.g., adding string length limits, regex patterns, custom error messages).

3. **Use `z.infer<>` for Type Inference.** Derive frontend types from Zod, avoiding manual type definitions that can drift from the database.

```typescript
// src/db/schema.ts (Drizzle)
export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  descriptionShort: text("description_short", { length: 300 }),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// src/domain/schemas/project.ts (Zod)
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/),
  descriptionShort: z.string().max(300).optional(),
  isFeatured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;
```

4. **Synchronization Check.** When a Drizzle schema column changes, the corresponding Zod schema must be updated in the same commit. The Data Steward agent must flag any PR where Zod schemas and Drizzle schemas are out of sync.

### 3.3. Accepted Patterns

- `z.infer<typeof projectSchema>` for type inference.
- Mapping Drizzle column types to Zod types (text → string, integer → number, uuid → string, jsonb → z.object() or z.array()).
- Using Zod's `.refine()` for cross-field validation.

### 3.4. Rejected Patterns

- Manually defining TypeScript types for form inputs that duplicate Zod-inferred types.
- Using `z.any()` or `z.unknown()` for database-backed schemas.
- Skipping Zod validation on mutation Server Functions.

---

## 4. Skill: Oxc-Compliant Coding

**Assigned To:** The Performance Enforcer (Oxc/Vitest)

### 4.1. Core Instruction

Write code that is optimized for Oxc Linter and Formatter. Avoid patterns that trigger traditional ESLint overhead. Focus on clean, Rust-optimized JavaScript/TypeScript patterns that align with Oxc's high-performance rules.

### 4.2. Coding Style Rules

| # | Rule | Correct | Incorrect |
|---|---|---|---|
| 1 | **Imports** | `import { z } from "zod"` | `import * as z from "zod"` |
| 2 | **Functions** | `const fn = () => { }` | `function fn() {}` for callbacks |
| 3 | **Types** | `type User = { name: string }` | `interface User { name: string }` |
| 4 | **Nullish** | `value ?? defaultValue` | `value \|\| defaultValue` (when `??` applies) |
| 5 | **Optional Chaining** | `obj?.prop?.nested` | `obj && obj.prop && obj.prop.nested` |
| 6 | **Async** | `async/await` | `.then().catch()` chains |
| 7 | **Strings** | `` `Hello ${name}` `` | `"Hello " + name` |
| 8 | **Const** | `const x = ...` | `let x = ...` (unless reassigned) |
| 9 | **Destructuring** | `const { name } = obj` | `const name = obj.name` |
| 10 | **Default Parameters** | `fn(x = 1) {}` | `fn(x) { x = x \|\| 1 }` |
| 11 | **Array Spread** | `[...arr, item]` | `arr.concat([item])` |
| 12 | **Object Spread** | `{ ...obj, key: val }` | `Object.assign({}, obj, { key: val })` |
| 13 | **Arrow Parens** | `(x) => x` | `x => x` (always parenthesize) |
| 14 | **Semicolons** | Always use semicolons | Omitting semicolons |
| 15 | **Trailing Commas** | Always use trailing commas | Omitting trailing commas |

### 4.3. Prohibited Configurations

- **No ESLint files:** `.eslintrc*`, `eslint.config.*`, `.eslintignore` must not exist.
- **No Prettier files:** `.prettierrc*`, `prettier.config.*`, `.prettierignore` must not exist.
- **No Jest files:** `jest.config.*` must not exist.
- **No Webpack files:** `webpack.config.*` must not exist.

### 4.4. Performance Auditing Rules

1. **Bundle Size:** Flag imports that pull in entire libraries when only a subset is needed.
   - Correct: `import { z } from "zod"`
   - Incorrect: `import { z } from "zod/lib/types"` or importing from barrel files that re-export everything.

2. **Re-renders:** Flag missing React key props in lists and mutations inside `useEffect` that could be derived from state.

3. **Tree Shaking:** Ensure all library imports use named exports that can be tree-shaken by Vite.

4. **Lazy Loading:** Flag route-level imports that should be lazy-loaded but aren't. Use TanStack Router's built-in code splitting with `route.lazy()`.

### 4.5. Verification Commands

```bash
# Lint the entire project
oxlint .

# Lint with auto-fix (formatting)
oxlint --fix .

# Check for any ESLint/Prettier artifacts
Get-ChildItem -Path . -Filter ".eslintrc*" -Recurse
Get-ChildItem -Path . -Filter ".prettierrc*" -Recurse
```

---

## 5. Skill: Zustand State Management

**Assigned To:** The Full-Stack Specialist, The UI Artisan

### 5.1. Core Instruction

Always prefer Zustand for lightweight global UI state over complex alternatives (Redux, React Context for state). Zustand stores are used for UI-level state such as sidebar visibility, active filters, theme preference, and modal states.

### 5.2. Implementation Rules

1. **Define Stores in `src/stores/`.** Each store file exports a single hook.

```typescript
// src/stores/sidebar.ts
import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));
```

2. **Server State is NOT Stored in Zustand.** Server state (projects, skills, experiences) is managed by TanStack Query. Zustand is for UI-only state.

3. **Store Granularity.** Create separate small stores for unrelated concerns instead of one monolithic store.

| Store | State | Purpose |
|---|---|---|
| `sidebar.ts` | `isOpen` | Sidebar collapse state |
| `theme.ts` | `mode` (light/dark/system) | Theme preference |
| `search.ts` | `query`, `filters` | Global search/filter state |
| `ui.ts` | `activeModal`, `toasts[]` | Modal/toast management |

4. **Usage in Components.**

```typescript
import { useSidebarStore } from "#/stores/sidebar";

function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  return <aside data-open={isOpen}>
    <button onClick={toggle}>Toggle</button>
  </aside>;
}
```

### 5.3. Accepted Patterns

- `create<Type>()((set, get) => ({ ... }))` — functional store creation.
- `useStore((state) => state.part)` — subscribing to partial state slices for optimal re-renders.
- `get()` inside actions for reading current state without subscribing.

### 5.4. Rejected Patterns

- Using Redux Toolkit or React Context for global UI state.
- Storing TanStack Query data (server state) in Zustand (double-caching anti-pattern).
- Creating monolithic "app state" stores that mix UI and server concerns.

---

## 6. Skill: shadcn/ui Component Design

**Assigned To:** The UI Artisan (shadcn/ui)

### 6.1. Core Instruction

Build all interfaces using shadcn/ui components. Customize them as needed, but maintain the base atomic design and Radix UI accessibility primitives.

### 6.2. Implementation Rules

1. **Install Components via CLI.** Always use `npx shadcn@latest add <component>` to add new shadcn/ui components. Never manually copy component code.

2. **Use `cn()` for Class Merging.** Always use the `cn()` utility from `src/lib/utils.ts` to merge Tailwind classes.

```typescript
import { cn } from "#/lib/utils";
<button className={cn("base-class", isActive && "active-class")} />
```

3. **Maintain CSS Variable-Based Theming.** Colors must be defined as CSS custom properties in `src/styles.css`. Never hardcode hex colors in component files.

4. **Component Composition.**
   - **Page Sections:** Use `<section>` with `island-shell` class for consistent card styling.
   - **Forms:** Use TanStack Form + shadcn Form components (Input, Select, Textarea, Button).
   - **Data Tables:** Use `@tanstack/react-table` with shadcn Table components.
   - **Modals:** Use Radix Dialog wrapped in shadcn's Dialog.

### 6.3. Component Template

```typescript
// src/components/shared/ProjectCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";

type ProjectCardProps = {
  title: string;
  category: string;
  description: string;
  isFeatured?: boolean;
};

export function ProjectCard({ title, category, description, isFeatured }: ProjectCardProps) {
  return (
    <Card className={cn("group", isFeatured && "ring-2 ring-primary")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary">{category}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        {/* Action buttons */}
      </CardFooter>
    </Card>
  );
}
```

### 6.4. Accepted Patterns

- Using shadcn/ui variants (size, variant) for Button, Badge, etc.
- Wrapping Radix primitives in custom components when no shadcn wrapper exists.
- Using Tailwind's `@apply` directive in CSS for repeated patterns (but prefer component composition).

### 6.5. Rejected Patterns

- Installing Material UI, Ant Design, Chakra UI, or any non-shadcn UI library.
- Using inline `style={{}}` for layout (use Tailwind utilities).
- Hardcoding colors that break theme switching.
- Writing custom dropdowns, modals, or popovers when Radix primitives exist.

---

## 7. Skill: TanStack Form Integration

**Assigned To:** The Full-Stack Specialist, The UI Artisan

### 7.1. Core Instruction

Wire TanStack Form instances with Zod schemas and Server Function submissions. Use `createFormHook` and `createFormHookContexts` for reusable form components.

### 7.2. Implementation Rules

1. **Create a Form Hook Factory.** Define form-aware field components in a centralized hook file.

```typescript
// src/hooks/form.ts
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField, TextArea, Select } from "#/components/shared/form-fields";
import { SubmitButton } from "#/components/shared/form-fields";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const useAppForm = createFormHook({
  fieldComponents: { TextField, TextArea, Select },
  formComponents: { SubmitButton },
});
```

2. **Define Zod Schema for Form Validation.**

```typescript
// src/domain/schemas/project.ts
export const projectFormSchema = z.object({
  title: z.string().min(1, "Required").max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  descriptionShort: z.string().max(300).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
```

3. **Wire Form to Server Function.**

```typescript
// src/routes/admin/projects.new.tsx
import { useAppForm } from "#/hooks/form";
import { projectFormSchema } from "#/domain/schemas/project";
import { createProject } from "#/apis/projects";

function NewProjectPage() {
  const form = useAppForm({
    defaultValues: { title: "", slug: "", descriptionShort: "" },
    validators: { onChange: projectFormSchema },
    onSubmit: async ({ value }) => {
      await createProject({ data: value });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.AppForm>
        <form.TextField name="title" label="Project Title" />
        <form.TextField name="slug" label="URL Slug" />
        <form.TextArea name="descriptionShort" label="Short Description" />
        <form.SubmitButton>Create Project</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
```

### 7.3. Accepted Patterns

- Using `validators: { onChange: schema }` for real-time validation feedback.
- Using `validators: { onSubmit: schema }` for final validation before Server Function call.
- Nesting field components inside `<form.AppForm>` for context propagation.

### 7.4. Rejected Patterns

- Using uncontrolled forms (raw `<input>` without TanStack Form).
- Writing custom validation logic when Zod schemas can be reused.
- Submitting forms without Zod validation on the client side.

---

## 8. Skill: Authentication & Authorization

**Assigned To:** The Full-Stack Specialist

### 8.1. Core Instruction

Protect all dashboard routes and Server Functions using Clerk authentication. Use Clerk's React components for client-side guards and Clerk's backend SDK for server-side checks.

### 8.2. Implementation Rules

1. **Client-Side Route Guard.** Create a layout route for `/admin` that wraps children in `<SignedIn>`.

```typescript
// src/routes/admin/route.tsx (Admin Layout)
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <SignedIn>
        <AdminSidebar />
        <main>
          <Outlet />
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

2. **Server-Side Auth Check.** Every Server Function that accesses protected data must call `auth()`.

```typescript
import { auth } from "@clerk/clerk-react"; // or the appropriate backend SDK

export const getProfile = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth();
  if (!userId) throw redirect({ to: "/auth/sign-in" });
  // ... proceed with data access
});
```

3. **Sign-In Page.** A dedicated `/auth/sign-in` route renders Clerk's `<SignIn />` component.

```typescript
// src/routes/auth/sign-in.tsx
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return <SignIn routing="path" path="/auth/sign-in" />;
}
```

### 8.3. Accepted Patterns

- Using `<SignedIn>` / `<SignedOut>` for route-level access control.
- Using `<RedirectToSignIn />` for unauthenticated redirects.
- Calling `auth()` at the top of every Server Function handler.

### 8.4. Rejected Patterns

- Storing Clerk session tokens in Zustand or localStorage manually.
- Implementing custom JWT verification (Clerk handles this).
- Skipping auth checks on "minor" Server Functions — ALL data access is guarded.

---

## 9. Skill: File & Storage Management

**Assigned To:** The Full-Stack Specialist, The Data Steward

### 9.1. Core Instruction

Use Supabase Storage for all file uploads (CV PDFs, project images, gallery media). Define storage buckets with appropriate RLS policies and file size limits.

### 9.2. Implementation Rules

1. **Define Storage Adapter.** Create an adapter in `src/infrastructure/storage/` implementing a storage Port.

```typescript
// src/domain/ports/IStorageService.ts
export interface IStorageService {
  uploadFile(bucket: string, path: string, file: File): Promise<string>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
}

// src/infrastructure/storage/supabaseStorage.ts
import { createClient } from "@supabase/supabase-js";
import { IStorageService } from "#/domain/ports/IStorageService";

export const supabaseStorage: IStorageService = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return data.path;
  },
  async deleteFile(bucket, path) {
    await supabase.storage.from(bucket).remove([path]);
  },
  getPublicUrl(bucket, path) {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
};
```

2. **Create Server Functions for Upload.**

```typescript
// src/apis/storage.ts
export const uploadCV = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ file: z.instanceof(File) }).parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const path = `cvs/${userId}/${data.file.name}`;
    const url = await supabaseStorage.uploadFile("cvs", path, data.file);
    // Also update profile.cv_url in the database
    await drizzleProfileRepository.updateProfile({ cvUrl: url });
    return url;
  });
```

3. **File Validation Rules.**
   - CV: PDF only, max 10 MB.
   - Project thumbnails: JPEG, PNG, WebP; max 2 MB.
   - Gallery images: JPEG, PNG, WebP; max 5 MB per image, 20 images per gallery.

### 9.3. Accepted Patterns

- Using Supabase Storage SDK for uploads/deletes.
- Storing file URLs in the database after successful upload.
- Cleaning up old files when a new file replaces them.

### 9.4. Rejected Patterns

- Storing files as base64 in the database (bloat).
- Using local filesystem storage (not portable across deployments).
- Allowing unauthenticated or unauthorized file uploads.

---

## 10. Skill: Testing with Vitest

**Assigned To:** The Performance Enforcer (Oxc/Vitest)

### 10.1. Core Instruction

Write and maintain Vitest unit tests for all domain use cases and repository adapters. Ensure minimum 95% coverage for domain layer code.

### 10.2. Implementation Rules

1. **Test File Placement.** Place test files in `__tests__/` directories adjacent to the source file.

```
src/
├── domain/
│   └── use-cases/
│       ├── createProject.ts
│       └── __tests__/
│           └── createProject.test.ts
```

2. **Domain Use Case Testing Pattern.**

```typescript
// src/domain/use-cases/__tests__/createProject.test.ts
import { describe, it, expect, vi } from "vitest";
import { createProjectUseCase } from "../createProject";
import { IProjectRepository } from "#/domain/ports/IProjectRepository";

describe("createProjectUseCase", () => {
  it("should create a project with valid data", async () => {
    const mockRepo: IProjectRepository = {
      create: vi.fn().mockResolvedValue({ id: "1", title: "Test", slug: "test" }),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const result = await createProjectUseCase(mockRepo, {
      title: "Test Project",
      slug: "test-project",
    });

    expect(mockRepo.create).toHaveBeenCalledWith({
      title: "Test Project",
      slug: "test-project",
    });
    expect(result.id).toBe("1");
  });

  it("should throw for invalid data", async () => {
    const mockRepo: IProjectRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    await expect(createProjectUseCase(mockRepo, { title: "" }))
      .rejects.toThrow();
  });
});
```

3. **Repository Adapter Testing Pattern.**

```typescript
// src/infrastructure/db/repositories/__tests__/drizzleProjectRepository.test.ts
import { describe, it, expect, vi } from "vitest";
import { drizzleProjectRepository } from "../drizzleProjectRepository";

// Mock the db module
vi.mock("#/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("drizzleProjectRepository", () => {
  it("should return all projects ordered by sort_order", async () => {
    // ... test implementation
  });
});
```

### 10.3. Coverage Targets

| Metric | Target | Measurement |
|---|---|---|
| Domain Use Cases | >= 95% | Line/branch coverage |
| Domain Schemas (Zod) | 100% | Line coverage |
| Infrastructure Repositories | >= 80% | Line/branch coverage |
| API Server Functions | >= 70% | Line coverage |

### 10.4. Accepted Patterns

- `vi.fn()` for mocking functions.
- `vi.mock()` for module-level mocking.
- `describe` / `it` / `expect` for test structure.
- `@testing-library/react` for component tests.

### 10.5. Rejected Patterns

- Using Jest (`jest.fn()`, `jest.mock()`) — use Vitest equivalents.
- Writing tests that hit real databases or external APIs.
- Skipping tests with `.skip` without documented rationale.

---

## 11. Skill: Migration & Schema Workflow

**Assigned To:** The Data Steward (Drizzle/Zod)

### 11.1. Core Instruction

Manage database schema changes through Drizzle Kit migrations. Never modify the database directly via raw SQL in production. Every schema change must go through the migration workflow.

### 11.2. Workflow Rules

1. **Modify `src/db/schema.ts`.** Make all column, table, enum, or index changes in the Drizzle schema file.

2. **Generate Migration.** Run `npm run db:generate` to create a SQL migration file in `supabase/migrations/`.

3. **Review Migration SQL.** Always review the generated SQL before applying it. Look for:
   - Correct column types
   - Proper foreign key relationships
   - Index creation on commonly queried columns
   - No destructive changes (DROP COLUMN) without explicit approval

4. **Apply Migration.** Run `npm run db:migrate` to apply pending migrations to the database.

5. **Update Zod Schemas.** After modifying the Drizzle schema, update the corresponding Zod validation schemas in `src/domain/schemas/`.

6. **Update Type Inferences.** If Drizzle columns changed their TypeScript types, update any code that depends on those types.

### 11.3. Migration Example

```sql
-- Generated by drizzle-kit
CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "description_short" varchar(300),
  "thumbnail_url" text,
  "is_featured" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);

CREATE INDEX IF NOT EXISTS "idx_projects_sort_order" ON "projects" ("sort_order");
```

### 11.4. Accepted Patterns

- `npm run db:generate` for migration creation.
- `npm run db:migrate` for migration application.
- Using Drizzle's `.defaultRandom()` for UUID primary keys.
- Using `.unique()` for unique constraints in Drizzle schema.

### 11.5. Rejected Patterns

- `npm run db:push` in production (only in development for rapid iteration).
- Running raw DDL (CREATE TABLE, ALTER TABLE) directly against production.
- Skipping migration generation and manually editing the database.

---

## 12. Skill: T3Env & Environment Validation

**Assigned To:** The Full-Stack Specialist, The Performance Enforcer

### 12.1. Core Instruction

Use `@t3-oss/env-core` (T3Env) validated by Zod to ensure critical environment variables are present before the application starts. Fail fast on missing or invalid configuration.

### 12.2. Implementation Rules

1. **Define Environment Schema in `src/env.ts`.**

```typescript
// src/env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_KEY: z.string().min(1),
  },
  client: {
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    VITE_APP_TITLE: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_APP_TITLE: process.env.VITE_APP_TITLE,
  },
});
```

2. **Use Environment Variables Throughout the App.**

```typescript
// src/db/index.ts
import { env } from "#/env";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

3. **Fail on Missing Variables.** T3Env throws an error at startup if any required variable is missing, preventing the app from starting in a misconfigured state.

### 12.3. Environment File Template

```bash
# .env.local (development)
DATABASE_URL=postgresql://postgres:password@localhost:54322/portfolio
CLERK_SECRET_KEY=sk_test_...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_APP_TITLE=Portfolio CMS
```

### 12.4. .env.example Template

```bash
# .env.example — Commit this file to the repository
DATABASE_URL=postgresql://user:password@host:port/database
CLERK_SECRET_KEY=sk_...
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_APP_TITLE=Portfolio CMS
```

### 12.5. Accepted Patterns

- Using `env.VARIABLE_NAME` for all environment reads.
- Calling `createEnv()` at the top level of `src/env.ts` (eager validation).
- Defining both `server` and `client` schemas separately.

### 12.6. Rejected Patterns

- Accessing `process.env.VITE_*` directly (must go through T3Env).
- Using non-validated `import.meta.env` access in client code.
- Hardcoding secrets or API keys in source code.

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-09*
*Author: Portfolio Management System Team*
