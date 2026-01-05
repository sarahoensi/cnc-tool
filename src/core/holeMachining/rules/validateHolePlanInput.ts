import { FieldValidationError } from "../../errors";
import { getHolePlanAvailability } from "./availability";

export function validateHolePlanInput(input: {
  D_start?: number;
  D_target?: number;
  N?: number;
  ae?: number;
}) {
  const availability = getHolePlanAvailability(input);
  const errors: Record<string, string> = {};

  if (!availability.has.D_target) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (availability.has.D_start && availability.has.D_target) {
    if (input.D_target! <= input.D_start!) {
      errors.D_target =
        "Target Ø må være større enn Start Ø";
    }
  }

  if (
    !availability.canPlanFromN &&
    !availability.canPlanFromAe &&
    !availability.canPlanFromNoStart
  ) {
    errors.D_start =
      "Ugyldig kombinasjon av Start Ø, N og ae";
    errors.N =
      "Oppgi enten antall kutt eller radialt inngrep";
    errors.ae =
      "Oppgi enten antall kutt eller radialt inngrep";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  return availability;
}
