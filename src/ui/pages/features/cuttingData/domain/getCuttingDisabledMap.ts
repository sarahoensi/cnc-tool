import type {
  CuttingFields
} from "../model/cuttingFields";
import type { SpeedDriver, FeedDriver } from "../drivers/types";

type Availability = {
  has: {
    D: boolean;
    Vc: boolean;
    n: boolean;
    F: boolean;
    fz: boolean;
    z: boolean;
  };
  canDerive: {
    n: boolean;
    F: boolean;
    fz: boolean;
  };
  hasNEffective: boolean;
};

export function getCuttingDisabledMap(args: {
  fields: CuttingFields;
  availability: Availability;
  drivers: {
    speed: SpeedDriver | null;
    feed: FeedDriver | null;
  };
}) {
  const { fields, drivers } = args;

  const disabled: Record<keyof CuttingFields, boolean> = {
    D: false,
    z: false,
    Vc: false,
    n: false,
    F: false,
    fz: false,
  };

  // --------------------------------------------------
  // 1. DRIVER-INTENSJON (ENESTE hard disable-regel)
  // --------------------------------------------------

  // SPEED: Vc <-> n
  if (drivers.speed) {
    const driver = drivers.speed;
    const sibling = driver === "Vc" ? "n" : "Vc";

    // Aldri lås hvis sibling er machine
    if (fields[sibling].source !== "machine") {
      disabled[sibling] = true;
    }
  }

  // FEED: F <-> fz
  if (drivers.feed) {
    const driver = drivers.feed;
    const sibling = driver === "F" ? "fz" : "F";

    // Aldri lås hvis sibling er machine
    if (fields[sibling].source !== "machine") {
      disabled[sibling] = true;
    }
  }

  return disabled;
}
