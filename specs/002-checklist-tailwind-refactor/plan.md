# Implementation Plan: Checklist Styling Standardization

**Branch**: `002-checklist-tailwind-refactor` | **Date**: 2026-02-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-checklist-tailwind-refactor/spec.md`

## Summary

Migrate two checklist components (`ChecklistPage`, `CategoryGroup`) from component-level CSS files to Tailwind CSS utility classes. The refactoring replaces `:host` selectors with Angular's `host: { class: '...' }` decorator property, moves element-scoped styles (`h1`, `ul`, `li`) to template-inline Tailwind classes, and deletes the orphaned CSS files. The result is pixel-identical rendering with zero component stylesheets.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Angular 21.1
**Primary Dependencies**: Tailwind CSS 4.2.1, Angular Material 21.1, Angular CDK 21.1 (drag-drop)
**Storage**: N/A (styling refactor — no data changes)
**Testing**: Vitest 4 with jsdom
**Target Platform**: Web (SPA, all modern browsers)
**Project Type**: Web application (Angular SPA)
**Performance Goals**: N/A (no runtime behavior changes)
**Constraints**: Pixel-identical rendering before/after; zero build errors/warnings
**Scale/Scope**: 2 components, 2 CSS files, 2 HTML templates, 2 TypeScript files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|---|---|---|
| **Styling** (Tailwind-first) | PASS after fix | This feature directly resolves the violation: component CSS files exist today and will be removed. |
| **UI Components** (Material-first) | OUT OF SCOPE | The spec targets Tailwind migration only. Material migration is a separate follow-up (noted in constitution sync report). Plain HTML elements remain for now. |
| **Component-First** (OnPush, signals) | PASS | Both components already use `ChangeDetectionStrategy.OnPush` and signal-based inputs. No changes needed. |
| **Type Safety** (strict TS) | PASS | No TypeScript logic changes. |
| **Test-First** (TDD) | PASS | Existing tests cover all behavior. Migration is style-only; no new behavior requires new tests. Tests will be run to confirm no regressions. |
| **Simplicity** (YAGNI) | PASS | Direct 1:1 mapping from CSS rules to Tailwind utilities. No abstractions introduced. |
| **Accessibility** | PASS | No ARIA attributes, keyboard handling, or focus management affected. Template structure unchanged. |
| **Host Bindings** | PASS after fix | `:host` CSS selectors will be replaced with `host: { class: '...' }` in `@Component` decorators per constitution mandate. |
| **Build** | PASS | Will verify `ng build` succeeds after migration. |
| **Bundle Size** | PASS | Removing component CSS files reduces bundle; Tailwind utilities are already in the global stylesheet. |
| **Formatting** | PASS | Prettier will be run on all modified files. |

**Pre-design gate**: PASS — no violations. The feature itself is the fix for the existing styling violation.

## Project Structure

### Documentation (this feature)

```text
specs/002-checklist-tailwind-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output — Tailwind migration decisions
├── data-model.md        # Phase 1 output — N/A (no data changes)
├── quickstart.md        # Phase 1 output — verification steps
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (affected files)

```text
src/app/checklist/
├── checklist.page.ts          # MODIFY: remove styleUrl, add host classes
├── checklist.page.html        # MODIFY: add Tailwind classes to <h1>, action div
├── checklist.page.css         # DELETE: migrated to Tailwind
├── category-group/
│   ├── category-group.ts      # MODIFY: remove styleUrl, add host classes
│   ├── category-group.html    # MODIFY: add Tailwind classes to <ul>, <li>, add-item div
│   └── category-group.css     # DELETE: migrated to Tailwind
```

**Structure Decision**: Single Angular SPA project. All changes are within the existing `src/app/checklist/` directory. No new files created; 2 files deleted, 4 files modified.

## Migration Mapping

### ChecklistPage (`checklist.page.css` → Tailwind)

| Original CSS | Tailwind Equivalent | Applied To |
|---|---|---|
| `:host { display: block; max-width: 800px; margin: 0 auto; padding: 24px 16px; }` | `block max-w-[800px] mx-auto py-6 px-4` | `host: { class: '...' }` in `@Component` |
| `h1 { margin-bottom: 24px; }` | `mb-6` | `class` attribute on `<h1>` in template |

### CategoryGroup (`category-group.css` → Tailwind)

| Original CSS | Tailwind Equivalent | Applied To |
|---|---|---|
| `:host { display: block; }` | `block` | `host: { class: '...' }` in `@Component` |
| `ul { list-style: none; padding: 0; margin: 0; }` | `list-none p-0 m-0` | `class` attribute on `<ul>` in template |
| `li { display: flex; align-items: center; gap: 8px; padding: 8px 0; }` | `flex items-center gap-2 py-2` | `class` attribute on `<li>` in template |

## Complexity Tracking

No violations to justify. This feature resolves an existing violation; it does not introduce any new complexity.
