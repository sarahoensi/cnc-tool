import { machineField } from "@app/state/field";
import type { FieldState } from "@app/state/field";
import { canOverwriteWithMachine } from "@app/state/field";

/**
 * Applies numeric solve results to FieldState records.
 *
 * Contract:
 * - Only fields that are allowed to be overwritten will be updated
 * - Actual user input (source === "user" && value !== "") is never overwritten
 * - Empty or machine fields may be filled with computed values
 * - Formatting is handled here to keep solvers UI-agnostic
 */
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

  const format =
    options?.format ??
    ((value: number) => value.toFixed(4));

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
