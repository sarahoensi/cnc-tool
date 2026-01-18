import { useDriverOverride, useDriverGroups } from
  "@ui/pages/shared/domain/driver";

import type { SpiralFields } from "../../model/spiralFields";
import type { HelixDriver } from "./types";

export function useSpiralDrivers(
  fields: SpiralFields,
  setFields: React.Dispatch<React.SetStateAction<SpiralFields>>,
) {
  const helixDriver = useDriverOverride<HelixDriver>();

  useDriverGroups({
    fields,
    setFields,
    groups: [
      {
        fields: ["pitch", "angle"] as const,
        driver: helixDriver,
      },
    ],
  });

  return {
    helixDriver,
  };
}
