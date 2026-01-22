import type { HoleExecutionState } from "@core/holeMachining";
import type { DiameterRules } from "../rules/diameterRules";
import { innerDiameterRules } from "../rules/innerDiameterRules";
import { outerDiameterRules } from "../rules/outerDiameterRules";

/**
 * Støttede diameter-moduser.
 * (kun "inner" i bruk foreløpig)
 */
export type DiameterMode = "inner" | "outer";

type Params = {
  mode: DiameterMode;
  state: HoleExecutionState;
  decimals: number;
};

function getRules(mode: DiameterMode): DiameterRules {
  switch (mode) {
    case "inner":
      return innerDiameterRules;
    case "outer":
      return outerDiameterRules;
  }
}

/**
 * UI-nær hook som validerer diameter-målinger
 * basert på valgt diameter-modus.
 *
 * ExecutionTable skal kun bruke validate().
 */
export function useDiameterMeasurementValidation({
  mode,
  state,
  decimals,
}: Params) {
  const rules = getRules(mode);

  function validate(step: number, value: string): string | null {
    if (!value.trim()) return "Målt Ø mangler";

    const num = Number(value.replace(",", "."));
    if (isNaN(num)) return "Ugyldig tall";

    const limit = rules.getLimit(step, state);

    if (!rules.isValid(num, limit)) {
      return rules.errorMessage(limit, decimals);
    }

    return null;
  }

  return { validate };
}
