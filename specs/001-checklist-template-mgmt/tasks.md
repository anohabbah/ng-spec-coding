---
description: "Task list for checklist items template management feature"
---

# Tasks: Checklist Items Template Management

**Input**: Design documents from `/specs/001-checklist-template-mgmt/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included per constitution Principle III (Test-First, NON-NEGOTIABLE). Tests MUST be written FIRST and FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature folder structure, types, schemas, and routing

- [ ] T001 Create checklist feature folder structure and define Category type, ChecklistItem interface, and ChecklistItemSchema Zod schema in src/app/checklist/checklist.model.ts
- [ ] T002 [P] Configure lazy-loaded route at /checklist in src/app/checklist/checklist.routes.ts and update src/app/app.routes.ts with loadChildren pointing to checklist.routes.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: NgRx SignalStore that all user stories depend on

**CRITICAL**: No user story work can begin until the store is implemented and tested

### Tests for Store

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T003 Write failing tests for ChecklistStore (saveChecklist persists entities, categories computed groups items by category, totalItems sums all items, isEmpty returns true when no items) in src/app/checklist/checklist.store.spec.ts

### Implementation for Store

- [ ] T004 Implement ChecklistStore using signalStore() with withEntities(), withMethods(saveChecklist), withComputed(categories, totalItems, isEmpty) in src/app/checklist/checklist.store.ts

**Checkpoint**: Store ready — user story implementation can now begin

---

## Phase 3: User Story 1 - View Existing Checklist Template (Priority: P1) MVP

**Goal**: Display checklist items grouped by category when navigating to the page. Show empty category groups when no template exists.

**Independent Test**: Navigate to /checklist with pre-loaded store data and verify items render under correct categories in order. Navigate with empty store and verify 3 empty category groups.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T005 [P] [US1] Write failing tests for category-group component (renders items from FormArray, displays category title, shows empty state message) in src/app/checklist/category-group/category-group.spec.ts
- [ ] T006 [P] [US1] Write failing tests for checklist.page component view mode (reads store on init, builds FormGroup with 3 FormArrays, renders 3 category-group components, handles empty store with empty FormArrays) in src/app/checklist/checklist.page.spec.ts

### Implementation for User Story 1

- [ ] T007 [US1] Implement category-group component with input(category, formArray), OnPush change detection, display items with @for loop, show empty state, include ARIA labels on category heading and item list in src/app/checklist/category-group/category-group.ts with category-group.html and category-group.css
- [ ] T008 [US1] Implement checklist.page component: inject ChecklistStore, build FormGroup with 3 FormArrays (MORNING, EVENING, NIGHT) populated from store on init, render 3 category-group components, include ARIA landmark and page heading in src/app/checklist/checklist.page.ts with checklist.page.html and checklist.page.css

**Checkpoint**: Page displays stored items grouped by category. Empty store shows 3 empty groups. MVP complete.

---

## Phase 4: User Story 2 - Add and Delete Items (Priority: P2)

**Goal**: Users can add new items with a text label to any category and delete existing items. Changes are local to the form until submit.

**Independent Test**: Add items to each category and verify they appear in the form. Delete items and verify removal. Confirm store is unchanged until submit.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US2] Write failing tests for add item (appends FormGroup to FormArray, generates id, empty label shows validation error and prevents add) and delete item (removes FormGroup from FormArray at correct index) in src/app/checklist/category-group/category-group.spec.ts
- [ ] T010 [P] [US2] Write failing test verifying store is unchanged after add/delete before submit in src/app/checklist/checklist.page.spec.ts

### Implementation for User Story 2

- [ ] T011 [US2] Add item input field with required Validators.required and aria-label, add button with aria-label, and per-item delete button with aria-label to category-group component in src/app/checklist/category-group/category-group.ts and category-group.html
- [ ] T012 [US2] Wire add logic (generate id via crypto.randomUUID(), push FormGroup to FormArray, clear input) and delete logic (removeAt index from FormArray) in category-group component in src/app/checklist/category-group/category-group.ts

**Checkpoint**: Users can add and delete items within each category. Validation prevents empty labels. Store unchanged until submit.

---

## Phase 5: User Story 3 - Reorder Items Within a Category (Priority: P3)

**Goal**: Users can reorder items within a category via drag-and-drop or up/down buttons. Cross-category moves are prevented.

**Independent Test**: Reorder items within a single category via drag-and-drop and up/down buttons. Verify new order in the form. Confirm cross-category drag is blocked.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [US3] Write failing tests for reorder (moveItemInArray changes FormArray order via drag-drop, up button moves item up one position, down button moves item down, first item up button disabled, last item down button disabled, cross-category drop prevented) in src/app/checklist/category-group/category-group.spec.ts

### Implementation for User Story 3

- [ ] T014 [US3] Add CdkDropList and CdkDrag from @angular/cdk/drag-drop to category-group component for drag-and-drop reorder within category (no cdkDropListConnectedTo to prevent cross-category moves), rely on CDK's built-in live announcements and keyboard support for accessibility in src/app/checklist/category-group/category-group.ts and category-group.html
- [ ] T015 [US3] Add up/down buttons per item with aria-labels for keyboard-accessible reorder (moveItemInArray on FormArray, disable up on first item, disable down on last item) in src/app/checklist/category-group/category-group.ts and category-group.html

**Checkpoint**: Items reorderable within each category via drag-drop and buttons. Cross-category moves blocked.

---

## Phase 6: User Story 4 - Submit and Reset Changes (Priority: P4)

**Goal**: Users can submit form state to persist to store, or reset to discard unsaved changes and revert to last persisted state.

**Independent Test**: Make changes, submit, refresh page — data persists. Make changes, reset — form reverts to last submitted state.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [US4] Write failing tests for submit (form value validated with Zod, saved to store via saveChecklist, form reflects new persisted state, submitting empty template with no items succeeds) and reset (form reverts to store state, all unsaved changes discarded, form pristine after reset) in src/app/checklist/checklist.page.spec.ts

### Implementation for User Story 4

- [ ] T017 [US4] Implement submit button: read form value, validate with ChecklistItemSchema, call store.saveChecklist() in src/app/checklist/checklist.page.ts and checklist.page.html
- [ ] T018 [US4] Implement reset button: re-read store categories computed, rebuild FormArrays, mark form pristine in src/app/checklist/checklist.page.ts and checklist.page.html

**Checkpoint**: Full editing lifecycle complete. Submit persists, reset reverts. All user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, validation, and quality gate verification

- [ ] T019 [P] Verify accessibility: run AXE checks on checklist page, verify keyboard navigation through all interactive elements, confirm ARIA labels are present on all buttons and inputs in src/app/checklist/category-group/category-group.ts and src/app/checklist/checklist.page.ts
- [ ] T020 Run quickstart.md validation scenarios (all 7 scenarios) to verify end-to-end feature correctness; additionally verify SC-005 by pre-loading store with 30 items and confirming page renders in under 1 second
- [ ] T021 [P] Run ng build and verify all quality gates pass (bundle size < 500kB warning, component styles < 4kB, no any types, Prettier formatted)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001 (model types) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 (store must exist)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (view must exist to add/delete)
- **User Story 3 (Phase 5)**: Depends on Phase 4 (items must exist to reorder)
- **User Story 4 (Phase 6)**: Depends on Phase 3 (view must exist for submit/reset)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) only — can start immediately after store
- **User Story 2 (P2)**: Depends on US1 (needs category-group and page components to exist)
- **User Story 3 (P3)**: Depends on US2 (needs items in the list to reorder)
- **User Story 4 (P4)**: Depends on US1 (needs form and store connection); can run in parallel with US2/US3

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002 can run in parallel with T001 (different files)
- T005 + T006 can run in parallel (different spec files)
- T009 + T010 can run in parallel (different spec files)
- T019 + T021 can run in parallel (different concerns)
- US4 (submit/reset) can potentially run in parallel with US2/US3 since it only depends on US1

---

## Parallel Example: User Story 1

```bash
# Launch tests for User Story 1 together (different files):
Task: "Write failing tests for category-group in category-group.spec.ts"
Task: "Write failing tests for checklist.page in checklist.page.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational store (T003, T004)
3. Complete Phase 3: User Story 1 (T005–T008)
4. **STOP and VALIDATE**: Navigate to /checklist — items display correctly
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Add/delete works → Demo
4. Add User Story 3 → Reorder works → Demo
5. Add User Story 4 → Submit/reset works → Demo
6. Polish → Accessibility + quality gates → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story builds on the previous but should be testable at each checkpoint
- Tests MUST fail before implementing (constitution Principle III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
