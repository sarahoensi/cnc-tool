import {
  registerMeasurement,
  computeNextTarget,
} from "@core/holeMachining";

import type { DiameterExecutionRules } from "./diameterExecutionRules";

/**
 * Execution-regler for INDRE diameter (ID).
 *
 * Foreløpig er dette bare en tynn wrapper rundt core.
 * Hele poenget er å isolere ID/OD-valg fra workflow.
 */
export const innerDiameterExecutionRules: DiameterExecutionRules = {
  registerMeasurement,
  computeNextTarget,
};
