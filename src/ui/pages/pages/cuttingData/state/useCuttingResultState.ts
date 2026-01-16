import { usePersistentState } from "@app/state";
import type { CuttingDataSolution } from "@core/cuttingData";

export function useCuttingResultState() {
  return usePersistentState<CuttingDataSolution | null>(
    "cutting:result",
    null
  );
}
