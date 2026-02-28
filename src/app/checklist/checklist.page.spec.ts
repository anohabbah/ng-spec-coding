import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ChecklistPage } from './checklist.page';
import { ChecklistStore } from './checklist.store';
import { Category, ChecklistItem } from './checklist.model';

function createItem(overrides: Partial<ChecklistItem> = {}): ChecklistItem {
  return {
    id: crypto.randomUUID(),
    label: 'Test item',
    position: 0,
    category: Category.MORNING,
    ...overrides,
  };
}

describe('ChecklistPage', () => {
  let fixture: ComponentFixture<ChecklistPage>;
  let component: ChecklistPage;
  let store: InstanceType<typeof ChecklistStore>;
  let fb: FormBuilder;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ChecklistPage],
      providers: [ChecklistStore],
    }).compileComponents();

    store = TestBed.inject(ChecklistStore);
    fb = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(ChecklistPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('US1: View mode', () => {
    it('should read store on init and build form', async () => {
      store.saveChecklist([
        createItem({ label: 'Wake up', position: 0, category: Category.MORNING }),
        createItem({ label: 'Read', position: 0, category: Category.EVENING }),
      ]);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form).toBeTruthy();
      expect(component.form.get('MORNING')).toBeTruthy();
      expect(component.form.get('EVENING')).toBeTruthy();
      expect(component.form.get('NIGHT')).toBeTruthy();
    });

    it('should build FormGroup with 3 FormArrays populated from store', async () => {
      store.saveChecklist([
        createItem({ label: 'M1', position: 0, category: Category.MORNING }),
        createItem({ label: 'M2', position: 1, category: Category.MORNING }),
        createItem({ label: 'E1', position: 0, category: Category.EVENING }),
      ]);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.get('MORNING')?.value.length).toBe(2);
      expect(component.form.get('EVENING')?.value.length).toBe(1);
      expect(component.form.get('NIGHT')?.value.length).toBe(0);
    });

    it('should render 3 category-group components', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const groups = fixture.nativeElement.querySelectorAll('app-category-group');
      expect(groups.length).toBe(3);
    });

    it('should handle empty store with empty FormArrays', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.get('MORNING')?.value.length).toBe(0);
      expect(component.form.get('EVENING')?.value.length).toBe(0);
      expect(component.form.get('NIGHT')?.value.length).toBe(0);
    });
  });

  describe('US2: Store isolation', () => {
    it('should not change store after add/delete before submit', async () => {
      const original = [createItem({ label: 'Original', position: 0, category: Category.MORNING })];
      store.saveChecklist(original);

      fixture.detectChanges();
      await fixture.whenStable();

      // Modify the form (add an item to MORNING FormArray)
      const morningArray = component.getFormArray(Category.MORNING);
      morningArray.push(fb.nonNullable.group({ id: 'new-id', label: 'New item' }));

      // Store should still have only original item
      expect(store.entities().length).toBe(1);
      expect(store.entities()[0].label).toBe('Original');
    });
  });

  describe('US4: Submit and reset', () => {
    it('should validate form with Zod and save to store on submit', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Add items to the form
      const morningArray = component.getFormArray(Category.MORNING);
      morningArray.push(fb.nonNullable.group({ id: 'id-1', label: 'Wake up' }));

      component.submit();

      expect(store.entities().length).toBe(1);
      expect(store.entities()[0].label).toBe('Wake up');
      expect(store.entities()[0].category).toBe(Category.MORNING);
    });

    it('should reflect new persisted state after submit', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const morningArray = component.getFormArray(Category.MORNING);
      morningArray.push(fb.nonNullable.group({ id: 'id-1', label: 'Submitted item' }));

      component.submit();

      const cats = store.categories();
      expect(cats['MORNING'].length).toBe(1);
      expect(cats['MORNING'][0].label).toBe('Submitted item');
    });

    it('should succeed when submitting empty template with no items', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      component.submit();

      expect(store.entities().length).toBe(0);
      expect(store.isEmpty()).toBe(true);
    });

    it('should persist correctly when one category is empty and others populated', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const morningArray = component.getFormArray(Category.MORNING);
      morningArray.push(fb.nonNullable.group({ id: 'id-1', label: 'Morning item' }));

      const nightArray = component.getFormArray(Category.NIGHT);
      nightArray.push(fb.nonNullable.group({ id: 'id-2', label: 'Night item' }));

      component.submit();

      const cats = store.categories();
      expect(cats['MORNING'].length).toBe(1);
      expect(cats['EVENING'].length).toBe(0);
      expect(cats['NIGHT'].length).toBe(1);
    });

    it('should revert form to store state on reset', async () => {
      store.saveChecklist([
        createItem({ label: 'Persisted', position: 0, category: Category.MORNING }),
      ]);

      fixture.detectChanges();
      await fixture.whenStable();

      // Add an unsaved item
      const morningArray = component.getFormArray(Category.MORNING);
      morningArray.push(fb.nonNullable.group({ id: 'unsaved', label: 'Unsaved' }));

      expect(morningArray.length).toBe(2);

      component.reset();

      expect(component.getFormArray(Category.MORNING).length).toBe(1);
      expect(component.getFormArray(Category.MORNING).at(0).get('label')?.value).toBe('Persisted');
    });

    it('should discard all unsaved changes on reset', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Add item without submitting
      const eveningArray = component.getFormArray(Category.EVENING);
      eveningArray.push(fb.nonNullable.group({ id: 'tmp', label: 'Temp' }));

      component.reset();

      expect(component.getFormArray(Category.EVENING).length).toBe(0);
    });

    it('should mark form as pristine after reset', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      component.form.markAsDirty();
      component.reset();

      expect(component.form.pristine).toBe(true);
    });
  });
});
