# Tasks: Checklist Material Refactor

**Input**: Design documents from `/specs/003-checklist-material-refactor/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Constitution mandates Test-First (NON-NEGOTIABLE). Existing test files must be updated to expect Material DOM structure before templates are changed. Tests should FAIL after update, then PASS once templates are refactored.

**Organization**: US1 (Material appearance) and US2 (preserved functionality) are both P1 and every template change touches both simultaneously — they share the same implementation phase, organized by component. US3 (accessibility) is a P2 verification phase.

**Phases 0–1 (complete)**: Research and design artifacts (research.md, data-model.md, quickstart.md) were produced prior to task generation. Task numbering and phase numbering begin at 2 accordingly.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 2: US1 + US2 — CategoryGroup Material Migration (Priority: P1) MVP

**Goal**: Replace all plain HTML elements in the CategoryGroup component with Angular Material equivalents while preserving all existing functionality (add, delete, reorder, drag-drop).

**Independent Test**: Load the checklist page, verify each category renders with Material list, Material icon buttons, Material form field input, and Material card wrapper. Exercise add/delete/reorder/drag-drop — all must work identically.

### Test Updates for CategoryGroup

> **Update tests FIRST, verify they FAIL, then implement**

- [ ] T002 [US1] Update CategoryGroup TestBed to import Material modules (`MatListModule`, `MatIconModule`, `MatButtonModule`, `MatFormFieldModule`, `MatInputModule`) in `src/app/checklist/category-group/category-group.spec.ts`
- [ ] T003 [US1] Update CategoryGroup test DOM queries — replace any tag-based selectors (`li`, `ul`, `input`) with `data-testid` attribute selectors or Material element selectors (`mat-list-item`, `mat-icon`, `mat-form-field`) in `src/app/checklist/category-group/category-group.spec.ts`

### Implementation for CategoryGroup

- [ ] T004 [US1] Add Material module imports (`MatListModule`, `MatIconModule`, `MatButtonModule`, `MatFormFieldModule`, `MatInputModule`, `MatCardModule`) to the `imports` array in `src/app/checklist/category-group/category-group.ts`
- [ ] T005 [US1] Refactor `src/app/checklist/category-group/category-group.html` — wrap `<section>` content in `<mat-card>` with `<mat-card-header>` for the `<h3>` title; replace `<ul>` with `<mat-list cdkDropList>` and `<li>` with `<mat-list-item cdkDrag>`; replace Unicode `↑`/`↓` buttons with `<button mat-icon-button><mat-icon>arrow_upward</mat-icon></button>` and `<button mat-icon-button><mat-icon>arrow_downward</mat-icon></button>`; replace "Delete" text button with `<button mat-icon-button><mat-icon>delete</mat-icon></button>`; replace `<input>` with `<mat-form-field><mat-label>New item for {{category()}}</mat-label><input matInput></mat-form-field>`; replace Add button with `<button mat-icon-button><mat-icon>add</mat-icon></button>`. Preserve all `data-testid`, `aria-label`, `[disabled]`, `(click)`, `(keydown.enter)`, `(input)`, and `(cdkDropListDropped)` bindings exactly as they are.
- [ ] T006 [US2] Verify CategoryGroup tests pass — run `npx ng test` and confirm all existing tests in `src/app/checklist/category-group/category-group.spec.ts` pass with no behavioral regressions

**Checkpoint**: CategoryGroup renders with full Material styling. Add, delete, reorder (buttons + drag-drop) all work. Tests pass.

---

## Phase 3: US1 + US2 — ChecklistPage Material Migration (Priority: P1)

**Goal**: Replace plain Submit/Reset buttons in the ChecklistPage with Material buttons. Both components now use Material throughout.

**Independent Test**: Load the checklist page, verify Submit renders as a raised primary Material button and Reset as a flat Material button. Click both and confirm submit/reset behavior unchanged.

### Test Updates for ChecklistPage

- [ ] T007 [US1] Update ChecklistPage TestBed to import Material modules (`MatButtonModule`)
- [ ] T008 [US1] Update ChecklistPage test DOM queries — replace any tag-based button selectors with `data-testid` or Material attribute selectors in `src/app/checklist/checklist.page.spec.ts`

### Implementation for ChecklistPage

- [ ] T009 [US1] Add Material module imports (`MatButtonModule`) to the `imports` array in `src/app/checklist/checklist.page.ts`
- [ ] T010 [US1] Refactor `src/app/checklist/checklist.page.html` — replace Submit `<button>` with `<button mat-raised-button color="primary">`, replace Reset `<button>` with `<button mat-button>`, replace the `<div class="actions">` wrapper with a flex container using Tailwind classes (`class="flex gap-4 mt-6"`). Preserve all `data-testid`, `aria-label`, `type="button"`, and `(click)` bindings exactly.
- [ ] T011 [US2] Verify ChecklistPage tests pass — run `npx ng test` and confirm all existing tests in `src/app/checklist/checklist.page.spec.ts` pass with no behavioral regressions

**Checkpoint**: Both components fully migrated to Material. All existing tests pass. No plain HTML interactive elements remain.

---

## Phase 4: US3 — Accessibility Verification (Priority: P2)

**Goal**: Confirm no accessibility regressions after Material migration. Material components provide built-in keyboard navigation, focus management, and ARIA attributes.

**Independent Test**: Tab through every interactive element on the checklist page using keyboard only. Verify all controls are reachable and operable. Confirm aria-labels are announced by screen reader.

- [ ] T012 [US3] Verify all `aria-label` attributes are present and correct on every interactive Material element across `src/app/checklist/checklist.page.html` and `src/app/checklist/category-group/category-group.html`
- [ ] T013 [US3] Verify keyboard navigation — Tab order reaches all buttons and inputs in logical sequence, Enter/Space activates buttons, Enter in the add-item input triggers addItem, disabled buttons are skipped in tab order
- [ ] T014 [US1] Verify edge cases — (a) category with zero items displays empty state correctly within Material layout, (b) rapid sequential move-up/move-down clicks update the Material list without visual glitches or lost items, (c) page renders correctly on a narrow viewport (≤ 480px) with no clipped or overflowing interactive controls

**Checkpoint**: Accessibility verified. All aria-labels preserved, keyboard navigation functional, Material built-in a11y active. Edge cases confirmed.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [ ] T015 Run full build (`npx ng build`) and confirm no errors, bundle size within thresholds (< 500 kB warning / 1 MB error)
- [ ] T016 Run full test suite (`npx ng test`) and confirm all tests pass across the entire project
- [ ] T017 Run Prettier formatting check (`npx prettier --check "src/app/checklist/**"`) and fix any violations
- [ ] T018 Run quickstart.md verification checklist — confirm all 9 verification items from `specs/003-checklist-material-refactor/quickstart.md` pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1+US2 CategoryGroup (Phase 2)**: No setup dependencies — start immediately
- **US1+US2 ChecklistPage (Phase 3)**: No setup dependencies; can run in parallel with Phase 2 (different files)
- **US3 Accessibility (Phase 4)**: Depends on Phases 2 and 3 (all Material migration complete)
- **Polish (Phase 5)**: Depends on all prior phases

### User Story Dependencies

- **US1 + US2 (P1)**: Co-dependent — every template change advances both. Organized by component (CategoryGroup first, then ChecklistPage) to enable incremental validation.
- **US3 (P2)**: Depends on US1+US2 completion. Verification-only, no code changes expected.

### Within Each Component

1. Update test file FIRST (expect Material elements) → tests FAIL
2. Update component TS (add Material imports) → tests still FAIL
3. Update component template (replace HTML with Material) → tests PASS
4. Verify no regressions

### Parallel Opportunities

- T002 and T003 can run in parallel (same file, but sequential within CategoryGroup spec)
- T007 and T008 can run in parallel with T004–T006 (different component files)
- Phase 2 and Phase 3 can run in parallel (CategoryGroup and ChecklistPage are independent files)
- T012 and T013 can run in parallel (different verification concerns)

---

## Parallel Example: CategoryGroup Migration

```text
# Sequential within CategoryGroup (same files):
T002 → T003 → T004 → T005 → T006

# But CategoryGroup and ChecklistPage can run in parallel:
Stream A: T002 → T003 → T004 → T005 → T006  (CategoryGroup)
Stream B: T007 → T008 → T009 → T010 → T011  (ChecklistPage)
```

---

## Implementation Strategy

### MVP First (Phase 2 Only)

1. Complete Phase 2: CategoryGroup migration (T002–T006)
2. **STOP and VALIDATE**: CategoryGroup renders with Material, all tests pass, drag-drop works
3. This alone delivers visible Material UI for the most complex component

### Incremental Delivery

1. Phase 2 → CategoryGroup Material migration → Test independently (MVP! No setup phase needed.)
2. Phase 3 → ChecklistPage Material migration → Test independently
3. Phase 4 → Accessibility verified
4. Phase 5 → Full validation, build, polish

### Parallel Team Strategy

With two developers:

1. Start immediately (no setup phase needed):
   - Developer A: Phase 2 (CategoryGroup — T002–T006)
   - Developer B: Phase 3 (ChecklistPage — T007–T011)
3. Both complete Phase 4 + 5 together (verification)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are co-implemented: every template change advances both stories
- Test updates MUST precede template changes per constitution (Test-First)
- Commit after each task or logical group (e.g., after each component migration)
- Stop at any checkpoint to validate story independently
- No data model, store, or validation changes in any task
