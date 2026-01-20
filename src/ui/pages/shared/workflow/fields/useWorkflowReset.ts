type ResetStep = () => void;

type UseWorkflowResetOptions = {
  steps: ResetStep[];
  onAfterReset?: () => void;
};

export function useWorkflowReset({
  steps,
  onAfterReset,
}: UseWorkflowResetOptions) {
  const reset = () => {
    for (const step of steps) {
      step();
    }

    onAfterReset?.();
  };

  return { reset };
}
