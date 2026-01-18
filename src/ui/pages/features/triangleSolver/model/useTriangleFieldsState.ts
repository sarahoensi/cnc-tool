import { usePersistentState } from "@app/state";
import type { TriangleFields } from "./triangleFields";
import { createEmptyTriangleFields } from "./triangleFields";

export function useTriangleFieldsState() {
  return usePersistentState<TriangleFields>(
    "triangle:fields",
    createEmptyTriangleFields
  );
}