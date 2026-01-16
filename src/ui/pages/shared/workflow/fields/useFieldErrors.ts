//src/app/hooks/form/useFieldErrors.ts

import { useState } from "react";

/**
 * Generic hook for field-level validation errors.
 *
 * K = union of field keys (string literals)
 */
export function useFieldErrors<K extends string>() {
  const [errors, setErrors] = useState<Partial<Record<K, string>>>({});

  /**
   * Set multiple field errors at once.
   * Replaces existing errors.
   */
  function setFieldErrors(next: Partial<Record<K, string>>) {
    setErrors(next);
  }

  /**
   * Clear error for a single field.
   */
  function clearFieldError(key: K) {
    setErrors(prev => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  /**
   * Clear all field errors.
   */
  function clearAllFieldErrors() {
    setErrors({});
  }

  return {
    fieldErrors: errors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  };
}
