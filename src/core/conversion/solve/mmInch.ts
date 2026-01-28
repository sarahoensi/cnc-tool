/**
 * mm ↔ inch conversion
 *
 * 1 inch = 25.4 mm
 */
export const mmInchConverter = {
  forward(mm: number): number {
    return mm / 25.4;
  },

  reverse(inch: number): number {
    return inch * 25.4;
  },
};
