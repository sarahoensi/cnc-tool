import type { SpiralFieldKey } from "../../model/spiralFields";

export type HelixDriver = Extract<SpiralFieldKey, "pitch" | "angle">;