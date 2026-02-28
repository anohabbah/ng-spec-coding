import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ChecklistStore } from './checklist.store';
import { CATEGORIES, Category, ChecklistItem, ChecklistItemSchema } from './checklist.model';
import { CategoryGroup } from './category-group/category-group';

@Component({
  selector: 'app-checklist-page',
  templateUrl: './checklist.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CategoryGroup, MatButton],
  host: { class: 'block max-w-[800px] mx-auto py-6 px-4' },
})
export class ChecklistPage implements OnInit {
  readonly store = inject(ChecklistStore);
  readonly categories = CATEGORIES;
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    MORNING: this.fb.array<FormGroup>([]),
    EVENING: this.fb.array<FormGroup>([]),
    NIGHT: this.fb.array<FormGroup>([]),
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
          items.push(result.data);
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
      const items = categorized[cat] ?? [];
      // Use setControl() to replace each FormArray with a new instance.
      // Mutating in place (clear + push) won't trigger re-render in OnPush
      // children that receive the FormArray via a signal input, since the
      // object reference stays the same.
      this.form.setControl(cat, this.fb.array(items.map((item) => this.createItemGroup(item))));
    }
    this.form.markAsPristine();
  }

  private createItemGroup(item: ChecklistItem): FormGroup {
    return this.fb.nonNullable.group({
      id: item.id,
      label: item.label,
    });
  }
}
