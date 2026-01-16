// src/ui/pages/shared/workflow/solving/applySolveResult.ts

import { machineField } from "@app/state/field";
import type { FieldState } from "@app/state/field";
import { canOverwriteWithMachine } from "@app/state/field";

/**
 * Applies solver result values to FieldState records.
 *
 * - Only overwrites fields that allow machine overwrite
 * - Supports explicit result → field mapping
 * - Supports reformatting (e.g. on decimal change)
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
  const format = options?.format ?? ((v) => String(v));

  for (const key of Object.keys(result) as (keyof F)[]) {
    const value = result[key];
    if (typeof value !== "number") continue;

    if (!canOverwriteWithMachine(prev[key])) continue;

    next[key] = machineField(
      format(value, key)
    ) as F[keyof F];
  }

  return next;
}
