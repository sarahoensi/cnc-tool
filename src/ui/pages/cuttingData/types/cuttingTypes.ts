// ui/cuttingData/cuttingTypes.ts
import type { FieldState } from "@app/state/field/field";

export type CuttingFields = {
  D: FieldState;
  z: FieldState;
  Vc: FieldState;
  n: FieldState;
  F: FieldState;
  fz: FieldState;
};

export type SpeedDriver = "Vc" | "n";
export type FeedDriver = "F" | "fz";
