import { solveHelix } from "@core/helix";
import type { HelixInput, HelixSolution, HelixMode } from "@core/helix/types";
import { FieldValidationError } from "@core/errors";
import { toNumber } from "@utils/number";

import type { SpiralFields } from "../model/spiralFields";

type FieldKeys = keyof SpiralFields;

type Params = {
  fields: SpiralFields;
  modeRef: React.RefObject<HelixMode>;
  clearAllFieldErrors: () => void;
  setFieldErrors: (errors: Partial<Record<FieldKeys, string>>) => void;
  setError: (error: string | null) => void;
  setResult: (result: HelixSolution | null) => void;
  applyFormattedResult: (values: Partial<Record<FieldKeys, number>>) => void;
};

export function useSpiralSolve({
  fields,
  modeRef,
  clearAllFieldErrors,
  setFieldErrors,
  setError,
  setResult,
  applyFormattedResult,
}: Params) {
  function handleSolve() {
    clearAllFieldErrors();
    setError(null);
    setResult(null);

    const input: HelixInput = {
      mode: modeRef.current,
      diameter: toNumber(fields.diameter.value),
    };

    const optionalKeys: Array<"toolDiameter" | "pitch" | "angle"> = [
      "toolDiameter",
      "pitch",
      "angle",
    ];

    for (const key of optionalKeys) {
      const raw = fields[key].value;
      if (raw === "") continue;

      const parsed = toNumber(raw);
      if (Number.isFinite(parsed)) {
        input[key] = parsed;
      }
    }

    try {
      const res = solveHelix(input);

      applyFormattedResult({
        pitch: res.pitch,
        angle: res.angle,
      });

      setResult(res);
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  return { handleSolve };
}
