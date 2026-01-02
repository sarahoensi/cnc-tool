import type { FieldState } from "./field";

/**
 * Determines whether a field may be overwritten by a machine-computed value.
 *
 * Rule:
 * - Only actual user input is protected
 * - Empty fields are always allowed to be filled
 *
 * Protected:
 *   source === "user" && value !== ""
 */
export function canOverwriteWithMachine(
  field: FieldState
): boolean {
  return !(
    field.source === "user" &&
    field.value !== ""
  );
}
