export type FieldSource = "empty" | "user" | "machine" ;

export type FieldState = {
  value: string;
  source: FieldSource;
  usage?: "idle" | "active";
};

export const emptyField = (): FieldState => ({
  value: "",
  source: "empty",
  usage: "idle",
});

export const userField = (value: string): FieldState => ({
  value,
  source: "user",
  usage: "idle",
});

export const machineField = (value: string): FieldState => ({
  value,
  source: "machine",
  usage: "idle",
});



/**
 * Clears all machine-filled fields in a record, except any keys explicitly
 * preserved, and returns a new object reference.
 */
export function clearMachineFields<F extends Record<string, FieldState>>(
  fields: F,
  keep: (keyof F)[] = []
): F {
  const keepSet = new Set(keep);
  let next: F | null = null;

  for (const key of Object.keys(fields) as (keyof F)[]) {
    if (keepSet.has(key)) continue;

    if (fields[key].source === "machine") {
      if (!next) next = { ...fields };
      next[key] = emptyField() as F[keyof F];
    }
  }

  return next ?? fields;
}
