# Design System — Portfolio CMS

## Overview

Dark-themed, glass-morphism admin panel and public pages. Built with Tailwind CSS v4, CSS custom properties, and shadcn/ui (Radix UI primitives).

---

## 1. Color System

All tokens defined as CSS custom properties in `:root` (`src/styles.css:7-61`).

### Core Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#070e18` | Page background base |
| `--background` | `#0a1220` | Surface/container background |
| `--foreground` | `#ffffff` | Primary text |
| `--sea-ink` | `#ffffff` | Primary text (alias) |
| `--sea-ink-soft` | `#d1d5db` | Secondary/muted text |
| `--muted-foreground` | `#a3a3a3` | Placeholder/tertiary text |

### Accent / Interactive

| Token | Value | Usage |
|---|---|---|
| `--lagoon` | `#4a9eff` | Primary accent, links, focus ring |
| `--lagoon-deep` | `#3a7bef` | Hover states |
| `--palm` | `#5a8fc9` | Gradient secondary (used in nav underline) |
| `--destructive` | `#ef4444` | Delete/danger actions |

### Surfaces & Borders

| Token | Value | Usage |
|---|---|---|
| `--card` | `#0d1628` | Card, sidebar, dialog backgrounds |
| `--surface` | `rgba(13, 22, 40, 0.74)` | Glass surface (island-shell) |
| `--surface-strong` | `rgba(16, 28, 50, 0.9)` | Stronger glass surface |
| `--line` | `rgba(100, 150, 220, 0.18)` | Borders, dividers, scrollbar |
| `--border` | `#1e3450` | Input/component borders |
| `--input` | `#1e3450` | Input field border |
| `--header-bg` | `rgba(7, 14, 24, 0.84)` | Sticky header background |
| `--inset-glint` | `rgba(80, 140, 220, 0.14)` | Inner highlight on cards |

### Buttons

| Variant | Background | Text |
|---|---|---|
| default/primary | `--lagoon` (#4a9eff) | `--primary-foreground` (#ffffff) |
| outline | Transparent, `--border` stroke | `--foreground` (#ffffff) |
| destructive | `--destructive` (#ef4444) | `#ffffff` |
| ghost | Transparent | `--foreground` |

---

## 2. Typography

- **Font**: Space Grotesk (Google Fonts) via `@import` at top of `styles.css`
- **Fallback stack**: `'Space Grotesk', ui-sans-serif, system-ui, sans-serif`
- **Scale**: Mobile-first, stepped up at `sm` breakpoint

| Level | Mobile | sm+ | Class |
|---|---|---|---|
| Page title (h1) | `text-lg` (1.125rem) | `md:text-2xl` (1.5rem) | `text-lg md:text-2xl font-bold` |
| Section heading | `text-sm` (0.875rem) | `md:text-lg` (1.125rem) | — |
| Body | `text-xs` (0.75rem) | `md:text-sm` (0.875rem) | — |
| Label / badge | `text-xs` (0.75rem) | — | — |
| Kicker | `text-[0.69rem]` uppercase, 0.16em letter-spacing | — | `island-kicker` |

### Nav-link underline

Desktop (≥1024px): full-width underline on hover/active.
Mobile (<1024px): 20% of link width, left-aligned.
Uses `::after` pseudo-element with `opacity` transition (170ms ease), gradient from `--lagoon` to `--palm`, 2px height.

---

## 3. Spacing

Responsive scale using Tailwind tokens:

| Context | Mobile | md+ | lg+ | xl+ |
|---|---|---|---|---|
| Page padding | `px-4` (16px) | — | `lg:px-12` (48px) | — |
| Card padding (island-shell) | `p-4` (16px) | `md:p-6` (24px) | — | — |
| Sidebar width | Hidden (slide-in) | — | `lg:w-52` (208px) | `xl:w-64` (256px) |
| Main margin | 0 | — | `lg:ml-52` | `xl:ml-64` |
| Table cell padding | `px-2.5 py-2` | — | — | `0.75rem 1rem` |

---

## 4. Layout Components

### 4.1. Page Wrap

Centered container:
```
width: min(1280px, calc(100% - 1rem))  →  calc(100% - 2rem) at sm+
margin-inline: auto
```

### 4.2. Island Shell

Glass card used for sections, dialogs, stat cards:
```
border: 1px solid var(--line)
background: linear-gradient(165deg, var(--surface-strong), var(--surface))
box-shadow: 0 1px 0 var(--inset-glint) inset, 0 22px 44px rgba(0,0,0,0.3), 0 6px 18px rgba(0,0,0,0.2)
backdrop-filter: blur(4px)
border-radius: var(--radius)
```

### 4.3. Glass Table

Data table with frosted background:
```
background: rgba(13, 22, 40, 0.55)
backdrop-filter: blur(10px)
border: 1px solid var(--line)
border-radius: var(--radius)
overflow: hidden (wraps scrollable table)
```

Cells:
- `th`: 600 weight, `--sea-ink` color, header row has blue-tinted background (`rgba(26, 42, 68, 0.5)`)
- `td`: `--sea-ink-soft` color, subtle row separator
- Row hover: `rgba(20, 36, 60, 0.6)`
- Text wraps naturally (`white-space: normal`, `overflow-wrap: break-word`)
- Below 1280px: table scrolls horizontally (`max-xl:overflow-x-auto`), column widths from content
- At 1280px+: table fills container, no scroll, `min-width: 0`

### 4.4. Header

```
sticky top-0, z-50
border-bottom: 1px solid var(--line)
bg: var(--header-bg) — semi-transparent dark
Logo left, nav links center (hidden < lg), user menu + hamburger right
Desktop: nav links in flex row with gap-x-5
Mobile (< lg): hamburger opens absolute dropdown with overlay
```

### 4.5. Admin Sidebar

```
Fixed left, w-64 / lg:w-52 / xl:w-64
Top offset: top-12 (below header)
Border-right: var(--line)
Background: var(--card)
Desktop (≥lg): visible by default, in-page flow
Mobile (< lg): slide-in overlay with translate-x, backdrop dim
Nav links: py-3, rounded-lg, hover bg var(--link-bg-hover)
```

### 4.6. Bottom Tab Bar (Mobile)

```
Fixed bottom, full width, z-30
Shown on < lg only
border-top: var(--line)
Background: var(--card)
Links arranged with flex-1, icon + label (label hidden < sm)
```

### 4.7. Feature Card

Hover-lifting card used for project/skill display:
```
background: linear-gradient(165deg, surface-strong + 7% white, surface)
box-shadow: inset glint + outer shadow
hover: translateY(-2px), border tinted with lagoon
```

---

## 5. Form Components

All form components from `src/components/forms/` and `src/components/ui/`:

| Component | File | Notes |
|---|---|---|
| TextField | `forms/TextField.tsx` | Wraps `<Input>` with label + error |
| TextAreaField | `forms/TextAreaField.tsx` | Wraps `<textarea>` with label |
| SelectField | `forms/SelectField.tsx` | Uses Radix Select primitive |
| DateField | `forms/DateField.tsx` | Uses Radix Popover + Calendar |
| FileUpload | `forms/FileUpload.tsx` | Image/PDF upload with preview, `max-w-full` + `truncate` |
| GalleryUpload | `forms/GalleryUpload.tsx` | Multi-image upload with caption inputs |
| Button | `ui/button.tsx` | Variants: default, outline, destructive, ghost. Sizes: xs, sm, default |
| Input | `ui/input.tsx` | `bg-[var(--card)]/50`, `h-9`, `break-words` |
| Switch | `ui/switch.tsx` | Radix Switch primitive |
| Slider | `ui/slider.tsx` | Radix Slider primitive |

### Form layout pattern (admin modals):

```
<div class="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/50">
  <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl md:rounded-2xl border bg-card p-4 md:p-6 shadow-lg">
    <!-- Header with title + close -->
    <form class="space-y-3 md:space-y-4">
      <!-- Fields in grid: grid gap-3 md:gap-4 sm:grid-cols-2 -->
      <!-- Submit buttons: flex justify-end gap-3 -->
    </form>
  </div>
</div>
```

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Default | < 640px | Single column, bottom tab nav, hamburger menu, compact padding |
| `sm` | ≥ 640px | Page wrap widens, bottom tab shows labels, header gains vertical padding |
| `md` | ≥ 768px | Form modals center vertically, cards gain padding |
| `lg` | ≥ 1024px | Desktop nav bar replaces hamburger, sidebar visible, bottom tab hidden |
| `xl` | ≥ 1280px | Sidebar widens to 256px, tables stop scrolling, columns fill container |

---

## 7. Animation Tokens

| Name | Property | Timing |
|---|---|---|
| `rise-in` | `opacity` + `translateY(12px → 0)` | 700ms cubic-bezier(0.16, 1, 0.3, 1) |
| Nav underline | `opacity` on `::after` | 170ms ease |
| Hover transitions | `background-color`, `color`, `border-color`, `transform` | 180ms ease |
| Sidebar slide | `transform` translateX | 200ms ease |

---

## 8. Z-Index Stack

| Layer | Value | Elements |
|---|---|---|
| Header | 50 | Sticky navbar |
| Modals | 40 | Form modals, dropdown menu, overlay |
| Sidebar | 30 | Admin sidebar, bottom tab nav |
| Dropdown overlay | 20 | Hamburger menu backdrop |
| Content | 10 | Page content |

---

## 9. Admin Layout Structure

```
<Header />                    ← sticky top-0 z-50
<AdminShell>
  <aside />                   ← fixed sidebar (lg+: visible, < lg: slide overlay)
  <main>                      ← flex-1, lg:ml-52 xl:ml-64
    <header bar />            ← border-bottom, px-4 lg:px-12
    <Outlet />                ← page content, p-4 lg:px-12 lg:py-6
  </main>
  <nav />                     ← bottom tab bar, fixed, < lg only
</AdminShell>
<Footer />
```

---

## 10. Data Table Column Widths

Percentage-based widths are used across admin tables to fill available space:

| Table | Columns | Widths |
|---|---|---|
| Projects | Title, Description, Featured, Category, Order, Actions | Featured: 90px, Category: 120px |
| Skills | Name, Category, Icon, Order, Actions | Name: 28%, Category: 20%, Icon: 26%, Order: 8% |
| Experiences | Organization, Role, Type, Start, End, Actions | Content-based (line-clamp-2) |
| Achievements | Title, Event, Organizer, Date, Actions | Content-based (line-clamp-2) |
| Stats | Key, Value, Category, Sub Value, Order, Actions | Content-based (line-clamp-2) |

---

## 11. Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--lagoon-deep); }
```
Firefox fallback: `scrollbar-width: thin; scrollbar-color: var(--line) transparent`
