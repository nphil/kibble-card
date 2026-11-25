/** Rules for the event sheet that need no Home Assistant or DOM, so they can be tested alone: the
 * sheet's title and how its photos group under the cats of a visit. Naming itself happens per
 * photo (`photo-answers.ts`); a visit's cats are read-only here.
 */

import type { Sample, SessionCat, TimelineEvent } from "../types";

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}

/** Live sheet title from the session cats. */
export function sessionTitle(cats: readonly Pick<SessionCat, "cat" | "ate">[], event: Pick<TimelineEvent, "identity" | "open">): string {
  if (event.identity === "not_a_cat") return "Not a cat";
  if (cats.length === 0) return "Who was here?";
  const groups = new Map<string, string[]>();
  for (const cat of cats) {
    const verb = event.open ? (cat.ate ? "is eating" : "is here") : (cat.ate ? "ate" : "came by");
    const names = groups.get(verb) ?? [];
    names.push(cat.cat);
    groups.set(verb, names);
  }
  return [...groups].map(([verb, names]) => joinNames(names) + " " + verb).join(", ");
}

export interface SessionPhotoSection {
  cat: string;
  samples: Sample[];
}

/** Groups every photo into a session cat section. Photos with no selected cat, or with a stale
 * cat name, follow the main part: most explicitly-owned photos, with the first cat winning ties.
 */
export function groupSessionPhotos(samples: readonly Sample[], cats: readonly SessionCat[]): SessionPhotoSection[] {
  if (cats.length < 2) return [];
  const sections = cats.map((cat) => ({ cat: cat.cat, samples: [] as Sample[] }));
  const byName = new Map(sections.map((section) => [section.cat, section]));
  const unassigned: Sample[] = [];
  for (const sample of samples) {
    const section = sample.cat ? byName.get(sample.cat) : undefined;
    if (section) section.samples.push(sample);
    else unassigned.push(sample);
  }
  if (unassigned.length > 0) {
    const main = sections.reduce((best, section) => section.samples.length > best.samples.length ? section : best);
    main.samples.push(...unassigned);
  }
  return sections;
}
