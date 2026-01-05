import { TriangleField } from "../rules/validateTriangleInput";
import { TriangleSolverInput } from "../types";
import { TriangleAvailability } from "../types";

export type TriangleInputContext = {
  raw: Record<TriangleField, string>;
  parsed: Partial<TriangleSolverInput>;
  parseErrors: Partial<Record<TriangleField, string>>;
  availability: TriangleAvailability;
};
