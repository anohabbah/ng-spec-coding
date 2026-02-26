import { z } from 'zod';

export const Category = {
  MORNING: 'MORNING',
  EVENING: 'EVENING',
  NIGHT: 'NIGHT',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const CATEGORIES: readonly Category[] = [
  Category.MORNING,
  Category.EVENING,
  Category.NIGHT,
] as const;

export interface ChecklistItem {
  id: string;
  label: string;
  position: number;
  category: Category;
}

export const ChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1),
  position: z.number().int().nonnegative(),
  category: z.enum(['MORNING', 'EVENING', 'NIGHT']),
});
