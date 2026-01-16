import { useEffect, useRef } from "react";
import { getDecimals } from "@ui/components/Settings/decimals/useDecimals";
import { formatNumber } from "@utils/format";
import { applySolveResult } from "@ui/pages/shared/workflow/solving";

type SetFieldsFn<F> = React.Dispatch<React.SetStateAction<F>>;

export function useReformatOnDecimalsChange<
  F extends Record<string, any>
>(
  setFields: SetFieldsFn<F>
) {
  const lastResultRef =
    useRef<Partial<Record<keyof F, number>> | null>(null);

  function applyFormattedResult(
    result: Partial<Record<keyof F, number>>
  ) {
    lastResultRef.current = result;

    const decimals = getDecimals();

    setFields(prev =>
      applySolveResult(prev, result, {
        format: (value) => formatNumber(value, decimals),
      })
    );
  }

  useEffect(() => {
    function handleDecimalsChanged() {
      if (!lastResultRef.current) return;

      const decimals = getDecimals();
      const result = lastResultRef.current;

      setFields(prev =>
        applySolveResult(prev, result, {
          format: (value) => formatNumber(value, decimals),
        })
      );
    }

    window.addEventListener(
      "decimals-changed",
      handleDecimalsChanged
    );
    return () =>
      window.removeEventListener(
        "decimals-changed",
        handleDecimalsChanged
      );
  }, [setFields]);

  return {
    applyFormattedResult,
  };
}
