/** Formats `kibble/cats`' `storage` into the cats card's one compact status line. Pure so the
 * byte-rounding and pluralization boundaries are directly testable.
 */

import type { Storage } from "../types";

/** Whole MB under 1000, one decimal place below 10 MB so "Using 0.4 MB" still reads as real
 * usage rather than rounding to nothing; GB above that, same one-decimal rule under 10 GB. */
export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1000) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  const gb = mb / 1024;
  return `${gb < 10 ? gb.toFixed(1) : Math.round(gb)} GB`;
}

/** "Using 184 MB, keeping 14 days." */
export function storageSummary(storage: Pick<Storage, "used_bytes" | "retention_days">): string {
  const days = storage.retention_days === 1 ? "1 day" : `${storage.retention_days} days`;
  return `Using ${formatBytes(storage.used_bytes)}, keeping ${days}`;
}

/** The feeder's own transient spool, when the daemon reports it -- direct evidence the
 * 80 MB-flash overflow this whole pipeline exists to fix is staying bounded. `null` when the
 * server has nothing to report (an older daemon, or a device that hasn't polled yet). */
export function spoolSummary(spool: Storage["device_spool"]): string | null {
  if (!spool) return null;
  return `Feeder buffer ${formatBytes(spool.used_bytes)} of ${formatBytes(spool.cap_bytes)}`;
}
