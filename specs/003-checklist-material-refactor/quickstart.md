# Quickstart: Checklist Material Refactor

**Branch**: `003-checklist-material-refactor` | **Date**: 2026-02-26

## Prerequisites

- Node.js (latest LTS) and npm installed
- Repository cloned and on the `003-checklist-material-refactor` branch

## Setup

```bash
npm install
```

All dependencies (Angular Material, CDK, Tailwind, etc.) are already declared in `package.json`.

## Development Server

```bash
npx ng serve
```

Navigate to `http://localhost:4200/checklist` to view the checklist page.

## Running Tests

```bash
npx ng test
```

Runs Vitest with Angular TestBed. All checklist tests are in:

- `src/app/checklist/checklist.page.spec.ts`
- `src/app/checklist/category-group/category-group.spec.ts`

## Key Files to Modify

| File                                                      | Change                                                                                                                                                     |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/app/checklist/checklist.page.ts`                     | Add Material module imports (`MatButtonModule`, `MatCardModule`, `MatIconModule`)                                                                          |
| `src/app/checklist/checklist.page.html`                   | Replace plain buttons with `mat-raised-button`/`mat-button`, wrap content in `mat-card`                                                                    |
| `src/app/checklist/category-group/category-group.ts`      | Add Material module imports (`MatButtonModule`, `MatIconModule`, `MatFormFieldModule`, `MatInputModule`, `MatListModule`)                                  |
| `src/app/checklist/category-group/category-group.html`    | Replace `ul`/`li` with `mat-list`/`mat-list-item`, `input` with `mat-form-field`+`matInput`, buttons with `mat-icon-button`, Unicode icons with `mat-icon` |
| `src/app/checklist/checklist.page.spec.ts`                | Update DOM queries if any use tag-based selectors                                                                                                          |
| `src/app/checklist/category-group/category-group.spec.ts` | Update DOM queries and add Material module imports to TestBed                                                                                              |

## Verification Checklist

1. `npx ng build` completes without errors
2. `npx ng test` passes all existing tests
3. All buttons display Material styling (ripple, elevation)
4. Text input shows floating label and Material focus state
5. List items render in Material list layout
6. Icons display as Material Icons (arrow_upward, arrow_downward, delete)
7. Drag-and-drop still works within categories
8. Keyboard navigation reaches all interactive elements
9. No plain/unstyled browser-default elements remain
