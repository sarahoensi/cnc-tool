import { usePersistentState } from "@app/state";

export function useCuttingErrorState() {
  return usePersistentState<string | null>(
    "cutting:error",
    null
  );
}
