import { useDriverOverride, useDriverGroups } from "@ui/pages/shared/domain/driver";
import type { HoleFields } from "../../model/holeFields";

export function useHoleDrivers(
  fields: HoleFields,
  setFields: React.Dispatch<React.SetStateAction<HoleFields>>
) {
  const planDriver = useDriverOverride<"N" | "ae">();

  useDriverGroups({
    fields,
    setFields,
    groups: [
      {
        fields: ["N", "ae"],
        driver: planDriver,
      },
    ],
  });

  return { planDriver };
}
