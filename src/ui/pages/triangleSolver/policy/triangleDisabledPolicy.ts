import type { TriangleFields } from "../types/triangleTypes";

type TriangleKey = keyof TriangleFields;

export function getTriangleDisabledMap(
  fields: TriangleFields,
  validSets: TriangleKey[][]
) {
  const disabled: Record<TriangleKey, boolean> = {
    a: false,
    b: false,
    c: false,
    alpha: false,
    beta: false,
  };

  const filled = (Object.keys(fields) as TriangleKey[])
    .filter(k => fields[k].source === "user");

  // 0 felt → ingen låsing
  if (filled.length === 0) {
    return disabled;
  }

  const matchingSets = validSets.filter(set =>
    filled.every(f => set.includes(f))
  );

  // ingen gyldige → lås alt (validering tar feilen)
  if (matchingSets.length === 0) {
    for (const key of Object.keys(disabled) as TriangleKey[]) {
      if (fields[key].source !== "machine") {
        disabled[key] = true;
      }
    }
    return disabled;
  }

  // Union av alle tillatte felter
  const allowed = new Set<TriangleKey>();
  for (const set of matchingSets) {
    for (const key of set) {
      allowed.add(key);
    }
  }

  for (const key of Object.keys(disabled) as TriangleKey[]) {
    if (!allowed.has(key) && fields[key].source !== "machine") {
      disabled[key] = true;
    }
  }

  return disabled;
}
