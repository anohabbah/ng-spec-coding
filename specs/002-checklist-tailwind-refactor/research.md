# Research: Checklist Styling Standardization

**Feature Branch**: `002-checklist-tailwind-refactor`
**Date**: 2026-02-26

## R1: Host Element Styling with Tailwind in Angular 21

**Decision**: Use `host: { class: '...' }` in the `@Component` decorator to apply Tailwind utility classes to the host element.

**Rationale**: The constitution (§ Angular Conventions > Styling) explicitly mandates this pattern for `:host` styling. Angular 21 supports the `host` metadata property natively, and Tailwind v4 classes applied this way are processed by the PostCSS pipeline since they appear in template-scanned source files.

**Alternatives considered**:
- `@HostBinding('class')` decorator — rejected; constitution (§ Angular Conventions > Host Bindings) forbids `@HostBinding` in favor of the `host` object.
- Keeping `:host` in a component CSS file — rejected; constitution forbids component CSS files unless Tailwind lacks the required utility.
- `hostDirectives` with a Tailwind wrapper — rejected; over-engineering for static class application.

## R2: Tailwind v4 Arbitrary Value Syntax for Non-Standard Spacing

**Decision**: Use Tailwind v4 arbitrary value syntax `max-w-[800px]` for the 800px max-width that has no standard Tailwind class equivalent.

**Rationale**: The spec (FR-001, FR-005) requires pixel-identical rendering. The closest standard class is `max-w-3xl` (48rem = 768px), which is 32px narrower. Tailwind v4 supports arbitrary values natively without configuration — no `tailwind.config.*` file needed.

**Alternatives considered**:
- `max-w-3xl` (768px) — rejected; violates FR-001 pixel-identical requirement (32px difference).
- `max-w-4xl` (56rem = 896px) — rejected; 96px wider than original.
- CSS custom property with `@theme` — rejected; over-engineering for a single value.

## R3: Element Selector Styles → Template Utility Classes

**Decision**: Replace element selectors (`h1`, `ul`, `li`) with Tailwind utility classes applied directly to those elements in the HTML template.

**Rationale**: This is the standard Tailwind utility-first approach. Each element gets its styling co-located in the template markup, making styling visible at the point of use.

**Mapping**:

| Original CSS | Tailwind Classes |
|---|---|
| `h1 { margin-bottom: 24px; }` | `class="mb-6"` on `<h1>` |
| `ul { list-style: none; padding: 0; margin: 0; }` | `class="list-none p-0 m-0"` on `<ul>` |
| `li { display: flex; align-items: center; gap: 8px; padding: 8px 0; }` | `class="flex items-center gap-2 py-2"` on `<li>` |

**Alternatives considered**:
- `@apply` in a global stylesheet — rejected; constitution forbids `@apply` unless the same combination appears in 5+ locations. These classes are used once each.
- Tailwind `@layer base` resets — rejected; these are component-scoped styles, not global resets.

## R4: Removing `styleUrl` from Component Decorators

**Decision**: Remove the `styleUrl` property entirely from `@Component` decorators after migration, rather than pointing to an empty file.

**Rationale**: The constitution requires that component CSS files MUST NOT exist unless Tailwind lacks the required utility. Leaving an empty file or empty `styleUrl` reference is dead code.

**Alternatives considered**:
- Keep empty CSS file — rejected; dead code, violates constitution.
- Replace `styleUrl` with `styles: []` — rejected; unnecessary property when no styles exist.

## R5: CDK Drag-Drop Styling Compatibility

**Decision**: CDK drag-drop directives (`cdkDropList`, `cdkDrag`) are styling-agnostic and work identically with Tailwind utility classes. No special handling needed.

**Rationale**: CDK drag-drop applies its own runtime classes (`.cdk-drag`, `.cdk-drag-preview`, `.cdk-drop-list-dragging`) independently of component styling approach. The migration only changes how static layout styles are applied — it does not affect CDK's dynamic class management.

**Alternatives considered**: None — CDK drag-drop is orthogonal to the styling approach.

## R6: Test Impact Assessment

**Decision**: Existing tests should pass without modification after the migration.

**Rationale**: All existing tests use `data-testid` attributes and semantic selectors (`app-category-group`, `h2, h3, [role="heading"]`) for querying DOM elements. None of the tests assert on CSS class names, stylesheet presence, or computed styles. The migration changes only how styles are delivered (component CSS → Tailwind utilities), not the DOM structure or component behavior.

**Alternatives considered**: N/A — this is an assessment, not a design choice.
