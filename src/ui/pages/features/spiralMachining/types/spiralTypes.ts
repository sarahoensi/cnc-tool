// spiralTypes.ts
import type { FieldState } from "@app/state/field/field";

export type SpiralFields = {
  diameter: FieldState;
  toolDiameter: FieldState;
  pitch: FieldState;
  angle: FieldState;
};

export type HelixDriver = "pitch" | "angle";