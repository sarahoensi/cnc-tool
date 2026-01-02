// ui/cuttingData/cuttingFieldUI.ts

import type { FieldUIState } from "@ui/field";
import type {
  CuttingFields,
  SpeedDriver,
  FeedDriver,
} from "./cuttingTypes";
import { getCuttingAvailability } from "./getCuttingAvailability";

/**
 * Bestemmer hvilke felter som er enabled / låst i Cutting Data.
 *
 * PRINSIPPER:
 * - Funksjonen er ren (ingen sideeffekter)
 * - Availability er sannheten
 * - Driver er kun brukerintensjon
 * - Felt låses kun når beregning faktisk er mulig
 * - Felt med eksisterende brukerinput låses ikke (hjelpende UX)
 */
export function getCuttingFieldUI(
  fields: CuttingFields,
  availability: ReturnType<typeof getCuttingAvailability>,
  opts: {
    speedDriver: SpeedDriver | null;
    feedDriver: FeedDriver | null;
    hasResult: boolean;
  }
): Record<keyof CuttingFields, FieldUIState> {
  // --------------------------------------------------
  // RESULTAT-MODUS
  // --------------------------------------------------
  // Etter beregning skal alt være redigerbart
  if (opts.hasResult) {
    return {
      D: { enabled: true },
      z: { enabled: true },
      Vc: { enabled: true },
      n: { enabled: true },
      F: { enabled: true },
      fz: { enabled: true },
    };
  }

  // --------------------------------------------------
  // BASIS: alt aktivt
  // --------------------------------------------------
  const ui: Record<keyof CuttingFields, FieldUIState> = {
    D: { enabled: true },
    z: { enabled: true },
    Vc: { enabled: true },
    n: { enabled: true },
    F: { enabled: true },
    fz: { enabled: true },
  };

  // --------------------------------------------------
  // HJELPEVARIABLER (lesbarhet)
  // --------------------------------------------------
  const hasUserVc = fields.Vc.value !== "";
  const hasUserN = fields.n.value !== "";
  const hasUserF = fields.F.value !== "";
  const hasUserFz = fields.fz.value !== "";
  const bothSpeedFilled =
  fields.Vc.value !== "" &&
  fields.n.value !== "";

  // --------------------------------------------------
  // HASTIGHET: Vc ⇄ n
  // --------------------------------------------------
  // Driver = Vc → n beregnes
  if (
    opts.speedDriver === "Vc" &&
    availability.canDeriveN &&
    !hasUserN
  ) {
    ui.n = {
      enabled: false,
      lockedReason: "Beregnes fra Vc og D",
    };
  }

  // Driver = n → Vc beregnes
  if (
    opts.speedDriver === "n" &&
    availability.hasN &&
    availability.hasD &&
    !hasUserVc
  ) {
    ui.Vc = {
      enabled: false,
      lockedReason: "Beregnes fra n og D",
    };
  }

  // --------------------------------------------------
  // MATING: F ⇄ fz
  // --------------------------------------------------
  // Driver = F → fz beregnes
  if (
    opts.feedDriver === "F" &&
    availability.canDeriveFz &&
    !hasUserFz
  ) {
    ui.fz = {
      enabled: false,
      lockedReason: "Beregnes fra F, z og n",
    };
  }

  // Driver = fz → F beregnes
  if (
    opts.feedDriver === "fz" &&
    availability.canDeriveF &&
    !hasUserF
  ) {
    ui.F = {
      enabled: false,
      lockedReason: "Beregnes fra fz, z og n",
    };
  }

  //-----
  if (bothSpeedFilled) {
  if (opts.speedDriver === "Vc") {
    ui.n = { enabled: false };
  } else if (opts.speedDriver === "n") {
    ui.Vc = { enabled: false };
  }
}

  return ui;
}
