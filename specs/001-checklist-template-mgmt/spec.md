# Feature Specification: Checklist Items Template Management

**Feature Branch**: `001-checklist-template-mgmt`
**Created**: 2026-02-25
**Status**: Draft
**Input**: User description: "Create a checklist items template management page with dynamic form, 3 categories (MORNING, EVENING, NIGHT), CRUD operations, ordering, reset/submit, and NgRx Signals store as source of truth."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Existing Checklist Template (Priority: P1)

A user navigates to the checklist template management page. If a checklist items template already exists in the store, the page displays all items grouped under their respective categories (MORNING, EVENING, NIGHT). Each category section shows its items in the saved order. If no template exists yet, the page displays the three empty category groups ready for the user to add items.

**Why this priority**: Viewing existing data is the foundation for all other interactions. Without this, the user cannot verify, edit, or manage their template.

**Independent Test**: Can be fully tested by navigating to the page with pre-loaded store data and verifying the items render correctly under each category in the correct order.

**Acceptance Scenarios**:

1. **Given** a checklist template exists with items in MORNING and EVENING categories, **When** the user navigates to the management page, **Then** the page displays the MORNING items and EVENING items under their respective category headings in saved order, and the NIGHT category is displayed as an empty group.
2. **Given** no checklist template exists, **When** the user navigates to the management page, **Then** the page displays three empty category groups (MORNING, EVENING, NIGHT) with the ability to add items to each.

---

### User Story 2 - Add and Delete Items (Priority: P2)

A user adds new checklist items to any of the three categories. Each new item requires a text label. The user can also remove any existing item from a category. Changes are reflected immediately in the form but are not persisted to the store until the user explicitly submits.

**Why this priority**: Adding and deleting items is the core editing capability. Without it, the template cannot be created or modified.

**Independent Test**: Can be fully tested by adding items to each category, verifying they appear in the form, deleting items, and verifying they are removed from the form—all without submitting.

**Acceptance Scenarios**:

1. **Given** the user is on the management page viewing the MORNING category, **When** the user adds a new item with label "Take vitamins", **Then** the item appears at the end of the MORNING category list in the form.
2. **Given** the EVENING category contains items "Read book" and "Brush teeth", **When** the user deletes "Read book", **Then** only "Brush teeth" remains in the EVENING category in the form.
3. **Given** the user has added a new item, **When** the user has not yet submitted, **Then** the store still contains the original template data (changes are local to the form).

---

### User Story 3 - Reorder Items Within a Category (Priority: P3)

A user reorders items within a single category by dragging them to a new position. The new order is reflected immediately in the form. Items can only be reordered within their own category, not moved between categories.

**Why this priority**: Ordering determines the sequence in which checklist items appear during daily use. It adds polish but is not required for basic template creation.

**Independent Test**: Can be fully tested by reordering items within a single category and verifying the new order is reflected in the form.

**Acceptance Scenarios**:

1. **Given** the MORNING category contains items "Wake up", "Shower", "Breakfast" in that order, **When** the user drags "Breakfast" to position 1, **Then** the order becomes "Breakfast", "Wake up", "Shower" in the form.
2. **Given** an item exists in the MORNING category, **When** the user attempts to drag it to the EVENING category, **Then** the move is not allowed; items stay within their own category.

---

### User Story 4 - Submit and Reset Changes (Priority: P4)

A user submits the current form state to persist all changes (additions, deletions, reorders) to the store. Alternatively, the user can reset the form to discard all unsaved changes and restore the form to the last persisted state from the store.

**Why this priority**: Submit and reset complete the editing lifecycle. Without submit, no changes are saved. Without reset, the user cannot undo mistakes before saving.

**Independent Test**: Can be fully tested by making changes, submitting, verifying the store is updated, then making new changes and resetting to verify the form reverts to the submitted state.

**Acceptance Scenarios**:

1. **Given** the user has added, deleted, and reordered items in the form, **When** the user clicks submit, **Then** the store is updated with the current form state and the form reflects the newly persisted data.
2. **Given** the user has made unsaved changes to the form, **When** the user clicks reset, **Then** all changes are discarded and the form reverts to the last persisted state from the store.
3. **Given** the user has just submitted changes, **When** the user clicks reset, **Then** the form remains unchanged (already in sync with the store).

---

### Edge Cases

- What happens when the user tries to add an item with an empty label? The system prevents adding empty items and shows a validation message.
- What happens when the user tries to submit with no items in any category? The system allows submitting an empty template (all categories empty), effectively clearing the template.
- What happens when the user deletes all items from one category and submits? That category is saved as empty; the other categories retain their items.
- What happens when the user navigates away with unsaved changes? No unsaved-changes guard for the initial version. Changes are lost if the user navigates away without submitting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display checklist items grouped under three fixed categories: MORNING, EVENING, and NIGHT.
- **FR-002**: Each category MUST display its items in the persisted order.
- **FR-003**: The user MUST be able to add a new item with a text label to any category.
- **FR-004**: A new item's label MUST be non-empty; the form MUST show a validation error for empty labels.
- **FR-005**: The user MUST be able to delete any item from any category.
- **FR-006**: The user MUST be able to reorder items within a category via drag-and-drop or up/down buttons.
- **FR-007**: Reordering MUST be restricted to within a single category; cross-category moves are not allowed.
- **FR-008**: The user MUST be able to submit the form to persist all changes to the store.
- **FR-009**: The user MUST be able to reset the form to discard all unsaved changes, reverting to the last persisted store state.
- **FR-010**: When navigating to the page, if a template exists in the store, the form MUST be pre-populated with the stored template data.
- **FR-011**: When navigating to the page with no stored template, the form MUST display three empty category groups.
- **FR-012**: The store MUST be the single source of truth for the checklist items template.

### Key Entities

- **Checklist Item**: A single task entry with a text label and a position within its category.
- **Category**: A fixed grouping (MORNING, EVENING, or NIGHT) that contains zero or more checklist items in a defined order.
- **Checklist Items Template**: The complete set of categories and their items, representing the full template managed on this page.

### Assumptions

- There is only one checklist items template (not per-user or per-date). This is a global template.
- No authentication or authorization is required for this page.
- No unsaved-changes navigation guard is needed for the initial version.
- Items have a text label only (no additional fields like description, duration, or icon).
- The three categories (MORNING, EVENING, NIGHT) are fixed and cannot be added, removed, or renamed by the user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new checklist item to any category in under 5 seconds.
- **SC-002**: Users can reorder items within a category in under 3 seconds via drag-and-drop.
- **SC-003**: After submitting, a page refresh displays the submitted data accurately with no data loss.
- **SC-004**: After resetting, the form matches the last submitted state exactly, with zero residual unsaved changes.
- **SC-005**: The page loads and displays an existing template with up to 30 items total in under 1 second.
