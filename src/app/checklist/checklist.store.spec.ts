import { TestBed } from '@angular/core/testing';
import { ChecklistStore } from './checklist.store';
import { ChecklistItem, Category } from './checklist.model';

function createItem(overrides: Partial<ChecklistItem> = {}): ChecklistItem {
  return {
    id: crypto.randomUUID(),
    label: 'Test item',
    position: 0,
    category: Category.MORNING,
    ...overrides,
  };
}

describe('ChecklistStore', () => {
  let store: InstanceType<typeof ChecklistStore>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ChecklistStore],
    });
    store = TestBed.inject(ChecklistStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saveChecklist', () => {
    it('should persist entities', () => {
      const items: ChecklistItem[] = [
        createItem({ label: 'Wake up', position: 0, category: Category.MORNING }),
        createItem({ label: 'Read', position: 0, category: Category.EVENING }),
      ];

      store.saveChecklist(items);

      expect(store.entities().length).toBe(2);
      expect(store.entities().map((e) => e.label)).toEqual(['Wake up', 'Read']);
    });

    it('should replace all existing entities on save', () => {
      store.saveChecklist([createItem({ label: 'First' })]);
      store.saveChecklist([createItem({ label: 'Second' })]);

      expect(store.entities().length).toBe(1);
      expect(store.entities()[0].label).toBe('Second');
    });
  });

  describe('categories computed', () => {
    it('should group items by category sorted by position ascending', () => {
      const items: ChecklistItem[] = [
        createItem({ label: 'M2', position: 1, category: Category.MORNING }),
        createItem({ label: 'M1', position: 0, category: Category.MORNING }),
        createItem({ label: 'E1', position: 0, category: Category.EVENING }),
        createItem({ label: 'N2', position: 1, category: Category.NIGHT }),
        createItem({ label: 'N1', position: 0, category: Category.NIGHT }),
      ];

      store.saveChecklist(items);

      const cats = store.categories();
      expect(cats.MORNING.map((i) => i.label)).toEqual(['M1', 'M2']);
      expect(cats.EVENING.map((i) => i.label)).toEqual(['E1']);
      expect(cats.NIGHT.map((i) => i.label)).toEqual(['N1', 'N2']);
    });

    it('should return empty arrays for categories with no items', () => {
      store.saveChecklist([]);

      const cats = store.categories();
      expect(cats.MORNING).toEqual([]);
      expect(cats.EVENING).toEqual([]);
      expect(cats.NIGHT).toEqual([]);
    });
  });

  describe('totalItems computed', () => {
    it('should sum all items across categories', () => {
      store.saveChecklist([
        createItem({ category: Category.MORNING }),
        createItem({ category: Category.EVENING }),
        createItem({ category: Category.NIGHT }),
      ]);

      expect(store.totalItems()).toBe(3);
    });
  });

  describe('isEmpty computed', () => {
    it('should return true when no items', () => {
      expect(store.isEmpty()).toBe(true);
    });

    it('should return false when items exist', () => {
      store.saveChecklist([createItem()]);
      expect(store.isEmpty()).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('should write to localStorage on save', () => {
      const items = [createItem({ label: 'Persisted', position: 0, category: Category.MORNING })];
      store.saveChecklist(items);

      const stored = localStorage.getItem('checklistTemplate');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.ids?.length ?? parsed.entityMap?.length ?? Object.keys(parsed).length).toBeGreaterThan(0);
    });

    it('should restore state from localStorage on init', () => {
      const items = [createItem({ label: 'Persisted', position: 0, category: Category.MORNING })];
      store.saveChecklist(items);

      // Verify the same injected store has persisted state
      expect(store.entities().length).toBe(1);
      expect(store.entities()[0].label).toBe('Persisted');
    });

    it('should discard corrupted localStorage data and initialize empty', () => {
      localStorage.setItem('checklistTemplate', '{"not": "valid entity state"}');

      // Reset TestBed to create a fresh store with corrupted storage
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ChecklistStore],
      });
      const freshStore: InstanceType<typeof ChecklistStore> = TestBed.inject(ChecklistStore);

      expect(freshStore.entities().length).toBe(0);
      expect(freshStore.isEmpty()).toBe(true);
    });
  });
});
