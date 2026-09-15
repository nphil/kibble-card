/** Pure bowl-fill combination logic. The feeder has two independent augers reporting into one
 * shared bin (the physical divider is removed), so two slightly different percentages almost
 * always mean "one bowl read twice," not two real chambers — only a genuine split shows two
 * numbers. */

export interface BowlFillDisplay {
  split: boolean;
  hopper1: number | null;
  hopper2: number | null;
  /** Single representative percentage when not split; null when split (each side has its own). */
  combined: number | null;
}

/** Auger readings within this many percentage points are treated as the same fill level. */
export const EQUAL_FILL_THRESHOLD = 5;

export function combineBowlFill(hopper1: number | null, hopper2: number | null): BowlFillDisplay {
  if (hopper1 === null && hopper2 === null) {
    return { split: false, hopper1: null, hopper2: null, combined: null };
  }
  if (hopper1 === null || hopper2 === null) {
    return { split: false, hopper1, hopper2, combined: hopper1 ?? hopper2 };
  }
  if (Math.abs(hopper1 - hopper2) < EQUAL_FILL_THRESHOLD) {
    return { split: false, hopper1, hopper2, combined: Math.round((hopper1 + hopper2) / 2) };
  }
  return { split: true, hopper1, hopper2, combined: null };
}
