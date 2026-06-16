# Portfolio Frontend Integration Guide (Next.js)

Consume data from the Portfolio CMS Supabase database into your Next.js portfolio website.

---

## 1. Supabase Setup

```bash
npm install @supabase/supabase-js
```

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Set these in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://ipkrjpftddtxwzmylxtf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Get the anon key from **Supabase Dashboard → Settings → API**.

---

## 2. Storage Base URL

All stored images use this base:

```
https://ipkrjpftddtxwzmylxtf.supabase.co/storage/v1/object/public/
```

**Buckets used:**

| Bucket | Contents |
|---|---|
| `avatars` | Profile avatar images |
| `company-images` | Experience organization logos |
| `project-images` | Project thumbnail images |
| `cv` | CV PDF file |
| `public` | Public static assets |

**Helper:**

```ts
const STORAGE = 'https://ipkrjpftddtxwzmylxtf.supabase.co/storage/v1/object/public'

export function storageUrl(bucket: string, path: string) {
  return `${STORAGE}/${bucket}/${path}`
}
```

---

## 3. Data Types & Fetching

### 3.1. Profile (Singleton)

```ts
interface Profile {
  id: string
  fullName: string
  currentRole: string
  currentRoles: string[]
  bioShort: string | null
  bioLong: string | null
  avatarUrl: string | null
  cvUrl: string | null
  location: string | null
  email: string | null
  github: string | null
  linkedin: string | null
  instagram: string | null
}

export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()
  if (!data) return null
  return {
    id: data.id,
    fullName: data.full_name,
    currentRole: data.current_role,
    currentRoles: data.current_roles ?? [],
    bioShort: data.bio_short,
    bioLong: data.bio_long,
    avatarUrl: data.avatar_url,
    cvUrl: data.cv_url,
    location: data.location,
    email: data.email,
    github: data.github,
    linkedin: data.linkedin,
    instagram: data.instagram,
  }
}
```

**Tip:** `currentRoles` is a PostgreSQL `text[]` array — use it for a typing animation.

---

### 3.2. Skills

```ts
type SkillCategory = 'mobile' | 'web' | 'frontend' | 'backend' | 'database'
  | 'devops' | 'deployment' | 'cloud' | 'design' | 'tools' | 'other'

interface Skill {
  id: string
  name: string
  category: SkillCategory
  iconUrl: string | null
  sortOrder: number | null
}

export async function listSkills(): Promise<Skill[]> {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    iconUrl: s.icon_url,
    sortOrder: s.sort_order,
  }))
}
```

**Icon source:** `icon_url` points to `https://skillicons.dev/icons?i=<name>` — render with `next/image`.

**Group by category for display:**

```ts
function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s)
    return acc
  }, {} as Record<string, Skill[]>)
}
```

---

### 3.3. Experiences

```ts
type ExpType = 'work' | 'organization' | 'volunteer' | 'education'

interface Experience {
  id: string
  orgName: string
  role: string
  startDate: string
  endDate: string | null
  description: string[]
  type: ExpType
  imageUrl: string | null
  sortOrder: number | null
}

export async function listExperiences(): Promise<Experience[]> {
  const { data } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(e => ({
    id: e.id,
    orgName: e.org_name,
    role: e.role,
    startDate: e.start_date,
    endDate: e.end_date,
    description: e.description ?? [],
    type: e.type,
    imageUrl: e.image_url,
    sortOrder: e.sort_order,
  }))
}
```

**Tip:** `description` is a `text[]` array — render each entry as a bullet point.

---

### 3.4. Projects

```ts
interface Project {
  id: string
  title: string
  slug: string
  descriptionShort: string | null
  thumbnailUrl: string | null
  techStacks: string[]
  isFeatured: boolean
  category: string | null
  githubUrl: string | null
  liveUrl: string | null
  additionalLinks: { label: string; url: string }[] | null
  sortOrder: number | null
}

export async function listProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    descriptionShort: p.description_short,
    thumbnailUrl: p.thumbnail_url,
    techStacks: p.tech_stacks ?? [],
    isFeatured: p.is_featured ?? false,
    category: p.category,
    githubUrl: p.github_url,
    liveUrl: p.live_url,
    additionalLinks: p.additional_links,
    sortOrder: p.sort_order,
  }))
}
```

**Filter featured:**

```ts
const featuredProjects = projects.filter(p => p.isFeatured)
```

**Filter by category:**

```ts
const webProjects = projects.filter(p => p.category === 'Web App')
const mobileProjects = projects.filter(p => p.category === 'Mobile App')
```

---

### 3.5. Achievements

```ts
interface Achievement {
  id: string
  title: string
  eventName: string | null
  organizer: string | null
  date: string
  description: string | null
  url: string | null
  sortOrder: number | null
}

export async function listAchievements(): Promise<Achievement[]> {
  const { data } = await supabase
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(a => ({
    id: a.id,
    title: a.title,
    eventName: a.event_name,
    organizer: a.organizer,
    date: a.date,
    description: a.description,
    url: a.url,
    sortOrder: a.sort_order,
  }))
}
```

---

### 3.6. Stats

```ts
interface Stat {
  id: string
  key: string
  value: string
  category: string | null
  subValue: string | null
  icon: string | null
  sortOrder: number | null
}

export async function listStats(): Promise<Stat[]> {
  const { data } = await supabase
    .from('stats')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(s => ({
    id: s.id,
    key: s.key,
    value: s.value,
    category: s.category,
    subValue: s.sub_value,
    icon: s.icon,
    sortOrder: s.sort_order,
  }))
}
```

**Usage ideas:**

```ts
const githubStats = stats.find(s => s.key === 'github_total_contributions')
// { value: '630', subValue: '2023–2026' }
```

Stat keys: `years_experience`, `projects_shipped`, `technologies_explored`, `main_focus`, `github_total_contributions`, `work_experience`, `education`, `gpa`, `personality_traits`

---

### 3.7. Case Studies

```ts
interface CaseStudy {
  id: string
  projectId: string
  contentMarkdown: string
  galleryJsonb: { url: string; caption: string }[]
}

export async function listCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await supabase
    .from('case_studies')
    .select('*')
  return (data ?? []).map(c => ({
    id: c.id,
    projectId: c.project_id,
    contentMarkdown: c.content_markdown,
    galleryJsonb: c.gallery_jsonb ?? [],
  }))
}
```

**Render markdown:** Use a library like `react-markdown` or `marked` to render `contentMarkdown`.

---

## 4. TanStack Query Hooks (Recommended)

Create a provider and hooks in your Next.js app:

```ts
// components/QueryProvider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

```ts
// hooks/usePortfolio.ts
import { useQuery } from '@tanstack/react-query'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => listSkills(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: () => listExperiences(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => listAchievements(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => listStats(),
    staleTime: 5 * 60 * 1000,
  })
}
```

Wrap your app:

```ts
// app/layout.tsx
import QueryProvider from '@/components/QueryProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
```

---

## 5. Sample Component Usage (Next.js)

```tsx
// app/page.tsx — or a client component
'use client'

import Image from 'next/image'
import { useProfile, useSkills, useProjects, useExperiences, useAchievements, useStats } from '@/hooks/usePortfolio'

export default function Home() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) return <div className="skeleton" />
  if (!profile) return <p>No profile</p>

  return (
    <section>
      {profile.avatarUrl && (
        <Image
          src={profile.avatarUrl}
          alt={profile.fullName}
          width={120}
          height={120}
          className="rounded-full"
        />
      )}
      <h1>{profile.fullName}</h1>
      <p>{profile.currentRole}</p>
      <p>{profile.bioShort}</p>
      <p>{profile.bioLong}</p>
      <div>
        {profile.currentRoles.map((role, i) => (
          <span key={i}>{role}</span>
        ))}
      </div>
    </section>
  )
}
```

**Skill icon example:**

```tsx
<Image
  src={skill.iconUrl ?? '/fallback.svg'}
  alt={skill.name}
  width={48}
  height={48}
/>
```

**Project gallery with next/image:**

```tsx
<Image
  src={thumbnailUrl}
  alt={title}
  width={640}
  height={360}
  className="rounded-lg object-cover"
/>
```

---

## 6. Migration Checklist

Replace these hardcoded sections with API data:

- [ ] **Hero / About** → `getProfile()` — name, role, bio, avatar
- [ ] **Typing animation** → `profile.currentRoles[]`
- [ ] **Stats bar** → `listStats()` — years, projects, technologies
- [ ] **Skills grid** → `listSkills()` — grouped by category, icons via skillicons.dev
- [ ] **Experience timeline** → `listExperiences()` — sorted by sortOrder
- [ ] **Projects grid** → `listProjects()` — featured filter, category filter
- [ ] **Achievements list** → `listAchievements()` — sorted by date
- [ ] **Social links** → `profile.github`, `profile.linkedin`, `profile.instagram`
- [ ] **CV download** → `profile.cvUrl`
- [ ] **Footer personality** → `stats.find(s => s.key === 'personality_traits')`

---

> **Note:** The CMS backend uses **Drizzle ORM** to manage the Supabase schema. Migrations are in `supabase/migrations/`. You don't need Drizzle on the frontend — just use `@supabase/supabase-js` to read data.
