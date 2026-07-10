---
trigger: always_on
glob:
description: Code conventions — functions, types, imports, naming, formatting, and linting rules.
---

# Code Conventions

> Core coding conventions for the Smart Transformer CRM project.
> All contributors and AI assistants **must** follow these rules.

---

## 1. Language & Tooling

| Tool        | Version / Config                                                              |
| ----------- | ----------------------------------------------------------------------------- |
| Runtime     | Bun                                                                           |
| Framework   | Next.js 16 (App Router)                                                       |
| Language    | TypeScript (strict mode)                                                      |
| Styling     | Tailwind CSS v4                                                               |
| Formatter   | Prettier (no semicolons, single quotes, 2-space indent, trailing comma `es5`) |
| Linter      | ESLint + `eslint-plugin-perfectionist` (alphabetical sorting)                 |
| UI Library  | shadcn/ui (Base UI primitives)                                                |
| Icons       | `@tabler/icons-react`, `@hugeicons/react`                                     |
| Data Fetch  | TanStack React Query                                                          |
| State (URL) | `nuqs` for URL search-param state                                             |
| Forms       | `react-hook-form` + `zod`                                                     |
| Path alias  | `~/` → `./src/`                                                               |

---

## 2. Functions — Always Use Function Declarations

> ESLint rule: `'func-style': ['error', 'declaration']`

Use `function` keyword declarations for **all** functions: components, hooks, helpers, handlers, and utilities.

```tsx
// ✅ Correct — function declaration
export function TransformerTable({ transformers }: TransformerTableProps) {
  function handleFilterChange(next: Partial<TransformerFilterState>) {
    // ...
  }

  return <div>…</div>
}

// ✅ Correct — private helper
function parseCsvValue(raw: string | null | undefined): string | null {
  // ...
}

// ❌ Wrong — arrow function assigned to const
const TransformerTable = ({ transformers }: TransformerTableProps) => { … }
const handleClick = () => { … }
```

**Exception — Arrow functions are acceptable only for:**

- Inline callbacks: `.map(() => …)`, `.filter(() => …)`, `onClick={() => …}`
- Immediate values: `const MINUTE = 60 * 1000`
- Module-level constant objects/arrays (e.g. `export const ROUTES = { … }`)

---

## 3. Type Definitions

> ESLint rule: `'@typescript-eslint/consistent-type-definitions': ['error', 'type']`

- Always use `type` keyword — **never** `interface`.
- Prefer `type` imports via `import type { … }` or `import { type … }`.
- Type properties are sorted **alphabetically** (enforced by `perfectionist`).
- Add JSDoc comments on each property for shared/exported types.

```tsx
// ✅ Correct
type TransformerTableProps = {
  /** Whether data is currently loading */
  isLoading?: boolean
  /** Total number of items */
  total: number
  /** Array of transformer data */
  transformers: Transformer[]
}

// ❌ Wrong — using interface
interface TransformerTableProps { … }
```

---

## 4. Import Ordering

Enforced by `eslint-plugin-perfectionist` — alphabetical, grouped:

```tsx
// 1. Type imports
import type { PaginatedResponse } from '~/types/paginated'
import type { Transformer } from '~/types/transformer'

// 2. React
import { useEffect, useState } from 'react'

// 3. External libraries (alphabetical)
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

// 4. Internal aliases (~/)
import { Badge } from '~/components/ui/badge'
import { nextApi } from '~/lib/axios/next-api'

// 5. Relative imports
import { TransformerFilter } from './transformer-filter'
```

---

## 5. Naming Conventions

| Item               | Convention          | Example                                         |
| ------------------ | ------------------- | ----------------------------------------------- |
| Component          | PascalCase          | `TransformerTable`, `RealtimeDisplay`           |
| Component file     | kebab-case          | `transformer-table.tsx`                         |
| Hook               | camelCase + `use`   | `useDebounce`, `useTransformerSearchParams`     |
| Hook file          | kebab-case + `use-` | `use-debounce.ts`                               |
| Utility function   | camelCase           | `formatDate`, `parseCsvValue`                   |
| Utility file       | kebab-case          | `date.ts`, `number.ts`                          |
| Constant           | UPPER_SNAKE_CASE    | `THINGWORX_MAX_BATCH_SIZE`, `CAPACITY_OPTIONS`  |
| Type               | PascalCase          | `TransformerStatus`, `PhaseData`                |
| Type file          | kebab-case          | `transformer.ts`, `paginated.ts`                |
| API route file     | `route.ts`          | `src/app/api/transformers/route.ts`             |
| Service file       | `service.ts`        | `src/app/api/transformers/service.ts`           |
| Barrel export      | `index.ts`          | `src/features/transformers/components/index.ts` |
| CSS / globals      | kebab-case          | `globals.css`                                   |
| Boolean props/vars | `is`/`has` prefix   | `isLoading`, `hasActiveFilter`, `isOnline`      |

---

## 6. Constants

- Place app-wide constants in `src/constants/`.
- Place module-level constants at the **top of the file**, after imports.
- Use `UPPER_SNAKE_CASE` for primitive constants.
- Use `as const` for readonly arrays/objects.

```tsx
export const CAPACITY_OPTIONS = [15, 37.5, 50, 100, 500] as const
export const DISTRICT_OPTIONS = ['คลองเตย', 'บางกะปิ', 'มีนบุรี'] as const

const THINGWORX_MAX_BATCH_SIZE = 50
const MINUTE = 60 * 1000
```

---

## 7. Formatting & Linting (Enforced)

These are auto-enforced — do not override:

| Rule             | Setting                               |
| ---------------- | ------------------------------------- |
| Semicolons       | None (`semi: false`)                  |
| Quotes           | Single (JS), Double (JSX)             |
| Indent           | 2 spaces                              |
| Trailing comma   | ES5                                   |
| Line endings     | LF                                    |
| `console.log`    | Error (`no-console`)                  |
| Unused vars      | Warn (prefix `_` to silence)          |
| `any` type       | Warn                                  |
| Prop/key sorting | Alphabetical (perfectionist)          |
| Import sorting   | Alphabetical, grouped (perfectionist) |
| Function style   | Declaration only                      |
| Type definition  | `type` only (no `interface`)          |
| Type imports     | `import type` / inline `type`         |

---

## 8. Comments

- Use `/** JSDoc */` for exported types, functions, and their properties.
- Use `//` inline comments sparingly — only for non-obvious logic.
- Use section dividers for long files:

```tsx
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
```

---

## 9. Error Handling

- Use `try/catch` in API route handlers.
- Use `.catch(() => [])` for non-critical external fetches (graceful degradation).
- Never swallow errors silently — log with `console.error` (exempt from `no-console` with `eslint-disable-next-line`).

```tsx
const realtimeRows = await fetchRealtimeRows(stationIds).catch(() => [])
```

---

## Quick Reference Checklist

- [ ] Functions use `function` declarations (not arrow `const`)
- [ ] Types use `type` keyword (never `interface`)
- [ ] Imports use `import type` for type-only imports
- [ ] All props, types, and JSX attributes are sorted alphabetically
- [ ] File names are `kebab-case`
- [ ] Boolean names use `is`/`has` prefix
- [ ] Constants use `UPPER_SNAKE_CASE`
- [ ] No semicolons, single quotes, 2-space indent
- [ ] No `console.log` (use `console.error` only with eslint-disable)
