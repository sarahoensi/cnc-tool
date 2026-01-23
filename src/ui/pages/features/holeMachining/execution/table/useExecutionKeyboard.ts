import type React from "react";
import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";

type Params = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export function useExecutionKeyboard({
  onSubmit,
  onCancel,
}: Params) {
  const { onKeyDown } = useEnterNavigation({
    onSubmit,
  });

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      onCancel();
      return;
    }

    onKeyDown(e);
  }

  return {
    onKeyDown: handleKeyDown,
  };
}
