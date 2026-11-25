/** The slice of `localStorage` the card's own small persisted settings need (the waiting answers,
 * a dismissed learning summary), so they can be tested with a plain object. */
export interface SimpleStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** `localStorage`, or `null` where the page may not use it (blocked, private mode, no DOM). */
export function browserStorage(): SimpleStorage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}
