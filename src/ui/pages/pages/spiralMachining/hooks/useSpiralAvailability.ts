// ui/pages/spiral/hooks/useSpiralAvailability.ts
import { toNumber } from "@utils/number";
import type { SpiralFields } from "../types/spiralTypes";
// import { getSpiralAvailability } from "@core/spiral/rules/availability";

export function useSpiralAvailability(fields: SpiralFields) {
  return {
    diameter: toNumber(fields.diameter.value),
    toolDiameter: toNumber(fields.toolDiameter.value),
    pitch: toNumber(fields.pitch.value),
    angle: toNumber(fields.angle.value),
  };
}
