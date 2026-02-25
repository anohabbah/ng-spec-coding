# Research: Checklist Items Template Management

**Feature**: 001-checklist-template-mgmt
**Date**: 2026-02-25

## R1: Angular Reactive Forms with Dynamic FormArrays

**Decision**: Use Angular Reactive Forms with `FormArray` per category, each containing `FormGroup` entries with a `label` `FormControl`.

**Rationale**: Reactive forms are mandated by the constitution (Principle I). `FormArray` natively supports dynamic add/remove/reorder operations and integrates well with CDK drag-drop. The form acts as the local editing state, independent of the store until submit.

**Alternatives considered**:
- Template-driven forms: Rejected per constitution (Principle I mandates Reactive forms). Less control over dynamic form manipulation.
- Signal-based form state without Angular Forms: Rejected—would lose built-in validation, dirty tracking, and reset capabilities that `FormGroup`/`FormArray` provide out of the box.

## R2: CDK Drag-Drop for Reordering

**Decision**: Use `@angular/cdk/drag-drop` (`CdkDropList` + `CdkDrag`) for drag-and-drop reordering within each category. Additionally provide up/down buttons for keyboard accessibility per FR-006.

**Rationale**: CDK is already installed (`@angular/cdk: ~21.1.5`). `CdkDropList` supports restricting drops to the same list (no `cdkDropListConnectedTo`), satisfying FR-007. CDK drag-drop includes built-in keyboard support (arrow keys when focused) and ARIA announcements, meeting Accessibility (Principle VI). Up/down buttons provide an additional non-drag alternative.

**Alternatives considered**:
- Third-party drag libraries (e.g., `@dnd-kit`, `sortablejs`): Rejected per Simplicity principle—adds unnecessary dependency when CDK already provides what's needed.
- Up/down buttons only (no drag-drop): Rejected—drag-and-drop provides faster UX for mouse/touch users. Both approaches will be offered.

## R3: NgRx SignalStore Pattern

**Decision**: Create a feature-scoped `ChecklistTemplateStore` using `signalStore()` from `@ngrx/signals` with `withEntities()`, `withMethods()`, and `withComputed()`.

**Rationale**: Constitution Principle IV mandates NgRx SignalStore for shared/feature state. The store holds the persisted template. The form reads from the store on init/reset and writes to the store on submit. `withComputed()` can expose derived state like total item count.

**Store shape**:
```
state: {
}
methods: {
  saveChecklist(template): void   // Replaces entire state
}
computed: {
  totalItems: number             // Sum of items across all categories
  isEmpty: boolean               // True when all categories are empty
  categories: {
    MORNING: ChecklistItem[],
    EVENING: ChecklistItem[],
    NIGHT: ChecklistItem[]
  }
}
```

**Alternatives considered**:
- Component-local signal state: Rejected—spec requires the store as the source of truth (FR-012), implying shared/persisted state beyond a single component lifecycle.
- Global service with BehaviorSubject: Rejected per Principle IV—signals are the mandated pattern.

## R4: Form-Store Synchronization Pattern

**Decision**: One-way data flow—form reads from store on init and reset; form writes to store on submit only.

**Rationale**: This pattern keeps the form as an isolated editing buffer. Users can freely add, delete, and reorder without affecting the store. Reset restores from store. Submit pushes to store. This satisfies FR-008, FR-009, FR-010, and FR-012.

**Flow**:
1. Page component `OnInit`: read store → build/populate form
2. User edits: form state changes locally (store unchanged)
3. User clicks Reset: re-read store → rebuild form
4. User clicks Submit: read form value → call store `saveChecklist()`

**Alternatives considered**:
- Two-way binding (form auto-syncs with store): Rejected—would make reset impossible and violate the "changes are local until submit" requirement (US2 acceptance scenario 3).

## R5: Lazy Loading Configuration

**Decision**: Define feature routes in `checklist.routes.ts` and lazy-load via `loadChildren` in `app.routes.ts`.

**Rationale**: Constitution Angular Conventions mandate lazy loading for all feature routes. This keeps the initial bundle small and satisfies bundle size quality gates.

**Route path**: `/checklist`

## R6: Zod Validation for Template Data

**Decision**: Define a Zod schema for `ChecklistItem` to validate data at store boundaries.

**Rationale**: Constitution Principle II mandates Zod validation at data boundaries. The schema validates on store save to ensure no empty labels or malformed data enters the persisted state.

**Alternatives considered**:
- Angular form validators only: Insufficient—form validators catch UI-level issues but don't guard the store boundary. Zod provides a second layer of defense.
- No validation on store save: Rejected per Principle II.
