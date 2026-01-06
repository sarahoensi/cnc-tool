import { setDecimals, getDecimals, type Decimals } from "./useDecimals";
import { useState } from "react";

export function DecimalSettings() {
  const [current, setCurrent] = useState<Decimals>(getDecimals());

  function handleChange(value: Decimals) {
    setDecimals(value);
    setCurrent(value);
  }

  return (
    <>
      <button onClick={() => handleChange(0)}>0 desimaler</button>
      <button onClick={() => handleChange(1)}>1 desimal</button>
      <button onClick={() => handleChange(2)}>2 desimaler</button>
      <button onClick={() => handleChange(3)}>3 desimaler</button>
      <button onClick={() => handleChange(4)}>4 desimaler</button>
      <button onClick={() => handleChange(5)}>5 desimaler</button>
      <button onClick={() => handleChange(6)}>6 desimaler</button>

      <p style={{ opacity: 0.6, marginTop: 8 }}>
        Nåværende: {current} desimal{current === 1 ? "" : "er"}
      </p>
    </>
  );
}
