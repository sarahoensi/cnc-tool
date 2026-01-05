import {
  createPlanFromN,
  createPlanFromAe,
  createPlanFromNoStart,
} from "./";
import { validateHolePlanInput } from "../rules/validateHolePlanInput";

export function createHolePlan(input: {
  D_start?: number;
  D_target?: number;
  N?: number;
  ae?: number;
}) {
  const availability = validateHolePlanInput(input);

  if (availability.canPlanFromN) {
    return createPlanFromN(input as any);
  }

  if (availability.canPlanFromAe) {
    return createPlanFromAe(input as any);
  }

  return createPlanFromNoStart(input as any);
}
