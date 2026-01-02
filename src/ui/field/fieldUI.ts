// src/ui/field/fieldUI.ts

export type FieldUIState = {
  enabled: boolean;
  lockedReason?: string;
};
export const enabledField = (): FieldUIState => ({
  enabled: true,
});

export const lockedField = (reason?: string): FieldUIState => ({
  enabled: false,
  lockedReason: reason,
});
