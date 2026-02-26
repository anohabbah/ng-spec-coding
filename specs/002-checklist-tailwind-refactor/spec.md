# Feature Specification: Checklist Styling Standardization

**Feature Branch**: `002-checklist-tailwind-refactor`
**Created**: 2026-02-26
**Status**: Draft
**Input**: User description: "Existing code in src/app/checklist/ uses custom CSS files (checklist.page.css, category-group.css) instead of Tailwind utilities. Refactor to Tailwind in a follow-up PR."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Styling Across the Application (Priority: P1)

As a developer working on the checklist feature, I encounter two component-level stylesheet files that use hand-written CSS rules instead of the project's established utility-first styling convention. This inconsistency increases cognitive overhead when making visual changes and creates a maintenance burden as styling rules are split between two different approaches. After this refactoring, all checklist components follow the same styling approach used by the rest of the application, making future changes faster and less error-prone.

**Why this priority**: This is the core deliverable. Eliminating the divergent styling approach in the checklist page component directly addresses the inconsistency described in the feature request.

**Independent Test**: Can be fully tested by visually comparing the checklist page before and after the refactoring and confirming pixel-identical rendering across all supported viewport sizes.

**Acceptance Scenarios**:

1. **Given** the checklist page is rendered at desktop viewport (1024px+), **When** a user views the page, **Then** the layout, spacing, and typography appear identical to the pre-refactoring baseline.
2. **Given** the checklist page is rendered at mobile viewport (below 768px), **When** a user views the page, **Then** the layout adapts identically to the pre-refactoring baseline with no visual regressions.
3. **Given** the refactoring is complete, **When** a developer inspects the checklist page component, **Then** no component-level stylesheet file is present and all styling is expressed through utility classes in the template.

---

### User Story 2 - Consistent Styling in Category Group Component (Priority: P2)

As a developer working on the category group component, I encounter a separate stylesheet that defines list reset rules and flex layout for checklist items. After this refactoring, the category group component uses the same utility-first approach, and its standalone stylesheet is removed.

**Why this priority**: This is the second component requiring refactoring. It depends on the same approach established in P1 but targets a child component with different styling concerns (list resets, flex item layout).

**Independent Test**: Can be fully tested by rendering a checklist with multiple categories and verifying that list items display correctly with proper alignment, spacing, and no list markers.

**Acceptance Scenarios**:

1. **Given** a checklist with multiple categories is displayed, **When** a user views the category group, **Then** each item appears in a horizontal row with centered alignment and consistent spacing, identical to the pre-refactoring baseline.
2. **Given** the refactoring is complete, **When** a developer inspects the category group component, **Then** no component-level stylesheet file is present and all styling is expressed through utility classes in the template.

---

### User Story 3 - Remove Unused Stylesheet Files (Priority: P3)

As a developer maintaining the codebase, I want all orphaned stylesheet files removed after the migration so that no dead code remains in the repository.

**Why this priority**: Cleanup step that naturally follows once P1 and P2 are complete. Prevents confusion from leftover files.

**Independent Test**: Can be fully tested by verifying the stylesheet files no longer exist in the project and the application builds and runs without errors.

**Acceptance Scenarios**:

1. **Given** all styling has been migrated to utility classes, **When** the removed stylesheet files are searched for in the codebase, **Then** they no longer exist and no component references them.
2. **Given** the stylesheet files have been removed, **When** the application is built, **Then** the build succeeds with no missing file or stylesheet errors.

---

### Edge Cases

- What happens when a component uses `:host` styling that cannot be directly expressed via template utility classes? The refactoring must account for host-level display and dimension rules.
- How does the refactoring handle styles applied to native HTML elements (e.g., `h1`, `ul`, `li`) that rely on element selectors rather than class selectors?
- What happens if a utility class produces slightly different computed values (e.g., spacing scale rounding) compared to the original pixel values?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST render the checklist page with the same visual appearance after the refactoring as before, with no user-visible changes.
- **FR-002**: The application MUST render the category group component with the same visual appearance after the refactoring as before, including list item alignment, spacing, and removal of default list markers.
- **FR-003**: The refactored components MUST NOT contain component-level stylesheet files; all styling MUST be expressed through utility classes applied in component templates.
- **FR-004**: The application MUST build successfully after all stylesheet files are removed, with zero build errors or warnings related to missing styles.
- **FR-005**: The refactored styling MUST preserve the existing responsive behavior, including the centered layout with a maximum content width on the checklist page.
- **FR-006**: The refactored components MUST use only utility classes that are part of the project's established styling system; no new custom stylesheets or one-off classes may be introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of checklist-related component stylesheet files are eliminated (2 files removed: checklist page stylesheet, category group stylesheet).
- **SC-002**: Zero visual regressions detected when comparing the checklist page before and after the refactoring across desktop (1024px+) and mobile (below 768px) viewports.
- **SC-003**: The application builds with zero errors and zero new warnings after the refactoring.
- **SC-004**: All existing tests for checklist functionality continue to pass without modification (unless tests explicitly assert on stylesheet presence).

## Assumptions

- The project already has a utility-first styling system configured and available for use in all components.
- The existing styles are limited to layout and spacing (no complex animations, transitions, or dynamic theme-based styling that would complicate migration).
- The specific pixel values used in the existing stylesheets (e.g., 800px max-width, 24px spacing, 8px gap) have close equivalents in the project's utility class system, or arbitrary value syntax is acceptable.
- This refactoring does not change any component behavior, state management, or data flow.
