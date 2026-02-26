# Research: Checklist Material Refactor

**Branch**: `003-checklist-material-refactor` | **Date**: 2026-02-26

## R1: Angular Material Availability and Theme

**Decision**: Angular Material 21.1 is installed and fully configured — no setup work needed.

**Rationale**: Codebase analysis confirmed:

- `@angular/material` v21.1.5 and `@angular/cdk` v21.1.5 are in `package.json`
- Material 3 theme is configured in `src/material-theme.scss` (Azure primary, Blue tertiary, Roboto typography, density 0)
- Theme is included in `angular.json` styles array
- Material Icons font is loaded via Google Fonts CDN in `src/index.html`

**Alternatives considered**: None — Material is already the project standard per the constitution.

## R3: Material Component Mapping

**Decision**: Use the following element-to-Material mappings:

| Current Element                | Material Replacement                                           | Rationale                                       |
|--------------------------------|----------------------------------------------------------------|-------------------------------------------------|
| `<button>` (Submit)            | `<button mat-raised-button color="primary">`                   | Primary action needs visual emphasis            |
| `<button>` (Reset)             | `<button mat-button>`                                          | Secondary action, less visual weight            |
| `<button>` (Move up/down)      | `<button mat-icon-button>`                                     | Small action icons, compact touch target        |
| `<button>` (Delete)            | `<button mat-icon-button>`                                     | Small action icon, consistent with move buttons |
| `<button>` (Add)               | `<button mat-mini-fab>` or `<button mat-icon-button>`          | Add action alongside input field                |
| Unicode ↑ / ↓ / "Delete" text  | `<mat-icon>` with `arrow_upward` / `arrow_downward` / `delete` | Standard Material icon set, already loaded      |
| `<input type="text">`          | `<mat-form-field><input matInput>`                             | Floating label, focus states, Material styling  |
| `<ul>` / `<li>`                | `<mat-list>` / `<mat-list-item>`                               | Structured list layout with consistent spacing  |
| `<section>` (category wrapper) | `<mat-card>` wrapping existing section content                 | Visual grouping with elevation per FR-008       |

**Alternatives considered**:

- `mat-action-list` instead of `mat-list` — Rejected because items are not clickable as a whole; actions are on individual buttons within each item.
- `mat-nav-list` — Rejected; intended for navigation links.

## R4: CDK Drag-Drop Compatibility with mat-list

**Decision**: Apply `cdkDropList` to `mat-list` and `cdkDrag` to `mat-list-item`. The CDK drag-drop directives are host-agnostic and attach to any element.

**Rationale**: CDK drag-drop works by attaching to the host element via directives. `mat-list` and `mat-list-item` are standard Angular components that accept additional directives. The existing `moveItemInArray` logic and same-container guard remain unchanged.

**Alternatives considered**:

- Wrapping `mat-list-item` in a `div[cdkDrag]` — Rejected as unnecessary nesting; directives can be applied directly to `mat-list-item`.

## R5: Test DOM Query Strategy

**Decision**: Update test queries to use `data-testid` attributes (already present) rather than tag-name selectors. Material components render as custom elements (e.g., `mat-list-item` instead of `li`), so any tests querying by `li` or `button` tag must be updated.

**Rationale**: The existing tests already use `[data-testid="..."]` selectors for most assertions. Any remaining tag-based queries need updating to match the new Material DOM structure.

**Alternatives considered**: None — `data-testid` is the existing convention and is host-element-agnostic.

## R6: Tailwind + Material Coexistence

**Decision**: Continue using Tailwind utilities for layout (flex, gap, padding, margins) on Material components. Material handles component-internal styling; Tailwind handles composition and spacing between components.

**Rationale**: The constitution mandates Tailwind as the sole styling approach. Material component internals are styled by the M3 theme. Layout utilities like `flex`, `gap-2`, `py-2`, `mb-6` can be applied directly to Material component host elements or their wrappers via Tailwind classes.

**Alternatives considered**:

- Removing Tailwind and relying solely on Material's layout utilities — Rejected; contradicts constitution styling mandate and would require adding component CSS files.
