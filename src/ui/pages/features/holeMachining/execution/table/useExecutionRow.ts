import type {
  HoleExecutionState,
  NextTargetInfo,
} from "@core/holeMachining";

export function useExecutionRow(
  state: HoleExecutionState,
  nextTarget: NextTargetInfo | null
) {
  return function getRow(step: number) {
    const log = state.log.find(l => l.step === step);
    const isCurrent = !state.finished && state.step + 1 === step;

    return {
      log,
      isCurrent,
      canEdit: Boolean(log) && step === state.step,

      startDiameter:
        log?.startDiameter ??
        (isCurrent ? nextTarget?.startDiameter : null),

      deltaD:
        log?.deltaD ??
        (isCurrent ? nextTarget?.deltaD : null),

      ae:
        log?.ae ??
        (isCurrent ? nextTarget?.ae : null),
    };
  };
}
