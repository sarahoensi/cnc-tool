type Params = {
  resetPage: () => void;
  resetFields: () => void;
  clearAllFieldErrors: () => void;
  setResult: (res: null) => void;
  setError: (err: null) => void;
  focusFirstField: () => void;
};

export function useSpiralReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setResult,
  setError,
  focusFirstField,
}: Params) {
  function reset() {
    // Nullstill UI-state
    resetPage();
    resetFields();

    // Fjern feil og resultat
    clearAllFieldErrors();
    setResult(null);
    setError(null);

    // UX
    focusFirstField();
  }

  return { reset };
}
