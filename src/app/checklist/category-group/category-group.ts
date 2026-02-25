import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Category } from '../checklist.model';

@Component({
  selector: 'app-category-group',
  templateUrl: './category-group.html',
  styleUrl: './category-group.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CdkDropList, CdkDrag],
})
export class CategoryGroup {
  readonly category = input.required<Category>();
  readonly formArray = input.required<FormArray<FormGroup<{ id: FormControl<string>; label: FormControl<string> }>>>();

  readonly newItemLabel = signal('');

  addItem(): void {
    const label = this.newItemLabel().trim();
    if (!label) {
      return;
    }

    const group = new FormGroup({
      id: new FormControl(crypto.randomUUID() as string, { nonNullable: true }),
      label: new FormControl(label, { nonNullable: true }),
    });

    this.formArray().push(group);
    this.newItemLabel.set('');
  }

  deleteItem(index: number): void {
    this.formArray().removeAt(index);
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    this.swapItems(index, index - 1);
  }

  moveDown(index: number): void {
    if (index >= this.formArray().length - 1) return;
    this.swapItems(index, index + 1);
  }

  onDrop(event: CdkDragDrop<unknown>): void {
    if (event.previousContainer !== event.container) return;
    const controls = this.formArray().controls;
    moveItemInArray(controls, event.previousIndex, event.currentIndex);
    this.formArray().updateValueAndValidity();
  }

  onInputChange(event: Event): void {
    this.newItemLabel.set((event.target as HTMLInputElement).value);
  }

  private swapItems(fromIndex: number, toIndex: number): void {
    const controls = this.formArray().controls;
    moveItemInArray(controls, fromIndex, toIndex);
    this.formArray().updateValueAndValidity();
  }
}
