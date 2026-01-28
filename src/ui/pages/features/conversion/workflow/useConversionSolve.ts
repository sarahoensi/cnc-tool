import { toNumber } from "@utils/number";
import { solveConversion } from "@core/conversion/solve/solveConversion";
import { mmInchConverter } from "@core/conversion/solve/mmInch";
import { interpretConversionInput } from "@core/conversion/input/interpretConversionInput";

import type { ConversionFields } from "../model/conversionFields";
import { machineField } from "@app/state/field";

export function useConversionSolve(
  fields: ConversionFields,
  setFields: React.Dispatch<React.SetStateAction<ConversionFields>>
) {
  function solve() {
    const raw = {
      left: toNumber(fields.left.value),
      right: toNumber(fields.right.value),
    };

    const interpreted = interpretConversionInput(raw);
    if (!interpreted.hasDriver) return;

    const result = solveConversion(mmInchConverter, raw);

    setFields(prev => {
      if (result.target === "right") {
        return {
          ...prev,
          right: {
            ...machineField(result.value.toString()),
            usage: "idle",
          },
        };
      }

      return {
        ...prev,
        left: {
          ...machineField(result.value.toString()),
          usage: "idle",
        },
      };
    });
  }

  return { solve };
}
