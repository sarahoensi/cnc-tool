
type UseCuttingResetArgs = {
  resetPage: () => void;
  resetFields: () => void;
  resetResult: () => void;
  resetError: () => void;
  clearAllFieldErrors: () => void;
  speedDriver: {
    clearDriver: () => void;
  };
  feedDriver: {
    clearDriver: () => void;
  };
};

export function useCuttingReset({
  resetPage,
  resetFields,
  resetResult,
  resetError,
  clearAllFieldErrors,
  speedDriver,
  feedDriver,
}: UseCuttingResetArgs) {
  return function reset() {

    resetPage();
    resetFields();
    resetResult();
    resetError();
    clearAllFieldErrors();

    speedDriver.clearDriver();
    feedDriver.clearDriver();
  };
}
