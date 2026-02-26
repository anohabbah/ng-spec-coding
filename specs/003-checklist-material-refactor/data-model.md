# Data Model: Checklist Material Refactor

**Branch**: `003-checklist-material-refactor` | **Date**: 2026-02-26

## Overview

This feature is a purely visual/component refactor. **No data model changes are required.** The existing entities, validation schemas, and state management remain untouched.

## Existing Entities (unchanged)

### ChecklistItem

Represents a single item within a checklist category.

- **id**: Unique identifier (UUID string)
- **label**: Display text for the item (non-empty string)
- **category**: Enum of `MORNING` | `EVENING` | `NIGHT`

### Category (enum)

Three fixed categories: `MORNING`, `EVENING`, `NIGHT`.

### ChecklistStore (NgRx SignalStore)

- Entity collection of `ChecklistItem`
- Computed signals: `categories()` (items grouped by category), `totals()` (count per category)
- Storage sync: localStorage persistence via `withStorageSync`
- Validation: Zod schema applied on load

## State Transitions

No new state transitions introduced. Existing transitions remain:

1. **Add item**: Empty input → validated label → new ChecklistItem appended to FormArray
2. **Delete item**: Item at index → removed from FormArray
3. **Reorder**: Items swap positions in FormArray (button or drag-drop)
4. **Submit**: FormArray contents → Zod validation → store update → localStorage sync
5. **Reset**: Store state → repopulate FormArrays → mark form pristine

## Impact Assessment

| Layer | Changed? | Reason |
|-------|----------|--------|
| Data model (`checklist.model.ts`) | No | No entity/schema changes |
| Store (`checklist.store.ts`) | No | No state logic changes |
| Store tests (`checklist.store.spec.ts`) | No | Store behavior unchanged |
| Component templates | Yes | HTML elements → Material components |
| Component TypeScript | Yes | New Material module imports only |
| Component tests | Yes | DOM query selectors updated for Material elements |
| App config | Yes | Add `provideAnimationsAsync()` |
