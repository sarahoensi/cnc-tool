import type {
  HoleExecutionState,
  NextTargetInfo,
} from "@core/holeMachining";

//import type { DiameterMode } from "../../model/diameterMode";

type Params = {
  //mode: DiameterMode;
  state: HoleExecutionState;
  nextTarget: NextTargetInfo | null;
};

export function useExecutionRow({
  //mode,
  state,
  nextTarget,
}: Params) {
  return function getRow(step: number) {
    const log = state.log.find(l => l.step === step);
    const isCurrent =
      !state.finished && state.step + 1 === step;

    return {
      /* -----------------------------
       * Status
       * ----------------------------- */
      log,
      isCurrent,
      canEdit: Boolean(log) && step === state.step,

      /* -----------------------------
       * Diameters
       * ----------------------------- */
      startDiameter:
        log?.startDiameter ??
        (isCurrent
          ? nextTarget?.startDiameter ?? null
          : null),

      /* -----------------------------
       * Cut values
       * ----------------------------- */
      deltaD:
        log?.deltaD ??
        (isCurrent ? nextTarget?.deltaD ?? null : null),

      ae:
        log?.ae ??
        (isCurrent ? nextTarget?.ae ?? null : null),
    };
  };
}
