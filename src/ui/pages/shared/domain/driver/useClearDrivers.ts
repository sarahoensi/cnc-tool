type ClearableDriver = {
  clearDriver: () => void;
};

export function useClearDrivers(...drivers: ClearableDriver[]) {
  return function clearAllDrivers() {
    for (const driver of drivers) {
      driver.clearDriver();
    }
  };
}
