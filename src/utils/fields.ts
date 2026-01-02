import type { FieldState } from "@app/state/field/field";

/**
 * When a user edits a field, clear any machine-generated fields to avoid stale values.
 */
export function applyUserEdit<T extends Record<string, FieldState>>(prev: T, editedKey: keyof T, value: string): T {
  const next: Record<string, FieldState> = { ...prev };

  for (const key in prev) {
    if (key !== editedKey && prev[key].source === "machine") {
      next[key] = { value: "", source: "machine" };
    }
  }

  next[editedKey as string] = { value, source: "user" };
  return next as T;
}
