export function useExecutionSubmit(params: {
  stateStep: number;
  measurements: Record<number, string>;
  onSubmit: (step: number) => void;
  onUpdate: (step: number, value: string) => void;
  markSubmitAttempt: (step: number, message?: string) => void;
  clearSubmitAttempt: () => void;
}) {
  function submitCurrent() {
    const step = params.stateStep + 1;
    const value = params.measurements[step] ?? "";

    if (!value.trim()) {
      params.markSubmitAttempt(step, "Målt Ø mangler");
      return;
    }

    try {
      params.onSubmit(step);
      params.clearSubmitAttempt();
    } catch (e) {
      params.markSubmitAttempt(
        step,
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  function update(step: number, value: string) {
    try {
      params.onUpdate(step, value);
      params.clearSubmitAttempt();
    } catch (e) {
      params.markSubmitAttempt(
        step,
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  return {
    submitCurrent,
    update,
  };
}
