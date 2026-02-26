# Implementation Plan: Checklist Items Template Management

**Branch**: `001-checklist-template-mgmt` | **Date**: 2026-02-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-checklist-template-mgmt/spec.md`

## Summary

Build a checklist items template management page as an Angular dynamic Reactive form. Items are grouped into three fixed categories (MORNING, EVENING, NIGHT). Users can add, delete, and reorder items within each category, then submit changes to persist them to an NgRx SignalStore or reset to discard unsaved edits. The page pre-populates from the store on navigation.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Angular 21.1
**Primary Dependencies**: Angular Material 21.1, Angular CDK 21.1 (drag-drop), NgRx Signals 21.0, ngrx-toolkit 0.1, Zod 4, Tailwind CSS 4
**Storage**: NgRx SignalStore with ngrx-toolkit `withStorageSync()` for localStorage persistence (no backend)
**Testing**: Vitest 4 with jsdom
**Target Platform**: Web (modern browsers)
**Project Type**: Single-page web application
**Performance Goals**: Page load with 30 items < 1s; drag reorder < 100ms visual feedback
**Constraints**: Initial bundle < 500kB; component styles < 4kB each
**Scale/Scope**: Single management page, 3 categories, up to ~30 items total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle              | Gate                                                                                                                         | Status |
|------------------------|------------------------------------------------------------------------------------------------------------------------------|--------|
| I. Component-First     | Page component + category-group child component, each standalone with `input()`/`output()`, OnPush, Reactive forms with `FormBuilder` (v1.3.0) | PASS   |
| II. Type Safety        | Strict TS, Zod schema for template validation, typed interfaces for all entities                                             | PASS   |
| III. Test-First        | Vitest specs written before implementation for store, page component, and category-group component                           | PASS   |
| IV. Signal-First State | NgRx SignalStore as single source of truth; `computed()` for derived state; no `mutate`                                      | PASS   |
| V. Simplicity          | Minimal component count (page + category-group); no premature abstractions; Angular CLI conventions                          | PASS   |
| VI. Accessibility      | CDK drag-drop provides built-in a11y (live announcements, keyboard support); up/down button alternative for keyboard users; ARIA labels on actions; WCAG AA compliance. No custom interactive patterns matching @angular/aria list (Listbox, Tabs, etc.); native form controls and CDK suffice. | PASS   |
| Angular Conventions    | Native control flow, `inject()`, `providedIn: 'root'` or feature-scoped store, `host` object for bindings, lazy-loaded route | PASS   |
| Quality Gates          | Build, tests, bundle budgets, type check, formatting all enforced                                                            | PASS   |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-checklist-template-mgmt/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/app/
├── checklist/
│   ├── checklist.model.ts        # Types, interfaces, Zod schemas
│   ├── checklist.routes.ts       # Lazy-loaded feature routes
│   ├── checklist.store.ts        # NgRx SignalStore with entities feature
│   ├── checklist.store.spec.ts   # Store tests
│   ├── checklist.page.ts     # Page component (form host)
│   ├── checklist.page.html   # Page template
│   ├── checklist.page.css    # Page styles
│   ├── checklist.page.spec.ts
│   └── category-group/
│       ├── category-group.ts              # Category group component
│       ├── category-group.html            # Category group template
│       ├── category-group.css             # Category group styles
│       └── category-group.spec.ts
├── app.routes.ts                          # Updated with lazy route
└── app.config.ts                          # No changes needed
```

**Structure Decision**: Single Angular application with a feature folder (`checklist/`) containing the page component, a reusable category-group child component, and a co-located SignalStore. The feature route is lazy-loaded per constitution routing conventions.

## Complexity Tracking

No violations. No entries needed.
