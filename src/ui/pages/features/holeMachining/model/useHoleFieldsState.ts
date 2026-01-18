import { usePersistentState } from "@app/state";
import { createEmptyHoleFields, HoleFields } from "./holeFields";

export function useHoleFieldsState() {
  return usePersistentState<HoleFields>(
    "hole:fields",
    createEmptyHoleFields
  );
}
