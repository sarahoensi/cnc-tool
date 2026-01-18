// ui/pages/spiral/policy/spiralDisabledPolicy.ts
import type { SpiralFields } from "../../model/spiralFields";
import type { HelixDriver } from "../driver/types";

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
  // 1. DRIVER-INTENSJON (ENESTE hard disable-regel)
  // --------------------------------------------------
  if (driver) {
    const sibling: HelixDriver =
      driver === "pitch" ? "angle" : "pitch";

    // Aldri lås hvis sibling er machine
    if (fields[sibling].source !== "machine") {
      disabled[sibling] = true;
    }
  }

  return disabled;
}