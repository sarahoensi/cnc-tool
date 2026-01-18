import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field";


export type SpiralFieldKey =
  | "diameter"
  | "toolDiameter"
  | "pitch"
  | "angle";

export type SpiralFields = Record<SpiralFieldKey, FieldState>;

export function createEmptySpiralFields(): SpiralFields {
  return {
    diameter: emptyField(),
    toolDiameter: emptyField(),
    pitch: emptyField(),
    angle: emptyField(),
  };
}


