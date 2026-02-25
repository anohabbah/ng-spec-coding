# Data Model: Checklist Items Template Management

**Feature**: 001-checklist-template-mgmt
**Date**: 2026-02-25

## Entities

### Category

A fixed enumeration representing the time-of-day grouping for checklist items.

| Value   | Description                        |
|---------|------------------------------------|
| MORNING | Items for the morning routine      |
| EVENING | Items for the evening routine      |
| NIGHT   | Items for the nighttime routine    |

**Constraints**:
- Exactly 3 values; cannot be added, removed, or renamed by users.
- Display order is always: MORNING → EVENING → NIGHT.

### ChecklistItem

A single task entry within a category.

| Field    | Type   | Constraints                       |
|----------|--------|-----------------------------------|
| id       | string | Unique identifier; auto-generated |
| label    | string | Non-empty; user-provided text     |
| position | number | Non-empty; auto-setted            |
| category | string | Non-empty; Fixed category         |

**Validation rules**:
- `id`: Must be a non-empty string. Generated at creation time (UUID or similar).
- `label`: Must be a non-empty, trimmed string. Leading/trailing whitespace is stripped before save.
- `cposition`: Must be a non-empty, auto-setted
- `category`: Must be a non-empty, trimmed string. Fixed known category.

## Relationships

- Each `ChecklistItem` belongs to exactly one `Category`.
- Items cannot exist outside a category.
- Moving items between categories is not supported (FR-007).

## State Transitions

### Store State

```text
                    ┌─────────────┐
     Page Init ───→ │   LOADED    │ ←── Reset (re-read store)
                    │ (from store)│
                    └──────┬──────┘
                           │
                    User edits form
                    (local only)
                           │
                    ┌──────▼──────┐
                    │   EDITING   │
                    │ (form dirty)│
                    └──────┬──────┘
                           │
                  ┌────────┴────────┐
                  │                 │
               Submit            Reset
                  │                 │
           ┌──────▼──────┐  ┌──────▼──────┐
           │   SAVED     │  │   LOADED    │
           │ (store      │  │ (form reset │
           │  updated)   │  │  to store)  │
           └─────────────┘  └─────────────┘
```

**Notes**:
- The store itself has no loading/error states since there is no backend. It is always synchronous.
- The form component tracks its own dirty/pristine state via Angular's built-in `FormGroup.dirty` property.

## Zod Schemas

The following schemas validate data at the store boundary:

- **ChecklistItemSchema**: Validates `id` (non-empty string), `category` (Fixed categories) and `label` (non-empty trimmed string).

These schemas are defined in `src/app/checklist/checklist.model.ts` alongside the TypeScript interfaces.
