import { getCuttingAvailability } from "@core/cuttingData/rules/availability";
import type { CuttingFields } from "../../model/cuttingFields";
import { toNumber } from "@utils/number";

/**
 * Adapter mellom UI FieldState og core availability-regler.
 * 
 * Ansvar:
 * - oversette FieldState -> CuttingDataInput
 * - kalle core-regel
 * - returnere domenelogikk til UI
 */
export function useCuttingAvailability(fields: CuttingFields) {
  return getCuttingAvailability({
    D: toNumber(fields.D.value),
    Vc: toNumber(fields.Vc.value),
    n: toNumber(fields.n.value),
    F: toNumber(fields.F.value),
    fz: toNumber(fields.fz.value),
    z: toNumber(fields.z.value),
  });
}
