---
trigger: always_on
glob:
description: Project architecture — folder structure, API route patterns, service layer, and Axios configuration.
---

# Project Architecture

> Project structure and architecture patterns for the Smart Transformer CRM project.
> All contributors and AI assistants **must** follow these rules.

---

## 1. Project Structure

```text
src/
├── app/                          # Next.js App Router
│   ├── (private)/                # Authenticated route group
│   ├── api/                      # API route handlers
│   │   └── transformers/
│   │       ├── route.ts          # GET/POST/etc handlers
│   │       └── service.ts        # Business logic (not in route.ts)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles (Tailwind v4)
│
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn primitives (Badge, Button, Card…)
│   ├── layout/                   # Layout components (Sidebar, Header…)
│   ├── navigation/               # Navigation components
│   ├── form/                     # Shared form components
│   └── page-header.tsx           # Shared page header
│
├── features/                     # Feature modules (domain-scoped)
│   └── transformers/
│       ├── components/           # Feature-specific components
│       │   ├── index.ts          # Barrel exports
│       │   ├── transformer-table.tsx
│       │   └── transformer-filter.tsx
│       ├── hooks/                # Feature-specific hooks
│       │   └── use-transformer-search-params.ts
│       └── index.tsx             # Feature page component
│
├── hooks/                        # Shared custom hooks
├── lib/                          # Library wrappers & utilities
│   ├── axios/                    # Axios instances (iot-api, next-api)
│   ├── auth/                     # Auth configuration
│   └── utils.ts                  # cn() helper
│
├── constants/                    # App-wide constants
├── config/                       # App configuration
├── providers/                    # React context providers
├── store/                        # Zustand stores
├── types/                        # Shared TypeScript types
├── utils/                        # Pure utility functions
├── i18n/                         # Internationalization
├── assets/                       # Static assets (fonts, files)
└── mock-data/                    # Mock/seed JSON data
```

### Key Structural Rules

- **Feature modules** (`src/features/`) are self-contained: each has its own `components/`, `hooks/`, and optionally `lib/`.
- **API routes** (`src/app/api/`) keep handlers thin — extract all business logic into a co-located `service.ts`.
- **Barrel exports** (`index.ts`) are used for features, components, providers, and lib to keep imports clean.
- **Shared code** goes in `src/hooks/`, `src/utils/`, `src/types/`, `src/lib/` — feature-specific code stays inside `src/features/`.

---

## 2. API Route Handlers

Route handlers (`route.ts`) are thin — they parse the request, call the service, and return a response.

```tsx
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getTransformers } from './service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(searchParams.get('limit')) || 10)
    const search = searchParams.get('search') ?? ''

    const result = await getTransformers({ limit, page, search })
    return NextResponse.json(result)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching transformers:', error)
    return NextResponse.json(
      { error: 'Failed to load transformers' },
      { status: 500 }
    )
  }
}
```

---

## 3. Service Layer

All business logic lives in **`service.ts`** — never in route handlers.

### Service Function Pattern

- Accept an options object with named params, destructured with defaults.
- Return typed responses.
- Use section dividers for public vs private helpers.

```tsx
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

type GetTransformersParams = {
  capacity?: string[]
  district?: string[]
  limit?: number
  page?: number
  search?: string
}

export async function getTransformers({
  capacity = [],
  limit = 10,
  page = 1,
  search = '',
}: GetTransformersParams = {}): Promise<PaginatedResponse<Transformer>> {
  // 1. Load data
  // 2. Apply filters
  // 3. Paginate
  // 4. Fetch external data (IoT)
  // 5. Merge and return
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function parseCsvValue(raw: string | null | undefined): string | null {
  // …
}
```

---

## 4. Axios Instances (`src/lib/axios/`)

### `nextApi` — Client → Next.js API routes

```tsx
import axios from 'axios'

export const nextApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

nextApi.interceptors.response.use((response) => response.data)
```

### `iotApi` — Server → External ThingWorx API

```tsx
'use server'

import axios from 'axios'

export const iotApi = axios.create({
  baseURL: process.env.IOT_API_URL,
  headers: {
    Accept: 'application/json',
    appKey: process.env.IOT_SECRET,
    'Content-Type': 'application/json',
  },
})

iotApi.interceptors.response.use((response) => response.data)
```

### Key Points

- Both instances strip the Axios response wrapper via `response.data` interceptor.
- `nextApi` is used in client components for internal API calls.
- `iotApi` is server-only — marked with `'use server'` and uses env variables.

---

## 5. Providers (`src/providers/`)

- Wrap the app with context providers in `layout.tsx`.
- Each provider is a separate file, re-exported via `index.ts` barrel.
- Use `'use client'` directive on provider files.

```tsx
// layout.tsx
import { TanstackProvider, ToasterProvider } from '~/providers'

export default async function RootLayout({ children }) {
  return (
    <TanstackProvider>
      <NuqsAdapter>
        <Suspense>{children}</Suspense>
      </NuqsAdapter>
      <ToasterProvider />
    </TanstackProvider>
  )
}
```

---

## 6. Type Files (`src/types/`)

- One type file per domain: `transformer.ts`, `paginated.ts`.
- All types use `export type` — never `interface`.
- JSDoc comments on every property.

```tsx
/** Basic transformer information */
export type Transformer = {
  /** Transformer capacity (kVA) */
  capacity: number
  /** Unique transformer identifier */
  id: string
  /** Current connection status */
  status: TransformerStatus
}

/** Generic paginated API response */
export type PaginatedResponse<T> = {
  data: T[]
  total: number
}
```

---

## Quick Reference Checklist

- [ ] API business logic lives in `service.ts`, not `route.ts`
- [ ] Feature code is scoped inside `src/features/<name>/`
- [ ] Barrel exports (`index.ts`) for features, components, providers, lib
- [ ] Shared code in `src/hooks/`, `src/utils/`, `src/types/`, `src/lib/`
- [ ] Axios instances strip response wrapper via interceptor
- [ ] Service functions accept an options object with defaults
- [ ] Type files have JSDoc on every property
