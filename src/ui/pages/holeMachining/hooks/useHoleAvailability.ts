// src/ui/pages/holeMachining/hooks/useHoleAvailability.ts

import { getHolePlanAvailability } from "@core/holeMachining/rules/availability";
import { toNumber } from "@utils/number";
import type { FieldState } from "@app/state/field/field";

/**
 * Adapter mellom UI FieldState og core availability-regler.
 *
 * Ansvar:
 * - oversette FieldState -> HolePlanInput
 * - kalle core-regel
 * - returnere domenelogikk til UI
 */
export function useHoleAvailability(fields: {
  D_start: FieldState;
  D_target: FieldState;
  N: FieldState;
  ae: FieldState;
}) {
  return getHolePlanAvailability({
    D_start: toNumber(fields.D_start.value),
    D_target: toNumber(fields.D_target.value),
    N: toNumber(fields.N.value),
    ae: toNumber(fields.ae.value),
  });
}
