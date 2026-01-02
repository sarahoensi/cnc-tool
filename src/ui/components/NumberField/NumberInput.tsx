// src/ui/components/NumberInput.tsx

import React from "react";
import { toNumber } from "@utils/number";

interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValue: (value: string, asNumber: number) => void;
}

/**
 * NumberInput:
 * - støtter både . og , (ingen minus-tegn)
 * - returnerer tekst OG tall (NaN hvis tom/ikke tall)
 * - validerer ikke hardt (soft validation)
 */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onValue, onKeyDown, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Tillat kun tall, punktum og komma (ingen minus).
    const filtered = raw
      .replace(/[^0-9.,]/g, "")
      .replace(/([.,]).*?\1/, "$1");

    const numeric = toNumber(filtered);

    onValue(filtered, numeric);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      ref={ref}
    />
  );
}
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
