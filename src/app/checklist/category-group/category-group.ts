import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import {
  type FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCard, MatCardHeader, MatCardContent, MatCardTitle } from '@angular/material/card';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Category } from '../checklist.model';

@Component({
  selector: 'app-category-group',
  templateUrl: './category-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatList,
    MatListItem,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatDivider,
    MatListItemTitle,
    MatListItemMeta,
  ],
  host: { class: 'block' },
})
export class CategoryGroup {
  readonly category = input.required<Category>();
  readonly formArray =
    input.required<FormArray<FormGroup<{ id: FormControl<string>; label: FormControl<string> }>>>();
  private readonly fb = inject(FormBuilder);

  readonly newItemLabel = signal('');

  addItem(): void {
    const label = this.newItemLabel().trim();
    if (!label) {
      return;
    }

    const group = this.fb.nonNullable.group({
      id: crypto.randomUUID() as string,
      label: label,
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
