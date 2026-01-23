import {
  registerMeasurement,
  computeNextTarget,
} from "@core/holeMachining";

import type { DiameterExecutionRules } from "./diameterExecutionRules";

/**
 * Midlertidig: bruker samme core-logikk som inner.
 * Kan erstattes når OD får egne regler.
 */
export const outerDiameterExecutionRules: DiameterExecutionRules = {
  registerMeasurement,
  computeNextTarget,
};
