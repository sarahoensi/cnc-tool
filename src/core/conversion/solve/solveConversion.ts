import type { ConversionInput, ConversionResult } from "../types";

export type Converter = {
  forward(value: number): number;
  reverse(value: number): number;
};

export function solveConversion(
  converter: Converter,
  input: ConversionInput
): ConversionResult {
  const hasLeft = typeof input.left === "number";
  const hasRight = typeof input.right === "number";

  if (hasLeft === hasRight) {
    throw new Error("Oppgi nøyaktig én verdi");
  }

  if (hasLeft) {
    return {
      target: "right",
      value: converter.forward(input.left!),
    };
  }

  return {
    target: "left",
    value: converter.reverse(input.right!),
  };
}
