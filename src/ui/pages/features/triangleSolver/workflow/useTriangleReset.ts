type UseTriangleResetOptions = {
  resetPage: () => void;
  resetFields: () => void;
  clearAllFieldErrors: () => void;
  setError: (error: string | null) => void;

  onAfterReset?: () => void;
};

export function useTriangleReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setError,
  onAfterReset,
}: UseTriangleResetOptions) {
  const reset = () => {
    // 1. Persistent page state
    resetPage();

    // 2. Domain state
    resetFields();

    // 3. Errors
    clearAllFieldErrors();
    setError(null);

    // 4. UI-intensjon (f.eks. fokus)
    onAfterReset?.();
  };

  return { reset };
}
