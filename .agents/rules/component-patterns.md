---
trigger: always_on
glob:
description: Component patterns — file structure, props, hooks, JSX, styling, and data fetching within components.
---

# Component Patterns

> Component structure and patterns used throughout the Smart Transformer CRM project.
> All contributors and AI assistants **must** follow these rules.

---

## 1. Component File Structure

Every component file follows a **strict top-to-bottom ordering**:

```tsx
// ──────────────────────────────────────────────
// 1. Directives
// ──────────────────────────────────────────────
'use client'

// ──────────────────────────────────────────────
// 2. Imports (sorted alphabetically by eslint-plugin-perfectionist)
//    Order: type imports → react → external → internal (~/) → relative
// ──────────────────────────────────────────────
import type { Transformer } from '~/types/transformer'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Badge } from '~/components/ui/badge'
import { nextApi } from '~/lib/axios/next-api'

import { useTransformerSearchParams } from '../hooks/use-transformer-search-params'

// ──────────────────────────────────────────────
// 3. Constants (module-level)
// ──────────────────────────────────────────────
const THINGWORX_MAX_BATCH_SIZE = 50

export const CAPACITY_OPTIONS = [15, 37.5, 50, 100, 500, 1000] as const

// ──────────────────────────────────────────────
// 4. Types (module-level, related to this file)
// ──────────────────────────────────────────────
type TransformerTableProps = {
  isLoading?: boolean
  total: number
  transformers: Transformer[]
}

// ──────────────────────────────────────────────
// 5. Exported component (one per file)
// ──────────────────────────────────────────────
export function TransformerTable({
  isLoading,
  total,
  transformers,
}: TransformerTableProps) {
  // 5a. Hooks — all hooks at the very top of the function body
  const [params, setParams] = useTransformerSearchParams()
  const isMobile = useIsMobile()

  // 5b. Derived state / computed values
  const totalPages = Math.ceil(total / limit)
  const hasActiveFilter = search.trim() !== ''

  // 5c. Handler functions — mutate state or trigger side effects
  function handleFilterChange(next: Partial<TransformerFilterState>) {
    setParams({ page: 1, ...next })
  }

  function resetFilters() {
    setParams({ page: 1, search: '' })
  }

  // 5d. Pure helper functions — only transform data, no side effects
  //     (If a helper is truly pure with no dependency on component
  //      scope, move it OUTSIDE the component body instead.)
  function renderStatusBadge(status: TransformerStatus) {
    return (
      <Badge variant={status === 'online' ? 'default' : 'destructive'}>
        {status}
      </Badge>
    )
  }

  // 5e. Effects (useEffect)
  useEffect(() => {
    // side-effect logic
  }, [dependency])

  // 5f. Return JSX (always last)
  return <div>…</div>
}

// ──────────────────────────────────────────────
// 6. Private (non-exported) helper components
// ──────────────────────────────────────────────
function MobileFilterDrawer({ options, selected }: MobileFilterDrawerProps) {
  // …
}

// ──────────────────────────────────────────────
// 7. Private data-fetching / utility functions
// ──────────────────────────────────────────────
async function fetchRealtimeData(
  transformerId: string
): Promise<TransformerReading> {
  return nextApi.get(`/transformers/${transformerId}/realtime`)
}

/** Pure helper — lives outside the component because it has no dependency on scope */
function parseCoordinate(val: unknown, fallback: number) {
  if (val === '' || val === null || val === undefined || isNaN(Number(val))) {
    return fallback
  }
  return Number(val)
}
```

### Summary of In-Component Order

1. **Hooks** (`useState`, `useQuery`, custom hooks)
2. **Derived state** (computed values from hooks/props)
3. **Handler functions** (`handle*`, `on*`, `toggle*`, `reset*`, `clear*` — mutate state or trigger side effects)
4. **Pure helper functions** (`format*`, `parse*`, `calculate*`, `render*`, `get*`, `to*` — only transform data; move outside the component if truly pure)
5. **Effects** (`useEffect`)
6. **Return JSX**

---

## 2. Props

- Define a `type` for props directly above the component.
- Destructure props in the function signature.
- Sort props alphabetically (enforced by `perfectionist`).
- Use JSDoc `/** … */` comments for prop documentation.

```tsx
type PercentBarProps = {
  /** Show 0%/100% end labels. Defaults to true. */
  showLabels?: boolean
  /** Thresholds for color transitions. */
  thresholds?: { danger: number; warn: number }
  /** Value in percent (0–100). Automatically clamped. */
  value: number
}

export function PercentBar({
  showLabels = true,
  thresholds = { danger: 90, warn: 70 },
  value,
}: PercentBarProps) {
  // …
}
```

---

## 3. JSX Attributes

- Sort attributes alphabetically on JSX elements (enforced by `perfectionist`).
- Use self-closing tags for elements without children.
- Place `className` as the first custom attribute when visually scanning.

```tsx
<Button
  className="h-8 cursor-pointer"
  disabled={!hasActiveFilter}
  onClick={onReset}
  size="sm"
  type="button"
  variant="outline"
>
  ล้างทั้งหมด
</Button>
```

---

## 4. Client Components

- Add `'use client'` directive only when the component uses client-side hooks (`useState`, `useEffect`, `useQuery`, event handlers, etc.).
- Keep it on line 1, followed by a blank line.

---

## 5. Loading / Empty / Error States

Follow a consistent pattern for data-dependent UI:

```tsx
if (isLoading) {
  return <Skeleton />
}

if (!data) return null

return <ActualContent data={data} />
```

---

## 6. Data Fetching in Components (TanStack React Query)

```tsx
const { data, isLoading } = useQuery<Transformer>({
  queryFn: () => nextApi.get(`/transformers/${id}`),
  queryKey: ['transformer', id],
})
```

- `queryKey` must be a descriptive tuple: `['resource', ...params]`.
- Sort the query options object alphabetically.

---

## 7. Hooks

### Shared Hooks (`src/hooks/`)

- One hook per file, named `use-<name>.ts`.
- Exported via function declaration.
- Re-usable across features.

### Feature Hooks (`src/features/<feature>/hooks/`)

- Scoped to a single feature.
- Named with feature context: `use-transformer-search-params.ts`.

### Hook File Template

```tsx
'use client'

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

## 8. Styling (Tailwind CSS v4)

- Use Tailwind utility classes directly — no custom CSS unless necessary.
- Use `cn()` from `~/lib/utils` when classes need to be conditional or merged.
- Use shadcn design tokens: `text-muted-foreground`, `bg-primary`, `border-input`, etc.
- Use `tabular-nums` for number-heavy columns (tables, stats).
- Use `font-mono` for technical values (IDs, codes, ratios).

---

## 9. Function Ordering Inside Components

Function declarations inside a component body must follow a strict ordering. This is enforced by the custom ESLint rule **`tlm/component-function-order`**.

### Categories (in order)

| Order | Category     | Naming Patterns                                                                  | Description                                                               |
| ----- | ------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1     | **Handlers** | `handle*`, `on*`, `toggle*`, `reset*`, `clear*`                                  | Functions that mutate state, call APIs, navigate, or trigger side effects |
| 2     | **Helpers**  | everything else (`format*`, `parse*`, `calculate*`, `render*`, `get*`, `to*`, …) | Pure functions that only transform data without side effects              |

### Rules

- **Handler functions** must appear before **pure helper functions**.
- **All function declarations** must appear before `useEffect` calls.
- **All function declarations** must appear before the `return` statement.
- **Truly pure helpers** (no dependency on component scope — props, state, or hooks) should be moved **outside the component body** entirely, alongside other private module-level helpers.

### Example — Correct

```tsx
export function TransformerDetail({ id }: TransformerDetailProps) {
  const { data } = useQuery({ queryKey: ['transformer', id], queryFn: … })
  const router = useRouter()

  // Derived state
  const currentLat = parseCoordinate(data?.lat, 0)  // uses module-level helper

  // ✅ Handlers first
  function handleSave() {
    router.push(`/transformers/${id}`)
  }

  // ✅ Helpers that need component scope after handlers
  function renderStatus() {
    return <Badge>{data?.status}</Badge>
  }

  // ✅ Effects after all functions
  useEffect(() => { … }, [])

  // ✅ Return last
  return <div>…</div>
}

// ✅ Pure helper lives outside — no component scope dependency
function parseCoordinate(val: unknown, fallback: number) {
  if (val === '' || val == null || isNaN(Number(val))) return fallback
  return Number(val)
}
```

### Example — Incorrect

```tsx
export function TransformerDetail({ id }: TransformerDetailProps) {
  const { data } = useQuery({ … })

  // ❌ Pure helper before handler
  function parseCoordinate(val: unknown, fallback: number) { … }

  const currentLat = parseCoordinate(data?.lat, 0)

  function handleSave() { … }

  // ❌ Function after useEffect
  useEffect(() => { … }, [])

  function formatLabel(label: string) { … }

  return <div>…</div>
}
```

---

## Quick Reference Checklist

- [ ] Component file order: directives → imports → constants → types → component → private helpers
- [ ] Inside components: hooks → derived state → handlers → helpers → effects → return JSX
- [ ] Handler functions (`handle*`, `on*`, `toggle*`, `reset*`, `clear*`) before helper functions
- [ ] Pure helpers with no scope dependency moved outside the component body
- [ ] No function declarations after `useEffect` or `return`
- [ ] Props type defined directly above the component
- [ ] Props destructured in function signature with defaults
- [ ] JSX attributes sorted alphabetically
- [ ] `'use client'` only when needed, on line 1
- [ ] Loading/empty/error states handled consistently
- [ ] Query keys are descriptive tuples
