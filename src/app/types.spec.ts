import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormTypeOf } from './types';

describe('FormTypeOf', () => {
  it('maps string to FormControl<string>', () => {
    expectTypeOf<FormTypeOf<string>>().toEqualTypeOf<FormControl<string>>();
  });

  it('maps number to FormControl<number>', () => {
    expectTypeOf<FormTypeOf<number>>().toEqualTypeOf<FormControl<number>>();
  });

  it('maps boolean to FormControl<boolean>', () => {
    expectTypeOf<FormTypeOf<boolean>>().toEqualTypeOf<FormControl<boolean>>();
  });

  it('maps Date to FormControl<Date>', () => {
    expectTypeOf<FormTypeOf<Date>>().toEqualTypeOf<FormControl<Date>>();
  });

  it('maps optional (string | undefined) to FormControl<string | undefined>', () => {
    expectTypeOf<FormTypeOf<string | undefined>>().toEqualTypeOf<FormControl<string | undefined>>();
  });

  it('maps nullable (string | null) to FormControl<string | null>', () => {
    expectTypeOf<FormTypeOf<string | null>>().toEqualTypeOf<FormControl<string | null>>();
  });

  it('maps flat object to FormGroup of FormControls', () => {
    interface Flat {
      name: string;
      age: number;
    }

    expectTypeOf<FormTypeOf<Flat>>().toEqualTypeOf<
      FormGroup<{
        name: FormControl<string>;
        age: FormControl<number>;
      }>
    >();
  });

  it('maps object with optional properties', () => {
    interface WithOptional {
      name: string;
      nickname?: string;
    }

    expectTypeOf<FormTypeOf<WithOptional>>().toEqualTypeOf<
      FormGroup<{
        name: FormControl<string>;
        nickname: FormControl<string | undefined>;
      }>
    >();
  });

  it('maps primitive array to FormArray<FormControl>', () => {
    expectTypeOf<FormTypeOf<string[]>>().toEqualTypeOf<FormArray<FormControl<string>>>();
  });

  it('maps object array to FormArray<FormGroup>', () => {
    interface Item {
      label: string;
      done: boolean;
    }

    expectTypeOf<FormTypeOf<Item[]>>().toEqualTypeOf<
      FormArray<
        FormGroup<{
          label: FormControl<string>;
          done: FormControl<boolean>;
        }>
      >
    >();
  });

  it('maps nested objects recursively', () => {
    interface Nested {
      address: {
        street: string;
        city: string;
      };
    }

    expectTypeOf<FormTypeOf<Nested>>().toEqualTypeOf<
      FormGroup<{
        address: FormGroup<{
          street: FormControl<string>;
          city: FormControl<string>;
        }>;
      }>
    >();
  });

  it('handles full integration example', () => {
    interface ChecklistTemplate {
      title: string;
      description?: string;
      dueDate: Date;
      tags: string[];
      items: {
        label: string;
        required: boolean;
      }[];
    }

    expectTypeOf<FormTypeOf<ChecklistTemplate>>().toEqualTypeOf<
      FormGroup<{
        title: FormControl<string>;
        description: FormControl<string | undefined>;
        dueDate: FormControl<Date>;
        tags: FormArray<FormControl<string>>;
        items: FormArray<
          FormGroup<{
            label: FormControl<string>;
            required: FormControl<boolean>;
          }>
        >;
      }>
    >();
  });
});
