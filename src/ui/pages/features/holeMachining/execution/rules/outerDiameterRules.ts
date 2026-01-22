import { formatNumber } from "@utils/number";
import { DiameterRules, getPreviousDiameter } from "./diameterRules";

export const outerDiameterRules: DiameterRules = {
  getLimit(step, state) {
    return getPreviousDiameter(step, state);
  },

  isValid(value, limit) {
    return value <= limit;
  },

  errorMessage(limit, decimals) {
    return `Må være ≤ ${formatNumber(limit, decimals)} mm`;
  },
};
