# Tasks: Checklist Styling Standardization

**Input**: Design documents from `/specs/002-checklist-tailwind-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested — existing tests cover all behavior. Migration is style-only; no new tests needed (plan §Test-First gate, research §R6).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 — Consistent Styling Across the Application (Priority: P1) 🎯 MVP

**Goal**: Migrate `ChecklistPage` from component-level CSS to Tailwind utility classes. Replace `:host` selector with `host: { class: '...' }` in the decorator and move `h1` element styling to template-inline Tailwind classes.

**Independent Test**: Visually compare the checklist page before and after at desktop (1024px+) and mobile (<768px) viewports — layout, spacing, and typography must be pixel-identical. Run `npm test` to confirm no regressions.

### Implementation for User Story 1

- [ ] T001 [P] [US1] In `src/app/checklist/checklist.page.ts`: remove `styleUrl: './checklist.page.css'` from `@Component` decorator and add `host: { class: 'block max-w-[800px] mx-auto py-6 px-4' }` to replace the `:host` CSS rule (research §R1, §R2)
- [ ] T002 [P] [US1] In `src/app/checklist/checklist.page.html`: add `class="mb-6"` to the `<h1>` element to replace the `h1 { margin-bottom: 24px; }` CSS rule (research §R3)

**Checkpoint**: ChecklistPage renders identically to pre-refactoring baseline. `checklist.page.css` is still present on disk but no longer referenced.

---

## Phase 2: User Story 2 — Consistent Styling in Category Group Component (Priority: P2)

**Goal**: Migrate `CategoryGroup` from component-level CSS to Tailwind utility classes. Replace `:host` selector with `host: { class: '...' }` in the decorator and move `ul`/`li` element styling to template-inline Tailwind classes.

**Independent Test**: Render a checklist with multiple categories — list items must display in horizontal rows with centered alignment, consistent 8px gap, no list markers, identical to pre-refactoring baseline. CDK drag-drop must remain functional.

### Implementation for User Story 2

- [ ] T003 [P] [US2] In `src/app/checklist/category-group/category-group.ts`: remove `styleUrl: './category-group.css'` from `@Component` decorator and add `host: { class: 'block' }` to replace the `:host` CSS rule (research §R1)
- [ ] T004 [P] [US2] In `src/app/checklist/category-group/category-group.html`: add `class="list-none p-0 m-0"` to the `<ul>` element and add `class="flex items-center gap-2 py-2"` to each `<li>` element to replace the `ul` and `li` CSS rules (research §R3)

**Checkpoint**: CategoryGroup renders identically to pre-refactoring baseline. `category-group.css` is still present on disk but no longer referenced.

---

## Phase 3: User Story 3 — Remove Unused Stylesheet Files (Priority: P3)

**Goal**: Delete both orphaned CSS files now that all styling has been migrated to Tailwind utilities. Verify zero build errors and no stray references.

**Independent Test**: Confirm `src/app/checklist/checklist.page.css` and `src/app/checklist/category-group/category-group.css` no longer exist. Run `ng build` — zero errors. Search codebase for references — zero results.

**Depends on**: US1 (Phase 1), US2 (Phase 2) — CSS files must not be referenced before deletion.

### Implementation for User Story 3

- [ ] T005 [P] [US3] Delete `src/app/checklist/checklist.page.css` (research §R4)
- [ ] T006 [P] [US3] Delete `src/app/checklist/category-group/category-group.css` (research §R4)
- [ ] T007 [US3] Verify no stray references to deleted CSS files remain in the codebase (quickstart §5: `grep -r "checklist.page.css\|category-group.css" src/` must return zero results)

**Checkpoint**: All user stories complete. Zero component-level CSS files remain in the checklist module.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all stories.

- [ ] T008 Run `ng build` and confirm zero errors and zero new warnings (quickstart §1, spec §FR-004, §SC-003)
- [ ] T009 Run `npm test` and confirm all existing tests pass without modification (quickstart §2, spec §SC-004)
- [ ] T010 Run full quickstart.md validation: serve the app and visually verify desktop, mobile, category groups, list items, and drag-drop per quickstart §3–§4

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1 (Phase 1)**: No dependencies — can start immediately
- **US2 (Phase 2)**: No dependencies — can start immediately (or in parallel with US1)
- **US3 (Phase 3)**: Depends on US1 and US2 completion — CSS files must be unreferenced before deletion
- **Polish (Phase 4)**: Depends on US3 completion — validates the full migration end-to-end

### User Story Dependencies

- **User Story 1 (P1)**: Independent — modifies `checklist.page.ts` and `checklist.page.html` only
- **User Story 2 (P2)**: Independent — modifies `category-group.ts` and `category-group.html` only
- **User Story 3 (P3)**: Depends on US1 + US2 — deletes CSS files that US1/US2 unlink

### Within Each User Story

- `.ts` file edit (decorator change) and `.html` file edit (template classes) target different files and are parallelizable [P]
- Both edits within a story must complete before the story checkpoint

### Parallel Opportunities

- **T001 ∥ T002**: Different files (`checklist.page.ts` vs `checklist.page.html`)
- **T003 ∥ T004**: Different files (`category-group.ts` vs `category-group.html`)
- **US1 ∥ US2**: Entirely different file sets — can run in parallel
- **T005 ∥ T006**: Different CSS files being deleted

---

## Parallel Example: User Story 1 + User Story 2

```bash
# Launch US1 and US2 in parallel (different file sets):
Task: "T001 [P] [US1] Remove styleUrl, add host classes in src/app/checklist/checklist.page.ts"
Task: "T002 [P] [US1] Add Tailwind class to <h1> in src/app/checklist/checklist.page.html"
Task: "T003 [P] [US2] Remove styleUrl, add host class in src/app/checklist/category-group/category-group.ts"
Task: "T004 [P] [US2] Add Tailwind classes to <ul>, <li> in src/app/checklist/category-group/category-group.html"

# After US1 + US2 complete, launch US3:
Task: "T005 [P] [US3] Delete src/app/checklist/checklist.page.css"
Task: "T006 [P] [US3] Delete src/app/checklist/category-group/category-group.css"
Task: "T007 [US3] Verify no stray references"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: US1 (ChecklistPage migration)
2. **STOP and VALIDATE**: Visually verify ChecklistPage at desktop and mobile viewports
3. Existing tests still pass

### Incremental Delivery

1. US1 → Validate ChecklistPage independently → MVP done
2. US2 → Validate CategoryGroup independently → Both components migrated
3. US3 → Delete CSS files, verify build → Clean codebase
4. Polish → Full quickstart.md validation → Feature complete

### Maximum Parallelism (Single Developer)

1. Run T001 + T002 + T003 + T004 in parallel (4 different files, zero conflicts)
2. Run T005 + T006 in parallel after all above complete
3. Run T007, T008, T009, T010 sequentially (verification chain)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No new tests needed — existing tests validate behavior, not styling approach (research §R6)
- All Tailwind class mappings are pre-determined in plan.md §Migration Mapping
- Arbitrary value `max-w-[800px]` is intentional — closest standard class `max-w-3xl` (768px) is 32px narrower (research §R2)
