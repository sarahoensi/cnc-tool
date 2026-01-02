// getSpiralFieldUI.ts
import { enabledField, lockedField } from "@ui/field";
import type { SpiralFields } from "./spiralTypes";

type SpiralDriver = "pitch" | "angle";

export function getSpiralFieldUI(
  _fields: SpiralFields,
  {
    hasResult,
    driverOverride,
  }: {
    hasResult: boolean;
    driverOverride: SpiralDriver | null;
  }
) {
  return {
    diameter: enabledField(),
    toolDiameter: enabledField(),

    pitch:
      hasResult
        ? lockedField("Resultat")
        : driverOverride === "angle"
        ? lockedField("Styres av vinkel")
        : enabledField(),

    angle:
      hasResult
        ? lockedField("Resultat")
        : driverOverride === "pitch"
        ? lockedField("Styres av pitch")
        : enabledField(),
  };
}
