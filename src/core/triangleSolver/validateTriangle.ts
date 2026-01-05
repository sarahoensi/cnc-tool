import { FieldValidationError } from "../errors";
import { getTriangleAvailability } from "./availability";
import type { TriangleSolverInput } from "./types";

export type TriangleField =
  | "a"
  | "b"
  | "c"
  | "alpha"
  | "beta";

type ErrorMap = Partial<Record<TriangleField, string>>;

function addError(
  errors: ErrorMap,
  field: TriangleField,
  message: string
) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

export function validateTriangleInput(input: TriangleSolverInput) {
  const {alpha, beta } = input;
  const availability = getTriangleAvailability(input);

  const errors: ErrorMap = {};

  const provided: Record<TriangleField, boolean> = {
    a: availability.hasA,
    b: availability.hasB,
    c: availability.hasC,
    alpha: availability.hasAlpha,
    beta: availability.hasBeta,
  };

  const givenCount = Object.values(provided).filter(Boolean).length;

  // ==================================================
  // 1. INGEN INPUT
  // ==================================================
  if (givenCount === 0) {
    addError(
      errors,
      "a",
      "Oppgi minst to verdier for å beregne trekanten"
    );
  }

  // ==================================================
  // 2. UGYLDIGE VINKLER
  // ==================================================
  if (alpha !== undefined && (alpha <= 0 || alpha >= 90)) {
    addError(errors, "alpha", "Vinkel må være mellom 0 og 90°");
  }

  if (beta !== undefined && (beta <= 0 || beta >= 90)) {
    addError(errors, "beta", "Vinkel må være mellom 0 og 90°");
  }

  // ==================================================
  // 3. KUN ÉN VERDI
  // ==================================================
  if (givenCount === 1) {
    if (provided.a) addError(errors, "a", "Én side alene er ikke nok");
    if (provided.b) addError(errors, "b", "Én side alene er ikke nok");
    if (provided.c) addError(errors, "c", "Én side alene er ikke nok");
    if (provided.alpha)
      addError(errors, "alpha", "Én vinkel alene er ikke nok");
    if (provided.beta)
      addError(errors, "beta", "Én vinkel alene er ikke nok");
  }

  // ==================================================
  // 4. TO VERDIER – KOMBinasjonsvalidering
  // ==================================================
  if (givenCount === 2) {
    // gyldige par for rettvinklet trekant
    const validPairs: Array<[TriangleField, TriangleField]> = [
      ["a", "b"],
      ["a", "alpha"],
      ["b", "beta"],
      ["c", "alpha"],
      ["c", "beta"],
    ];

    const isValidPair = validPairs.some(
      ([x, y]) => provided[x] && provided[y]
    );

    if (!isValidPair) {
      for (const key in provided) {
        const field = key as TriangleField;
        if (provided[field]) {
          addError(
            errors,
            field,
            "Denne kombinasjonen er ikke nok til å løse trekanten"
          );
        }
      }
    }

    // mer presise meldinger for kjente “nesten riktige” tilfeller
    if (provided.a && provided.b) {
      addError(errors, "alpha", "Oppgi en vinkel eller hypotenusen");
    }

    if (provided.c && !provided.alpha && !provided.beta) {
      addError(errors, "alpha", "Oppgi minst én vinkel");
    }
  }

  // ==================================================
  // 5. VINKELKONSISTENS
  // ==================================================
  if (availability.hasAlpha && availability.hasBeta) {
    if (Math.abs(alpha! + beta! - 90) > 1e-6) {
      addError(errors, "alpha", "Summen av vinkler må være 90°");
      addError(errors, "beta", "Summen av vinkler må være 90°");
    }
  }

  // ==================================================
  // 6. AVBRYT VED FEIL
  // ==================================================
  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError<TriangleField>(errors);
  }
}
