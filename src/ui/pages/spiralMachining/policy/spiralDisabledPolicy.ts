// ui/pages/spiral/policy/spiralDisabledPolicy.ts
import type { SpiralFields, HelixDriver } from "../types/spiralTypes";

export function getSpiralDisabledMap(args: {
  fields: SpiralFields;
  driver: HelixDriver | null;
}) {
  const { fields, driver } = args;

  const disabled: Record<keyof SpiralFields, boolean> = {
    diameter: false,
    toolDiameter: false,
    pitch: false,
    angle: false,
  };

  // --------------------------------------------------
  // DRIVER-INTENSJON (samme mønster som cuttingData)
  // --------------------------------------------------
  if (driver) {
    const sibling = driver === "pitch" ? "angle" : "pitch";

    // Aldri lås hvis sibling er machine
    if (fields[sibling].source !== "machine") {
      disabled[sibling] = true;
    }
  }

  return disabled;
}
