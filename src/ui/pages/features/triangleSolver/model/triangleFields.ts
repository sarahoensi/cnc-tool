import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field";

export type TriangleFieldKey =
  | "a"
  | "b"
  | "c"
  | "alpha"
  | "beta";

export type TriangleFields = Record<TriangleFieldKey, FieldState>;

export function createEmptyTriangleFields(): TriangleFields {
  return {
    a: emptyField(),
    b: emptyField(),
    c: emptyField(),
    alpha: emptyField(),
    beta: emptyField(),
  };
}