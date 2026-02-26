# Quickstart: Checklist Items Template Management

**Feature**: 001-checklist-template-mgmt
**Date**: 2026-02-25

## Prerequisites

- Node.js (compatible with Angular 21)
- npm 10.9+
- Project dependencies installed (`npm install`)

## Run the Application

```bash
ng serve
```

Navigate to `http://localhost:4200/checklist` to access the checklist items template management page.

## Run Tests

```bash
ng test
```

This runs all Vitest specs including the checklist items template feature tests.

## Verify the Feature

### Scenario 1: Empty State

1. Navigate to `/checklist` with no pre-existing data.
2. Verify three category sections are displayed: MORNING, EVENING, NIGHT.
3. Each section shows no items and has an "Add item" control.

### Scenario 2: Add Items

1. In the MORNING section, type "Wake up" and click Add.
2. Verify "Wake up" appears in the MORNING list.
3. Repeat for EVENING ("Read book") and NIGHT ("Set alarm").
4. Verify each item appears under its correct category.

### Scenario 3: Delete Items

1. With items added, click the delete button on "Wake up".
2. Verify "Wake up" is removed from MORNING.
3. Verify other categories are unaffected.

### Scenario 4: Reorder Items

1. Add multiple items to MORNING: "Wake up", "Shower", "Breakfast".
2. Drag "Breakfast" to the first position (or use up button).
3. Verify the order becomes: "Breakfast", "Wake up", "Shower".

### Scenario 5: Submit Changes

1. Make several edits (add, delete, reorder).
2. Click Submit.
3. Refresh the page.
4. Verify the submitted data persists and displays correctly.

### Scenario 6: Reset Changes

1. Make several unsaved edits.
2. Click Reset.
3. Verify the form reverts to the last submitted state.

### Scenario 7: Validation

1. Try to add an item with an empty label.
2. Verify a validation error is shown and the item is not added.

## Key Files

| File                                                 | Purpose                                |
|------------------------------------------------------|----------------------------------------|
| `src/app/checklist/checklist.model.ts`               | Types, interfaces, Zod schemas         |
| `src/app/checklist/checklist.store.ts`               | NgRx SignalStore with entities feature |
| `src/app/checklist/checklist.routes.ts`              | Lazy-loaded feature routes             |
| `src/app/checklist/checklist.page.ts`                | Page component                         |
| `src/app/checklist/category-group/category-group.ts` | Category group component               |
| `src/app/app.routes.ts`                              | Root routes (lazy-loads feature)       |
