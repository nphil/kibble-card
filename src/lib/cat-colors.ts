/** A deterministic fallback color for a cat name the roster hasn't resolved yet (the `kibble/
 * cats` query still loading, or a name with no known `color_index`) -- stable across renders so
 * a monogram doesn't flicker between colors while data streams in. Never a substitute for the
 * real `color_index` once it's known; callers prefer `catColorAt` whenever they have one.
 */

import { catColorAt } from "../styles/tokens";

export function fallbackCatColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return catColorAt(hash);
}
