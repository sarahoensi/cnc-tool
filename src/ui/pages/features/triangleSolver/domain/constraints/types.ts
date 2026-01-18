import type { TriangleFields } from "../../model/triangleFields";

export type TriangleConstraint =
  (keyof TriangleFields)[];

export const triangleConstraints: TriangleConstraint[] = [
  ["a", "b"],
  ["a", "alpha"],
  ["b", "beta"],
  ["c", "alpha"],
  ["c", "beta"],
];
