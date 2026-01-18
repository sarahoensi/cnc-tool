type Params = {
  resetPage: () => void;
  resetFields: () => void;

  clearAllFieldErrors: () => void;

  setPlan: (plan: null) => void;
  setState: (state: null) => void;
  setMeasurements: (m: {}) => void;
  setError: (error: null) => void;

  focusFirstField: () => void;
};

export function useHoleReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setPlan,
  setState,
  setMeasurements,
  setError,
  focusFirstField,
}: Params) {
  function reset() {
    resetPage();
    resetFields();

    clearAllFieldErrors();
    setPlan(null);
    setState(null);
    setMeasurements({});
    setError(null);

    focusFirstField();
  }

  return { reset };
}
