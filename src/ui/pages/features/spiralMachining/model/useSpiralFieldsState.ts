import { usePersistentState } from "@app/state";
import type { SpiralFields } from "./spiralFields";
import { createEmptySpiralFields } from "./spiralFields";

export function useSpiralFieldsState() {
  return usePersistentState<SpiralFields>(
    "spiral:fields",
    createEmptySpiralFields
  );
}
