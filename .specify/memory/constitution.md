<!--
  Sync Impact Report
  ==================
  Version change: 1.4.0 → 1.5.0

  Modified principles:
    - III. Test-First → expanded to mandate `/tdd` skill for ALL
      task execution; TDD is no longer just a guideline but an
      enforced workflow via the /tdd skill's red-green-refactor loop

  Added sections: N/A

  Removed sections: N/A

  Modified sections:
    - Quality Gates → added TDD Workflow gate mandating `/tdd` skill
    - Principle III bullet list → added /tdd skill mandate and
      explicit prohibition of implementing without running /tdd first

  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed
      (Constitution Check references constitution dynamically)
    - .specify/templates/spec-template.md ✅ no changes needed
      (no hardcoded principle references)
    - .specify/templates/tasks-template.md ✅ updated: tests changed
      from OPTIONAL to MANDATORY, /tdd skill usage mandated
    - .specify/templates/commands/*.md ✅ no command files exist

  Follow-up TODOs:
    - Existing code in src/app/checklist/ uses custom CSS files
      (checklist.page.css, category-group.css) instead of Tailwind
      utilities. Refactor to Tailwind in a follow-up PR.
    - Existing code in src/app/checklist/ uses plain HTML elements
      (button, input, ul/li) instead of Angular Material components.
      Refactor to Material in a follow-up PR.
    - Existing code in src/app/checklist/ uses manual FormGroup/
      FormControl/FormArray instantiation. Refactor to use
      FormBuilder in a follow-up PR.
-->

# Angular Sample Constitution

## Core Principles

### I. Component-First

Every feature MUST start as a standalone Angular component with clearly
defined inputs and outputs. Components MUST:

- Use `input()` and `output()` signal functions instead of `@Input()`
  and `@Output()` decorators
- NOT set `standalone: true` in decorators—it is the default in
  Angular v20+
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in the
  `@Component` decorator
- Use `computed()` for all derived state
- Be small and focused on a single responsibility
- Be independently testable in isolation
- Prefer inline templates for small components
- Prefer Reactive forms over Template-driven forms
- Prefer `FormBuilder` (via `inject(FormBuilder)`) to construct
  `FormGroup`, `FormControl`, and `FormArray` instances instead of
  manual `new FormGroup()` / `new FormControl()` / `new FormArray()`
  instantiation
- Use paths relative to the component TS file for external
  templates/styles

**Rationale**: Component isolation enables parallel development,
simplifies testing, and enforces clean interfaces between features.
Signal-based inputs/outputs align with Angular's modern reactivity
model.

### II. Type Safety

Strict TypeScript MUST be enforced across the entire codebase:

- `strict: true` in tsconfig with no escape hatches
- `any` type is forbidden; use `unknown` with type guards when types
  are uncertain
- Prefer type inference when the type is obvious; explicit annotations
  MUST be used when inference is ambiguous
- Zod schemas MUST validate all external data boundaries (API
  responses, form inputs, route params)
- Interfaces and types MUST be defined for all data structures

**Rationale**: Type safety catches bugs at compile time, serves as
living documentation, and enables confident refactoring.

### III. Test-First via `/tdd` Skill (NON-NEGOTIABLE)

TDD MUST be followed for ALL feature development. Every task MUST
be executed exclusively through the `/tdd` skill's red-green-refactor
loop:

- Every task MUST be implemented by invoking `/tdd`—direct
  implementation without `/tdd` is FORBIDDEN
- `/tdd` enforces the red-green-refactor cycle: write a failing
  Vitest spec → implement minimum code to pass → refactor
- Write Vitest specs FIRST
- Verify specs FAIL before writing any implementation code
- Implement the minimum code to pass specs—no more
- Refactor only after green (all specs pass)
- Every component MUST have a corresponding `.spec.ts` file
- No task is considered complete until it has passed through the
  full `/tdd` red-green-refactor cycle

**Rationale**: Test-first development prevents gold-plating, ensures
requirements are met, and provides regression safety. Mandating the
`/tdd` skill ensures the red-green-refactor discipline is
consistently enforced—not left to developer discretion.

### IV. Signal-First State

State management MUST use NgRx Signals as the primary pattern:

- Component-local state uses Angular signals
- Shared/feature state uses NgRx SignalStore
- Use `computed()` for all derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals; use `update` or `set` instead
- RxJS observables are permitted for async streams (HTTP, WebSocket)
  but MUST be converted to signals at component boundaries
- Global mutable state outside of stores is forbidden

**Rationale**: Signal-based state management aligns with Angular's
reactivity model, improves change detection performance, and provides
clear state ownership.

### V. Simplicity (YAGNI)

Start simple and avoid premature abstractions:

- Implement only what is currently needed—no speculative features
- Prefer Angular's built-in patterns over custom abstractions
- Three similar lines of code are better than a premature abstraction
- Complexity MUST be justified in code review before merging
- Follow Angular CLI conventions for file structure and naming

**Rationale**: Simplicity reduces cognitive load, speeds development,
and makes the codebase accessible to new contributors.

### VI. Accessibility

All UI MUST be accessible by default:

- MUST pass all AXE automated checks
- MUST follow all WCAG AA minimums, including focus management, color
  contrast, and ARIA attributes
- Accessibility MUST be verified during development, not deferred to
  a later phase
- Custom interactive components MUST use `@angular/aria` directives
  to implement WAI-ARIA patterns (keyboard navigation, focus
  management, ARIA attributes, screen reader announcements)
- When neither Angular Material nor native HTML elements meet the
  requirement, `@angular/aria` directives MUST be used instead of
  manually implementing ARIA attributes and keyboard handlers

**Rationale**: Accessibility is a fundamental quality attribute, not
an afterthought. `@angular/aria` provides headless, WAI-ARIA-compliant
directives that handle complex keyboard interactions, focus management,
and screen reader support—eliminating the need for error-prone manual
ARIA implementation.

## Angular Conventions

These conventions are derived from the Angular team's recommended
guidelines and MUST be followed in all code:

### UI Components

Angular Material MUST be the default choice for all UI elements:

- When Angular Material provides a component that matches the UI
  need, it MUST be used instead of plain HTML elements
- Common mappings (non-exhaustive):
  - Buttons → `mat-button`, `mat-raised-button`, `mat-icon-button`
  - Text inputs → `mat-form-field` + `matInput`
  - Lists → `mat-list` + `mat-list-item`
  - Cards/panels → `mat-card`
  - Checkboxes → `mat-checkbox`
  - Icons → `mat-icon`
  - Dialogs → `MatDialog` service
  - Menus → `mat-menu`
  - Tables → `mat-table`
  - Expansion panels → `mat-expansion-panel`
  - Toolbars → `mat-toolbar`
  - Dividers → `mat-divider`
- Plain HTML elements (e.g., `<button>`, `<input>`, `<ul>`) MUST NOT
  be used when an Angular Material equivalent exists
- Angular CDK primitives (e.g., `CdkDragDrop`, `CdkVirtualScroll`)
  MUST be used for behaviors not covered by Material components
- When no Material component or CDK primitive fits, plain HTML with
  `@angular/aria` directives is permitted

**Rationale**: Angular Material components provide consistent theming,
built-in accessibility (keyboard nav, ARIA, focus management), and
responsive behavior out of the box. Using plain HTML duplicates this
effort, introduces inconsistency, and risks accessibility gaps.

### Styling

Tailwind CSS MUST be the sole styling approach:

- All visual styling MUST use Tailwind CSS utility classes in
  templates
- For `:host` element styling, use `host: { class: '...' }` in the
  `@Component` decorator with Tailwind utility classes (e.g.,
  `host: { class: 'block max-w-screen-md mx-auto px-4 py-6' }`)
- Component CSS/SCSS files MUST NOT be created unless Tailwind CSS
  lacks the required utility
- When custom CSS is unavoidable, it MUST include a comment
  explaining why no Tailwind equivalent exists
- Do NOT use `@apply` to extract Tailwind utilities into custom CSS
  classes unless the same combination appears in 5+ locations
- Do NOT use inline `style` attributes or `[style.*]` bindings;
  use Tailwind classes or Angular Material theming instead
- Angular Material component theming MUST use the Material theming
  system (CSS custom properties / `@angular/material` theme mixins),
  not custom CSS overrides

**Rationale**: Tailwind CSS provides a comprehensive utility-first
system that eliminates the need for custom stylesheets, ensures
consistency, reduces CSS bloat, and keeps styling co-located with
markup. Custom CSS fragments scattered across component files lead
to duplication, specificity conflicts, and maintenance burden.

### Templates

- Use native control flow (`@if`, `@for`, `@switch`) instead of
  `*ngIf`, `*ngFor`, `*ngSwitch`
- Keep templates simple and avoid complex logic
- Use the async pipe to handle observables in templates
- Do NOT assume globals like `new Date()` are available in templates
- Do NOT write arrow functions in templates (they are not supported)
- Do NOT use `ngClass`; use `class` bindings instead
- Do NOT use `ngStyle`; use `style` bindings instead

### Services

- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use the `inject()` function instead of constructor injection

### Host Bindings

- Do NOT use `@HostBinding` or `@HostListener` decorators
- Put host bindings inside the `host` object of the `@Component` or
  `@Directive` decorator

### Images

- Use `NgOptimizedImage` for all static images
- `NgOptimizedImage` does not work for inline base64 images; use
  standard `<img>` tags for those

### File Naming

- Page components MUST use the `.page.` infix
  (e.g., `feature.page.ts`, `feature.page.html`, `feature.page.spec.ts`)
- Child/shared components keep the default hyphenated name
  (e.g., `category-group.ts`)

### Routing

- Implement lazy loading for all feature routes

### Accessibility

- Import `@angular/aria` directives from their specific subpackages
  (e.g., `@angular/aria/toolbar`, `@angular/aria/tabs`,
  `@angular/aria/listbox`)
- Use `@angular/aria` directives for these interactive patterns when
  building custom components: Listbox, Select, Combobox, Autocomplete,
  Tabs, Accordion, Tree, Grid, Toolbar, Menu, Menubar
- Do NOT manually implement keyboard navigation or ARIA attributes
  for patterns that `@angular/aria` already covers
- Apply directives to standard HTML elements or custom component host
  elements—`@angular/aria` is headless and does not impose styling

## Technology Stack

- **Framework**: Angular 21+ with standalone components
- **UI Components**: Angular Material 21+ (MUST be used for all UI
  elements when a suitable component exists)
- **Styling**: Tailwind CSS 4 (MUST be the sole styling approach;
  custom CSS forbidden unless Tailwind lacks the utility)
- **Accessibility**: @angular/aria (headless WAI-ARIA directives)
- **State**: NgRx Signals + ngrx-toolkit
- **Validation**: Zod 4
- **Testing**: Vitest 4 with jsdom
- **Build**: Angular CLI with `@angular/build`
- **Package Manager**: npm
- **TypeScript**: 5.9+ with strict mode
- **Formatting**: Prettier (100 char width, single quotes,
  Angular HTML parser)

Technology additions or replacements MUST be documented with rationale
and approved before integration.

## Quality Gates

All code MUST pass these gates before merging:

- **Build**: `ng build` MUST complete without errors
- **Tests**: `ng test` MUST pass with no failures
- **TDD Workflow**: Every task MUST be executed via the `/tdd` skill;
  PRs without evidence of red-green-refactor cycle MUST be rejected
- **UI Components**: Plain HTML elements MUST NOT be used when an
  Angular Material equivalent exists; reviewer MUST reject violations
- **Styling**: All styling MUST use Tailwind CSS utility classes;
  component CSS files MUST NOT exist unless justified with a comment
  explaining why Tailwind is insufficient
- **Accessibility**: MUST pass AXE checks; MUST meet WCAG AA minimums;
  custom interactive components MUST use `@angular/aria` directives
  for keyboard navigation and focus management
- **Bundle Size**: Initial bundle MUST stay under 500kB warning /
  1MB error threshold
- **Component Styles**: Any component style MUST stay under 4kB
  warning / 8kB error threshold
- **Type Check**: No `any` types, no unused imports
- **Formatting**: Prettier MUST be run; unformatted code MUST be
  rejected

## Governance

This constitution is the highest-authority document for the Angular
Sample project. All development decisions, code reviews, and
architectural choices MUST comply with these principles.

**Amendment Procedure**:

1. Propose changes with rationale in a dedicated PR
2. All active contributors MUST review and approve
3. Changes MUST include a migration plan for existing code if applicable
4. Version MUST be incremented per the versioning policy below

**Versioning Policy**:

- MAJOR: Principle removal, redefinition, or backward-incompatible
  governance change
- MINOR: New principle added or existing principle materially expanded
- PATCH: Clarifications, wording fixes, non-semantic refinements

**Compliance Review**:

- Every PR MUST be checked against these principles
- Complexity violations MUST be justified before approval
- Quarterly review of constitution relevance is RECOMMENDED

**Version**: 1.5.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-03-19
