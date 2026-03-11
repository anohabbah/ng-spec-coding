import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormTypeOf<T> = [T] extends [(infer U)[]]
  ? FormArray<FormTypeOf<U>>
  : [T] extends [Date]
    ? FormControl<T>
    : [T] extends [object]
      ? FormGroup<{ [K in keyof T]-?: FormTypeOf<T[K]> }>
      : FormControl<T>;
