import { DiameterMode } from "./types";

export interface NormalizedDiameterSpace {
  mode: DiameterMode;
  D_start: number;        // original start
  progressTarget: number; // alltid > 0
}

export function normalizeDiameterSpace(
D_start: number, D_target: number, mode: DiameterMode): NormalizedDiameterSpace {
  //const mode = getDirection(D_start, D_target);
  return {
    mode: mode,
    D_start: D_start,
    progressTarget: Math.abs(D_target - D_start),
  };
}

export function denormalizeDiameter(
  space: NormalizedDiameterSpace,
  progress: number
): number {
  return space.mode === "ID"
    ? space.D_start + progress
    : space.D_start - progress;
}
