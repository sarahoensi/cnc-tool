import type { TriangleFields } from "../../model/triangleFields";

type FieldKey = keyof TriangleFields;

export function getTriangleDisabledMap(
  fields: TriangleFields,
  constraints: FieldKey[][]
) {
  const disabled: Record<FieldKey, boolean> = {
    a: false,
    b: false,
    c: false,
    alpha: false,
    beta: false,
  };

  // 1. Hvilke felt er fylt av bruker (ikke machine)
  const filled = (Object.keys(fields) as FieldKey[]).filter(
    (k) =>
      fields[k].value !== "" &&
      fields[k].source !== "machine"
  );

  // Ingenting fylt → ingenting disabled
  if (filled.length === 0) {
    return disabled;
  }

  // 2. Finn constraints som fortsatt er kompatible
  const compatibleConstraints = constraints.filter(
    (set) =>
      filled.every((f) => set.includes(f))
  );

  // Ingen kompatible → disable ingenting (la solve ta feilen)
  if (compatibleConstraints.length === 0) {
    return disabled;
  }

  // 3. Felter som finnes i minst ett kompatibelt sett
  const allowed = new Set<FieldKey>();
  for (const set of compatibleConstraints) {
    for (const key of set) {
      allowed.add(key);
    }
  }

  // 4. Disable alle andre (med mindre de er machine)
  for (const key of Object.keys(disabled) as FieldKey[]) {
    if (!allowed.has(key) && fields[key].source !== "machine") {
      disabled[key] = true;
    }
  }

  return disabled;
}
