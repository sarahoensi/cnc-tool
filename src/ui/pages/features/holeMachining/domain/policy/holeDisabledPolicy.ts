import type { HoleFields } from "../../model/holeFields";

type Availability = {
  has: {
    D_start: boolean;
    D_target: boolean;
    N: boolean;
    ae: boolean;
  };

  canPlanFromN: boolean;
  canPlanFromAe: boolean;
  canPlanFromNoStart: boolean;
  canPlan: boolean;
};

export function getHoleDisabledMap(args: {
  fields: HoleFields;
  availability: Availability;
  drivers: {
    plan: "N" | "ae" | null;
  };
}) {
  const { fields, drivers } = args;

  const disabled: Record<keyof HoleFields, boolean> = {
    D_start: false,
    D_target: false,
    N: false,
    ae: false,
  };

  // --------------------------------------------------
  // 1. DRIVER-INTENSJON (ENESTE hard disable-regel)
  // --------------------------------------------------
  if (drivers.plan) {
    const driver = drivers.plan;
    const sibling = driver === "N" ? "ae" : "N";

    // Samme regel som cutting:
    // Aldri lås hvis sibling er machine
    if (fields[sibling].source !== "machine") {
      disabled[sibling] = true;
    }
  }

  return disabled;
}
