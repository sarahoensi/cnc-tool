// src/core/error.ts

export type FieldErrorMap<T extends string = string> = Partial<Record<T, string>>;

export class FieldValidationError<T extends string = string> extends Error {
  fieldErrors: FieldErrorMap<T>;

  constructor(fieldErrors: FieldErrorMap<T>) {
    super("Valideringsfeil");
    this.name = "FieldValidationError";
    this.fieldErrors = fieldErrors;
  }
}
