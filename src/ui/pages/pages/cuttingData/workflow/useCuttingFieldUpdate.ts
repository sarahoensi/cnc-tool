import { useFieldUpdater } from "@ui/pages/shared/workflow";
import type { CuttingFields } from "../state/cuttingFields";

type UseCuttingFieldUpdateArgs = {
  setFields: React.Dispatch<React.SetStateAction<CuttingFields>>;
  clearFieldError: (key: keyof CuttingFields) => void;
  clearError: () => void;
};

export function useCuttingFieldUpdate({
  setFields,
  clearFieldError,
  clearError,
}: UseCuttingFieldUpdateArgs) {
  return useFieldUpdater<CuttingFields>({
    setFields,
    clearFieldError,
    clearError,
  });
}
