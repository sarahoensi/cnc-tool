//src/ui/pages/triangleSolver/triangleTypes.ts

import { FieldState } from "@app/state/field/field";

export type TriangleFields = {
  a: FieldState;
  b: FieldState;
  c: FieldState;
  alpha: FieldState;
  beta: FieldState;
};

export type ActiveTrianglePart = "a" | "b" | "c" | "alpha" | "beta" | null;
