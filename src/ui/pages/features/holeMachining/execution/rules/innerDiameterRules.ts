import { DiameterRules } from "./diameterRules";
import { getPreviousDiameter } from "./diameterRules";
import { formatNumber } from "@utils/format";

/**
 * Regler for INDRE diameter (ID).
 *
 * Diameter skal alltid være:
 *   ny >= forrige
 */
export const innerDiameterRules: DiameterRules = {
  getLimit(step, state) {
    return getPreviousDiameter(step, state);
  },

  isValid(value, limit) {
    return value >= limit;
  },

  errorMessage(limit, decimals) {
    return `Må være ≥ ${formatNumber(limit, decimals)} mm`;
  },
};
