import { DiameterMode } from "./types";

export function getDirection(
  D_start: number,
  D_target: number
): DiameterMode {
  return D_target > D_start ? "ID" : "OD";
}

export function applyDirection(
  value: number,
  mode: DiameterMode
) {
  return mode === "ID" ? value : -value;
}
