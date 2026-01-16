import { machineField } from "@app/state/field";
import type { FieldState } from "@app/state/field";
import { canOverwriteWithMachine } from "@app/state/field";


export function applySolveResult<
  F extends Record<string, FieldState>
>(
  prev: F,
  result: Partial<Record<keyof F, number>>,
  options?: {
    format?: (value: number, key: keyof F) => string;
  }
): F {
  const next: F = { ...prev };

  const format = options?.format ?? ((value: number) => String(value));


  for (const key of Object.keys(result) as (keyof F)[]) {
    const computed = result[key];
    if (typeof computed !== "number") continue;

    const prevField = prev[key];
    if (!canOverwriteWithMachine(prevField)) continue;

    next[key] = machineField(
      format(computed, key)
    ) as F[keyof F];
  }

  return next;
}
