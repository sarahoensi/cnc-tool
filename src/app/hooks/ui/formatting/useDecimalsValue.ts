import { useEffect, useState } from "react";
import { getDecimals } from "@ui/components/Settings/decimals/useDecimals";

export function useDecimalsValue() {
  const [decimals, setDecimals] = useState(getDecimals());

  useEffect(() => {
    function handleChange() {
      setDecimals(getDecimals());
    }

    window.addEventListener("decimals-changed", handleChange);
    return () =>
      window.removeEventListener("decimals-changed", handleChange);
  }, []);

  return decimals;
}
