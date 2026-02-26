# Implementation Plan: Checklist Material Refactor

**Branch**: `003-checklist-material-refactor` | **Date**: 2026-02-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-checklist-material-refactor/spec.md`

## Summary

Replace all plain HTML interactive elements (buttons, inputs, ul/li lists) in the two checklist components (`ChecklistPage` and `CategoryGroup`) with Angular Material equivalents.
Wrap categories in `mat-card`, replace Unicode arrow/text icons with `mat-icon`, use `mat-form-field`+`matInput` for the add-item input, and apply Material button directives to all buttons.
CDK drag-drop integration must be preserved on the Material list. All existing aria-labels, data-testid attributes, reactive form behavior, and test coverage must remain intact.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Angular 21.1
**Primary Dependencies**: Angular Material 21.1, Angular CDK 21.1 (drag-drop), NgRx Signals 21.0, ngrx-toolkit 0.1, Zod 4, Tailwind CSS 4.2
**Storage**: N/A (styling refactor — no data changes)
**Testing**: Vitest 4.0 with Angular TestBed
**Target Platform**: Web (browser)
**Project Type**: Single-page web application
**Performance Goals**: N/A (no performance-sensitive changes)
**Constraints**: Initial bundle < 500 kB warning / 1 MB error; component styles < 4 kB warning / 8 kB error
**Scale/Scope**: 2 components, 2 templates, 2 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle                           | Status | Notes                                                                                                                    |
|-------------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| I. Component-First                  | PASS   | No new components created; existing standalone OnPush components preserved. FormBuilder already in use.                  |
| II. Type Safety                     | PASS   | No type changes; strict mode unaffected.                                                                                 |
| III. Test-First (NON-NEGOTIABLE)    | PASS   | Existing tests must be updated to account for new Material DOM structure; tests written/updated before template changes. |
| IV. Signal-First State              | PASS   | No state changes; signals and store untouched.                                                                           |
| V. Simplicity (YAGNI)               | PASS   | 1:1 element replacement, no new abstractions or features.                                                                |
| VI. Accessibility                   | PASS   | Material components provide built-in a11y; existing aria-labels preserved.                                               |
| Angular Conventions > UI Components | PASS   | This feature directly fulfills the mandate: "Angular Material MUST be the default choice for all UI elements."           |
| Angular Conventions > Styling       | PASS   | Tailwind CSS remains sole styling approach; no component CSS files created.                                              |
| Quality Gates > UI Components       | PASS   | After refactor, no plain HTML elements will exist where Material equivalents are available.                              |
| Quality Gates > Styling             | PASS   | No component CSS files introduced.                                                                                       |

**Pre-Phase 0 Gate**: PASSED — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-checklist-material-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.config.ts                          # No changes (animations provider deprecated since Angular 20.2)
│   └── checklist/
│       ├── checklist.page.ts                  # Update imports (Material modules)
│       ├── checklist.page.html                # Replace buttons with mat-button, wrap in mat-card
│       ├── checklist.page.spec.ts             # Update DOM queries for Material elements
│       ├── checklist.model.ts                 # No changes
│       ├── checklist.store.ts                 # No changes
│       ├── checklist.store.spec.ts            # No changes
│       └── category-group/
│           ├── category-group.ts              # Update imports (Material modules)
│           ├── category-group.html            # Replace buttons, input, ul/li with Material
│           └── category-group.spec.ts         # Update DOM queries for Material elements
└── material-theme.scss                        # No changes (already configured M3 Azure/Blue)
```

**Structure Decision**: Single-project Angular SPA. All changes are confined to the `src/app/checklist/` feature directory. No new files created. (`app.config.ts` is NOT modified — `provideAnimationsAsync()` was deprecated in Angular 20.2 and Angular Material 21 handles animations internally.)

## Complexity Tracking

No constitution violations — this section is not applicable.
