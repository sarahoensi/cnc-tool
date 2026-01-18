// src/ui/pages/cuttingData/state/cuttingFields.ts

import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field";

export type CuttingFieldKey =
  | "D"
  | "z"
  | "Vc"
  | "n"
  | "F"
  | "fz";

export type CuttingFields = Record<CuttingFieldKey, FieldState>;

export function createEmptyCuttingFields(): CuttingFields {
  return {
    D: emptyField(),
    z: emptyField(),
    Vc: emptyField(),
    n: emptyField(),
    F: emptyField(),
    fz: emptyField(),
  };
}
