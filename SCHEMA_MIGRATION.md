# Database Schema Migration Guide

> **Context:** The Portfolio Management System schema evolved across several iterations.
> The public portfolio website queries this Supabase PostgreSQL database directly and
> must be updated to match the current schema.

---

## Overview of Changes

| Table | Status | Key Changes |
|-------|--------|-------------|
| `profiles` | Modified | Added `current_roles`, `avatar_url`, social links, `location`, `email` |
| `skills` | Unchanged | — |
| `experiences` | Modified | Column renames + `type` changed from enum to plain text |
| `projects` | Modified | Column renames, added `tech_stacks`, `github_url`, `live_url`, `additional_links` |
| `achievements` | Modified | Column renames, `date` now NOT NULL, added `sort_order` |
| `case_studies` | Unchanged | — |
| `stats` | **New** | Entirely new key-value stat table |

---

## Table-by-Table Migration

### `profiles`

```diff
- bio_short        text(280)
- cv_url           text
+ current_roles    text[]  NOT NULL DEFAULT '{}'
+ avatar_url       text
+ location         text
+ email            text
+ github           text
+ linkedin         text
+ instagram        text
```

**Current columns:** `id` (uuid PK), `full_name`, `current_role`, `current_roles` (text[]), `bio_short`, `bio_long`, `avatar_url`, `cv_url`, `location`, `email`, `github`, `linkedin`, `instagram`, `created_at`, `updated_at`

**Example SELECT:**
```sql
SELECT full_name, current_role, current_roles, bio_short, bio_long,
       avatar_url, cv_url, location, email, github, linkedin, instagram
FROM profiles LIMIT 1;
```

---

### `experiences`

```diff
- title            text  NOT NULL   →  org_name  text  NOT NULL
- company          text  NOT NULL   →  role      text  NOT NULL
- location         text  NOT NULL   (removed)
- description      text[]           →  description  text  (single string)
- image            text             (removed)
+ type             text  NOT NULL   (was pgEnum, now plain text)
+ updated_at       timestamp
```

**Valid `type` values:** `work`, `organization`, `volunteer`, `education` (plain text, no longer a PostgreSQL enum)

**Current columns:** `id` (uuid PK), `org_name`, `role`, `start_date`, `end_date`, `description`, `type`, `sort_order`, `created_at`, `updated_at`

**Example SELECT:**
```sql
SELECT org_name, role, start_date, end_date, description, type, sort_order
FROM experiences
ORDER BY sort_order ASC;
```

---

### `projects`

```diff
- subtitle         text             (removed)
- description      text             (removed)
- demo_url         text             →  live_url       text
- repo_url         text             →  github_url     text
- tech_stack       text[]           →  tech_stacks    text[]
+ description_short  varchar(300)
+ additional_links   jsonb  [{ label: string, url: string }]
+ updated_at         timestamp
```

**`tech_stacks`** is a text array (same as old `tech_stack` — just renamed).

**`additional_links`** is a JSONB array of `{ label: string, url: string }`.

**Current columns:** `id` (uuid PK), `title`, `slug` (unique), `description_short`, `thumbnail_url`, `tech_stacks` (text[]), `is_featured`, `category`, `github_url`, `live_url`, `additional_links` (jsonb), `sort_order`, `created_at`, `updated_at`

**Example SELECT:**
```sql
SELECT title, slug, description_short, thumbnail_url, tech_stacks,
       is_featured, category, github_url, live_url, additional_links, sort_order
FROM projects
ORDER BY sort_order ASC;
```

---

### `achievements`

```diff
- position         text       →  event_name    text
- issuer           text       →  organizer     text
- category         text          (removed)
- date             date          (now NOT NULL)
- image_url        text       →  url           text
- credential_url   text          (merged into url)
+ sort_order       integer
+ updated_at       timestamp
```

**Current columns:** `id` (uuid PK), `title`, `event_name`, `organizer`, `date` (NOT NULL), `description`, `url`, `sort_order`, `created_at`, `updated_at`

**Example SELECT:**
```sql
SELECT title, event_name, organizer, date, description, url, sort_order
FROM achievements
ORDER BY sort_order ASC;
```

---

### `case_studies`

**No changes.** Same columns as before.

**Current columns:** `id` (uuid PK), `project_id` (FK → projects.id), `content_markdown`, `gallery_jsonb` (jsonb), `created_at`, `updated_at`

---

### `skills`

**No changes.**

**Current columns:** `id` (uuid PK), `name`, `category` (pgEnum: mobile, web, backend, devops, design, other), `icon_url`, `sort_order`, `created_at`

---

### `stats` (New Table)

Entirely new table for the `/about` page stat cards.

```sql
CREATE TABLE stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text NOT NULL,
  value      text NOT NULL,
  category   text,
  sub_value  text,
  icon       text,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now()
);
```

**Seeded rows:**

| key | value | category | sub_value |
|-----|-------|----------|-----------|
| `years_experience` | `3+` | general | — |
| `projects_shipped` | `18` | general | — |
| `technologies_explored` | `27` | general | — |
| `main_focus` | `Front-end / Mobile / Full-stack` | general | — |
| `github_total_contributions` | `630` | general | `2023–2026` |
| `work_experience` | `2` | general | `positions` |
| `education` | `Informatics Engineering - 2023` | about | `Universitas Brawijaya` |
| `gpa` | `3.92` | about | `out of 4.00` |
| `personality_traits` | `Growth Mindset / Continuous Learner / Detail Oriented / Result Driven` | about | — |

**Example SELECT:**
```sql
SELECT key, value, category, sub_value, icon, sort_order
FROM stats
ORDER BY sort_order ASC;
```

---

## Type Reference

| Postgres Column | Drizzle Type | App (TS) Type | Notes |
|---|---|---|---|
| `uuid` | `uuid()` | `string` | All PKs are `gen_random_uuid()` |
| `text` | `text()` | `string` | — |
| `text[]` | `text().array()` | `string[]` | `current_roles`, `tech_stacks` |
| `varchar(300)` | `varchar({ length: 300 })` | `string` | `bio_short`, `description_short` |
| `boolean` | `boolean()` | `boolean` | Default `false` |
| `integer` | `integer()` | `number` | `sort_order` |
| `date` | `date()` | `string` | Always `YYYY-MM-DD` format |
| `timestamp with time zone` | `timestamp({ withTimezone: true })` | `Date \| string` | `created_at`, `updated_at` |
| `jsonb` | `jsonb().$type<T>()` | `T` | `additional_links`, `gallery_jsonb` |

---

## Common Migration Pitfalls

1. **`description` on experiences** — was `text[]` (array of paragraphs), now single `text`. If the old code reads `description[0]`, change to `description` directly.
2. **Experience `type`** — was a PostgreSQL enum (`exp_type`), now plain `text`. Use string comparison, not enum casting.
3. **Project `tech_stacks`** — was `tech_stack` (same type, renamed). Update any `SELECT tech_stack` → `tech_stacks`.
4. **Achievement `date`** — was nullable `date`, now `NOT NULL`. Every achievement row has a date.
5. **Profile social links** — if the old query didn't select `github`, `linkedin`, `instagram`, they're now available as nullable text columns.
6. **`stats` table** — is new. The about/stats page will 404 or show no data until the query is added.
