// ui/pages/spiral/hooks/useSpiralAvailability.ts
import { toNumber } from "@utils/number";
import type { SpiralFields } from "../../model/spiralFields";
import type { SpiralMode } from "../../model/spiralModes.ts";
import { getHelixAvailability } from "@core/helix/rules/availability";


export function useSpiralAvailability(
  fields: SpiralFields,
  mode: SpiralMode,
) {
  return getHelixAvailability({
    mode,
    diameter: toNumber(fields.diameter.value),
    toolDiameter: toNumber(fields.toolDiameter.value),
    pitch:
      fields.pitch.value !== ""
        ? toNumber(fields.pitch.value)
        : undefined,
    angle:
      fields.angle.value !== ""
        ? toNumber(fields.angle.value)
        : undefined,
  });
}