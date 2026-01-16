import type { CuttingFieldKey } from "../../state/cuttingFields";

export type SpeedDriver = Extract<CuttingFieldKey, "Vc" | "n">;
export type FeedDriver = Extract<CuttingFieldKey, "F" | "fz">;
