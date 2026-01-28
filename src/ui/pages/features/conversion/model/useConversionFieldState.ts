import { useState } from "react";
import { emptyField } from "@app/state/field";
import type { ConversionFields } from "./conversionFields";

export function useConversionFieldsState() {
  const [fields, setFields] = useState<ConversionFields>({
    left: { ...emptyField(), usage: "idle" },
    right: { ...emptyField(), usage: "idle" },
  });

  function resetFields() {
    setFields({
      left: { ...emptyField(), usage: "idle" },
      right: { ...emptyField(), usage: "idle" },
    });
  }

  return [fields, setFields, resetFields] as const;
}
