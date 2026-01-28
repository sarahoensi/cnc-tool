export type ConversionInput = {
  left?: number;
  right?: number;
};

export type ConversionResult =
  | { target: "left"; value: number }
  | { target: "right"; value: number };
