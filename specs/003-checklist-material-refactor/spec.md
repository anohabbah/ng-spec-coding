# Feature Specification: Checklist Material Refactor

**Feature Branch**: `003-checklist-material-refactor`
**Created**: 2026-02-26
**Status**: Draft
**Input**: User description: "Existing code in src/app/checklist/ uses plain HTML elements (button, input, ul/li) instead of Angular Material components. Refactor to Material in a follow-up PR."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Material Design Appearance (Priority: P1)

A user navigating to the checklist page sees a polished, professional interface that follows Material Design conventions — buttons have visual affordance (raised/outlined styles, ripple effects), text inputs have floating labels and clear focus states, and lists present items in a structured, recognizable Material list layout.

**Why this priority**: The primary goal of this refactor is visual and UX consistency. Replacing unstyled browser-default elements with Material components is the core deliverable.

**Independent Test**: Can be verified by loading the checklist page and confirming all interactive elements render as Material Design components with appropriate visual styling, focus indicators, and interaction feedback (ripple, hover states).

**Acceptance Scenarios**:

1. **Given** the checklist page is loaded, **When** the user views the page, **Then** all buttons render with Material Design styling (visible affordance, ripple on click)
2. **Given** a category group is displayed, **When** the user views the item list, **Then** items appear in a structured Material list layout with consistent spacing and dividers
3. **Given** a category group is displayed, **When** the user focuses the text input for adding items, **Then** the input displays a Material floating label and clear focus border
4. **Given** the checklist page is loaded, **When** the user views action icons (move up, move down, delete), **Then** they display as recognizable Material icons instead of plain Unicode characters

---

### User Story 2 - Preserved Functionality After Refactor (Priority: P1)

A user performs all existing checklist operations — adding items, deleting items, reordering via buttons, reordering via drag-and-drop, submitting, and resetting — and every operation works identically to the current implementation. No functionality is added or removed.

**Why this priority**: Equal to P1 because a visual refactor that breaks existing behavior is a regression, not an improvement. All current workflows must remain intact.

**Independent Test**: Can be verified by running the full existing acceptance test suite and manually exercising every user interaction (add, delete, move up, move down, drag-drop, submit, reset) to confirm identical behavior.

**Acceptance Scenarios**:

1. **Given** a category with an empty input, **When** the user types a label and presses Enter or clicks the add button, **Then** the item is appended to the category list
2. **Given** a category with multiple items, **When** the user clicks the delete action on an item, **Then** the item is removed from the list
3. **Given** a category with multiple items, **When** the user clicks the move-up or move-down action, **Then** the item shifts position accordingly (disabled at boundaries)
4. **Given** a category with multiple items, **When** the user drags an item to a new position within the same category, **Then** the item reorders and cross-category drops remain blocked
5. **Given** modified form state, **When** the user clicks Submit, **Then** changes persist to storage; **When** the user clicks Reset, **Then** changes revert to last saved state

---

### User Story 3 - Maintained Accessibility (Priority: P2)

A user relying on assistive technology (screen reader, keyboard navigation) can still operate the entire checklist interface. All existing aria-labels, focus order, and keyboard interactions are preserved or enhanced by Material component defaults.

**Why this priority**: Accessibility must not regress during a visual refactor. Material components provide built-in accessibility features that should maintain or improve the current baseline.

**Independent Test**: Can be verified by tabbing through the entire page with a keyboard, confirming all interactive elements are reachable and operable, and running an accessibility audit tool to check for regressions.

**Acceptance Scenarios**:

1. **Given** the checklist page is loaded, **When** the user navigates with keyboard only (Tab, Enter, Space), **Then** all buttons and inputs are reachable and operable in logical order
2. **Given** a screen reader is active, **When** the user interacts with any element, **Then** meaningful labels are announced for all controls (add, delete, move up, move down, submit, reset)

---

### Edge Cases

- What happens when the checklist has zero items in a category? The empty state message should display correctly within the Material layout.
- What happens when items are reordered rapidly via button clicks? The Material list should update without visual glitches or lost items.
- What happens during drag-and-drop with Material list items? Drag-and-drop must integrate properly with Material list components without layout conflicts.
- What happens when the page is viewed on a narrow viewport? Material components should remain usable and not overflow or clip interactive controls.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All plain button elements MUST be replaced with Material button components displaying appropriate visual styles (raised, icon, or flat as contextually suitable)
- **FR-002**: All plain text input elements MUST be replaced with Material form field components featuring floating labels and standard Material input behavior
- **FR-003**: All unordered list / list item structures MUST be replaced with Material list components providing consistent item layout and optional dividers
- **FR-004**: All Unicode character icons (arrows, text-based delete indicators) MUST be replaced with Material icon components using standard icon glyphs
- **FR-005**: The existing drag-and-drop reordering MUST continue to function correctly with the new Material list components
- **FR-006**: All existing aria-label attributes and data-testid attributes MUST be preserved on the refactored elements
- **FR-007**: The existing form behavior (reactive forms with form arrays, submit with validation, reset to stored state) MUST remain unchanged
- **FR-008**: Category containers (morning, evening, night sections) SHOULD use Material card components to provide visual grouping and elevation
- **FR-009**: The submit and reset action buttons MUST remain visually distinct — submit as a primary/emphasized action and reset as a secondary/de-emphasized action

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of interactive elements (buttons, inputs, lists) render using Material Design styling with no plain browser-default elements remaining
- **SC-002**: All existing user workflows (add, delete, reorder, drag-drop, submit, reset) pass acceptance testing with no behavioral changes
- **SC-003**: Keyboard navigation allows reaching and operating every interactive element without a mouse
- **SC-004**: No accessibility regressions — existing aria-labels are preserved and Material built-in accessibility features are active
- **SC-005**: The page visually aligns with Material Design guidelines — verified by passing all 9 items in the quickstart verification checklist (Material button styling with ripple, floating label input, Material list layout, Material icons, drag-and-drop functional, keyboard navigation, no unstyled browser-default elements)

## Assumptions

- Angular Material is already available as a project dependency and can be imported directly without additional installation.
- The Material default theme (or a project-configured theme) is already set up and will apply to newly added Material components.
- This refactor is purely visual/component-level — no changes to state management, data flow, validation logic, or store interactions.
- Tailwind utility classes will continue to be used alongside Material components for layout spacing and positioning where appropriate.
- The existing drag-and-drop integration is compatible with Material list components without requiring an alternative drag-drop approach.

## Scope Boundaries

### In Scope

- Replacing plain HTML elements with Material equivalents in the two checklist component templates
- Updating component imports to include required Material modules
- Ensuring visual consistency with Material Design conventions
- Preserving all existing functionality, accessibility, and test attributes

### Out of Scope

- Adding new checklist features (e.g., inline editing, sorting, filtering)
- Changing state management, store logic, or validation behavior
- Modifying the checklist data model or form structure
- Refactoring components outside the checklist feature
- Custom Material theme creation (uses existing project theme)
