// src/ui/pages/features/holeMachining/domain/measurement/useHoleMeasurementValidation.ts

import type { HoleExecutionState } from "@core/holeMachining";
import { formatNumber } from "@utils/format";

export function useHoleMeasurementValidation(
  state: HoleExecutionState,
  decimals: number
) {
  function getMinAllowedDiameter(step: number): number {
    const previous = state.log
      .filter(l => l.step < step)
      .sort((a, b) => b.step - a.step)[0];

    return previous ? previous.measured : state.D_start;
  }

  function validate(step: number, value: string): string | null {
    if (!value.trim()) return "Målt Ø mangler";

    const num = Number(value.replace(",", "."));
    if (isNaN(num)) return "Ugyldig tall";

    const min = getMinAllowedDiameter(step);

    if (num < min) {
      return `Må være ≥ ${formatNumber(min, decimals)} mm`;
    }

    return null;
  }

  return {
    validate,
  };
}
