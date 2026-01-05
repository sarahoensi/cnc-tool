import { interpretHolePlanInput } from "../input/interpretHolePlanInput";

type HolePlanInput = {
  D_start?: number;
  D_target?: number;
  N?: number;
  ae?: number;
};

export function getHolePlanAvailability(input: HolePlanInput) {
  const { has } = interpretHolePlanInput(input);

  // Gyldige og entydige plan-typer
  const canPlanFromN =
    has.D_start &&
    has.D_target &&
    has.N &&
    !has.ae;

  const canPlanFromAe =
    has.D_start &&
    has.D_target &&
    has.ae &&
    !has.N;

  const canPlanFromNoStart =
    !has.D_start &&
    has.D_target &&
    has.N &&
    has.ae;

  const canPlan =
    canPlanFromN ||
    canPlanFromAe ||
    canPlanFromNoStart;

  return {
    has,

    canPlanFromN,
    canPlanFromAe,
    canPlanFromNoStart,

    canPlan,
  };
}
