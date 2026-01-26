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
 
export function canOverwriteWithMachine(
  field: FieldState
): boolean {
  return !(
    field.source === "user" &&
    field.value !== ""
  );
}
*/
export type OverwriteSource =
  | "machine"
  | "plan"
  | "execution";

  export function canOverwrite(
  field: FieldState,
  incoming: OverwriteSource
): boolean {
  // Brukerinput er alltid beskyttet
  if (field.source === "user" && field.value !== "") {
    return false;
  }

  // Execution låser feltet
  if (field.source === "execution") {
    return false;
  }

  // Plan kan overskrives av execution, men ikke av machine
  if (field.source === "plan" && incoming === "machine") {
    return false;
  }

  return true;
}
