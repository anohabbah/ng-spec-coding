import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { patchState } from '@ngrx/signals';
import { ChecklistItem, Category, ChecklistItemSchema } from './checklist.model';
import { z } from 'zod';

export const ChecklistStore = signalStore(
  { providedIn: 'root' },
  withEntities<ChecklistItem>(),
  withComputed((store) => ({
    categories: computed(() => {
      const all = store.entities();
      const grouped: Record<Category, ChecklistItem[]> = {
        MORNING: [],
        EVENING: [],
        NIGHT: [],
      };
      for (const item of all) {
        grouped[item.category].push(item);
      }
      grouped.MORNING.sort((a, b) => a.position - b.position);
      grouped.EVENING.sort((a, b) => a.position - b.position);
      grouped.NIGHT.sort((a, b) => a.position - b.position);
      return grouped;
    }),
    totalItems: computed(() => store.entities().length),
    isEmpty: computed(() => store.entities().length === 0),
  })),
  withMethods((store) => ({
    saveChecklist(items: ChecklistItem[]): void {
      patchState(store, setAllEntities(items));
    },
  })),
  withStorageSync({
    key: 'checklistTemplate',
    autoSync: true,
    parse: (stateString: string) => {
      try {
        const parsed = JSON.parse(stateString);
        // Validate that we have a proper entity state shape
        if (parsed && Array.isArray(parsed.ids) && parsed.entityMap) {
          // Validate each entity against the schema
          const validEntities: Record<string, ChecklistItem> = {};
          const validIds: string[] = [];
          for (const id of parsed.ids) {
            const entity = parsed.entityMap[id];
            const result = ChecklistItemSchema.safeParse(entity);
            if (result.success) {
              validEntities[id] = result.data as ChecklistItem;
              validIds.push(id);
            }
          }
          return { ids: validIds, entityMap: validEntities };
        }
        return { ids: [], entityMap: {} };
      } catch {
        return { ids: [], entityMap: {} };
      }
    },
  }),
);
