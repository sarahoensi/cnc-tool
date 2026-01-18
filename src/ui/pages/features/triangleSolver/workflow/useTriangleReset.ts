type Params = {
  resetPage: () => void;
  resetFields: () => void;
  clearAllFieldErrors: () => void;
  setError: (value: string | null) => void;
};

export function useTriangleReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setError,
}: Params) {
  function reset() {
    resetPage();
    resetFields();
    clearAllFieldErrors();
    setError(null);
  }

  return { reset };
}
