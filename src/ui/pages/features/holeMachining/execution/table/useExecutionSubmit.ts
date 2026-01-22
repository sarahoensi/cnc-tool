export function useExecutionSubmit(params: {
  stateStep: number;
  measurements: Record<number, string>;
  validate: (step: number, value: string) => string | null;
  onSubmit: (step: number) => void;
  onUpdate: (step: number, value: string) => void;
  markSubmitAttempt: (step: number) => void;
  clearSubmitAttempt: () => void;
}) {
  function submitCurrent() {
    const step = params.stateStep + 1;
    const value = params.measurements[step] ?? "";
    const error = params.validate(step, value);

    if (!error) {
      params.onSubmit(step);
      params.clearSubmitAttempt();
    } else {
      params.markSubmitAttempt(step);
    }
  }

  function update(step: number, value: string) {
    params.onUpdate(step, value);
  }

  return {
    submitCurrent,
    update,
  };
}
