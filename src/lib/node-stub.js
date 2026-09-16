// Stub for the Node built-ins `@scrypted/client` imports but never reaches in a browser: its
// transport picks `domFetch` + engine.io's browser websocket once `process.arch` reads
// "browser" (set at build time), leaving these requires dead but still resolvable. Empty rather
// than a polyfill on purpose -- if some future code path did reach one, the resulting
// "undefined is not a function" is a far better signal than a silently wrong shim.
export default {};
