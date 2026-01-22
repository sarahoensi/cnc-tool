// src/ui/pages/cuttingData/domain/drivers/useSpeedDrivers.ts

import { useDriverOverride, useDriverGroups } from "@ui/pages/shared/domain/driver";


import type { CuttingFields } from "../model/cuttingFields";
import type { SpeedDriver, FeedDriver } from "./types";

export function useSpeedFeedDrivers(
  fields: CuttingFields,
  setFields: React.Dispatch<React.SetStateAction<CuttingFields>>,
) {
  const speedDriver = useDriverOverride<SpeedDriver>();
  const feedDriver = useDriverOverride<FeedDriver>();

  useDriverGroups({
    fields,
    setFields,
    groups: [
      {
        fields: ["Vc", "n"] as const,
        driver: speedDriver,
      },
      {
        fields: ["F", "fz"] as const,
        driver: feedDriver,
      },
    ],
  });

  return {
    speedDriver,
    feedDriver,
  };
}