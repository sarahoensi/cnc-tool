// src/ui/pages/cuttingData/state/useCuttingFieldsState.ts

import { usePersistentState } from "@app/state";
import { createEmptyCuttingFields, type CuttingFields } from "./cuttingFields";

export function useCuttingFieldsState() {
  return usePersistentState<CuttingFields>(
    "cutting:fields",
    createEmptyCuttingFields
  );
}
