import { usePersistentState } from "@app/state";
import type { HelixSolution } from "@core/helix/types";

export function useSpiralResultState() {
 
    usePersistentState<HelixSolution | null>(
      "spiral:result",
      null
    );
}

