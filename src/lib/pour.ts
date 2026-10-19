/** Which hopper(s) a kibble pour reads as coming from -- the bowl paints its falling pieces in
 * that hopper's food colour (or a mix of both), so this decides which is honest to claim. Kept
 * pure so the "card-initiated feed uses the hopper(s) the user chose; everything else uses the
 * honest default" rule is directly testable against plain values.
 */

/** What `kibble.feed`'s own `hopper` field can carry: one specific side, or both at once. */
export type HopperSide = "both" | "1" | "2";

/** `null` means this card did not initiate the feed currently in progress -- a scheduled feed,
 * one fired from the feeder's own physical button, or one started from another dashboard, none
 * of which ever carried a hopper source this card saw. */
export type PourSource = HopperSide | null;

/** Resolves the honest source for the pour animation: the card's own choice when it started the
 * feed in progress, otherwise hopper 1 alone in single mode (the only hopper there is) or both
 * mixed in dual mode -- nothing said which side actually fired, so neither is claimed alone. */
export function effectivePourSource(pourSource: PourSource, singleHopper: boolean): HopperSide {
  return pourSource ?? (singleHopper ? "1" : "both");
}
