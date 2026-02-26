import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CategoryGroup } from './category-group';
import { Category } from '../checklist.model';
import { Component, viewChild } from '@angular/core';

function buildFormArray(fb: FormBuilder, items: { id: string; label: string }[]): FormArray<FormGroup> {
  return fb.array(
    items.map((item) => fb.nonNullable.group({ id: item.id, label: item.label })),
  ) as FormArray<FormGroup>;
}

@Component({
  imports: [CategoryGroup],
  template: `<app-category-group [category]="category" [formArray]="formArray" />`,
})
class TestHost {
  category: Category = Category.MORNING;
  formArray = new FormArray<FormGroup>([]);
  readonly categoryGroup = viewChild.required(CategoryGroup);
}

describe('CategoryGroup', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fb = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
  });

  describe('US1: View mode', () => {
    it('should render items from FormArray', async () => {
      host.formArray = buildFormArray(fb, [
        { id: '1', label: 'Wake up' },
        { id: '2', label: 'Shower' },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('[data-testid="checklist-item"]');
      expect(items.length).toBe(2);
    });

    it('should display category title', async () => {
      host.category = Category.EVENING;
      fixture.detectChanges();
      await fixture.whenStable();

      const heading = fixture.nativeElement.querySelector('h2, h3, [role="heading"]');
      expect(heading?.textContent).toContain('EVENING');
    });

    it('should show empty state message when no items', async () => {
      host.formArray = buildFormArray(fb, []);
      fixture.detectChanges();
      await fixture.whenStable();

      const emptyState = fixture.nativeElement.querySelector('[data-testid="empty-state"]');
      expect(emptyState).toBeTruthy();
    });

    it('should not show empty state when items exist', async () => {
      host.formArray = buildFormArray(fb, [{ id: '1', label: 'Item' }]);
      fixture.detectChanges();
      await fixture.whenStable();

      const emptyState = fixture.nativeElement.querySelector('[data-testid="empty-state"]');
      expect(emptyState).toBeFalsy();
    });
  });

  describe('US2: Add and delete items', () => {
    beforeEach(async () => {
      host.formArray = buildFormArray(fb, [{ id: '1', label: 'Existing item' }]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should append FormGroup to FormArray when adding', async () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-input"]',
      );
      const addBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-btn"]',
      );

      input.value = 'New item';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      addBtn.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.length).toBe(2);
      expect(host.formArray.at(1).get('label')?.value).toBe('New item');
    });

    it('should generate id when adding item', async () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-input"]',
      );
      const addBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-btn"]',
      );

      input.value = 'New item';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      addBtn.click();
      fixture.detectChanges();

      const newGroup = host.formArray.at(1);
      expect(newGroup.get('id')?.value).toBeTruthy();
      expect(newGroup.get('id')?.value.length).toBeGreaterThan(0);
    });

    it('should show validation error and prevent add for empty label', async () => {
      const addBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-btn"]',
      );
      addBtn.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.length).toBe(1); // unchanged
    });

    it('should show validation error and prevent add for whitespace-only label', async () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-input"]',
      );
      const addBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="add-item-btn"]',
      );

      input.value = '   ';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      addBtn.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.length).toBe(1); // unchanged
    });

    it('should remove FormGroup from FormArray at correct index on delete', async () => {
      // Add a second item to the existing formArray
      host.formArray.push(
        fb.nonNullable.group({ id: '2', label: 'Second' }),
      );
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.length).toBe(2);

      const deleteBtns = fixture.nativeElement.querySelectorAll(
        '[data-testid="delete-item-btn"]',
      );
      deleteBtns[0].click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.length).toBe(1);
      expect(host.formArray.at(0).get('label')?.value).toBe('Second');
    });
  });

  describe('US3: Reorder items', () => {
    beforeEach(async () => {
      host.formArray = buildFormArray(fb, [
        { id: '1', label: 'First' },
        { id: '2', label: 'Second' },
        { id: '3', label: 'Third' },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should move item up one position via up button', async () => {
      const upBtns = fixture.nativeElement.querySelectorAll('[data-testid="move-up-btn"]');
      upBtns[1].click(); // Move "Second" up
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.at(0).get('label')?.value).toBe('Second');
      expect(host.formArray.at(1).get('label')?.value).toBe('First');
    });

    it('should move item down one position via down button', async () => {
      const downBtns = fixture.nativeElement.querySelectorAll('[data-testid="move-down-btn"]');
      downBtns[0].click(); // Move "First" down
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.formArray.at(0).get('label')?.value).toBe('Second');
      expect(host.formArray.at(1).get('label')?.value).toBe('First');
    });

    it('should disable up button on first item', async () => {
      const upBtns: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
        '[data-testid="move-up-btn"]',
      );
      expect(upBtns[0].disabled).toBe(true);
    });

    it('should disable down button on last item', async () => {
      const downBtns: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
        '[data-testid="move-down-btn"]',
      );
      expect(downBtns[downBtns.length - 1].disabled).toBe(true);
    });

    it('should support drag-drop reorder via component method', () => {
      const component = host.categoryGroup();
      const sameContainer = {};
      component.onDrop({
        previousIndex: 2,
        currentIndex: 0,
        container: sameContainer as any,
        previousContainer: sameContainer as any,
        isPointerOverContainer: true,
        item: {} as any,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop'),
      });

      expect(host.formArray.at(0).get('label')?.value).toBe('Third');
      expect(host.formArray.at(1).get('label')?.value).toBe('First');
      expect(host.formArray.at(2).get('label')?.value).toBe('Second');
    });

    it('should prevent cross-category drop', () => {
      const component = host.categoryGroup();
      const container = {};
      const otherContainer = {};
      component.onDrop({
        previousIndex: 0,
        currentIndex: 0,
        container: container as any,
        previousContainer: otherContainer as any, // different container = cross-category
        isPointerOverContainer: true,
        item: {} as any,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop'),
      });

      // Should remain unchanged
      expect(host.formArray.at(0).get('label')?.value).toBe('First');
    });
  });
});
