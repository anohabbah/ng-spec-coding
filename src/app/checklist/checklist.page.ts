import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChecklistStore } from './checklist.store';
import { CATEGORIES, Category, ChecklistItem, ChecklistItemSchema } from './checklist.model';
import { CategoryGroup } from './category-group/category-group';

@Component({
  selector: 'app-checklist-page',
  templateUrl: './checklist.page.html',
  styleUrl: './checklist.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CategoryGroup],
})
export class ChecklistPage implements OnInit {
  readonly store = inject(ChecklistStore);
  readonly categories = CATEGORIES;

  form = new FormGroup({
    MORNING: new FormArray<FormGroup>([]),
    EVENING: new FormArray<FormGroup>([]),
    NIGHT: new FormArray<FormGroup>([]),
  });

  ngOnInit(): void {
    this.populateFormFromStore();
  }

  getFormArray(category: Category): FormArray<FormGroup> {
    return this.form.get(category) as FormArray<FormGroup>;
  }

  submit(): void {
    const items: ChecklistItem[] = [];
    for (const cat of CATEGORIES) {
      const formArray = this.getFormArray(cat);
      formArray.controls.forEach((group, index) => {
        const raw = {
          id: group.get('id')?.value,
          label: group.get('label')?.value?.trim(),
          position: index,
          category: cat,
        };
        const result = ChecklistItemSchema.safeParse(raw);
        if (result.success) {
          items.push(result.data as ChecklistItem);
        }
      });
    }
    this.store.saveChecklist(items);
    this.form.markAsPristine();
  }

  reset(): void {
    this.populateFormFromStore();
  }

  private populateFormFromStore(): void {
    const categorized = this.store.categories();
    for (const cat of CATEGORIES) {
      const items = categorized[cat];
      const formArray = this.getFormArray(cat);
      formArray.clear();
      for (const item of items) {
        formArray.push(this.createItemGroup(item));
      }
    }
    this.form.markAsPristine();
  }

  private createItemGroup(item: ChecklistItem): FormGroup {
    return new FormGroup({
      id: new FormControl(item.id, { nonNullable: true }),
      label: new FormControl(item.label, { nonNullable: true }),
    });
  }
}
