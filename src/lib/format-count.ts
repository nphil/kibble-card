/** A whole number for display, with thousands separators in the person's own language. Never
 * "NaN" or "undefined": anything that is not a finite number reads as 0. */
export function formatCount(value: number | null | undefined, locale?: string): string {
  const whole = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat(locale).format(whole);
}

/** "1 photo", "12 photos": the noun agrees with the count. */
export function countOf(value: number | null | undefined, singular: string, plural: string, locale?: string): string {
  const whole = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
  return `${formatCount(whole, locale)} ${Math.abs(whole) === 1 ? singular : plural}`;
}
