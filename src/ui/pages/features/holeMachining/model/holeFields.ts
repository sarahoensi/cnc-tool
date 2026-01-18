import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field";

export type HoleFields = {
  D_start: FieldState;
  D_target: FieldState;
  N: FieldState;
  ae: FieldState;
};

export function createEmptyHoleFields(): HoleFields {
  return {
    D_start: emptyField(),
    D_target: emptyField(),
    N: emptyField(),
    ae: emptyField(),
  };
}
