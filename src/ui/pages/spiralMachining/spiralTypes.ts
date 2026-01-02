// spiralTypes.ts
import type { FieldState } from "@app/state/field/field";

export type SpiralFields = {
  diameter: FieldState;
  toolDiameter: FieldState;
  pitch: FieldState;
  angle: FieldState;
};

// src/ui/fieldUI.ts (eller spiralTypes.ts)
export type FieldUIState = {
  enabled: boolean;
  lockedReason?: string;
};
