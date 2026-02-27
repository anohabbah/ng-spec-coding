import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import {Category, ChecklistItem, ChecklistItemSchema} from './checklist.model';
import { chain } from 'lodash';
import { sortBy } from 'lodash/fp';

export const ChecklistStore = signalStore(
  { providedIn: 'root' },
  withEntities<ChecklistItem>(),
  withComputed((store) => ({
    categories: computed(() => {
        const grouped = chain(store.entities())
          .groupBy('category')
          .mapValues(sortBy<ChecklistItem>('position'))
          .value();
        return { MORNING: [], EVENING: [], NIGHT: [], ...grouped } as Record<Category, ChecklistItem[]>;
      },
    ),
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
