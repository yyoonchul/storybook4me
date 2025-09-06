---
description: React project rules
globs: 
alwaysApply: false
---
## 🛠️ Frontend “Cursor Rules” — **React 19 + TypeScript + React Router DOM + Supabase**

> Use these guidelines when you create or review code for our web-novel platform. They replace the previous Next.js-focused rules.

---

### 📌 Core Folder Structure Principles (Initial Stage)

1. **Feature-Centric**

   * All new code should be organized under `features/<feature-name>/`.

2. **Create Only When Needed**

   * Create folders and files only for what you're using "today".

3. **Single Responsibility**

   * Components, hooks, APIs, and services should have one role per file.

4. **Internal Layers**

   * Classify `ui/ hooks/ api/ services/ tests/` only within feature folders.

5. **Common Code Promotion Rule**

   * Move to `shared/` only when the same logic is reused in **3 or more places**.

6. **Fixed Top-Level Structure**

   * Maintain only **`assets/ shared/ features/`** three folders at the top level.

> Following these 6 principles ensures both MVP speed and future scalability.

# Project Frontend Rules

## UI Component Usage Rules

1. Prioritize Common Components
   - Use components from src/shared/ui as priority
   - Utilize basic components like Button, Card, Input, Badge
   - Apply custom styles using Tailwind classes

2. Document Reference
   - Check docs/ui-guide.md document first
   - Refer to component usage and example code
   - Follow design tokens and layout guidelines

3. Component Import Paths
   - Use relative paths: "../../../shared/ui/[component]"
   - Prohibit use of path alias (@/)

4. Page Layout
   - Use container + max-w-{size} pattern
   - Apply consistent spacing system
   - Consider responsive design

5. State Handling
   - Always implement loading/error states
   - Utilize examples from UI guide

## File Structure

features/
  ├── [feature_1]]/
  │   ├── ui/          # Components
  │   ├── hooks/       # Custom hooks
  │   ├── api/         # API calls
  │   └── types/       # Type definitions
  └── [feature_2]/
      ├── ui/
      ├── hooks/
      ├── api/
      └── types/

shared/
  ├── ui/             # Common components
  ├── lib/            # Utilities
  ├── hooks/          # Common hooks
  └── types/          # Common types 
---

### 1. Code Style & Structure

| Theme                   | Guideline                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language & Paradigm** | Write idiomatic **TypeScript** using *functional, declarative* React 19 patterns only—no class components.                                                    |
| **Type Safety**         | Provide full, explicit types; prefer **type aliases** & **interfaces** over `any`. Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. |
| **File/Folder Naming**  | `kebab-case` for folders, `PascalCase.tsx` for components, `camelCase.ts` for hooks & utils (`components/auth-wizard/AuthWizard.tsx`).                        |
| **Modularity**          | Break UI into small composable pieces. Put one React component or hook per file. Use barrel files (`index.ts`) only for public APIs.                          |
| **Utilities**           | Centralize helpers in `/lib` and shared hooks in `/hooks`. Keep each helper pure and side-effect-free.                                                        |

---

### 2. Routing & Navigation

* Use **React Router DOM v6** with data routers and `<Suspense>` for deferred/lazy data loading.
* colocate route components under `routes/` mirroring the URL structure.
* Favor **loader/actions** (v6.22+) to keep data fetching outside render paths and to enable optimistic UI.

---

### 3. State Management & Data Fetching

| Concern             | Guideline                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Global State**    | Use **Zustand** for non-server state (UI, feature flags). Keep each store flat & serializable.                                                               |
| **Server Data**     | Use **TanStack React Query** with Supabase RPC / SQL views. Define **query keys** in `/lib/queryKeys.ts`.                                                    |
| **Supabase Client** | Wrap `createClient()` in `/lib/supabaseBrowser.ts` and `/lib/supabaseServer.ts` (for Node scripts/tests) to avoid re-instantiation.                          |
| **Realtime**        | Use Supabase channel subscriptions inside custom hooks (`useChannel`) and expose snapshot state through TanStack Query’s `setQueryData` for cache coherence. |

---

### 4. Validation, Security & Error Handling

* **Zod** schemas for every external boundary (forms, route loaders, Supabase RPC payloads).
* Sanitize rich-text or user HTML with `sanitize-html`.
* Prevent XSS/CSRF:

  * Rely on Supabase’s **Row-Level Security (RLS)**—no direct `service_role` usage in the browser.
  * Use `SameSite=Lax` cookies for auth where needed.
* Apply **guard clauses** and throw custom `AppError` subclasses; catch with an `<ErrorBoundary>` per route.

---

### 5. Performance & Optimization

| Area                   | Practice                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Rendering**          | Leverage React 19 *compiler* (automatic memoization) where possible; avoid unnecessary `useEffect`.                       |
| **Code-Splitting**     | Use `React.lazy` + `Suspense` or `import()` inside route loaders; set webpack chunk names for clarity.                    |
| **Images**             | Import `.webp` or `.avif` only, specify `width`/`height`, enable `loading="lazy"` and decode using `fetchpriority="low"`. |
| **Caching**            | Configure React Query `staleTime` / `cacheTime` per use-case; prefer **server-side paging** in Supabase queries.          |
| **Accessibility & UX** | Default to **Radix Primitives** wrapped in **Shadcn UI** components; always set `aria-*` props.                           |

---

### 6. Styling System

* **Tailwind CSS** (JIT mode) — keep class lists short with `@apply` in component-scoped `*.module.css` when readability suffers.
* Use **CSS variables** for theme tokens; store them in `:root` and reference in Tailwind config.
* Follow a 4-point spacing scale (`1, 1.5, 2, 3, 4, 6, 8`).

---

### 7. Testing & Quality Gates

| Layer                  | Tools & Conventions                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Unit / Integration** | **Jest** + **React Testing Library**; name files `*.test.tsx`. Mock Supabase with `@supabase/supabase-js` stubs.                  |
| **E2E**                | **Playwright**; tests run against local Supabase docker stack.                                                                    |
| **Coverage**           | Maintain ≥ 80 % statements; block PRs below threshold.                                                                            |
| **CI**                 | ESLint (`eslint-config-next` replaced with custom React 19 config), Prettier, TypeScript `--noEmit` type-check, Jest, Playwright. |

---

### 8. Documentation & Maintainability

* **JSDoc** on complex functions; keep them terse.
* Each folder has a `README.md` describing its public surface.
* Use **changesets** + **Conventional Commits** for versioning and automated changelog generation.
* Dependabot enabled; run `pnpm audit` in CI.

---

### 9. Output Expectations for New Code

1. **Type-safe, production-ready** React 19 functional components.
2. Supabase queries wrapped in React Query hooks with proper typing and optimistic updates.
3. Tailwind + Shadcn styled UI that is responsive and accessible.
4. Complete Zod validation and uniform error handling.
5. Corresponding Jest/RTL tests *and* Playwright E2E script skeletons.

> **Follow these rules rigorously** to ensure our codebase remains clean, secure, and scalable.
