export function parseNumberFields<T extends object>(
  fields: { [K in keyof T]: { value: string } }
): {
  input: Partial<{ [K in keyof T]: number }>;
  errors: Partial<Record<keyof T, string>>;
} {
  const input: Partial<Record<keyof T, number>> = {};
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key in fields) {
    const raw = fields[key].value;
    if (raw === "") continue;

    const parsed = Number(raw);

    if (!Number.isFinite(parsed)) {
      errors[key] = "Ugyldig tallverdi";
      continue;
    }

    if (parsed <= 0) {
      errors[key] = "Verdien må være > 0";
      continue;
    }

    input[key] = parsed;
  }

  return { input, errors };
}
