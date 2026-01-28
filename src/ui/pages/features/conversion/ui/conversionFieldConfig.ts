export const conversionFieldConfig = [
  {
    key: "left",
    label: "Millimeter",
    unit: "mm",
    autoFocus: true,
  },
  {
    key: "right",
    label: "Inch",
    unit: "in",
  },
] as const;

export type CuttingFieldConfig = {
  key?: string;
  label: string;
  unit?: string;
  autoFocus?: boolean;
};
