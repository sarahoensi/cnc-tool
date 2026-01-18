type Params = {
  resetPage: () => void;
  resetFields: () => void;
  clearAllFieldErrors: () => void;
  setResult: (value: null) => void;
  setError: (value: null) => void;
  clearDrivers: () => void;
};

export function useCuttingReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setResult,
  setError,
  clearDrivers,
}: Params) {
  function reset() {
    resetPage();
    resetFields();
    clearAllFieldErrors();
    setResult(null);
    setError(null);
    clearDrivers();
  }

  return { reset };
}
