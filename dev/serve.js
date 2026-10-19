/** Minimal static file server for the dev harness — no external dependency, just `Bun.serve`
 * over the `dev/` directory so the screenshot script has a real http:// origin to navigate to.
 * Plain JS deliberately: this is throwaway dev tooling, not shipped card code, so it sits
 * outside the browser-targeted tsconfig instead of dragging Bun's globals into that typecheck.
 */

import { extname, join, normalize } from "node:path";

const ROOT = import.meta.dir;
const PORT = Number(process.env.HARNESS_PORT ?? 4173);

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    let path = normalize(decodeURIComponent(url.pathname));
    if (path === "/" || path === "") path = "/index.html";
    const filePath = join(ROOT, path);
    if (!filePath.startsWith(ROOT)) {
      return new Response("Forbidden", { status: 403 });
    }
    const file = Bun.file(filePath);
    const type = CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }
    // Range passthrough (the `?card=timeline` review sheet's `<video>` scrubs a clip fixture
    // through this same server) -- `Bun.file` alone does not answer `Range` on its own.
    const rangeHeader = request.headers.get("Range");
    if (rangeHeader) {
      const total = file.size;
      const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      const start = match?.[1] ? Number(match[1]) : 0;
      const end = match?.[2] ? Number(match[2]) : total - 1;
      return new Response(file.slice(start, end + 1), {
        status: 206,
        headers: {
          "content-type": type,
          "accept-ranges": "bytes",
          "content-range": `bytes ${start}-${end}/${total}`,
          "content-length": String(end - start + 1),
        },
      });
    }
    return new Response(file, {
      headers: { "content-type": type, "accept-ranges": "bytes", "content-length": String(file.size) },
    });
  },
});

console.log(`Kibble card dev harness: http://localhost:${PORT}/`);
