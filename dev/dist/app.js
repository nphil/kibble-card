// dist/kibble-card.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var require_commons = __commonJS({
  "node_modules/engine.io-parser/build/cjs/commons.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
    var PACKET_TYPES = /* @__PURE__ */ Object.create(null);
    exports.PACKET_TYPES = PACKET_TYPES;
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    var PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
    exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
    Object.keys(PACKET_TYPES).forEach((key) => {
      PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    var ERROR_PACKET = { type: "error", data: "parser error" };
    exports.ERROR_PACKET = ERROR_PACKET;
  }
});
var require_encodePacket_browser = __commonJS({
  "node_modules/engine.io-parser/build/cjs/encodePacket.browser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodePacket = void 0;
    exports.encodePacketToBinary = encodePacketToBinary;
    var commons_js_1 = require_commons();
    var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
    var withNativeArrayBuffer = typeof ArrayBuffer === "function";
    var isView = (obj) => {
      return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
    };
    var encodePacket = ({ type, data }, supportsBinary, callback) => {
      if (withNativeBlob && data instanceof Blob) {
        if (supportsBinary) {
          return callback(data);
        } else {
          return encodeBlobAsBase64(data, callback);
        }
      } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
        if (supportsBinary) {
          return callback(data);
        } else {
          return encodeBlobAsBase64(new Blob([data]), callback);
        }
      }
      return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
    };
    exports.encodePacket = encodePacket;
    var encodeBlobAsBase64 = (data, callback) => {
      const fileReader = new FileReader();
      fileReader.onload = function() {
        const content = fileReader.result.split(",")[1];
        callback("b" + (content || ""));
      };
      return fileReader.readAsDataURL(data);
    };
    function toArray(data) {
      if (data instanceof Uint8Array) {
        return data;
      } else if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      } else {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      }
    }
    var TEXT_ENCODER;
    function encodePacketToBinary(packet, callback) {
      if (withNativeBlob && packet.data instanceof Blob) {
        return packet.data.arrayBuffer().then(toArray).then(callback);
      } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
        return callback(toArray(packet.data));
      }
      encodePacket(packet, false, (encoded) => {
        if (!TEXT_ENCODER) {
          TEXT_ENCODER = new TextEncoder();
        }
        callback(TEXT_ENCODER.encode(encoded));
      });
    }
  }
});
var require_base64_arraybuffer = __commonJS({
  "node_modules/engine.io-parser/build/cjs/contrib/base64-arraybuffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decode = exports.encode = void 0;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
    for (let i6 = 0; i6 < chars.length; i6++) {
      lookup[chars.charCodeAt(i6)] = i6;
    }
    var encode = (arraybuffer) => {
      let bytes = new Uint8Array(arraybuffer), i6, len = bytes.length, base64 = "";
      for (i6 = 0; i6 < len; i6 += 3) {
        base64 += chars[bytes[i6] >> 2];
        base64 += chars[(bytes[i6] & 3) << 4 | bytes[i6 + 1] >> 4];
        base64 += chars[(bytes[i6 + 1] & 15) << 2 | bytes[i6 + 2] >> 6];
        base64 += chars[bytes[i6 + 2] & 63];
      }
      if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }
      return base64;
    };
    exports.encode = encode;
    var decode = (base64) => {
      let bufferLength = base64.length * 0.75, len = base64.length, i6, p3 = 0, encoded1, encoded2, encoded3, encoded4;
      if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
          bufferLength--;
        }
      }
      const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
      for (i6 = 0; i6 < len; i6 += 4) {
        encoded1 = lookup[base64.charCodeAt(i6)];
        encoded2 = lookup[base64.charCodeAt(i6 + 1)];
        encoded3 = lookup[base64.charCodeAt(i6 + 2)];
        encoded4 = lookup[base64.charCodeAt(i6 + 3)];
        bytes[p3++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p3++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p3++] = (encoded3 & 3) << 6 | encoded4 & 63;
      }
      return arraybuffer;
    };
    exports.decode = decode;
  }
});
var require_decodePacket_browser = __commonJS({
  "node_modules/engine.io-parser/build/cjs/decodePacket.browser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodePacket = void 0;
    var commons_js_1 = require_commons();
    var base64_arraybuffer_js_1 = require_base64_arraybuffer();
    var withNativeArrayBuffer = typeof ArrayBuffer === "function";
    var decodePacket = (encodedPacket, binaryType) => {
      if (typeof encodedPacket !== "string") {
        return {
          type: "message",
          data: mapBinary(encodedPacket, binaryType)
        };
      }
      const type = encodedPacket.charAt(0);
      if (type === "b") {
        return {
          type: "message",
          data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
        };
      }
      const packetType = commons_js_1.PACKET_TYPES_REVERSE[type];
      if (!packetType) {
        return commons_js_1.ERROR_PACKET;
      }
      return encodedPacket.length > 1 ? {
        type: commons_js_1.PACKET_TYPES_REVERSE[type],
        data: encodedPacket.substring(1)
      } : {
        type: commons_js_1.PACKET_TYPES_REVERSE[type]
      };
    };
    exports.decodePacket = decodePacket;
    var decodeBase64Packet = (data, binaryType) => {
      if (withNativeArrayBuffer) {
        const decoded = (0, base64_arraybuffer_js_1.decode)(data);
        return mapBinary(decoded, binaryType);
      } else {
        return { base64: true, data };
      }
    };
    var mapBinary = (data, binaryType) => {
      switch (binaryType) {
        case "blob":
          if (data instanceof Blob) {
            return data;
          } else {
            return new Blob([data]);
          }
        case "arraybuffer":
        default:
          if (data instanceof ArrayBuffer) {
            return data;
          } else {
            return data.buffer;
          }
      }
    };
  }
});
var require_cjs = __commonJS({
  "node_modules/engine.io-parser/build/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
    exports.createPacketEncoderStream = createPacketEncoderStream;
    exports.createPacketDecoderStream = createPacketDecoderStream;
    var encodePacket_js_1 = require_encodePacket_browser();
    Object.defineProperty(exports, "encodePacket", { enumerable: true, get: function() {
      return encodePacket_js_1.encodePacket;
    } });
    var decodePacket_js_1 = require_decodePacket_browser();
    Object.defineProperty(exports, "decodePacket", { enumerable: true, get: function() {
      return decodePacket_js_1.decodePacket;
    } });
    var commons_js_1 = require_commons();
    var SEPARATOR = String.fromCharCode(30);
    var encodePayload = (packets, callback) => {
      const length = packets.length;
      const encodedPackets = new Array(length);
      let count = 0;
      packets.forEach((packet, i6) => {
        (0, encodePacket_js_1.encodePacket)(packet, false, (encodedPacket) => {
          encodedPackets[i6] = encodedPacket;
          if (++count === length) {
            callback(encodedPackets.join(SEPARATOR));
          }
        });
      });
    };
    exports.encodePayload = encodePayload;
    var decodePayload = (encodedPayload, binaryType) => {
      const encodedPackets = encodedPayload.split(SEPARATOR);
      const packets = [];
      for (let i6 = 0; i6 < encodedPackets.length; i6++) {
        const decodedPacket = (0, decodePacket_js_1.decodePacket)(encodedPackets[i6], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
          break;
        }
      }
      return packets;
    };
    exports.decodePayload = decodePayload;
    function createPacketEncoderStream() {
      return new TransformStream({
        transform(packet, controller) {
          (0, encodePacket_js_1.encodePacketToBinary)(packet, (encodedPacket) => {
            const payloadLength = encodedPacket.length;
            let header;
            if (payloadLength < 126) {
              header = new Uint8Array(1);
              new DataView(header.buffer).setUint8(0, payloadLength);
            } else if (payloadLength < 65536) {
              header = new Uint8Array(3);
              const view = new DataView(header.buffer);
              view.setUint8(0, 126);
              view.setUint16(1, payloadLength);
            } else {
              header = new Uint8Array(9);
              const view = new DataView(header.buffer);
              view.setUint8(0, 127);
              view.setBigUint64(1, BigInt(payloadLength));
            }
            if (packet.data && typeof packet.data !== "string") {
              header[0] |= 128;
            }
            controller.enqueue(header);
            controller.enqueue(encodedPacket);
          });
        }
      });
    }
    var TEXT_DECODER;
    function totalLength(chunks) {
      return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    }
    function concatChunks(chunks, size) {
      if (chunks[0].length === size) {
        return chunks.shift();
      }
      const buffer = new Uint8Array(size);
      let j2 = 0;
      for (let i6 = 0; i6 < size; i6++) {
        buffer[i6] = chunks[0][j2++];
        if (j2 === chunks[0].length) {
          chunks.shift();
          j2 = 0;
        }
      }
      if (chunks.length && j2 < chunks[0].length) {
        chunks[0] = chunks[0].slice(j2);
      }
      return buffer;
    }
    function createPacketDecoderStream(maxPayload, binaryType) {
      if (!TEXT_DECODER) {
        TEXT_DECODER = new TextDecoder();
      }
      const chunks = [];
      let state2 = 0;
      let expectedLength = -1;
      let isBinary = false;
      return new TransformStream({
        transform(chunk, controller) {
          chunks.push(chunk);
          while (true) {
            if (state2 === 0) {
              if (totalLength(chunks) < 1) {
                break;
              }
              const header = concatChunks(chunks, 1);
              isBinary = (header[0] & 128) === 128;
              expectedLength = header[0] & 127;
              if (expectedLength < 126) {
                state2 = 3;
              } else if (expectedLength === 126) {
                state2 = 1;
              } else {
                state2 = 2;
              }
            } else if (state2 === 1) {
              if (totalLength(chunks) < 2) {
                break;
              }
              const headerArray = concatChunks(chunks, 2);
              expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
              state2 = 3;
            } else if (state2 === 2) {
              if (totalLength(chunks) < 8) {
                break;
              }
              const headerArray = concatChunks(chunks, 8);
              const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
              const n6 = view.getUint32(0);
              if (n6 > Math.pow(2, 53 - 32) - 1) {
                controller.enqueue(commons_js_1.ERROR_PACKET);
                break;
              }
              expectedLength = n6 * Math.pow(2, 32) + view.getUint32(4);
              state2 = 3;
            } else {
              if (totalLength(chunks) < expectedLength) {
                break;
              }
              const data = concatChunks(chunks, expectedLength);
              controller.enqueue((0, decodePacket_js_1.decodePacket)(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
              state2 = 0;
            }
            if (expectedLength === 0 || expectedLength > maxPayload) {
              controller.enqueue(commons_js_1.ERROR_PACKET);
              break;
            }
          }
        }
      });
    }
    exports.protocol = 4;
  }
});
var require_cjs2 = __commonJS({
  "node_modules/@socket.io/component-emitter/lib/cjs/index.js"(exports) {
    exports.Emitter = Emitter;
    function Emitter(obj) {
      if (obj) return mixin(obj);
    }
    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }
    Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
      return this;
    };
    Emitter.prototype.once = function(event, fn) {
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }
      on.fn = fn;
      this.on(event, on);
      return this;
    };
    Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }
      var callbacks = this._callbacks["$" + event];
      if (!callbacks) return this;
      if (1 == arguments.length) {
        delete this._callbacks["$" + event];
        return this;
      }
      var cb;
      for (var i6 = 0; i6 < callbacks.length; i6++) {
        cb = callbacks[i6];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i6, 1);
          break;
        }
      }
      if (callbacks.length === 0) {
        delete this._callbacks["$" + event];
      }
      return this;
    };
    Emitter.prototype.emit = function(event) {
      this._callbacks = this._callbacks || {};
      var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
      for (var i6 = 1; i6 < arguments.length; i6++) {
        args[i6 - 1] = arguments[i6];
      }
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i6 = 0, len = callbacks.length; i6 < len; ++i6) {
          callbacks[i6].apply(this, args);
        }
      }
      return this;
    };
    Emitter.prototype.emitReserved = Emitter.prototype.emit;
    Emitter.prototype.listeners = function(event) {
      this._callbacks = this._callbacks || {};
      return this._callbacks["$" + event] || [];
    };
    Emitter.prototype.hasListeners = function(event) {
      return !!this.listeners(event).length;
    };
  }
});
var require_globals = __commonJS({
  "node_modules/engine.io-client/build/cjs/globals.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultBinaryType = exports.globalThisShim = exports.nextTick = void 0;
    exports.createCookieJar = createCookieJar;
    exports.nextTick = (() => {
      const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
      if (isPromiseAvailable) {
        return (cb) => Promise.resolve().then(cb);
      } else {
        return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
      }
    })();
    exports.globalThisShim = (() => {
      if (typeof self !== "undefined") {
        return self;
      } else if (typeof window !== "undefined") {
        return window;
      } else {
        return Function("return this")();
      }
    })();
    exports.defaultBinaryType = "arraybuffer";
    function createCookieJar() {
    }
  }
});
var require_util = __commonJS({
  "node_modules/engine.io-client/build/cjs/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pick = pick;
    exports.installTimerFunctions = installTimerFunctions;
    exports.byteLength = byteLength;
    exports.randomString = randomString;
    var globals_node_js_1 = require_globals();
    function pick(obj, ...attr) {
      return attr.reduce((acc, k2) => {
        if (obj.hasOwnProperty(k2)) {
          acc[k2] = obj[k2];
        }
        return acc;
      }, {});
    }
    var NATIVE_SET_TIMEOUT = globals_node_js_1.globalThisShim.setTimeout;
    var NATIVE_CLEAR_TIMEOUT = globals_node_js_1.globalThisShim.clearTimeout;
    function installTimerFunctions(obj, opts) {
      if (opts.useNativeTimers) {
        obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globals_node_js_1.globalThisShim);
        obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globals_node_js_1.globalThisShim);
      } else {
        obj.setTimeoutFn = globals_node_js_1.globalThisShim.setTimeout.bind(globals_node_js_1.globalThisShim);
        obj.clearTimeoutFn = globals_node_js_1.globalThisShim.clearTimeout.bind(globals_node_js_1.globalThisShim);
      }
    }
    var BASE64_OVERHEAD = 1.33;
    function byteLength(obj) {
      if (typeof obj === "string") {
        return utf8Length(obj);
      }
      return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
      let c5 = 0, length = 0;
      for (let i6 = 0, l3 = str.length; i6 < l3; i6++) {
        c5 = str.charCodeAt(i6);
        if (c5 < 128) {
          length += 1;
        } else if (c5 < 2048) {
          length += 2;
        } else if (c5 < 55296 || c5 >= 57344) {
          length += 3;
        } else {
          i6++;
          length += 4;
        }
      }
      return length;
    }
    function randomString() {
      return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
    }
  }
});
var require_parseqs = __commonJS({
  "node_modules/engine.io-client/build/cjs/contrib/parseqs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encode = encode;
    exports.decode = decode;
    function encode(obj) {
      let str = "";
      for (let i6 in obj) {
        if (obj.hasOwnProperty(i6)) {
          if (str.length)
            str += "&";
          str += encodeURIComponent(i6) + "=" + encodeURIComponent(obj[i6]);
        }
      }
      return str;
    }
    function decode(qs) {
      let qry = {};
      let pairs = qs.split("&");
      for (let i6 = 0, l3 = pairs.length; i6 < l3; i6++) {
        let pair = pairs[i6].split("=");
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return qry;
    }
  }
});
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s5 = 1e3;
    var m2 = s5 * 60;
    var h5 = m2 * 60;
    var d3 = h5 * 24;
    var w2 = d3 * 7;
    var y3 = d3 * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n6 = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n6 * y3;
        case "weeks":
        case "week":
        case "w":
          return n6 * w2;
        case "days":
        case "day":
        case "d":
          return n6 * d3;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n6 * h5;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n6 * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n6 * s5;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n6;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d3) {
        return Math.round(ms / d3) + "d";
      }
      if (msAbs >= h5) {
        return Math.round(ms / h5) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms / m2) + "m";
      }
      if (msAbs >= s5) {
        return Math.round(ms / s5) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d3) {
        return plural(ms, msAbs, d3, "day");
      }
      if (msAbs >= h5) {
        return plural(ms, msAbs, h5, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms, msAbs, m2, "minute");
      }
      if (msAbs >= s5) {
        return plural(ms, msAbs, s5, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n6, name) {
      var isPlural = msAbs >= n6 * 1.5;
      return Math.round(ms / n6) + " " + name + (isPlural ? "s" : "");
    }
  }
});
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i6 = 0; i6 < namespace.length; i6++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i6);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v2) => {
            enableOverride = v2;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m2;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m2 = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m2[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c5 = "color: " + this.color;
      args.splice(1, 0, c5, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c5);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r6;
      try {
        r6 = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r6 && typeof process !== "undefined" && "env" in process) {
        r6 = process.env.DEBUG;
      }
      return r6;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v2) {
      try {
        return JSON.stringify(v2);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});
var require_transport = __commonJS({
  "node_modules/engine.io-client/build/cjs/transport.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transport = exports.TransportError = void 0;
    var engine_io_parser_1 = require_cjs();
    var component_emitter_1 = require_cjs2();
    var util_js_1 = require_util();
    var parseqs_js_1 = require_parseqs();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:transport");
    var TransportError = class extends Error {
      constructor(reason, description, context) {
        super(reason);
        this.description = description;
        this.context = context;
        this.type = "TransportError";
      }
    };
    exports.TransportError = TransportError;
    var Transport = class extends component_emitter_1.Emitter {
      /**
       * Transport abstract constructor.
       *
       * @param {Object} opts - options
       * @protected
       */
      constructor(opts) {
        super();
        this.writable = false;
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.opts = opts;
        this.query = opts.query;
        this.socket = opts.socket;
        this.supportsBinary = !opts.forceBase64;
      }
      /**
       * Emits an error.
       *
       * @param {String} reason
       * @param description
       * @param context - the error context
       * @return {Transport} for chaining
       * @protected
       */
      onError(reason, description, context) {
        super.emitReserved("error", new TransportError(reason, description, context));
        return this;
      }
      /**
       * Opens the transport.
       */
      open() {
        this.readyState = "opening";
        this.doOpen();
        return this;
      }
      /**
       * Closes the transport.
       */
      close() {
        if (this.readyState === "opening" || this.readyState === "open") {
          this.doClose();
          this.onClose();
        }
        return this;
      }
      /**
       * Sends multiple packets.
       *
       * @param {Array} packets
       */
      send(packets) {
        if (this.readyState === "open") {
          this.write(packets);
        } else {
          debug("transport is not open, discarding packets");
        }
      }
      /**
       * Called upon open
       *
       * @protected
       */
      onOpen() {
        this.readyState = "open";
        this.writable = true;
        super.emitReserved("open");
      }
      /**
       * Called with data.
       *
       * @param {String} data
       * @protected
       */
      onData(data) {
        const packet = (0, engine_io_parser_1.decodePacket)(data, this.socket.binaryType);
        this.onPacket(packet);
      }
      /**
       * Called with a decoded packet.
       *
       * @protected
       */
      onPacket(packet) {
        super.emitReserved("packet", packet);
      }
      /**
       * Called upon close.
       *
       * @protected
       */
      onClose(details) {
        this.readyState = "closed";
        super.emitReserved("close", details);
      }
      /**
       * Pauses the transport, in order not to lose packets during an upgrade.
       *
       * @param onPause
       */
      pause(onPause) {
      }
      createUri(schema, query = {}) {
        return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
      }
      _hostname() {
        const hostname = this.opts.hostname;
        return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
      }
      _port() {
        if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) {
          return ":" + this.opts.port;
        } else {
          return "";
        }
      }
      _query(query) {
        const encodedQuery = (0, parseqs_js_1.encode)(query);
        return encodedQuery.length ? "?" + encodedQuery : "";
      }
    };
    exports.Transport = Transport;
  }
});
var require_polling = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/polling.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Polling = void 0;
    var transport_js_1 = require_transport();
    var util_js_1 = require_util();
    var engine_io_parser_1 = require_cjs();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:polling");
    var Polling = class extends transport_js_1.Transport {
      constructor() {
        super(...arguments);
        this._polling = false;
      }
      get name() {
        return "polling";
      }
      /**
       * Opens the socket (triggers polling). We write a PING message to determine
       * when the transport is open.
       *
       * @protected
       */
      doOpen() {
        this._poll();
      }
      /**
       * Pauses polling.
       *
       * @param {Function} onPause - callback upon buffers are flushed and transport is paused
       * @package
       */
      pause(onPause) {
        this.readyState = "pausing";
        const pause = () => {
          debug("paused");
          this.readyState = "paused";
          onPause();
        };
        if (this._polling || !this.writable) {
          let total = 0;
          if (this._polling) {
            debug("we are currently polling - waiting to pause");
            total++;
            this.once("pollComplete", function() {
              debug("pre-pause polling complete");
              --total || pause();
            });
          }
          if (!this.writable) {
            debug("we are currently writing - waiting to pause");
            total++;
            this.once("drain", function() {
              debug("pre-pause writing complete");
              --total || pause();
            });
          }
        } else {
          pause();
        }
      }
      /**
       * Starts polling cycle.
       *
       * @private
       */
      _poll() {
        debug("polling");
        this._polling = true;
        this.doPoll();
        this.emitReserved("poll");
      }
      /**
       * Overloads onData to detect payloads.
       *
       * @protected
       */
      onData(data) {
        debug("polling got data %s", data);
        const callback = (packet) => {
          if ("opening" === this.readyState && packet.type === "open") {
            this.onOpen();
          }
          if ("close" === packet.type) {
            this.onClose({ description: "transport closed by the server" });
            return false;
          }
          this.onPacket(packet);
        };
        (0, engine_io_parser_1.decodePayload)(data, this.socket.binaryType).forEach(callback);
        if ("closed" !== this.readyState) {
          this._polling = false;
          this.emitReserved("pollComplete");
          if ("open" === this.readyState) {
            this._poll();
          } else {
            debug('ignoring poll - transport state "%s"', this.readyState);
          }
        }
      }
      /**
       * For polling, send a close packet.
       *
       * @protected
       */
      doClose() {
        const close = () => {
          debug("writing close packet");
          this.write([{ type: "close" }]);
        };
        if ("open" === this.readyState) {
          debug("transport open - closing");
          close();
        } else {
          debug("transport not open - deferring close");
          this.once("open", close);
        }
      }
      /**
       * Writes a packets payload.
       *
       * @param {Array} packets - data packets
       * @protected
       */
      write(packets) {
        this.writable = false;
        (0, engine_io_parser_1.encodePayload)(packets, (data) => {
          this.doWrite(data, () => {
            this.writable = true;
            this.emitReserved("drain");
          });
        });
      }
      /**
       * Generates uri for connection.
       *
       * @private
       */
      uri() {
        const schema = this.opts.secure ? "https" : "http";
        const query = this.query || {};
        if (false !== this.opts.timestampRequests) {
          query[this.opts.timestampParam] = (0, util_js_1.randomString)();
        }
        if (!this.supportsBinary && !query.sid) {
          query.b64 = 1;
        }
        return this.createUri(schema, query);
      }
    };
    exports.Polling = Polling;
  }
});
var require_has_cors = __commonJS({
  "node_modules/engine.io-client/build/cjs/contrib/has-cors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasCORS = void 0;
    var value = false;
    try {
      value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
    } catch (err) {
    }
    exports.hasCORS = value;
  }
});
var require_polling_xhr = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/polling-xhr.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XHR = exports.Request = exports.BaseXHR = void 0;
    var polling_js_1 = require_polling();
    var component_emitter_1 = require_cjs2();
    var util_js_1 = require_util();
    var globals_node_js_1 = require_globals();
    var has_cors_js_1 = require_has_cors();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:polling");
    function empty() {
    }
    var BaseXHR = class extends polling_js_1.Polling {
      /**
       * XHR Polling constructor.
       *
       * @param {Object} opts
       * @package
       */
      constructor(opts) {
        super(opts);
        if (typeof location !== "undefined") {
          const isSSL = "https:" === location.protocol;
          let port = location.port;
          if (!port) {
            port = isSSL ? "443" : "80";
          }
          this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
        }
      }
      /**
       * Sends data.
       *
       * @param {String} data - data to send.
       * @param {Function} fn - called upon flush.
       * @private
       */
      doWrite(data, fn) {
        const req = this.request({
          method: "POST",
          data
        });
        req.on("success", fn);
        req.on("error", (xhrStatus, context) => {
          this.onError("xhr post error", xhrStatus, context);
        });
      }
      /**
       * Starts a poll cycle.
       *
       * @private
       */
      doPoll() {
        debug("xhr poll");
        const req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", (xhrStatus, context) => {
          this.onError("xhr poll error", xhrStatus, context);
        });
        this.pollXhr = req;
      }
    };
    exports.BaseXHR = BaseXHR;
    var Request = class _Request extends component_emitter_1.Emitter {
      /**
       * Request constructor
       *
       * @param {Object} options
       * @package
       */
      constructor(createRequest, uri, opts) {
        super();
        this.createRequest = createRequest;
        (0, util_js_1.installTimerFunctions)(this, opts);
        this._opts = opts;
        this._method = opts.method || "GET";
        this._uri = uri;
        this._data = void 0 !== opts.data ? opts.data : null;
        this._create();
      }
      /**
       * Creates the XHR object and sends the request.
       *
       * @private
       */
      _create() {
        var _a;
        const opts = (0, util_js_1.pick)(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this._opts.xd;
        const xhr = this._xhr = this.createRequest(opts);
        try {
          debug("xhr open %s: %s", this._method, this._uri);
          xhr.open(this._method, this._uri, true);
          try {
            if (this._opts.extraHeaders) {
              xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
              for (let i6 in this._opts.extraHeaders) {
                if (this._opts.extraHeaders.hasOwnProperty(i6)) {
                  xhr.setRequestHeader(i6, this._opts.extraHeaders[i6]);
                }
              }
            }
          } catch (e6) {
          }
          if ("POST" === this._method) {
            try {
              xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            } catch (e6) {
            }
          }
          try {
            xhr.setRequestHeader("Accept", "*/*");
          } catch (e6) {
          }
          (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
          if ("withCredentials" in xhr) {
            xhr.withCredentials = this._opts.withCredentials;
          }
          if (this._opts.requestTimeout) {
            xhr.timeout = this._opts.requestTimeout;
          }
          xhr.onreadystatechange = () => {
            var _a2;
            if (xhr.readyState === 3) {
              (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
                // @ts-ignore
                xhr.getResponseHeader("set-cookie")
              );
            }
            if (4 !== xhr.readyState)
              return;
            if (200 === xhr.status || 1223 === xhr.status) {
              this._onLoad();
            } else {
              this.setTimeoutFn(() => {
                this._onError(typeof xhr.status === "number" ? xhr.status : 0);
              }, 0);
            }
          };
          debug("xhr data %s", this._data);
          xhr.send(this._data);
        } catch (e6) {
          this.setTimeoutFn(() => {
            this._onError(e6);
          }, 0);
          return;
        }
        if (typeof document !== "undefined") {
          this._index = _Request.requestsCount++;
          _Request.requests[this._index] = this;
        }
      }
      /**
       * Called upon error.
       *
       * @private
       */
      _onError(err) {
        this.emitReserved("error", err, this._xhr);
        this._cleanup(true);
      }
      /**
       * Cleans up house.
       *
       * @private
       */
      _cleanup(fromError) {
        if ("undefined" === typeof this._xhr || null === this._xhr) {
          return;
        }
        this._xhr.onreadystatechange = empty;
        if (fromError) {
          try {
            this._xhr.abort();
          } catch (e6) {
          }
        }
        if (typeof document !== "undefined") {
          delete _Request.requests[this._index];
        }
        this._xhr = null;
      }
      /**
       * Called upon load.
       *
       * @private
       */
      _onLoad() {
        const data = this._xhr.responseText;
        if (data !== null) {
          this.emitReserved("data", data);
          this.emitReserved("success");
          this._cleanup();
        }
      }
      /**
       * Aborts the request.
       *
       * @package
       */
      abort() {
        this._cleanup();
      }
    };
    exports.Request = Request;
    Request.requestsCount = 0;
    Request.requests = {};
    if (typeof document !== "undefined") {
      if (typeof attachEvent === "function") {
        attachEvent("onunload", unloadHandler);
      } else if (typeof addEventListener === "function") {
        const terminationEvent = "onpagehide" in globals_node_js_1.globalThisShim ? "pagehide" : "unload";
        addEventListener(terminationEvent, unloadHandler, false);
      }
    }
    function unloadHandler() {
      for (let i6 in Request.requests) {
        if (Request.requests.hasOwnProperty(i6)) {
          Request.requests[i6].abort();
        }
      }
    }
    var hasXHR2 = function() {
      const xhr = newRequest({
        xdomain: false
      });
      return xhr && xhr.responseType !== null;
    }();
    var XHR = class extends BaseXHR {
      constructor(opts) {
        super(opts);
        const forceBase64 = opts && opts.forceBase64;
        this.supportsBinary = hasXHR2 && !forceBase64;
      }
      request(opts = {}) {
        Object.assign(opts, { xd: this.xd }, this.opts);
        return new Request(newRequest, this.uri(), opts);
      }
    };
    exports.XHR = XHR;
    function newRequest(opts) {
      const xdomain = opts.xdomain;
      try {
        if ("undefined" !== typeof XMLHttpRequest && (!xdomain || has_cors_js_1.hasCORS)) {
          return new XMLHttpRequest();
        }
      } catch (e6) {
      }
      if (!xdomain) {
        try {
          return new globals_node_js_1.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
        } catch (e6) {
        }
      }
    }
  }
});
var require_websocket = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/websocket.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WS = exports.BaseWS = void 0;
    var transport_js_1 = require_transport();
    var util_js_1 = require_util();
    var engine_io_parser_1 = require_cjs();
    var globals_node_js_1 = require_globals();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:websocket");
    var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
    var BaseWS = class extends transport_js_1.Transport {
      get name() {
        return "websocket";
      }
      doOpen() {
        const uri = this.uri();
        const protocols = this.opts.protocols;
        const opts = isReactNative ? {} : (0, util_js_1.pick)(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
          opts.headers = this.opts.extraHeaders;
        }
        try {
          this.ws = this.createSocket(uri, protocols, opts);
        } catch (err) {
          return this.emitReserved("error", err);
        }
        this.ws.binaryType = this.socket.binaryType;
        this.addEventListeners();
      }
      /**
       * Adds event listeners to the socket
       *
       * @private
       */
      addEventListeners() {
        this.ws.onopen = () => {
          if (this.opts.autoUnref) {
            this.ws._socket.unref();
          }
          this.onOpen();
        };
        this.ws.onclose = (closeEvent) => this.onClose({
          description: "websocket connection closed",
          context: closeEvent
        });
        this.ws.onmessage = (ev) => this.onData(ev.data);
        this.ws.onerror = (e6) => this.onError("websocket error", e6);
      }
      write(packets) {
        this.writable = false;
        for (let i6 = 0; i6 < packets.length; i6++) {
          const packet = packets[i6];
          const lastPacket = i6 === packets.length - 1;
          (0, engine_io_parser_1.encodePacket)(packet, this.supportsBinary, (data) => {
            try {
              this.doWrite(packet, data);
            } catch (e6) {
              debug("websocket closed before onclose event");
            }
            if (lastPacket) {
              (0, globals_node_js_1.nextTick)(() => {
                this.writable = true;
                this.emitReserved("drain");
              }, this.setTimeoutFn);
            }
          });
        }
      }
      doClose() {
        if (typeof this.ws !== "undefined") {
          this.ws.onerror = () => {
          };
          this.ws.close();
          this.ws = null;
        }
      }
      /**
       * Generates uri for connection.
       *
       * @private
       */
      uri() {
        const schema = this.opts.secure ? "wss" : "ws";
        const query = this.query || {};
        if (this.opts.timestampRequests) {
          query[this.opts.timestampParam] = (0, util_js_1.randomString)();
        }
        if (!this.supportsBinary) {
          query.b64 = 1;
        }
        return this.createUri(schema, query);
      }
    };
    exports.BaseWS = BaseWS;
    var WebSocketCtor = globals_node_js_1.globalThisShim.WebSocket || globals_node_js_1.globalThisShim.MozWebSocket;
    var WS = class extends BaseWS {
      createSocket(uri, protocols, opts) {
        return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
      }
      doWrite(_packet, data) {
        this.ws.send(data);
      }
    };
    exports.WS = WS;
  }
});
var require_webtransport = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/webtransport.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WT = void 0;
    var transport_js_1 = require_transport();
    var globals_node_js_1 = require_globals();
    var engine_io_parser_1 = require_cjs();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:webtransport");
    var WT = class extends transport_js_1.Transport {
      get name() {
        return "webtransport";
      }
      doOpen() {
        try {
          this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
        } catch (err) {
          return this.emitReserved("error", err);
        }
        this._transport.closed.then(() => {
          debug("transport closed gracefully");
          this.onClose();
        }).catch((err) => {
          debug("transport closed due to %s", err);
          this.onError("webtransport error", err);
        });
        this._transport.ready.then(() => {
          this._transport.createBidirectionalStream().then((stream) => {
            const decoderStream = (0, engine_io_parser_1.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
            const reader = stream.readable.pipeThrough(decoderStream).getReader();
            const encoderStream = (0, engine_io_parser_1.createPacketEncoderStream)();
            encoderStream.readable.pipeTo(stream.writable);
            this._writer = encoderStream.writable.getWriter();
            const read = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  debug("session is closed");
                  return;
                }
                debug("received chunk: %o", value);
                this.onPacket(value);
                read();
              }).catch((err) => {
                debug("an error occurred while reading: %s", err);
              });
            };
            read();
            const packet = { type: "open" };
            if (this.query.sid) {
              packet.data = `{"sid":"${this.query.sid}"}`;
            }
            this._writer.write(packet).then(() => this.onOpen());
          });
        });
      }
      write(packets) {
        this.writable = false;
        for (let i6 = 0; i6 < packets.length; i6++) {
          const packet = packets[i6];
          const lastPacket = i6 === packets.length - 1;
          this._writer.write(packet).then(() => {
            if (lastPacket) {
              (0, globals_node_js_1.nextTick)(() => {
                this.writable = true;
                this.emitReserved("drain");
              }, this.setTimeoutFn);
            }
          });
        }
      }
      doClose() {
        var _a;
        (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
      }
    };
    exports.WT = WT;
  }
});
var require_transports = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transports = void 0;
    var polling_xhr_node_js_1 = require_polling_xhr();
    var websocket_node_js_1 = require_websocket();
    var webtransport_js_1 = require_webtransport();
    exports.transports = {
      websocket: websocket_node_js_1.WS,
      webtransport: webtransport_js_1.WT,
      polling: polling_xhr_node_js_1.XHR
    };
  }
});
var require_parseuri = __commonJS({
  "node_modules/engine.io-client/build/cjs/contrib/parseuri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    var parts = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor"
    ];
    function parse(str) {
      if (str.length > 8e3) {
        throw "URI too long";
      }
      const src = str, b3 = str.indexOf("["), e6 = str.indexOf("]");
      if (b3 != -1 && e6 != -1) {
        str = str.substring(0, b3) + str.substring(b3, e6).replace(/:/g, ";") + str.substring(e6, str.length);
      }
      let m2 = re.exec(str || ""), uri = {}, i6 = 14;
      while (i6--) {
        uri[parts[i6]] = m2[i6] || "";
      }
      if (b3 != -1 && e6 != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
        uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
        uri.ipv6uri = true;
      }
      uri.pathNames = pathNames(uri, uri["path"]);
      uri.queryKey = queryKey(uri, uri["query"]);
      return uri;
    }
    function pathNames(obj, path) {
      const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
      if (path.slice(0, 1) == "/" || path.length === 0) {
        names.splice(0, 1);
      }
      if (path.slice(-1) == "/") {
        names.splice(names.length - 1, 1);
      }
      return names;
    }
    function queryKey(uri, query) {
      const data = {};
      query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
        if ($1) {
          data[$1] = $2;
        }
      });
      return data;
    }
  }
});
var require_socket = __commonJS({
  "node_modules/engine.io-client/build/cjs/socket.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Socket = exports.SocketWithUpgrade = exports.SocketWithoutUpgrade = void 0;
    var index_js_1 = require_transports();
    var util_js_1 = require_util();
    var parseqs_js_1 = require_parseqs();
    var parseuri_js_1 = require_parseuri();
    var component_emitter_1 = require_cjs2();
    var engine_io_parser_1 = require_cjs();
    var globals_node_js_1 = require_globals();
    var debug_1 = __importDefault(require_browser());
    var debug = (0, debug_1.default)("engine.io-client:socket");
    var withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
    var OFFLINE_EVENT_LISTENERS = [];
    if (withEventListeners) {
      addEventListener("offline", () => {
        debug("closing %d connection(s) because the network was lost", OFFLINE_EVENT_LISTENERS.length);
        OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
      }, false);
    }
    var SocketWithoutUpgrade = class _SocketWithoutUpgrade extends component_emitter_1.Emitter {
      /**
       * Socket constructor.
       *
       * @param {String|Object} uri - uri or options
       * @param {Object} opts - options
       */
      constructor(uri, opts) {
        super();
        this.binaryType = globals_node_js_1.defaultBinaryType;
        this.writeBuffer = [];
        this._prevBufferLen = 0;
        this._pingInterval = -1;
        this._pingTimeout = -1;
        this._maxPayload = -1;
        this._pingTimeoutTime = Infinity;
        if (uri && "object" === typeof uri) {
          opts = uri;
          uri = null;
        }
        if (uri) {
          const parsedUri = (0, parseuri_js_1.parse)(uri);
          opts.hostname = parsedUri.host;
          opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
          opts.port = parsedUri.port;
          if (parsedUri.query)
            opts.query = parsedUri.query;
        } else if (opts.host) {
          opts.hostname = (0, parseuri_js_1.parse)(opts.host).host;
        }
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
        if (opts.hostname && !opts.port) {
          opts.port = this.secure ? "443" : "80";
        }
        this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
        this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
        this.transports = [];
        this._transportsByName = {};
        opts.transports.forEach((t5) => {
          const transportName = t5.prototype.name;
          this.transports.push(transportName);
          this._transportsByName[transportName] = t5;
        });
        this.opts = Object.assign({
          path: "/engine.io",
          agent: false,
          withCredentials: false,
          upgrade: true,
          timestampParam: "t",
          rememberUpgrade: false,
          addTrailingSlash: true,
          rejectUnauthorized: true,
          perMessageDeflate: {
            threshold: 1024
          },
          transportOptions: {},
          closeOnBeforeunload: false
        }, opts);
        this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
        if (typeof this.opts.query === "string") {
          this.opts.query = (0, parseqs_js_1.decode)(this.opts.query);
        }
        if (withEventListeners) {
          if (this.opts.closeOnBeforeunload) {
            this._beforeunloadEventListener = () => {
              if (this.transport) {
                this.transport.removeAllListeners();
                this.transport.close();
              }
            };
            addEventListener("beforeunload", this._beforeunloadEventListener, false);
          }
          if (this.hostname !== "localhost") {
            debug("adding listener for the 'offline' event");
            this._offlineEventListener = () => {
              this._onClose("transport close", {
                description: "network connection lost"
              });
            };
            OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
          }
        }
        if (this.opts.withCredentials) {
          this._cookieJar = (0, globals_node_js_1.createCookieJar)();
        }
        this._open();
      }
      /**
       * Creates transport of the given type.
       *
       * @param {String} name - transport name
       * @return {Transport}
       * @private
       */
      createTransport(name) {
        debug('creating transport "%s"', name);
        const query = Object.assign({}, this.opts.query);
        query.EIO = engine_io_parser_1.protocol;
        query.transport = name;
        if (this.id)
          query.sid = this.id;
        const opts = Object.assign({}, this.opts, {
          query,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port
        }, this.opts.transportOptions[name]);
        debug("options: %j", opts);
        return new this._transportsByName[name](opts);
      }
      /**
       * Initializes transport to use and starts probe.
       *
       * @private
       */
      _open() {
        if (this.transports.length === 0) {
          this.setTimeoutFn(() => {
            this.emitReserved("error", "No transports available");
          }, 0);
          return;
        }
        const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
        this.readyState = "opening";
        const transport = this.createTransport(transportName);
        transport.open();
        this.setTransport(transport);
      }
      /**
       * Sets the current transport. Disables the existing one (if any).
       *
       * @private
       */
      setTransport(transport) {
        debug("setting transport %s", transport.name);
        if (this.transport) {
          debug("clearing existing transport %s", this.transport.name);
          this.transport.removeAllListeners();
        }
        this.transport = transport;
        transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
      }
      /**
       * Called when connection is deemed open.
       *
       * @private
       */
      onOpen() {
        debug("socket open");
        this.readyState = "open";
        _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush();
      }
      /**
       * Handles a packet.
       *
       * @private
       */
      _onPacket(packet) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
          this.emitReserved("packet", packet);
          this.emitReserved("heartbeat");
          switch (packet.type) {
            case "open":
              this.onHandshake(JSON.parse(packet.data));
              break;
            case "ping":
              this._sendPacket("pong");
              this.emitReserved("ping");
              this.emitReserved("pong");
              this._resetPingTimeout();
              break;
            case "error":
              const err = new Error("server error");
              err.code = packet.data;
              this._onError(err);
              break;
            case "message":
              this.emitReserved("data", packet.data);
              this.emitReserved("message", packet.data);
              break;
          }
        } else {
          debug('packet received with socket readyState "%s"', this.readyState);
        }
      }
      /**
       * Called upon handshake completion.
       *
       * @param {Object} data - handshake obj
       * @private
       */
      onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this._pingInterval = data.pingInterval;
        this._pingTimeout = data.pingTimeout;
        this._maxPayload = data.maxPayload;
        this.onOpen();
        if ("closed" === this.readyState)
          return;
        this._resetPingTimeout();
      }
      /**
       * Sets and resets ping timeout timer based on server pings.
       *
       * @private
       */
      _resetPingTimeout() {
        this.clearTimeoutFn(this._pingTimeoutTimer);
        const delay = this._pingInterval + this._pingTimeout;
        this._pingTimeoutTime = Date.now() + delay;
        this._pingTimeoutTimer = this.setTimeoutFn(() => {
          this._onClose("ping timeout");
        }, delay);
        if (this.opts.autoUnref) {
          this._pingTimeoutTimer.unref();
        }
      }
      /**
       * Called on `drain` event
       *
       * @private
       */
      _onDrain() {
        this.writeBuffer.splice(0, this._prevBufferLen);
        this._prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
          this.emitReserved("drain");
        } else {
          this.flush();
        }
      }
      /**
       * Flush write buffers.
       *
       * @private
       */
      flush() {
        if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
          const packets = this._getWritablePackets();
          debug("flushing %d packets in socket", packets.length);
          this.transport.send(packets);
          this._prevBufferLen = packets.length;
          this.emitReserved("flush");
        }
      }
      /**
       * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
       * long-polling)
       *
       * @private
       */
      _getWritablePackets() {
        const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
        if (!shouldCheckPayloadSize) {
          return this.writeBuffer;
        }
        let payloadSize = 1;
        for (let i6 = 0; i6 < this.writeBuffer.length; i6++) {
          const data = this.writeBuffer[i6].data;
          if (data) {
            payloadSize += (0, util_js_1.byteLength)(data);
          }
          if (i6 > 0 && payloadSize > this._maxPayload) {
            debug("only send %d out of %d packets", i6, this.writeBuffer.length);
            return this.writeBuffer.slice(0, i6);
          }
          payloadSize += 2;
        }
        debug("payload size is %d (max: %d)", payloadSize, this._maxPayload);
        return this.writeBuffer;
      }
      /**
       * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
       *
       * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
       * `write()` method then the message would not be buffered by the Socket.IO client.
       *
       * @return {boolean}
       * @private
       */
      /* private */
      _hasPingExpired() {
        if (!this._pingTimeoutTime)
          return true;
        const hasExpired = Date.now() > this._pingTimeoutTime;
        if (hasExpired) {
          debug("throttled timer detected, scheduling connection close");
          this._pingTimeoutTime = 0;
          (0, globals_node_js_1.nextTick)(() => {
            this._onClose("ping timeout");
          }, this.setTimeoutFn);
        }
        return hasExpired;
      }
      /**
       * Sends a message.
       *
       * @param {String} msg - message.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @return {Socket} for chaining.
       */
      write(msg, options, fn) {
        this._sendPacket("message", msg, options, fn);
        return this;
      }
      /**
       * Sends a message. Alias of {@link Socket#write}.
       *
       * @param {String} msg - message.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @return {Socket} for chaining.
       */
      send(msg, options, fn) {
        this._sendPacket("message", msg, options, fn);
        return this;
      }
      /**
       * Sends a packet.
       *
       * @param {String} type - packet type.
       * @param {String} data.
       * @param {Object} options.
       * @param {Function} fn - callback function.
       * @private
       */
      _sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
          fn = data;
          data = void 0;
        }
        if ("function" === typeof options) {
          fn = options;
          options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
          return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        const packet = {
          type,
          data,
          options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn)
          this.once("flush", fn);
        this.flush();
      }
      /**
       * Closes the connection.
       */
      close() {
        const close = () => {
          this._onClose("forced close");
          debug("socket closing - telling transport to close");
          this.transport.close();
        };
        const cleanupAndClose = () => {
          this.off("upgrade", cleanupAndClose);
          this.off("upgradeError", cleanupAndClose);
          close();
        };
        const waitForUpgrade = () => {
          this.once("upgrade", cleanupAndClose);
          this.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
          this.readyState = "closing";
          if (this.writeBuffer.length) {
            this.once("drain", () => {
              if (this.upgrading) {
                waitForUpgrade();
              } else {
                close();
              }
            });
          } else if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        }
        return this;
      }
      /**
       * Called upon transport error
       *
       * @private
       */
      _onError(err) {
        debug("socket error %j", err);
        _SocketWithoutUpgrade.priorWebsocketSuccess = false;
        if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
          debug("trying next transport");
          this.transports.shift();
          return this._open();
        }
        this.emitReserved("error", err);
        this._onClose("transport error", err);
      }
      /**
       * Called upon transport close.
       *
       * @private
       */
      _onClose(reason, description) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          debug('socket close with reason: "%s"', reason);
          this.clearTimeoutFn(this._pingTimeoutTimer);
          this.transport.removeAllListeners("close");
          this.transport.close();
          this.transport.removeAllListeners();
          if (withEventListeners) {
            if (this._beforeunloadEventListener) {
              removeEventListener("beforeunload", this._beforeunloadEventListener, false);
            }
            if (this._offlineEventListener) {
              const i6 = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
              if (i6 !== -1) {
                debug("removing listener for the 'offline' event");
                OFFLINE_EVENT_LISTENERS.splice(i6, 1);
              }
            }
          }
          this.readyState = "closed";
          this.id = null;
          this.emitReserved("close", reason, description);
          this.writeBuffer = [];
          this._prevBufferLen = 0;
        }
      }
    };
    exports.SocketWithoutUpgrade = SocketWithoutUpgrade;
    SocketWithoutUpgrade.protocol = engine_io_parser_1.protocol;
    var SocketWithUpgrade = class extends SocketWithoutUpgrade {
      constructor() {
        super(...arguments);
        this._upgrades = [];
      }
      onOpen() {
        super.onOpen();
        if ("open" === this.readyState && this.opts.upgrade) {
          debug("starting upgrade probes");
          for (let i6 = 0; i6 < this._upgrades.length; i6++) {
            this._probe(this._upgrades[i6]);
          }
        }
      }
      /**
       * Probes a transport.
       *
       * @param {String} name - transport name
       * @private
       */
      _probe(name) {
        debug('probing transport "%s"', name);
        let transport = this.createTransport(name);
        let failed = false;
        SocketWithoutUpgrade.priorWebsocketSuccess = false;
        const onTransportOpen = () => {
          if (failed)
            return;
          debug('probe transport "%s" opened', name);
          transport.send([{ type: "ping", data: "probe" }]);
          transport.once("packet", (msg) => {
            if (failed)
              return;
            if ("pong" === msg.type && "probe" === msg.data) {
              debug('probe transport "%s" pong', name);
              this.upgrading = true;
              this.emitReserved("upgrading", transport);
              if (!transport)
                return;
              SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
              debug('pausing current transport "%s"', this.transport.name);
              this.transport.pause(() => {
                if (failed)
                  return;
                if ("closed" === this.readyState)
                  return;
                debug("changing transport and sending upgrade packet");
                cleanup();
                this.setTransport(transport);
                transport.send([{ type: "upgrade" }]);
                this.emitReserved("upgrade", transport);
                transport = null;
                this.upgrading = false;
                this.flush();
              });
            } else {
              debug('probe transport "%s" failed', name);
              const err = new Error("probe error");
              err.transport = transport.name;
              this.emitReserved("upgradeError", err);
            }
          });
        };
        function freezeTransport() {
          if (failed)
            return;
          failed = true;
          cleanup();
          transport.close();
          transport = null;
        }
        const onerror = (err) => {
          const error = new Error("probe error: " + err);
          error.transport = transport.name;
          freezeTransport();
          debug('probe transport "%s" failed because of error: %s', name, err);
          this.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
          onerror("transport closed");
        }
        function onclose() {
          onerror("socket closed");
        }
        function onupgrade(to) {
          if (transport && to.name !== transport.name) {
            debug('"%s" works - aborting "%s"', to.name, transport.name);
            freezeTransport();
          }
        }
        const cleanup = () => {
          transport.removeListener("open", onTransportOpen);
          transport.removeListener("error", onerror);
          transport.removeListener("close", onTransportClose);
          this.off("close", onclose);
          this.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
          this.setTimeoutFn(() => {
            if (!failed) {
              transport.open();
            }
          }, 200);
        } else {
          transport.open();
        }
      }
      onHandshake(data) {
        this._upgrades = this._filterUpgrades(data.upgrades);
        super.onHandshake(data);
      }
      /**
       * Filters upgrades, returning only those matching client transports.
       *
       * @param {Array} upgrades - server upgrades
       * @private
       */
      _filterUpgrades(upgrades) {
        const filteredUpgrades = [];
        for (let i6 = 0; i6 < upgrades.length; i6++) {
          if (~this.transports.indexOf(upgrades[i6]))
            filteredUpgrades.push(upgrades[i6]);
        }
        return filteredUpgrades;
      }
    };
    exports.SocketWithUpgrade = SocketWithUpgrade;
    var Socket = class extends SocketWithUpgrade {
      constructor(uri, opts = {}) {
        const isOptionsOnly = typeof uri === "object";
        const o7 = isOptionsOnly ? { ...uri } : { ...opts };
        if (!o7.transports || o7.transports && typeof o7.transports[0] === "string") {
          o7.transports = (o7.transports || ["polling", "websocket", "webtransport"]).map((transportName) => index_js_1.transports[transportName]).filter((t5) => !!t5);
        }
        super(isOptionsOnly ? o7 : uri, o7);
      }
    };
    exports.Socket = Socket;
  }
});
var require_polling_fetch = __commonJS({
  "node_modules/engine.io-client/build/cjs/transports/polling-fetch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fetch = void 0;
    var polling_js_1 = require_polling();
    var Fetch = class extends polling_js_1.Polling {
      doPoll() {
        this._fetch().then((res) => {
          if (!res.ok) {
            return this.onError("fetch read error", res.status, res);
          }
          res.text().then((data) => this.onData(data));
        }).catch((err) => {
          this.onError("fetch read error", err);
        });
      }
      doWrite(data, callback) {
        this._fetch(data).then((res) => {
          if (!res.ok) {
            return this.onError("fetch write error", res.status, res);
          }
          callback();
        }).catch((err) => {
          this.onError("fetch write error", err);
        });
      }
      _fetch(data) {
        var _a;
        const isPost = data !== void 0;
        const headers = new Headers(this.opts.extraHeaders);
        if (isPost) {
          headers.set("content-type", "text/plain;charset=UTF-8");
        }
        (_a = this.socket._cookieJar) === null || _a === void 0 ? void 0 : _a.appendCookies(headers);
        return fetch(this.uri(), {
          method: isPost ? "POST" : "GET",
          body: isPost ? data : null,
          headers,
          credentials: this.opts.withCredentials ? "include" : "omit"
        }).then((res) => {
          var _a2;
          (_a2 = this.socket._cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(res.headers.getSetCookie());
          return res;
        });
      }
    };
    exports.Fetch = Fetch;
  }
});
var require_cjs3 = __commonJS({
  "node_modules/engine.io-client/build/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebTransport = exports.WebSocket = exports.NodeWebSocket = exports.XHR = exports.NodeXHR = exports.Fetch = exports.nextTick = exports.parse = exports.installTimerFunctions = exports.transports = exports.TransportError = exports.Transport = exports.protocol = exports.SocketWithUpgrade = exports.SocketWithoutUpgrade = exports.Socket = void 0;
    var socket_js_1 = require_socket();
    Object.defineProperty(exports, "Socket", { enumerable: true, get: function() {
      return socket_js_1.Socket;
    } });
    var socket_js_2 = require_socket();
    Object.defineProperty(exports, "SocketWithoutUpgrade", { enumerable: true, get: function() {
      return socket_js_2.SocketWithoutUpgrade;
    } });
    Object.defineProperty(exports, "SocketWithUpgrade", { enumerable: true, get: function() {
      return socket_js_2.SocketWithUpgrade;
    } });
    exports.protocol = socket_js_1.Socket.protocol;
    var transport_js_1 = require_transport();
    Object.defineProperty(exports, "Transport", { enumerable: true, get: function() {
      return transport_js_1.Transport;
    } });
    Object.defineProperty(exports, "TransportError", { enumerable: true, get: function() {
      return transport_js_1.TransportError;
    } });
    var index_js_1 = require_transports();
    Object.defineProperty(exports, "transports", { enumerable: true, get: function() {
      return index_js_1.transports;
    } });
    var util_js_1 = require_util();
    Object.defineProperty(exports, "installTimerFunctions", { enumerable: true, get: function() {
      return util_js_1.installTimerFunctions;
    } });
    var parseuri_js_1 = require_parseuri();
    Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
      return parseuri_js_1.parse;
    } });
    var globals_node_js_1 = require_globals();
    Object.defineProperty(exports, "nextTick", { enumerable: true, get: function() {
      return globals_node_js_1.nextTick;
    } });
    var polling_fetch_js_1 = require_polling_fetch();
    Object.defineProperty(exports, "Fetch", { enumerable: true, get: function() {
      return polling_fetch_js_1.Fetch;
    } });
    var polling_xhr_node_js_1 = require_polling_xhr();
    Object.defineProperty(exports, "NodeXHR", { enumerable: true, get: function() {
      return polling_xhr_node_js_1.XHR;
    } });
    var polling_xhr_js_1 = require_polling_xhr();
    Object.defineProperty(exports, "XHR", { enumerable: true, get: function() {
      return polling_xhr_js_1.XHR;
    } });
    var websocket_node_js_1 = require_websocket();
    Object.defineProperty(exports, "NodeWebSocket", { enumerable: true, get: function() {
      return websocket_node_js_1.WS;
    } });
    var websocket_js_1 = require_websocket();
    Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function() {
      return websocket_js_1.WS;
    } });
    var webtransport_js_1 = require_webtransport();
    Object.defineProperty(exports, "WebTransport", { enumerable: true, get: function() {
      return webtransport_js_1.WT;
    } });
  }
});
var require_promise_utils = __commonJS({
  "node_modules/@scrypted/client/dist/common/src/promise-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeoutError = void 0;
    exports.singletonPromise = singletonPromise;
    exports.timeoutPromise = timeoutPromise;
    exports.timeoutFunction = timeoutFunction;
    exports.createPromiseDebouncer = createPromiseDebouncer;
    exports.createMapPromiseDebouncer = createMapPromiseDebouncer;
    function singletonPromise(rp, method, cacheDuration = 0) {
      if (rp?.promise)
        return rp;
      const promise = method();
      if (!rp) {
        rp = {
          promise,
          cacheDuration
        };
      } else {
        rp.promise = promise;
      }
      promise.finally(() => setTimeout(() => rp.promise = void 0, rp.cacheDuration));
      return rp;
    }
    var TimeoutError = class extends Error {
      promise;
      constructor(promise) {
        super("Operation Timed Out");
        this.promise = promise;
      }
    };
    exports.TimeoutError = TimeoutError;
    function timeoutPromise(timeout, promise) {
      return new Promise((resolve, reject) => {
        const t5 = setTimeout(() => reject(new TimeoutError(promise)), timeout);
        promise.then((v2) => {
          clearTimeout(t5);
          resolve(v2);
        }).catch((e6) => {
          clearTimeout(t5);
          reject(e6);
        });
      });
    }
    function timeoutFunction(timeout, f4) {
      return new Promise((resolve, reject) => {
        let isTimedOut = false;
        const promise = f4(() => isTimedOut);
        const t5 = setTimeout(() => {
          isTimedOut = true;
          reject(new TimeoutError(promise));
        }, timeout);
        promise.then((v2) => {
          clearTimeout(t5);
          resolve(v2);
        }).catch((e6) => {
          clearTimeout(t5);
          reject(e6);
        });
      });
    }
    function createPromiseDebouncer() {
      let current;
      return (func) => {
        if (!current)
          current = func().finally(() => current = void 0);
        return current;
      };
    }
    function createMapPromiseDebouncer() {
      const map = /* @__PURE__ */ new Map();
      return (key, debounce, func) => {
        const keyStr = JSON.stringify(key);
        let value = map.get(keyStr);
        if (!value) {
          value = func().finally(() => {
            if (!debounce) {
              map.delete(keyStr);
              return;
            }
            setTimeout(() => map.delete(keyStr), debounce);
          });
          map.set(keyStr, value);
        }
        return value;
      };
    }
  }
});
var require_rpc = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/rpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RpcPeer = exports.RPCResultError = void 0;
    exports.startPeriodicGarbageCollection = startPeriodicGarbageCollection;
    exports.getEvalSource = getEvalSource;
    function startPeriodicGarbageCollection() {
      if (!globalThis.gc) {
        console.warn("rpc peer garbage collection not available: global.gc is not exposed.");
      }
      let g2;
      try {
        g2 = globalThis;
      } catch (e6) {
      }
      let lastCollection = 0;
      return setInterval(() => {
        const now = Date.now();
        const sinceLastCollection = now - lastCollection;
        const remotesCreated = RpcPeer.remotesCreated;
        RpcPeer.remotesCreated = 0;
        const remotesCollected = RpcPeer.remotesCollected;
        RpcPeer.remotesCollected = 0;
        if (remotesCreated || remotesCollected || sinceLastCollection > 5 * 60 * 1e3) {
          lastCollection = now;
          g2?.gc?.();
        }
      }, 1e4);
    }
    var RpcProxy = class _RpcProxy {
      peer;
      entry;
      constructorName;
      proxyProps;
      proxyOneWayMethods;
      static iteratorMethods = /* @__PURE__ */ new Set([
        "next",
        "throw",
        "return"
      ]);
      constructor(peer, entry2, constructorName, proxyProps, proxyOneWayMethods) {
        this.peer = peer;
        this.entry = entry2;
        this.constructorName = constructorName;
        this.proxyProps = proxyProps;
        this.proxyOneWayMethods = proxyOneWayMethods;
      }
      toPrimitive() {
        const peer = this.peer;
        return `RpcProxy-${peer.selfName}:${peer.peerName}: ${this.constructorName}`;
      }
      get(target, p3, receiver) {
        if (p3 === Symbol.asyncIterator) {
          if (!this.proxyProps?.[Symbol.asyncIterator.toString()])
            return;
          return () => {
            return new Proxy(() => {
            }, this);
          };
        }
        if (_RpcProxy.iteratorMethods.has(p3?.toString())) {
          const asyncIteratorMethod = this.proxyProps?.[Symbol.asyncIterator.toString()]?.[p3];
          if (asyncIteratorMethod)
            return new Proxy(() => asyncIteratorMethod, this);
        }
        if (p3 === RpcPeer.PROPERTY_PROXY_ID)
          return this.entry.id;
        if (p3 === "__proxy_constructor")
          return this.constructorName;
        if (p3 === RpcPeer.PROPERTY_PROXY_PEER)
          return this.peer;
        if (p3 === RpcPeer.PROPERTY_PROXY_PROPERTIES)
          return this.proxyProps;
        if (p3 === RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS)
          return this.proxyOneWayMethods;
        if (p3 === RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION || p3 === RpcPeer.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN)
          return;
        if (p3 === "then")
          return;
        if (p3 === "constructor")
          return;
        if (this.proxyProps?.[p3] !== void 0)
          return this.proxyProps?.[p3];
        const handled = RpcPeer.handleFunctionInvocations(this, target, p3, receiver);
        if (handled)
          return handled;
        return new Proxy(() => p3, this);
      }
      set(target, p3, value, receiver) {
        if (p3 === RpcPeer.finalizerIdSymbol) {
          this.entry.finalizerId = value;
        } else {
          this.proxyProps ||= {};
          this.proxyProps[p3] = value;
        }
        return true;
      }
      apply(target, thisArg, argArray) {
        const method = target() || null;
        const oneway = this.proxyOneWayMethods?.includes?.(method);
        if (Object.isFrozen(this.peer.pendingResults)) {
          if (oneway)
            return Promise.resolve();
          return Promise.reject(new RPCResultError(this.peer, "RpcPeer has been killed (apply) " + target()));
        }
        const args = [];
        const serializationContext = {};
        for (const arg of argArray || []) {
          args.push(this.peer.serialize(arg, serializationContext));
        }
        const rpcApply = {
          type: "apply",
          id: void 0,
          proxyId: this.entry.id,
          args,
          method
        };
        if (oneway) {
          rpcApply.oneway = true;
          if (method === null)
            delete rpcApply.method;
          this.peer.send(rpcApply, void 0, serializationContext);
          return Promise.resolve();
        }
        const pendingResult = this.peer.createPendingResult(method, (id, reject) => {
          rpcApply.id = id;
          this.peer.send(rpcApply, reject, serializationContext);
        });
        const asyncIterator = this.proxyProps?.[Symbol.asyncIterator.toString()];
        if (!asyncIterator || method !== asyncIterator.next && method !== asyncIterator.return)
          return pendingResult;
        return pendingResult.then((value) => {
          if (method === asyncIterator.return) {
            return {
              done: true,
              value: void 0
            };
          }
          return {
            value,
            done: false
          };
        }).catch((e6) => {
          if (e6.name === "StopAsyncIteration") {
            return {
              done: true,
              value: void 0
            };
          }
          throw e6;
        });
      }
    };
    var RPCResultError = class extends Error {
      cause;
      constructor(peer, message, cause, options) {
        super(`${message}
${peer.selfName}:${peer.peerName}`);
        this.cause = cause;
        if (options?.name) {
          this.name = options?.name;
        }
        if (options?.stack) {
          this.stack = `${cause?.stack || options.stack}
${peer.peerName}:${peer.selfName}`;
        }
      }
    };
    exports.RPCResultError = RPCResultError;
    try {
      const fr = FinalizationRegistry;
    } catch (e6) {
      window.WeakRef = class WeakRef {
        target;
        constructor(target) {
          this.target = target;
        }
        deref() {
          return this.target;
        }
      };
      window.FinalizationRegistry = class FinalizationRegistry {
        register() {
        }
      };
    }
    var RpcPeer = class _RpcPeer {
      selfName;
      peerName;
      send;
      params = {};
      pendingResults = {};
      localProxied = /* @__PURE__ */ new Map();
      localProxyMap = /* @__PURE__ */ new Map();
      // @ts-ignore
      remoteWeakProxies = {};
      // @ts-ignore
      finalizers = new FinalizationRegistry((entry2) => this.finalize(entry2));
      nameDeserializerMap = /* @__PURE__ */ new Map();
      onProxyTypeSerialization = /* @__PURE__ */ new Map();
      onProxySerialization;
      constructorSerializerMap = /* @__PURE__ */ new Map();
      transportSafeArgumentTypes = _RpcPeer.getDefaultTransportSafeArgumentTypes();
      killed;
      killedSafe;
      killedDeferred;
      tags = {};
      yieldedAsyncIterators = /* @__PURE__ */ new Set();
      static finalizerIdSymbol = Symbol("rpcFinalizerId");
      static remotesCollected = 0;
      static remotesCreated = 0;
      static activeRpcPeer;
      static isRpcProxy(value) {
        return !!value?.[_RpcPeer.PROPERTY_PROXY_ID];
      }
      static getDefaultTransportSafeArgumentTypes() {
        const jsonSerializable = /* @__PURE__ */ new Set();
        jsonSerializable.add(Number.name);
        jsonSerializable.add(String.name);
        jsonSerializable.add(Object.name);
        jsonSerializable.add(Boolean.name);
        jsonSerializable.add(Array.name);
        return jsonSerializable;
      }
      static handleFunctionInvocations(thiz, target, p3, receiver) {
        if (p3 === "apply") {
          return (thisArg, args) => {
            return thiz.apply(target, thiz, args);
          };
        } else if (p3 === "call") {
          return (thisArg, ...args) => {
            return thiz.apply(target, thiz, args);
          };
        } else if (p3 === "toString" || p3 === Symbol.toPrimitive) {
          return (thisArg, ...args) => {
            return thiz.toPrimitive();
          };
        }
      }
      // static setProxyProperties(value: any, properties: any) {
      //     value[RpcPeer.PROPERTY_PROXY_PROPERTIES] = properties;
      // }
      // static getProxyProperties(value: any) {
      //     return value?.[RpcPeer.PROPERTY_PROXY_PROPERTIES];
      // }
      static getIteratorNext(target) {
        if (!target[Symbol.asyncIterator])
          return;
        const proxyProps = target[this.PROPERTY_PROXY_PROPERTIES]?.[Symbol.asyncIterator.toString()];
        return proxyProps?.next || "next";
      }
      static prepareProxyProperties(value) {
        let props = value?.[_RpcPeer.PROPERTY_PROXY_PROPERTIES];
        if (!value[Symbol.asyncIterator])
          return props;
        props ||= {};
        if (!props[Symbol.asyncIterator.toString()]) {
          props[Symbol.asyncIterator.toString()] = {
            next: "next",
            throw: "throw",
            return: "return"
          };
        }
        return props;
      }
      static RANDOM_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      static RPC_RESULT_ERROR_NAME = "RPCResultError";
      static PROPERTY_PROXY_ID = "__proxy_id";
      static PROPERTY_PROXY_PEER = "__proxy_peer";
      static PROPERTY_PROXY_ONEWAY_METHODS = "__proxy_oneway_methods";
      static PROPERTY_JSON_DISABLE_SERIALIZATION = "__json_disable_serialization";
      static PROPERTY_PROXY_PROPERTIES = "__proxy_props";
      static PROPERTY_JSON_COPY_SERIALIZE_CHILDREN = "__json_copy_serialize_children";
      static PROBED_PROPERTIES = /* @__PURE__ */ new Set([
        "then",
        "constructor",
        "__proxy_id",
        "__proxy_constructor",
        _RpcPeer.PROPERTY_PROXY_PEER,
        _RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS,
        _RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION,
        _RpcPeer.PROPERTY_PROXY_PROPERTIES,
        _RpcPeer.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN
      ]);
      constructor(selfName, peerName, send) {
        this.selfName = selfName;
        this.peerName = peerName;
        this.send = send;
        this.killed = new Promise((resolve, reject) => {
          this.killedDeferred = { resolve, reject, method: void 0 };
        }).catch((e6) => e6.message || "Unknown Error");
        this.killedSafe = this.killed.then(() => {
        }).catch(() => {
        });
      }
      static isTransportSafe(value) {
        if (!value)
          return true;
        return !value[Symbol.asyncIterator] && !value[_RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION] && this.getDefaultTransportSafeArgumentTypes().has(value.constructor?.name);
      }
      isTransportSafe(value) {
        if (!value)
          return true;
        return !value[Symbol.asyncIterator] && !value[_RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION] && this.transportSafeArgumentTypes.has(value.constructor?.name);
      }
      static generateId() {
        return [...new Array(8)].map(() => _RpcPeer.RANDOM_DIGITS.charAt(Math.floor(Math.random() * _RpcPeer.RANDOM_DIGITS.length))).join("");
      }
      createPendingResult(method, cb) {
        if (Object.isFrozen(this.pendingResults))
          return Promise.reject(new RPCResultError(this, "RpcPeer has been killed (createPendingResult)"));
        const promise = new Promise((resolve, reject) => {
          const id = _RpcPeer.generateId();
          this.pendingResults[id] = { resolve, reject, method };
          cb(id, (e6) => reject(new RPCResultError(this, e6.message, e6)));
        });
        promise.catch(() => {
        });
        return promise;
      }
      kill(message) {
        if (Object.isFrozen(this.pendingResults))
          return;
        const error = new RPCResultError(this, message || "peer was killed");
        this.killedDeferred.reject(error);
        for (const result of Object.values(this.pendingResults)) {
          result.reject(error);
        }
        for (const y3 of this.yieldedAsyncIterators) {
          y3.throw(error).catch(() => {
          });
        }
        this.yieldedAsyncIterators.clear();
        this.pendingResults = Object.freeze({});
        this.params = Object.freeze({});
        this.remoteWeakProxies = Object.freeze({});
        this.localProxyMap.clear();
        this.localProxied.clear();
      }
      // need a name/constructor map due to babel name mangling? fix somehow?
      addSerializer(ctr, name, serializer) {
        this.nameDeserializerMap.set(name, serializer);
        this.constructorSerializerMap.set(ctr, name);
      }
      finalize(entry2) {
        _RpcPeer.remotesCollected++;
        delete this.remoteWeakProxies[entry2.id];
        const rpcFinalize = {
          __local_proxy_id: entry2.id,
          __local_proxy_finalizer_id: entry2.finalizerId,
          type: "finalize"
        };
        this.send(rpcFinalize);
      }
      async getParam(param) {
        return this.createPendingResult("getParam", (id, reject) => {
          const paramMessage = {
            id,
            type: "param",
            param
          };
          this.send(paramMessage, reject);
        });
      }
      createErrorResult(result, e6) {
        result.result = this.serializeError(e6);
        result.throw = true;
        return result;
      }
      deserialize(value, deserializationContext) {
        if (!value)
          return value;
        const copySerializeChildren = value[_RpcPeer.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN];
        if (copySerializeChildren) {
          if (Array.isArray(copySerializeChildren)) {
            const array = [];
            for (const val of copySerializeChildren) {
              array.push(this.deserialize(val, deserializationContext));
            }
            return array;
          }
          const ret = {};
          for (const [key, val] of Object.entries(value)) {
            ret[key] = this.deserialize(val, deserializationContext);
          }
          return ret;
        }
        const { __remote_proxy_id, __remote_proxy_finalizer_id, __local_proxy_id, __remote_constructor_name, __serialized_value, __remote_proxy_props, __remote_proxy_oneway_methods } = value;
        if (__remote_constructor_name === _RpcPeer.RPC_RESULT_ERROR_NAME)
          return this.deserializeError(__serialized_value);
        if (__remote_proxy_id) {
          let proxy = this.remoteWeakProxies[__remote_proxy_id]?.deref();
          if (!proxy)
            proxy = this.newProxy(__remote_proxy_id, __remote_constructor_name, __remote_proxy_props, __remote_proxy_oneway_methods);
          proxy[_RpcPeer.finalizerIdSymbol] = __remote_proxy_finalizer_id;
          const deserializer2 = this.nameDeserializerMap.get(__remote_constructor_name);
          if (deserializer2) {
            return deserializer2.deserialize(proxy, deserializationContext);
          }
          return proxy;
        }
        if (__local_proxy_id) {
          const ret = this.localProxyMap.get(__local_proxy_id);
          if (!ret)
            throw new RPCResultError(this, `invalid local proxy id ${__local_proxy_id}`);
          return ret;
        }
        const deserializer = this.nameDeserializerMap.get(__remote_constructor_name);
        if (deserializer) {
          return deserializer.deserialize(__serialized_value, deserializationContext);
        }
        return value;
      }
      deserializeError(e6) {
        const { name, stack, message } = e6;
        return new RPCResultError(this, message, void 0, { name, stack });
      }
      serializeError(e6) {
        const __serialized_value = {
          stack: e6.stack || "[no stack]",
          name: e6.name || "[no name]",
          message: e6.message || "[no message]"
        };
        return {
          // probably not safe to use constructor.name
          __remote_constructor_name: _RpcPeer.RPC_RESULT_ERROR_NAME,
          __remote_proxy_id: void 0,
          __remote_proxy_finalizer_id: void 0,
          __remote_proxy_oneway_methods: void 0,
          __remote_proxy_props: void 0,
          __serialized_value
        };
      }
      serialize(value, serializationContext) {
        if (value?.[_RpcPeer.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN] === true) {
          if (Array.isArray(value)) {
            const array = [];
            for (const val of value) {
              array.push(this.serialize(val, serializationContext));
            }
            return {
              [_RpcPeer.PROPERTY_JSON_COPY_SERIALIZE_CHILDREN]: array
            };
          }
          const ret2 = {};
          for (const [key, val] of Object.entries(value)) {
            ret2[key] = this.serialize(val, serializationContext);
          }
          return ret2;
        }
        if (this.isTransportSafe(value)) {
          return value;
        }
        let __remote_constructor_name = value.__proxy_constructor || value.constructor?.name?.toString();
        if (value instanceof Error)
          return this.serializeError(value);
        const serializerMapName = this.constructorSerializerMap.get(value.constructor);
        if (serializerMapName) {
          __remote_constructor_name = serializerMapName;
          const serializer = this.nameDeserializerMap.get(serializerMapName);
          if (!serializer)
            throw new Error("serializer not found for " + serializerMapName);
          const serialized = serializer.serialize(value, serializationContext);
          const ret2 = {
            __remote_proxy_id: void 0,
            __remote_proxy_finalizer_id: void 0,
            __remote_constructor_name,
            __remote_proxy_props: _RpcPeer.prepareProxyProperties(value),
            __remote_proxy_oneway_methods: value?.[_RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS],
            __serialized_value: serialized
          };
          return ret2;
        }
        let proxiedEntry = this.localProxied.get(value);
        if (proxiedEntry) {
          const { proxyId: __remote_proxy_id2, properties: __remote_proxy_props2 } = this.onProxySerialization?.(value) || {
            proxyId: proxiedEntry.id,
            properties: _RpcPeer.prepareProxyProperties(value)
          };
          if (__remote_proxy_id2 !== proxiedEntry.id)
            throw new Error("onProxySerialization proxy id mismatch");
          const __remote_proxy_finalizer_id = _RpcPeer.generateId();
          proxiedEntry.finalizerId = __remote_proxy_finalizer_id;
          const ret2 = {
            __remote_proxy_id: __remote_proxy_id2,
            __remote_proxy_finalizer_id,
            __remote_constructor_name,
            __remote_proxy_props: __remote_proxy_props2,
            __remote_proxy_oneway_methods: value?.[_RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]
          };
          return ret2;
        }
        const { __proxy_id, __proxy_peer } = value;
        if (__proxy_id && __proxy_peer === this) {
          const ret2 = {
            __local_proxy_id: __proxy_id
          };
          return ret2;
        }
        this.onProxyTypeSerialization.get(__remote_constructor_name)?.(value);
        const { proxyId: __remote_proxy_id, properties: __remote_proxy_props } = this.onProxySerialization?.(value) || {
          proxyId: _RpcPeer.generateId(),
          properties: _RpcPeer.prepareProxyProperties(value)
        };
        proxiedEntry = {
          id: __remote_proxy_id,
          finalizerId: __remote_proxy_id
        };
        this.localProxied.set(value, proxiedEntry);
        this.localProxyMap.set(__remote_proxy_id, value);
        const ret = {
          __remote_proxy_id,
          __remote_proxy_finalizer_id: __remote_proxy_id,
          __remote_constructor_name,
          __remote_proxy_props,
          __remote_proxy_oneway_methods: value?.[_RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]
        };
        return ret;
      }
      newProxy(proxyId, proxyConstructorName, proxyProps, proxyOneWayMethods) {
        _RpcPeer.remotesCreated++;
        const localProxiedEntry = {
          id: proxyId,
          finalizerId: void 0
        };
        const rpc = new RpcProxy(this, localProxiedEntry, proxyConstructorName, proxyProps, proxyOneWayMethods);
        const target = proxyConstructorName === "Function" || proxyConstructorName === "AsyncFunction" ? function() {
        } : rpc;
        const proxy = new Proxy(target, rpc);
        const weakref = new WeakRef(proxy);
        this.remoteWeakProxies[proxyId] = weakref;
        this.finalizers.register(rpc, localProxiedEntry);
        return proxy;
      }
      handleMessage(message, deserializationContext) {
        try {
          _RpcPeer.activeRpcPeer = this;
          this.handleMessageInternal(message, deserializationContext);
        } finally {
          _RpcPeer.activeRpcPeer = void 0;
        }
      }
      sendResult(result, serializationContext) {
        this.send(result, (e6) => {
          this.send(this.createErrorResult(result, e6), void 0, serializationContext);
        }, serializationContext);
      }
      async handleMessageInternal(message, deserializationContext) {
        if (Object.isFrozen(this.pendingResults))
          return;
        try {
          switch (message.type) {
            case "param": {
              const rpcParam = message;
              const serializationContext = {};
              let result;
              try {
                result = {
                  type: "result",
                  id: rpcParam.id,
                  result: this.serialize(this.params[rpcParam.param], serializationContext)
                };
              } catch (e6) {
                this.createErrorResult(result, e6);
              }
              this.sendResult(result, serializationContext);
              break;
            }
            case "apply": {
              const rpcApply = message;
              const result = {
                type: "result",
                id: rpcApply.id || ""
              };
              const serializationContext = {};
              try {
                const target = this.localProxyMap.get(rpcApply.proxyId);
                if (!target)
                  throw new Error(`proxy id ${rpcApply.proxyId} not found`);
                const args = [];
                for (const arg of rpcApply.args || []) {
                  args.push(this.deserialize(arg, deserializationContext));
                }
                let value;
                if (rpcApply.method) {
                  const method = target[rpcApply.method];
                  if (!method)
                    throw new Error(`target ${target?.constructor?.name} does not have method ${rpcApply.method}`);
                  const isIteratorNext = _RpcPeer.getIteratorNext(target) === rpcApply.method;
                  if (isIteratorNext)
                    this.yieldedAsyncIterators.delete(target);
                  value = await target[rpcApply.method](...args);
                  if (isIteratorNext) {
                    if (value.done) {
                      const errorType = {
                        name: "StopAsyncIteration",
                        message: void 0
                      };
                      throw errorType;
                    } else {
                      if (Object.isFrozen(this.pendingResults)) {
                        target.throw(new RPCResultError(this, "RpcPeer has been killed (yield)")).catch(() => {
                        });
                      } else {
                        this.yieldedAsyncIterators.add(target);
                      }
                      value = value.value;
                    }
                  }
                } else {
                  value = await target(...args);
                }
                result.result = this.serialize(value, serializationContext);
              } catch (e6) {
                this.createErrorResult(result, e6);
              }
              if (!rpcApply.oneway)
                this.sendResult(result, serializationContext);
              break;
            }
            case "result": {
              const rpcResult = message;
              const deferred = this.pendingResults[rpcResult.id];
              delete this.pendingResults[rpcResult.id];
              if (!deferred)
                throw new Error(`unknown result ${rpcResult.id}`);
              const deserialized = this.deserialize(rpcResult.result, deserializationContext);
              if (rpcResult.throw)
                deferred.reject(deserialized);
              else
                deferred.resolve(deserialized);
              break;
            }
            case "finalize": {
              const rpcFinalize = message;
              const local = this.localProxyMap.get(rpcFinalize.__local_proxy_id);
              if (local) {
                const localProxiedEntry = this.localProxied.get(local);
                if (rpcFinalize.__local_proxy_finalizer_id && rpcFinalize.__local_proxy_finalizer_id !== localProxiedEntry?.finalizerId) {
                  break;
                }
                this.localProxyMap.delete(rpcFinalize.__local_proxy_id);
                this.localProxied.delete(local);
              }
              break;
            }
            default:
              throw new Error(`unknown rpc message type ${message.type}`);
          }
        } catch (e6) {
          console.error("unhandled rpc error", this.peerName, e6);
          return;
        }
      }
    };
    exports.RpcPeer = RpcPeer;
    function getEvalSource() {
      return `
    (() => {
        ${RpcProxy}

        ${RpcPeer}

        ${startPeriodicGarbageCollection}

        return {
            startPeriodicGarbageCollection,
            RpcPeer,
            RpcProxy,
        };
    })();
    `;
    }
  }
});
var require_mediaobject = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/mediaobject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MediaObject = void 0;
    var rpc_1 = require_rpc();
    var MediaObject = class {
      mimeType;
      data;
      __proxy_props;
      constructor(mimeType, data, options) {
        this.mimeType = mimeType;
        this.data = data;
        this.__proxy_props = {};
        options ||= {};
        options.mimeType = mimeType;
        options.convert ||= null;
        options.toMimeTypes ||= null;
        for (const [key, value] of Object.entries(options)) {
          if (rpc_1.RpcPeer.isTransportSafe(value))
            this.__proxy_props[key] = value;
          this[key] = value;
        }
      }
      async getData() {
        return Promise.resolve(this.data);
      }
    };
    exports.MediaObject = MediaObject;
  }
});
var require_dist = __commonJS({
  "node_modules/@scrypted/types/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScryptedMimeTypes = exports.ScryptedInterface = exports.MediaPlayerState = exports.SecuritySystemObstruction = exports.SecuritySystemMode = exports.AirQuality = exports.AirPurifierMode = exports.AirPurifierStatus = exports.ChargeState = exports.LockState = exports.PanTiltZoomMovement = exports.ThermostatMode = exports.TemperatureUnit = exports.FanMode = exports.HumidityMode = exports.ScryptedDeviceType = exports.ScryptedInterfaceDescriptors = exports.ScryptedInterfaceMethod = exports.ScryptedInterfaceProperty = exports.DeviceBase = exports.TYPES_VERSION = void 0;
    exports.TYPES_VERSION = "0.5.55";
    var DeviceBase = class {
    };
    exports.DeviceBase = DeviceBase;
    var ScryptedInterfaceProperty;
    (function(ScryptedInterfaceProperty2) {
      ScryptedInterfaceProperty2["id"] = "id";
      ScryptedInterfaceProperty2["info"] = "info";
      ScryptedInterfaceProperty2["interfaces"] = "interfaces";
      ScryptedInterfaceProperty2["mixins"] = "mixins";
      ScryptedInterfaceProperty2["name"] = "name";
      ScryptedInterfaceProperty2["nativeId"] = "nativeId";
      ScryptedInterfaceProperty2["pluginId"] = "pluginId";
      ScryptedInterfaceProperty2["providedInterfaces"] = "providedInterfaces";
      ScryptedInterfaceProperty2["providedName"] = "providedName";
      ScryptedInterfaceProperty2["providedRoom"] = "providedRoom";
      ScryptedInterfaceProperty2["providedType"] = "providedType";
      ScryptedInterfaceProperty2["providerId"] = "providerId";
      ScryptedInterfaceProperty2["room"] = "room";
      ScryptedInterfaceProperty2["type"] = "type";
      ScryptedInterfaceProperty2["scryptedRuntimeArguments"] = "scryptedRuntimeArguments";
      ScryptedInterfaceProperty2["on"] = "on";
      ScryptedInterfaceProperty2["brightness"] = "brightness";
      ScryptedInterfaceProperty2["colorTemperature"] = "colorTemperature";
      ScryptedInterfaceProperty2["rgb"] = "rgb";
      ScryptedInterfaceProperty2["hsv"] = "hsv";
      ScryptedInterfaceProperty2["buttons"] = "buttons";
      ScryptedInterfaceProperty2["sensors"] = "sensors";
      ScryptedInterfaceProperty2["running"] = "running";
      ScryptedInterfaceProperty2["paused"] = "paused";
      ScryptedInterfaceProperty2["docked"] = "docked";
      ScryptedInterfaceProperty2["temperatureSetting"] = "temperatureSetting";
      ScryptedInterfaceProperty2["temperature"] = "temperature";
      ScryptedInterfaceProperty2["temperatureUnit"] = "temperatureUnit";
      ScryptedInterfaceProperty2["humidity"] = "humidity";
      ScryptedInterfaceProperty2["resolution"] = "resolution";
      ScryptedInterfaceProperty2["audioVolumes"] = "audioVolumes";
      ScryptedInterfaceProperty2["recordingActive"] = "recordingActive";
      ScryptedInterfaceProperty2["ptzCapabilities"] = "ptzCapabilities";
      ScryptedInterfaceProperty2["lockState"] = "lockState";
      ScryptedInterfaceProperty2["entryOpen"] = "entryOpen";
      ScryptedInterfaceProperty2["batteryLevel"] = "batteryLevel";
      ScryptedInterfaceProperty2["chargeState"] = "chargeState";
      ScryptedInterfaceProperty2["online"] = "online";
      ScryptedInterfaceProperty2["fromMimeType"] = "fromMimeType";
      ScryptedInterfaceProperty2["toMimeType"] = "toMimeType";
      ScryptedInterfaceProperty2["converters"] = "converters";
      ScryptedInterfaceProperty2["binaryState"] = "binaryState";
      ScryptedInterfaceProperty2["tampered"] = "tampered";
      ScryptedInterfaceProperty2["sleeping"] = "sleeping";
      ScryptedInterfaceProperty2["powerDetected"] = "powerDetected";
      ScryptedInterfaceProperty2["audioDetected"] = "audioDetected";
      ScryptedInterfaceProperty2["motionDetected"] = "motionDetected";
      ScryptedInterfaceProperty2["ambientLight"] = "ambientLight";
      ScryptedInterfaceProperty2["occupied"] = "occupied";
      ScryptedInterfaceProperty2["flooded"] = "flooded";
      ScryptedInterfaceProperty2["ultraviolet"] = "ultraviolet";
      ScryptedInterfaceProperty2["luminance"] = "luminance";
      ScryptedInterfaceProperty2["position"] = "position";
      ScryptedInterfaceProperty2["securitySystemState"] = "securitySystemState";
      ScryptedInterfaceProperty2["pm10Density"] = "pm10Density";
      ScryptedInterfaceProperty2["pm25Density"] = "pm25Density";
      ScryptedInterfaceProperty2["vocDensity"] = "vocDensity";
      ScryptedInterfaceProperty2["noxDensity"] = "noxDensity";
      ScryptedInterfaceProperty2["co2ppm"] = "co2ppm";
      ScryptedInterfaceProperty2["airQuality"] = "airQuality";
      ScryptedInterfaceProperty2["airPurifierState"] = "airPurifierState";
      ScryptedInterfaceProperty2["filterChangeIndication"] = "filterChangeIndication";
      ScryptedInterfaceProperty2["filterLifeLevel"] = "filterLifeLevel";
      ScryptedInterfaceProperty2["humiditySetting"] = "humiditySetting";
      ScryptedInterfaceProperty2["fan"] = "fan";
      ScryptedInterfaceProperty2["applicationInfo"] = "applicationInfo";
      ScryptedInterfaceProperty2["chatCompletionCapabilities"] = "chatCompletionCapabilities";
      ScryptedInterfaceProperty2["systemDevice"] = "systemDevice";
    })(ScryptedInterfaceProperty || (exports.ScryptedInterfaceProperty = ScryptedInterfaceProperty = {}));
    var ScryptedInterfaceMethod;
    (function(ScryptedInterfaceMethod2) {
      ScryptedInterfaceMethod2["listen"] = "listen";
      ScryptedInterfaceMethod2["probe"] = "probe";
      ScryptedInterfaceMethod2["setMixins"] = "setMixins";
      ScryptedInterfaceMethod2["setName"] = "setName";
      ScryptedInterfaceMethod2["setRoom"] = "setRoom";
      ScryptedInterfaceMethod2["setType"] = "setType";
      ScryptedInterfaceMethod2["getPluginJson"] = "getPluginJson";
      ScryptedInterfaceMethod2["turnOff"] = "turnOff";
      ScryptedInterfaceMethod2["turnOn"] = "turnOn";
      ScryptedInterfaceMethod2["setBrightness"] = "setBrightness";
      ScryptedInterfaceMethod2["getTemperatureMaxK"] = "getTemperatureMaxK";
      ScryptedInterfaceMethod2["getTemperatureMinK"] = "getTemperatureMinK";
      ScryptedInterfaceMethod2["setColorTemperature"] = "setColorTemperature";
      ScryptedInterfaceMethod2["setRgb"] = "setRgb";
      ScryptedInterfaceMethod2["setHsv"] = "setHsv";
      ScryptedInterfaceMethod2["pressButton"] = "pressButton";
      ScryptedInterfaceMethod2["sendNotification"] = "sendNotification";
      ScryptedInterfaceMethod2["start"] = "start";
      ScryptedInterfaceMethod2["stop"] = "stop";
      ScryptedInterfaceMethod2["pause"] = "pause";
      ScryptedInterfaceMethod2["resume"] = "resume";
      ScryptedInterfaceMethod2["dock"] = "dock";
      ScryptedInterfaceMethod2["setTemperature"] = "setTemperature";
      ScryptedInterfaceMethod2["setTemperatureUnit"] = "setTemperatureUnit";
      ScryptedInterfaceMethod2["getPictureOptions"] = "getPictureOptions";
      ScryptedInterfaceMethod2["takePicture"] = "takePicture";
      ScryptedInterfaceMethod2["getAudioStream"] = "getAudioStream";
      ScryptedInterfaceMethod2["setAudioVolumes"] = "setAudioVolumes";
      ScryptedInterfaceMethod2["startDisplay"] = "startDisplay";
      ScryptedInterfaceMethod2["stopDisplay"] = "stopDisplay";
      ScryptedInterfaceMethod2["getVideoStream"] = "getVideoStream";
      ScryptedInterfaceMethod2["getVideoStreamOptions"] = "getVideoStreamOptions";
      ScryptedInterfaceMethod2["getPrivacyMasks"] = "getPrivacyMasks";
      ScryptedInterfaceMethod2["setPrivacyMasks"] = "setPrivacyMasks";
      ScryptedInterfaceMethod2["getVideoTextOverlays"] = "getVideoTextOverlays";
      ScryptedInterfaceMethod2["setVideoTextOverlay"] = "setVideoTextOverlay";
      ScryptedInterfaceMethod2["getRecordingStream"] = "getRecordingStream";
      ScryptedInterfaceMethod2["getRecordingStreamCurrentTime"] = "getRecordingStreamCurrentTime";
      ScryptedInterfaceMethod2["getRecordingStreamOptions"] = "getRecordingStreamOptions";
      ScryptedInterfaceMethod2["getRecordingStreamThumbnail"] = "getRecordingStreamThumbnail";
      ScryptedInterfaceMethod2["deleteRecordingStream"] = "deleteRecordingStream";
      ScryptedInterfaceMethod2["setRecordingActive"] = "setRecordingActive";
      ScryptedInterfaceMethod2["ptzCommand"] = "ptzCommand";
      ScryptedInterfaceMethod2["getRecordedEvents"] = "getRecordedEvents";
      ScryptedInterfaceMethod2["getVideoClip"] = "getVideoClip";
      ScryptedInterfaceMethod2["getVideoClips"] = "getVideoClips";
      ScryptedInterfaceMethod2["getVideoClipThumbnail"] = "getVideoClipThumbnail";
      ScryptedInterfaceMethod2["removeVideoClips"] = "removeVideoClips";
      ScryptedInterfaceMethod2["setVideoStreamOptions"] = "setVideoStreamOptions";
      ScryptedInterfaceMethod2["startIntercom"] = "startIntercom";
      ScryptedInterfaceMethod2["stopIntercom"] = "stopIntercom";
      ScryptedInterfaceMethod2["lock"] = "lock";
      ScryptedInterfaceMethod2["unlock"] = "unlock";
      ScryptedInterfaceMethod2["addPassword"] = "addPassword";
      ScryptedInterfaceMethod2["getPasswords"] = "getPasswords";
      ScryptedInterfaceMethod2["removePassword"] = "removePassword";
      ScryptedInterfaceMethod2["activate"] = "activate";
      ScryptedInterfaceMethod2["deactivate"] = "deactivate";
      ScryptedInterfaceMethod2["isReversible"] = "isReversible";
      ScryptedInterfaceMethod2["closeEntry"] = "closeEntry";
      ScryptedInterfaceMethod2["openEntry"] = "openEntry";
      ScryptedInterfaceMethod2["getDevice"] = "getDevice";
      ScryptedInterfaceMethod2["releaseDevice"] = "releaseDevice";
      ScryptedInterfaceMethod2["adoptDevice"] = "adoptDevice";
      ScryptedInterfaceMethod2["discoverDevices"] = "discoverDevices";
      ScryptedInterfaceMethod2["createDevice"] = "createDevice";
      ScryptedInterfaceMethod2["getCreateDeviceSettings"] = "getCreateDeviceSettings";
      ScryptedInterfaceMethod2["reboot"] = "reboot";
      ScryptedInterfaceMethod2["getRefreshFrequency"] = "getRefreshFrequency";
      ScryptedInterfaceMethod2["refresh"] = "refresh";
      ScryptedInterfaceMethod2["getMediaStatus"] = "getMediaStatus";
      ScryptedInterfaceMethod2["load"] = "load";
      ScryptedInterfaceMethod2["seek"] = "seek";
      ScryptedInterfaceMethod2["skipNext"] = "skipNext";
      ScryptedInterfaceMethod2["skipPrevious"] = "skipPrevious";
      ScryptedInterfaceMethod2["convert"] = "convert";
      ScryptedInterfaceMethod2["convertMedia"] = "convertMedia";
      ScryptedInterfaceMethod2["getSettings"] = "getSettings";
      ScryptedInterfaceMethod2["putSetting"] = "putSetting";
      ScryptedInterfaceMethod2["armSecuritySystem"] = "armSecuritySystem";
      ScryptedInterfaceMethod2["disarmSecuritySystem"] = "disarmSecuritySystem";
      ScryptedInterfaceMethod2["setAirPurifierState"] = "setAirPurifierState";
      ScryptedInterfaceMethod2["getReadmeMarkdown"] = "getReadmeMarkdown";
      ScryptedInterfaceMethod2["getOauthUrl"] = "getOauthUrl";
      ScryptedInterfaceMethod2["onOauthCallback"] = "onOauthCallback";
      ScryptedInterfaceMethod2["canMixin"] = "canMixin";
      ScryptedInterfaceMethod2["getMixin"] = "getMixin";
      ScryptedInterfaceMethod2["releaseMixin"] = "releaseMixin";
      ScryptedInterfaceMethod2["onRequest"] = "onRequest";
      ScryptedInterfaceMethod2["onConnection"] = "onConnection";
      ScryptedInterfaceMethod2["onPush"] = "onPush";
      ScryptedInterfaceMethod2["run"] = "run";
      ScryptedInterfaceMethod2["eval"] = "eval";
      ScryptedInterfaceMethod2["loadScripts"] = "loadScripts";
      ScryptedInterfaceMethod2["saveScript"] = "saveScript";
      ScryptedInterfaceMethod2["forkInterface"] = "forkInterface";
      ScryptedInterfaceMethod2["getDetectionInput"] = "getDetectionInput";
      ScryptedInterfaceMethod2["getObjectTypes"] = "getObjectTypes";
      ScryptedInterfaceMethod2["detectObjects"] = "detectObjects";
      ScryptedInterfaceMethod2["generateObjectDetections"] = "generateObjectDetections";
      ScryptedInterfaceMethod2["getDetectionModel"] = "getDetectionModel";
      ScryptedInterfaceMethod2["setHumidity"] = "setHumidity";
      ScryptedInterfaceMethod2["setFan"] = "setFan";
      ScryptedInterfaceMethod2["startRTCSignalingSession"] = "startRTCSignalingSession";
      ScryptedInterfaceMethod2["createRTCSignalingSession"] = "createRTCSignalingSession";
      ScryptedInterfaceMethod2["getScryptedUserAccessControl"] = "getScryptedUserAccessControl";
      ScryptedInterfaceMethod2["generateVideoFrames"] = "generateVideoFrames";
      ScryptedInterfaceMethod2["connectStream"] = "connectStream";
      ScryptedInterfaceMethod2["getTTYSettings"] = "getTTYSettings";
      ScryptedInterfaceMethod2["getChatCompletion"] = "getChatCompletion";
      ScryptedInterfaceMethod2["streamChatCompletion"] = "streamChatCompletion";
      ScryptedInterfaceMethod2["getTextEmbedding"] = "getTextEmbedding";
      ScryptedInterfaceMethod2["getImageEmbedding"] = "getImageEmbedding";
      ScryptedInterfaceMethod2["callLLMTool"] = "callLLMTool";
      ScryptedInterfaceMethod2["getLLMTools"] = "getLLMTools";
    })(ScryptedInterfaceMethod || (exports.ScryptedInterfaceMethod = ScryptedInterfaceMethod = {}));
    exports.ScryptedInterfaceDescriptors = {
      "ScryptedDevice": {
        "name": "ScryptedDevice",
        "methods": [
          "listen",
          "probe",
          "setMixins",
          "setName",
          "setRoom",
          "setType"
        ],
        "properties": [
          "id",
          "info",
          "interfaces",
          "mixins",
          "name",
          "nativeId",
          "pluginId",
          "providedInterfaces",
          "providedName",
          "providedRoom",
          "providedType",
          "providerId",
          "room",
          "type"
        ]
      },
      "ScryptedPlugin": {
        "name": "ScryptedPlugin",
        "methods": [
          "getPluginJson"
        ],
        "properties": []
      },
      "ScryptedPluginRuntime": {
        "name": "ScryptedPluginRuntime",
        "methods": [],
        "properties": [
          "scryptedRuntimeArguments"
        ]
      },
      "OnOff": {
        "name": "OnOff",
        "methods": [
          "turnOff",
          "turnOn"
        ],
        "properties": [
          "on"
        ]
      },
      "Brightness": {
        "name": "Brightness",
        "methods": [
          "setBrightness"
        ],
        "properties": [
          "brightness"
        ]
      },
      "ColorSettingTemperature": {
        "name": "ColorSettingTemperature",
        "methods": [
          "getTemperatureMaxK",
          "getTemperatureMinK",
          "setColorTemperature"
        ],
        "properties": [
          "colorTemperature"
        ]
      },
      "ColorSettingRgb": {
        "name": "ColorSettingRgb",
        "methods": [
          "setRgb"
        ],
        "properties": [
          "rgb"
        ]
      },
      "ColorSettingHsv": {
        "name": "ColorSettingHsv",
        "methods": [
          "setHsv"
        ],
        "properties": [
          "hsv"
        ]
      },
      "Buttons": {
        "name": "Buttons",
        "methods": [],
        "properties": [
          "buttons"
        ]
      },
      "PressButtons": {
        "name": "PressButtons",
        "methods": [
          "pressButton"
        ],
        "properties": []
      },
      "Sensors": {
        "name": "Sensors",
        "methods": [],
        "properties": [
          "sensors"
        ]
      },
      "Notifier": {
        "name": "Notifier",
        "methods": [
          "sendNotification"
        ],
        "properties": []
      },
      "StartStop": {
        "name": "StartStop",
        "methods": [
          "start",
          "stop"
        ],
        "properties": [
          "running"
        ]
      },
      "Pause": {
        "name": "Pause",
        "methods": [
          "pause",
          "resume"
        ],
        "properties": [
          "paused"
        ]
      },
      "Dock": {
        "name": "Dock",
        "methods": [
          "dock"
        ],
        "properties": [
          "docked"
        ]
      },
      "TemperatureSetting": {
        "name": "TemperatureSetting",
        "methods": [
          "setTemperature"
        ],
        "properties": [
          "temperatureSetting"
        ]
      },
      "Thermometer": {
        "name": "Thermometer",
        "methods": [
          "setTemperatureUnit"
        ],
        "properties": [
          "temperature",
          "temperatureUnit"
        ]
      },
      "HumiditySensor": {
        "name": "HumiditySensor",
        "methods": [],
        "properties": [
          "humidity"
        ]
      },
      "Camera": {
        "name": "Camera",
        "methods": [
          "getPictureOptions",
          "takePicture"
        ],
        "properties": []
      },
      "Resolution": {
        "name": "Resolution",
        "methods": [],
        "properties": [
          "resolution"
        ]
      },
      "Microphone": {
        "name": "Microphone",
        "methods": [
          "getAudioStream"
        ],
        "properties": []
      },
      "AudioVolumeControl": {
        "name": "AudioVolumeControl",
        "methods": [
          "setAudioVolumes"
        ],
        "properties": [
          "audioVolumes"
        ]
      },
      "Display": {
        "name": "Display",
        "methods": [
          "startDisplay",
          "stopDisplay"
        ],
        "properties": []
      },
      "VideoCamera": {
        "name": "VideoCamera",
        "methods": [
          "getVideoStream",
          "getVideoStreamOptions"
        ],
        "properties": []
      },
      "VideoCameraMask": {
        "name": "VideoCameraMask",
        "methods": [
          "getPrivacyMasks",
          "setPrivacyMasks"
        ],
        "properties": []
      },
      "VideoTextOverlays": {
        "name": "VideoTextOverlays",
        "methods": [
          "getVideoTextOverlays",
          "setVideoTextOverlay"
        ],
        "properties": []
      },
      "VideoRecorder": {
        "name": "VideoRecorder",
        "methods": [
          "getRecordingStream",
          "getRecordingStreamCurrentTime",
          "getRecordingStreamOptions",
          "getRecordingStreamThumbnail"
        ],
        "properties": [
          "recordingActive"
        ]
      },
      "VideoRecorderManagement": {
        "name": "VideoRecorderManagement",
        "methods": [
          "deleteRecordingStream",
          "setRecordingActive"
        ],
        "properties": []
      },
      "PanTiltZoom": {
        "name": "PanTiltZoom",
        "methods": [
          "ptzCommand"
        ],
        "properties": [
          "ptzCapabilities"
        ]
      },
      "EventRecorder": {
        "name": "EventRecorder",
        "methods": [
          "getRecordedEvents"
        ],
        "properties": []
      },
      "VideoClips": {
        "name": "VideoClips",
        "methods": [
          "getVideoClip",
          "getVideoClips",
          "getVideoClipThumbnail",
          "removeVideoClips"
        ],
        "properties": []
      },
      "VideoCameraConfiguration": {
        "name": "VideoCameraConfiguration",
        "methods": [
          "setVideoStreamOptions"
        ],
        "properties": []
      },
      "Intercom": {
        "name": "Intercom",
        "methods": [
          "startIntercom",
          "stopIntercom"
        ],
        "properties": []
      },
      "Lock": {
        "name": "Lock",
        "methods": [
          "lock",
          "unlock"
        ],
        "properties": [
          "lockState"
        ]
      },
      "PasswordStore": {
        "name": "PasswordStore",
        "methods": [
          "addPassword",
          "getPasswords",
          "removePassword"
        ],
        "properties": []
      },
      "Scene": {
        "name": "Scene",
        "methods": [
          "activate",
          "deactivate",
          "isReversible"
        ],
        "properties": []
      },
      "Entry": {
        "name": "Entry",
        "methods": [
          "closeEntry",
          "openEntry"
        ],
        "properties": []
      },
      "EntrySensor": {
        "name": "EntrySensor",
        "methods": [],
        "properties": [
          "entryOpen"
        ]
      },
      "DeviceProvider": {
        "name": "DeviceProvider",
        "methods": [
          "getDevice",
          "releaseDevice"
        ],
        "properties": []
      },
      "DeviceDiscovery": {
        "name": "DeviceDiscovery",
        "methods": [
          "adoptDevice",
          "discoverDevices"
        ],
        "properties": []
      },
      "DeviceCreator": {
        "name": "DeviceCreator",
        "methods": [
          "createDevice",
          "getCreateDeviceSettings"
        ],
        "properties": []
      },
      "Battery": {
        "name": "Battery",
        "methods": [],
        "properties": [
          "batteryLevel"
        ]
      },
      "Charger": {
        "name": "Charger",
        "methods": [],
        "properties": [
          "chargeState"
        ]
      },
      "Reboot": {
        "name": "Reboot",
        "methods": [
          "reboot"
        ],
        "properties": []
      },
      "Refresh": {
        "name": "Refresh",
        "methods": [
          "getRefreshFrequency",
          "refresh"
        ],
        "properties": []
      },
      "MediaPlayer": {
        "name": "MediaPlayer",
        "methods": [
          "getMediaStatus",
          "load",
          "seek",
          "skipNext",
          "skipPrevious"
        ],
        "properties": []
      },
      "Online": {
        "name": "Online",
        "methods": [],
        "properties": [
          "online"
        ]
      },
      "BufferConverter": {
        "name": "BufferConverter",
        "methods": [
          "convert"
        ],
        "properties": [
          "fromMimeType",
          "toMimeType"
        ]
      },
      "MediaConverter": {
        "name": "MediaConverter",
        "methods": [
          "convertMedia"
        ],
        "properties": [
          "converters"
        ]
      },
      "Settings": {
        "name": "Settings",
        "methods": [
          "getSettings",
          "putSetting"
        ],
        "properties": []
      },
      "BinarySensor": {
        "name": "BinarySensor",
        "methods": [],
        "properties": [
          "binaryState"
        ]
      },
      "TamperSensor": {
        "name": "TamperSensor",
        "methods": [],
        "properties": [
          "tampered"
        ]
      },
      "Sleep": {
        "name": "Sleep",
        "methods": [],
        "properties": [
          "sleeping"
        ]
      },
      "PowerSensor": {
        "name": "PowerSensor",
        "methods": [],
        "properties": [
          "powerDetected"
        ]
      },
      "AudioSensor": {
        "name": "AudioSensor",
        "methods": [],
        "properties": [
          "audioDetected"
        ]
      },
      "MotionSensor": {
        "name": "MotionSensor",
        "methods": [],
        "properties": [
          "motionDetected"
        ]
      },
      "AmbientLightSensor": {
        "name": "AmbientLightSensor",
        "methods": [],
        "properties": [
          "ambientLight"
        ]
      },
      "OccupancySensor": {
        "name": "OccupancySensor",
        "methods": [],
        "properties": [
          "occupied"
        ]
      },
      "FloodSensor": {
        "name": "FloodSensor",
        "methods": [],
        "properties": [
          "flooded"
        ]
      },
      "UltravioletSensor": {
        "name": "UltravioletSensor",
        "methods": [],
        "properties": [
          "ultraviolet"
        ]
      },
      "LuminanceSensor": {
        "name": "LuminanceSensor",
        "methods": [],
        "properties": [
          "luminance"
        ]
      },
      "PositionSensor": {
        "name": "PositionSensor",
        "methods": [],
        "properties": [
          "position"
        ]
      },
      "SecuritySystem": {
        "name": "SecuritySystem",
        "methods": [
          "armSecuritySystem",
          "disarmSecuritySystem"
        ],
        "properties": [
          "securitySystemState"
        ]
      },
      "PM10Sensor": {
        "name": "PM10Sensor",
        "methods": [],
        "properties": [
          "pm10Density"
        ]
      },
      "PM25Sensor": {
        "name": "PM25Sensor",
        "methods": [],
        "properties": [
          "pm25Density"
        ]
      },
      "VOCSensor": {
        "name": "VOCSensor",
        "methods": [],
        "properties": [
          "vocDensity"
        ]
      },
      "NOXSensor": {
        "name": "NOXSensor",
        "methods": [],
        "properties": [
          "noxDensity"
        ]
      },
      "CO2Sensor": {
        "name": "CO2Sensor",
        "methods": [],
        "properties": [
          "co2ppm"
        ]
      },
      "AirQualitySensor": {
        "name": "AirQualitySensor",
        "methods": [],
        "properties": [
          "airQuality"
        ]
      },
      "AirPurifier": {
        "name": "AirPurifier",
        "methods": [
          "setAirPurifierState"
        ],
        "properties": [
          "airPurifierState"
        ]
      },
      "FilterMaintenance": {
        "name": "FilterMaintenance",
        "methods": [],
        "properties": [
          "filterChangeIndication",
          "filterLifeLevel"
        ]
      },
      "Readme": {
        "name": "Readme",
        "methods": [
          "getReadmeMarkdown"
        ],
        "properties": []
      },
      "OauthClient": {
        "name": "OauthClient",
        "methods": [
          "getOauthUrl",
          "onOauthCallback"
        ],
        "properties": []
      },
      "MixinProvider": {
        "name": "MixinProvider",
        "methods": [
          "canMixin",
          "getMixin",
          "releaseMixin"
        ],
        "properties": []
      },
      "HttpRequestHandler": {
        "name": "HttpRequestHandler",
        "methods": [
          "onRequest"
        ],
        "properties": []
      },
      "EngineIOHandler": {
        "name": "EngineIOHandler",
        "methods": [
          "onConnection"
        ],
        "properties": []
      },
      "PushHandler": {
        "name": "PushHandler",
        "methods": [
          "onPush"
        ],
        "properties": []
      },
      "Program": {
        "name": "Program",
        "methods": [
          "run"
        ],
        "properties": []
      },
      "Scriptable": {
        "name": "Scriptable",
        "methods": [
          "eval",
          "loadScripts",
          "saveScript"
        ],
        "properties": []
      },
      "ClusterForkInterface": {
        "name": "ClusterForkInterface",
        "methods": [
          "forkInterface"
        ],
        "properties": []
      },
      "ObjectDetector": {
        "name": "ObjectDetector",
        "methods": [
          "getDetectionInput",
          "getObjectTypes"
        ],
        "properties": []
      },
      "ObjectDetection": {
        "name": "ObjectDetection",
        "methods": [
          "detectObjects",
          "generateObjectDetections",
          "getDetectionModel"
        ],
        "properties": []
      },
      "ObjectDetectionPreview": {
        "name": "ObjectDetectionPreview",
        "methods": [],
        "properties": []
      },
      "ObjectDetectionGenerator": {
        "name": "ObjectDetectionGenerator",
        "methods": [],
        "properties": []
      },
      "HumiditySetting": {
        "name": "HumiditySetting",
        "methods": [
          "setHumidity"
        ],
        "properties": [
          "humiditySetting"
        ]
      },
      "Fan": {
        "name": "Fan",
        "methods": [
          "setFan"
        ],
        "properties": [
          "fan"
        ]
      },
      "RTCSignalingChannel": {
        "name": "RTCSignalingChannel",
        "methods": [
          "startRTCSignalingSession"
        ],
        "properties": []
      },
      "RTCSignalingClient": {
        "name": "RTCSignalingClient",
        "methods": [
          "createRTCSignalingSession"
        ],
        "properties": []
      },
      "LauncherApplication": {
        "name": "LauncherApplication",
        "methods": [],
        "properties": [
          "applicationInfo"
        ]
      },
      "ScryptedUser": {
        "name": "ScryptedUser",
        "methods": [
          "getScryptedUserAccessControl"
        ],
        "properties": []
      },
      "VideoFrameGenerator": {
        "name": "VideoFrameGenerator",
        "methods": [
          "generateVideoFrames"
        ],
        "properties": []
      },
      "StreamService": {
        "name": "StreamService",
        "methods": [
          "connectStream"
        ],
        "properties": []
      },
      "TTY": {
        "name": "TTY",
        "methods": [],
        "properties": []
      },
      "TTYSettings": {
        "name": "TTYSettings",
        "methods": [
          "getTTYSettings"
        ],
        "properties": []
      },
      "ChatCompletion": {
        "name": "ChatCompletion",
        "methods": [
          "getChatCompletion",
          "streamChatCompletion"
        ],
        "properties": [
          "chatCompletionCapabilities"
        ]
      },
      "TextEmbedding": {
        "name": "TextEmbedding",
        "methods": [
          "getTextEmbedding"
        ],
        "properties": []
      },
      "ImageEmbedding": {
        "name": "ImageEmbedding",
        "methods": [
          "getImageEmbedding"
        ],
        "properties": []
      },
      "LLMTools": {
        "name": "LLMTools",
        "methods": [
          "callLLMTool",
          "getLLMTools"
        ],
        "properties": []
      },
      "ScryptedSystemDevice": {
        "name": "ScryptedSystemDevice",
        "methods": [],
        "properties": [
          "systemDevice"
        ]
      },
      "ScryptedDeviceCreator": {
        "name": "ScryptedDeviceCreator",
        "methods": [],
        "properties": []
      },
      "ScryptedSettings": {
        "name": "ScryptedSettings",
        "methods": [],
        "properties": []
      }
    };
    var ScryptedDeviceType;
    (function(ScryptedDeviceType2) {
      ScryptedDeviceType2["Builtin"] = "Builtin";
      ScryptedDeviceType2["Internal"] = "Internal";
      ScryptedDeviceType2["Camera"] = "Camera";
      ScryptedDeviceType2["Fan"] = "Fan";
      ScryptedDeviceType2["Light"] = "Light";
      ScryptedDeviceType2["Switch"] = "Switch";
      ScryptedDeviceType2["Outlet"] = "Outlet";
      ScryptedDeviceType2["Sensor"] = "Sensor";
      ScryptedDeviceType2["Scene"] = "Scene";
      ScryptedDeviceType2["Program"] = "Program";
      ScryptedDeviceType2["Automation"] = "Automation";
      ScryptedDeviceType2["Vacuum"] = "Vacuum";
      ScryptedDeviceType2["Notifier"] = "Notifier";
      ScryptedDeviceType2["Thermostat"] = "Thermostat";
      ScryptedDeviceType2["Lock"] = "Lock";
      ScryptedDeviceType2["PasswordControl"] = "PasswordControl";
      ScryptedDeviceType2["Display"] = "Display";
      ScryptedDeviceType2["SmartDisplay"] = "SmartDisplay";
      ScryptedDeviceType2["Speaker"] = "Speaker";
      ScryptedDeviceType2["SmartSpeaker"] = "SmartSpeaker";
      ScryptedDeviceType2["RemoteDesktop"] = "RemoteDesktop";
      ScryptedDeviceType2["Event"] = "Event";
      ScryptedDeviceType2["Entry"] = "Entry";
      ScryptedDeviceType2["Garage"] = "Garage";
      ScryptedDeviceType2["DeviceProvider"] = "DeviceProvider";
      ScryptedDeviceType2["DataSource"] = "DataSource";
      ScryptedDeviceType2["API"] = "API";
      ScryptedDeviceType2["Buttons"] = "Buttons";
      ScryptedDeviceType2["Doorbell"] = "Doorbell";
      ScryptedDeviceType2["Irrigation"] = "Irrigation";
      ScryptedDeviceType2["Valve"] = "Valve";
      ScryptedDeviceType2["Person"] = "Person";
      ScryptedDeviceType2["SecuritySystem"] = "SecuritySystem";
      ScryptedDeviceType2["WindowCovering"] = "WindowCovering";
      ScryptedDeviceType2["Siren"] = "Siren";
      ScryptedDeviceType2["AirPurifier"] = "AirPurifier";
      ScryptedDeviceType2["Internet"] = "Internet";
      ScryptedDeviceType2["Network"] = "Network";
      ScryptedDeviceType2["Bridge"] = "Bridge";
      ScryptedDeviceType2["LLM"] = "LLM";
      ScryptedDeviceType2["Unknown"] = "Unknown";
    })(ScryptedDeviceType || (exports.ScryptedDeviceType = ScryptedDeviceType = {}));
    var HumidityMode;
    (function(HumidityMode2) {
      HumidityMode2["Humidify"] = "Humidify";
      HumidityMode2["Dehumidify"] = "Dehumidify";
      HumidityMode2["Auto"] = "Auto";
      HumidityMode2["Off"] = "Off";
    })(HumidityMode || (exports.HumidityMode = HumidityMode = {}));
    var FanMode;
    (function(FanMode2) {
      FanMode2["Auto"] = "Auto";
      FanMode2["Manual"] = "Manual";
    })(FanMode || (exports.FanMode = FanMode = {}));
    var TemperatureUnit;
    (function(TemperatureUnit2) {
      TemperatureUnit2["C"] = "C";
      TemperatureUnit2["F"] = "F";
    })(TemperatureUnit || (exports.TemperatureUnit = TemperatureUnit = {}));
    var ThermostatMode;
    (function(ThermostatMode2) {
      ThermostatMode2["Off"] = "Off";
      ThermostatMode2["Cool"] = "Cool";
      ThermostatMode2["Heat"] = "Heat";
      ThermostatMode2["HeatCool"] = "HeatCool";
      ThermostatMode2["Auto"] = "Auto";
      ThermostatMode2["FanOnly"] = "FanOnly";
      ThermostatMode2["Purifier"] = "Purifier";
      ThermostatMode2["Eco"] = "Eco";
      ThermostatMode2["Dry"] = "Dry";
      ThermostatMode2["On"] = "On";
    })(ThermostatMode || (exports.ThermostatMode = ThermostatMode = {}));
    var PanTiltZoomMovement;
    (function(PanTiltZoomMovement2) {
      PanTiltZoomMovement2["Absolute"] = "Absolute";
      PanTiltZoomMovement2["Relative"] = "Relative";
      PanTiltZoomMovement2["Continuous"] = "Continuous";
      PanTiltZoomMovement2["Preset"] = "Preset";
      PanTiltZoomMovement2["Home"] = "Home";
    })(PanTiltZoomMovement || (exports.PanTiltZoomMovement = PanTiltZoomMovement = {}));
    var LockState;
    (function(LockState2) {
      LockState2["Locked"] = "Locked";
      LockState2["Unlocked"] = "Unlocked";
      LockState2["Jammed"] = "Jammed";
    })(LockState || (exports.LockState = LockState = {}));
    var ChargeState;
    (function(ChargeState2) {
      ChargeState2["Trickle"] = "trickle";
      ChargeState2["Charging"] = "charging";
      ChargeState2["NotCharging"] = "not-charging";
    })(ChargeState || (exports.ChargeState = ChargeState = {}));
    var AirPurifierStatus;
    (function(AirPurifierStatus2) {
      AirPurifierStatus2["Inactive"] = "Inactive";
      AirPurifierStatus2["Idle"] = "Idle";
      AirPurifierStatus2["Active"] = "Active";
      AirPurifierStatus2["ActiveNightMode"] = "ActiveNightMode";
    })(AirPurifierStatus || (exports.AirPurifierStatus = AirPurifierStatus = {}));
    var AirPurifierMode;
    (function(AirPurifierMode2) {
      AirPurifierMode2["Manual"] = "Manual";
      AirPurifierMode2["Automatic"] = "Automatic";
    })(AirPurifierMode || (exports.AirPurifierMode = AirPurifierMode = {}));
    var AirQuality;
    (function(AirQuality2) {
      AirQuality2["Unknown"] = "Unknown";
      AirQuality2["Excellent"] = "Excellent";
      AirQuality2["Good"] = "Good";
      AirQuality2["Fair"] = "Fair";
      AirQuality2["Inferior"] = "Inferior";
      AirQuality2["Poor"] = "Poor";
    })(AirQuality || (exports.AirQuality = AirQuality = {}));
    var SecuritySystemMode;
    (function(SecuritySystemMode2) {
      SecuritySystemMode2["Disarmed"] = "Disarmed";
      SecuritySystemMode2["HomeArmed"] = "HomeArmed";
      SecuritySystemMode2["AwayArmed"] = "AwayArmed";
      SecuritySystemMode2["NightArmed"] = "NightArmed";
    })(SecuritySystemMode || (exports.SecuritySystemMode = SecuritySystemMode = {}));
    var SecuritySystemObstruction;
    (function(SecuritySystemObstruction2) {
      SecuritySystemObstruction2["Sensor"] = "Sensor";
      SecuritySystemObstruction2["Occupied"] = "Occupied";
      SecuritySystemObstruction2["Time"] = "Time";
      SecuritySystemObstruction2["Error"] = "Error";
    })(SecuritySystemObstruction || (exports.SecuritySystemObstruction = SecuritySystemObstruction = {}));
    var MediaPlayerState;
    (function(MediaPlayerState2) {
      MediaPlayerState2["Idle"] = "Idle";
      MediaPlayerState2["Playing"] = "Playing";
      MediaPlayerState2["Paused"] = "Paused";
      MediaPlayerState2["Buffering"] = "Buffering";
    })(MediaPlayerState || (exports.MediaPlayerState = MediaPlayerState = {}));
    var ScryptedInterface;
    (function(ScryptedInterface2) {
      ScryptedInterface2["ScryptedDevice"] = "ScryptedDevice";
      ScryptedInterface2["ScryptedPlugin"] = "ScryptedPlugin";
      ScryptedInterface2["ScryptedPluginRuntime"] = "ScryptedPluginRuntime";
      ScryptedInterface2["OnOff"] = "OnOff";
      ScryptedInterface2["Brightness"] = "Brightness";
      ScryptedInterface2["ColorSettingTemperature"] = "ColorSettingTemperature";
      ScryptedInterface2["ColorSettingRgb"] = "ColorSettingRgb";
      ScryptedInterface2["ColorSettingHsv"] = "ColorSettingHsv";
      ScryptedInterface2["Buttons"] = "Buttons";
      ScryptedInterface2["PressButtons"] = "PressButtons";
      ScryptedInterface2["Sensors"] = "Sensors";
      ScryptedInterface2["Notifier"] = "Notifier";
      ScryptedInterface2["StartStop"] = "StartStop";
      ScryptedInterface2["Pause"] = "Pause";
      ScryptedInterface2["Dock"] = "Dock";
      ScryptedInterface2["TemperatureSetting"] = "TemperatureSetting";
      ScryptedInterface2["Thermometer"] = "Thermometer";
      ScryptedInterface2["HumiditySensor"] = "HumiditySensor";
      ScryptedInterface2["Camera"] = "Camera";
      ScryptedInterface2["Resolution"] = "Resolution";
      ScryptedInterface2["Microphone"] = "Microphone";
      ScryptedInterface2["AudioVolumeControl"] = "AudioVolumeControl";
      ScryptedInterface2["Display"] = "Display";
      ScryptedInterface2["VideoCamera"] = "VideoCamera";
      ScryptedInterface2["VideoCameraMask"] = "VideoCameraMask";
      ScryptedInterface2["VideoTextOverlays"] = "VideoTextOverlays";
      ScryptedInterface2["VideoRecorder"] = "VideoRecorder";
      ScryptedInterface2["VideoRecorderManagement"] = "VideoRecorderManagement";
      ScryptedInterface2["PanTiltZoom"] = "PanTiltZoom";
      ScryptedInterface2["EventRecorder"] = "EventRecorder";
      ScryptedInterface2["VideoClips"] = "VideoClips";
      ScryptedInterface2["VideoCameraConfiguration"] = "VideoCameraConfiguration";
      ScryptedInterface2["Intercom"] = "Intercom";
      ScryptedInterface2["Lock"] = "Lock";
      ScryptedInterface2["PasswordStore"] = "PasswordStore";
      ScryptedInterface2["Scene"] = "Scene";
      ScryptedInterface2["Entry"] = "Entry";
      ScryptedInterface2["EntrySensor"] = "EntrySensor";
      ScryptedInterface2["DeviceProvider"] = "DeviceProvider";
      ScryptedInterface2["DeviceDiscovery"] = "DeviceDiscovery";
      ScryptedInterface2["DeviceCreator"] = "DeviceCreator";
      ScryptedInterface2["Battery"] = "Battery";
      ScryptedInterface2["Charger"] = "Charger";
      ScryptedInterface2["Reboot"] = "Reboot";
      ScryptedInterface2["Refresh"] = "Refresh";
      ScryptedInterface2["MediaPlayer"] = "MediaPlayer";
      ScryptedInterface2["Online"] = "Online";
      ScryptedInterface2["BufferConverter"] = "BufferConverter";
      ScryptedInterface2["MediaConverter"] = "MediaConverter";
      ScryptedInterface2["Settings"] = "Settings";
      ScryptedInterface2["BinarySensor"] = "BinarySensor";
      ScryptedInterface2["TamperSensor"] = "TamperSensor";
      ScryptedInterface2["Sleep"] = "Sleep";
      ScryptedInterface2["PowerSensor"] = "PowerSensor";
      ScryptedInterface2["AudioSensor"] = "AudioSensor";
      ScryptedInterface2["MotionSensor"] = "MotionSensor";
      ScryptedInterface2["AmbientLightSensor"] = "AmbientLightSensor";
      ScryptedInterface2["OccupancySensor"] = "OccupancySensor";
      ScryptedInterface2["FloodSensor"] = "FloodSensor";
      ScryptedInterface2["UltravioletSensor"] = "UltravioletSensor";
      ScryptedInterface2["LuminanceSensor"] = "LuminanceSensor";
      ScryptedInterface2["PositionSensor"] = "PositionSensor";
      ScryptedInterface2["SecuritySystem"] = "SecuritySystem";
      ScryptedInterface2["PM10Sensor"] = "PM10Sensor";
      ScryptedInterface2["PM25Sensor"] = "PM25Sensor";
      ScryptedInterface2["VOCSensor"] = "VOCSensor";
      ScryptedInterface2["NOXSensor"] = "NOXSensor";
      ScryptedInterface2["CO2Sensor"] = "CO2Sensor";
      ScryptedInterface2["AirQualitySensor"] = "AirQualitySensor";
      ScryptedInterface2["AirPurifier"] = "AirPurifier";
      ScryptedInterface2["FilterMaintenance"] = "FilterMaintenance";
      ScryptedInterface2["Readme"] = "Readme";
      ScryptedInterface2["OauthClient"] = "OauthClient";
      ScryptedInterface2["MixinProvider"] = "MixinProvider";
      ScryptedInterface2["HttpRequestHandler"] = "HttpRequestHandler";
      ScryptedInterface2["EngineIOHandler"] = "EngineIOHandler";
      ScryptedInterface2["PushHandler"] = "PushHandler";
      ScryptedInterface2["Program"] = "Program";
      ScryptedInterface2["Scriptable"] = "Scriptable";
      ScryptedInterface2["ClusterForkInterface"] = "ClusterForkInterface";
      ScryptedInterface2["ObjectDetector"] = "ObjectDetector";
      ScryptedInterface2["ObjectDetection"] = "ObjectDetection";
      ScryptedInterface2["ObjectDetectionPreview"] = "ObjectDetectionPreview";
      ScryptedInterface2["ObjectDetectionGenerator"] = "ObjectDetectionGenerator";
      ScryptedInterface2["HumiditySetting"] = "HumiditySetting";
      ScryptedInterface2["Fan"] = "Fan";
      ScryptedInterface2["RTCSignalingChannel"] = "RTCSignalingChannel";
      ScryptedInterface2["RTCSignalingClient"] = "RTCSignalingClient";
      ScryptedInterface2["LauncherApplication"] = "LauncherApplication";
      ScryptedInterface2["ScryptedUser"] = "ScryptedUser";
      ScryptedInterface2["VideoFrameGenerator"] = "VideoFrameGenerator";
      ScryptedInterface2["StreamService"] = "StreamService";
      ScryptedInterface2["TTY"] = "TTY";
      ScryptedInterface2["TTYSettings"] = "TTYSettings";
      ScryptedInterface2["ChatCompletion"] = "ChatCompletion";
      ScryptedInterface2["TextEmbedding"] = "TextEmbedding";
      ScryptedInterface2["ImageEmbedding"] = "ImageEmbedding";
      ScryptedInterface2["LLMTools"] = "LLMTools";
      ScryptedInterface2["ScryptedSystemDevice"] = "ScryptedSystemDevice";
      ScryptedInterface2["ScryptedDeviceCreator"] = "ScryptedDeviceCreator";
      ScryptedInterface2["ScryptedSettings"] = "ScryptedSettings";
    })(ScryptedInterface || (exports.ScryptedInterface = ScryptedInterface = {}));
    var ScryptedMimeTypes;
    (function(ScryptedMimeTypes2) {
      ScryptedMimeTypes2["Url"] = "text/x-uri";
      ScryptedMimeTypes2["InsecureLocalUrl"] = "text/x-insecure-local-uri";
      ScryptedMimeTypes2["LocalUrl"] = "text/x-local-uri";
      ScryptedMimeTypes2["ServerId"] = "text/x-server-id";
      ScryptedMimeTypes2["PushEndpoint"] = "text/x-push-endpoint";
      ScryptedMimeTypes2["SchemePrefix"] = "x-scrypted/x-scrypted-scheme-";
      ScryptedMimeTypes2["MediaStreamUrl"] = "text/x-media-url";
      ScryptedMimeTypes2["MediaObject"] = "x-scrypted/x-scrypted-media-object";
      ScryptedMimeTypes2["RequestMediaObject"] = "x-scrypted/x-scrypted-request-media-object";
      ScryptedMimeTypes2["RequestMediaStream"] = "x-scrypted/x-scrypted-request-stream";
      ScryptedMimeTypes2["MediaStreamFeedback"] = "x-scrypted/x-media-stream-feedback";
      ScryptedMimeTypes2["FFmpegInput"] = "x-scrypted/x-ffmpeg-input";
      ScryptedMimeTypes2["FFmpegTranscodeStream"] = "x-scrypted/x-ffmpeg-transcode-stream";
      ScryptedMimeTypes2["RTCSignalingChannel"] = "x-scrypted/x-scrypted-rtc-signaling-channel";
      ScryptedMimeTypes2["RTCSignalingSession"] = "x-scrypted/x-scrypted-rtc-signaling-session";
      ScryptedMimeTypes2["RTCConnectionManagement"] = "x-scrypted/x-scrypted-rtc-connection-management";
      ScryptedMimeTypes2["Image"] = "x-scrypted/x-scrypted-image";
    })(ScryptedMimeTypes || (exports.ScryptedMimeTypes = ScryptedMimeTypes = {}));
  }
});
var require_rpc_buffer_serializer = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/rpc-buffer-serializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SidebandBufferSerializer = exports.BufferSerializer = void 0;
    var BufferSerializer = class {
      serialize(value) {
        console.warn("Using slow buffer serialization. Ensure the peer supports SidebandBufferSerializer.");
        return value.toString("base64");
      }
      deserialize(serialized) {
        console.warn("Using slow buffer deserialization. Ensure the peer supports SidebandBufferSerializer.");
        return Buffer.from(serialized, "base64");
      }
    };
    exports.BufferSerializer = BufferSerializer;
    var SidebandBufferSerializer = class {
      bufferSerializer = new BufferSerializer();
      serialize(value, serializationContext) {
        if (!serializationContext)
          return this.bufferSerializer.serialize(value);
        const buffers = serializationContext.buffers = serializationContext.buffers || [];
        buffers.push(value);
        return buffers.length - 1;
      }
      deserialize(serialized, serializationContext) {
        if (!serializationContext?.buffers)
          return this.bufferSerializer.deserialize(serialized);
        const buffers = serializationContext.buffers;
        return buffers[serialized];
      }
    };
    exports.SidebandBufferSerializer = SidebandBufferSerializer;
  }
});
var require_descriptor = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/descriptor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyInterfaces = exports.allInterfaceProperties = void 0;
    exports.getPropertyInterfaces = getPropertyInterfaces;
    exports.getInterfaceMethods = getInterfaceMethods;
    exports.getInterfaceProperties = getInterfaceProperties;
    exports.isValidInterfaceMethod = isValidInterfaceMethod;
    exports.isValidInterfaceProperty = isValidInterfaceProperty;
    var types_1 = require_dist();
    exports.allInterfaceProperties = [].concat(...Object.values(types_1.ScryptedInterfaceDescriptors).map((type) => type.properties));
    function getPropertyInterfaces(descriptors) {
      const propertyInterfaces = {};
      for (const descriptor of Object.values(descriptors)) {
        for (const property of descriptor.properties) {
          propertyInterfaces[property] = descriptor.name;
        }
      }
      return propertyInterfaces;
    }
    exports.propertyInterfaces = getPropertyInterfaces(types_1.ScryptedInterfaceDescriptors);
    function getInterfaceMethods(descriptors, interfaces) {
      return Object.values(descriptors).filter((e6) => interfaces.has(e6.name)).map((type) => type.methods).flat();
    }
    function getInterfaceProperties(descriptors, interfaces) {
      return Object.values(descriptors).filter((e6) => interfaces.has(e6.name)).map((type) => type.properties).flat();
    }
    function isValidInterfaceMethod(descriptors, interfaces, method) {
      const availableMethods = getInterfaceMethods(descriptors, interfaces);
      return availableMethods.includes(method) || descriptors[types_1.ScryptedInterface.ScryptedDevice].methods.includes(method);
    }
    function isValidInterfaceProperty(descriptors, interfaces, property) {
      const availableProperties = getInterfaceProperties(descriptors, new Set(interfaces));
      return availableProperties.includes(property);
    }
  }
});
var require_plugin_state_check = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/plugin-state-check.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkProperty = checkProperty;
    var types_1 = require_dist();
    var rpc_1 = require_rpc();
    var descriptor_1 = require_descriptor();
    function checkProperty(key, value) {
      if (key === types_1.ScryptedInterfaceProperty.id)
        throw new Error("id is read only");
      if (key === types_1.ScryptedInterfaceProperty.nativeId)
        throw new Error("nativeId is read only");
      if (key === types_1.ScryptedInterfaceProperty.mixins)
        throw new Error("mixins is read only");
      if (key === types_1.ScryptedInterfaceProperty.interfaces)
        throw new Error("interfaces is a read only post-mixin computed property, use providedInterfaces");
      if (rpc_1.RpcPeer.isRpcProxy(value))
        throw new Error("value must be a primitive type");
      const iface = descriptor_1.propertyInterfaces[key.toString()];
      if (iface === types_1.ScryptedInterface.ScryptedDevice) {
        if (key !== types_1.ScryptedInterfaceProperty.info)
          throw new Error(`${key.toString()} can not be set. Use DeviceManager.onDevicesChanges or DeviceManager.onDeviceDiscovered to update the device description.`);
      }
    }
  }
});
var require_device = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/device.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageImpl = exports.DeviceManagerImpl = exports.DeviceStateProxyHandler = void 0;
    var rpc_1 = require_rpc();
    var plugin_state_check_1 = require_plugin_state_check();
    var DeviceLogger = class {
      console;
      nativeId;
      api;
      logger;
      constructor(api, nativeId, console2) {
        this.console = console2;
        this.api = api;
        this.nativeId = nativeId;
      }
      async ensureLogger() {
        if (!this.logger)
          this.logger = this.api.getLogger(this.nativeId);
        return await this.logger;
      }
      async log(level, message) {
        (await this.ensureLogger()).log(level, message);
      }
      a(msg) {
        this.log("a", msg);
      }
      async clear() {
        (await this.ensureLogger()).clear();
      }
      async clearAlert(msg) {
        (await this.ensureLogger()).clearAlert(msg);
      }
      async clearAlerts() {
        (await this.ensureLogger()).clearAlerts();
      }
      d(msg) {
        this.log("d", msg);
      }
      e(msg) {
        this.log("e", msg);
      }
      i(msg) {
        this.log("i", msg);
      }
      v(msg) {
        this.log("v", msg);
      }
      w(msg) {
        this.log("w", msg);
      }
    };
    var DeviceStateProxyHandler = class {
      deviceManager;
      id;
      setState;
      constructor(deviceManager, id, setState) {
        this.deviceManager = deviceManager;
        this.id = id;
        this.setState = setState;
      }
      get(target, p3, receiver) {
        if (p3 === "id")
          return this.id;
        if (p3 === rpc_1.RpcPeer.PROPERTY_PROXY_PROPERTIES)
          return { id: this.id };
        if (p3 === "setState")
          return this.setState;
        return this.deviceManager.systemManager.state[this.id][p3]?.value;
      }
      set(target, p3, value, receiver) {
        (0, plugin_state_check_1.checkProperty)(p3.toString(), value);
        this.deviceManager.systemManager.state[this.id][p3] = {
          value
        };
        this.setState(p3.toString(), value);
        return true;
      }
    };
    exports.DeviceStateProxyHandler = DeviceStateProxyHandler;
    var DeviceManagerImpl = class {
      systemManager;
      getDeviceConsole;
      getMixinConsole;
      api;
      nativeIds = /* @__PURE__ */ new Map();
      deviceStorage = /* @__PURE__ */ new Map();
      mixinStorage = /* @__PURE__ */ new Map();
      constructor(systemManager, getDeviceConsole, getMixinConsole) {
        this.systemManager = systemManager;
        this.getDeviceConsole = getDeviceConsole;
        this.getMixinConsole = getMixinConsole;
      }
      async requestRestart() {
        return this.api.requestRestart();
      }
      getDeviceLogger(nativeId) {
        return new DeviceLogger(this.api, nativeId, this.getDeviceConsole?.(nativeId) || console);
      }
      getDeviceState(nativeId) {
        const handler = new DeviceStateProxyHandler(this, this.nativeIds.get(nativeId).id, (property, value) => this.api.setState(nativeId, property, value));
        return new Proxy(handler, handler);
      }
      createDeviceState(id, setState) {
        const handler = new DeviceStateProxyHandler(this, id, setState);
        return new Proxy(handler, handler);
      }
      getDeviceStorage(nativeId) {
        let ret = this.deviceStorage.get(nativeId);
        if (!ret) {
          ret = new StorageImpl(this, nativeId);
          this.deviceStorage.set(nativeId, ret);
        }
        return ret;
      }
      getMixinStorage(id, nativeId) {
        let ms = this.mixinStorage.get(nativeId);
        if (!ms) {
          ms = /* @__PURE__ */ new Map();
          this.mixinStorage.set(nativeId, ms);
        }
        let ret = ms.get(id);
        if (!ret) {
          ret = new StorageImpl(this, nativeId, `mixin:${id}:`);
          ms.set(id, ret);
        }
        return ret;
      }
      pruneMixinStorage() {
        for (const nativeId of this.nativeIds.keys()) {
          const storage = this.nativeIds.get(nativeId).storage;
          for (const key of Object.keys(storage)) {
            if (!key.startsWith("mixin:"))
              continue;
            const [, id] = key.split(":");
            if (id && !this.systemManager.state[id])
              delete storage[key];
          }
        }
      }
      async onMixinEvent(id, nativeId, eventInterface, eventData) {
        return this.api.onMixinEvent(id, nativeId, eventInterface, eventData);
      }
      getNativeIds() {
        return Array.from(this.nativeIds.keys());
      }
      async onDeviceDiscovered(device) {
        return this.api.onDeviceDiscovered(device);
      }
      async onDeviceRemoved(nativeId) {
        return this.api.onDeviceRemoved(nativeId);
      }
      async onDeviceEvent(nativeId, eventInterface, eventData) {
        return this.api.onDeviceEvent(nativeId, eventInterface, eventData);
      }
      async onDevicesChanged(devices) {
        return this.api.onDevicesChanged(devices);
      }
    };
    exports.DeviceManagerImpl = DeviceManagerImpl;
    function toStorageString(value) {
      if (value === null)
        return "null";
      if (value === void 0)
        return "undefined";
      return value.toString();
    }
    var StorageImpl = class _StorageImpl {
      deviceManager;
      nativeId;
      prefix;
      api;
      static allowedMethods = [
        "length",
        "clear",
        "getItem",
        "setItem",
        "key",
        "removeItem"
      ];
      static indexedHandler = {
        get(target, property) {
          const keyString = property.toString();
          if (_StorageImpl.allowedMethods.includes(keyString)) {
            const f4 = target[keyString];
            if (keyString === "length")
              return f4;
            return f4.bind(target);
          }
          return target.getItem(toStorageString(property));
        },
        set(target, property, value) {
          target.setItem(toStorageString(property), value);
          return true;
        }
      };
      constructor(deviceManager, nativeId, prefix) {
        this.deviceManager = deviceManager;
        this.nativeId = nativeId;
        this.prefix = prefix;
        this.deviceManager = deviceManager;
        this.api = deviceManager.api;
        this.nativeId = nativeId;
        if (!this.prefix)
          this.prefix = "";
        return new Proxy(this, _StorageImpl.indexedHandler);
      }
      get storage() {
        return this.deviceManager.nativeIds.get(this.nativeId).storage;
      }
      get length() {
        return Object.keys(this.storage).filter((key) => key.startsWith(this.prefix)).length;
      }
      clear() {
        if (!this.prefix) {
          this.deviceManager.nativeIds.get(this.nativeId).storage = {};
        } else {
          const storage = this.storage;
          Object.keys(this.storage).filter((key) => key.startsWith(this.prefix)).forEach((key) => delete storage[key]);
        }
        this.api.setStorage(this.nativeId, this.storage);
      }
      getItem(key) {
        return this.storage[this.prefix + key];
      }
      key(index) {
        if (!this.prefix) {
          return Object.keys(this.storage)[index];
        }
        return Object.keys(this.storage).filter((key) => key.startsWith(this.prefix))[index].substring(this.prefix.length);
      }
      removeItem(key) {
        delete this.storage[this.prefix + key];
        this.api.setStorage(this.nativeId, this.storage);
      }
      setItem(key, value) {
        key = toStorageString(key);
        value = toStorageString(value);
        if (this.storage[this.prefix + key] === value)
          return;
        this.storage[this.prefix + key] = value;
        this.api.setStorage(this.nativeId, this.storage);
      }
    };
    exports.StorageImpl = StorageImpl;
  }
});
var require_endpoint = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/endpoint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndpointManagerImpl = void 0;
    var types_1 = require_dist();
    var EndpointManagerImpl = class {
      deviceManager;
      api;
      pluginId;
      mediaManager;
      getEndpoint(nativeId) {
        if (!nativeId)
          return this.pluginId;
        const id = this.deviceManager.nativeIds.get(nativeId)?.id;
        if (!id)
          throw new Error("invalid nativeId " + nativeId);
        if (!nativeId)
          return this.pluginId;
        return id;
      }
      async getUrlSafeIp() {
        const ip = await this.api.getComponent("SCRYPTED_IP_ADDRESS");
        return ip?.includes(":") ? `[${ip}]` : ip;
      }
      /**
       * @deprecated
       */
      async getAuthenticatedPath(nativeId) {
        return this.getPath(nativeId);
      }
      /**
       * @deprecated
       */
      async getInsecurePublicLocalEndpoint(nativeId) {
        return this.getLocalEndpoint(nativeId, {
          insecure: true,
          public: true
        });
      }
      /**
       * @deprecated
       */
      async getPublicCloudEndpoint(nativeId) {
        return this.getCloudEndpoint(nativeId, {
          public: true
        });
      }
      /**
       * @deprecated
       */
      async getPublicLocalEndpoint(nativeId) {
        return this.getLocalEndpoint(nativeId, {
          public: true
        });
      }
      /**
       * @deprecated
       */
      async getPublicPushEndpoint(nativeId) {
        const mo = await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(nativeId)), types_1.ScryptedMimeTypes.PushEndpoint);
        return this.mediaManager.convertMediaObjectToUrl(mo, types_1.ScryptedMimeTypes.PushEndpoint);
      }
      async getPath(nativeId, options) {
        return `/endpoint/${this.getEndpoint(nativeId)}/${options?.public ? "public/" : ""}`;
      }
      async getLocalEndpoint(nativeId, options) {
        const protocol = options?.insecure ? "http" : "https";
        const port = await this.api.getComponent(options?.insecure ? "SCRYPTED_INSECURE_PORT" : "SCRYPTED_SECURE_PORT");
        const path = await this.getPath(nativeId, options);
        const url = `${protocol}://${await this.getUrlSafeIp()}:${port}${path}`;
        return url;
      }
      async getCloudEndpoint(nativeId, options) {
        const local = await this.getLocalEndpoint(nativeId, options);
        const mo = await this.mediaManager.createMediaObject(Buffer.from(local), types_1.ScryptedMimeTypes.LocalUrl);
        return this.mediaManager.convertMediaObjectToUrl(mo, types_1.ScryptedMimeTypes.LocalUrl);
      }
      async getCloudPushEndpoint(nativeId) {
        const mo = await this.mediaManager.createMediaObject(Buffer.from(this.getEndpoint(nativeId)), types_1.ScryptedMimeTypes.PushEndpoint);
        return this.mediaManager.convertMediaObjectToUrl(mo, types_1.ScryptedMimeTypes.PushEndpoint);
      }
      async setLocalAddresses(addresses) {
        const addressSettings = await this.api.getComponent("addresses");
        return addressSettings.setLocalAddresses(addresses);
      }
      async getLocalAddresses() {
        const addressSettings = await this.api.getComponent("addresses");
        return await addressSettings.getLocalAddresses();
      }
      async setAccessControlAllowOrigin(options) {
        const self2 = this;
        const setAccessControlAllowOrigin = await this.deviceManager.systemManager.getComponent("setAccessControlAllowOrigin");
        return setAccessControlAllowOrigin(options);
      }
    };
    exports.EndpointManagerImpl = EndpointManagerImpl;
  }
});
var require_plugin_remote_websocket = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/plugin-remote-websocket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocketSerializer = exports.WebSocketConnection = void 0;
    exports.createWebSocketClass = createWebSocketClass;
    var rpc_1 = require_rpc();
    var WebSocketEventTarget = class {
      events = {};
      dispatchEvent(event) {
        const list = this.events[event.type];
        if (!list) {
          return;
        }
        for (const l3 of list) {
          l3(event);
        }
      }
      addEventListener(type, f4) {
        let list = this.events[type];
        if (!list) {
          list = this.events[type] = [];
        }
        list.push(f4);
      }
      removeEventListener(type, f4) {
        const list = this.events[type];
        if (!list) {
          return;
        }
        const index = list.indexOf(f4);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
    };
    function defineEventAttribute(p3, type) {
      Object.defineProperty(p3, "on" + type, {
        get: function() {
          throw new Error(`${type} is write only`);
        },
        set: function(f4) {
          this.events[type] = [f4];
        }
      });
    }
    function createWebSocketClass(__websocketConnect) {
      class WebSocket extends WebSocketEventTarget {
        connection;
        _url;
        _protocols;
        readyState;
        constructor(connection, protocols) {
          super();
          this.connection = connection;
          this._url = connection.url;
          this._protocols = protocols;
          this.readyState = 0;
          __websocketConnect(connection, {
            connect: (e6, ws) => {
              if (e6 != null) {
                this.dispatchEvent({
                  type: "error",
                  message: e6.toString()
                });
                return;
              }
              this.readyState = 1;
              this.dispatchEvent({
                type: "open"
              });
            },
            end: () => {
              this.readyState = 3;
              this.dispatchEvent({
                type: "close",
                reason: "closed"
              });
            },
            error: (e6) => {
              this.readyState = 3;
              this.dispatchEvent({
                type: "error",
                message: e6.toString()
              });
            },
            data: (data) => {
              this.dispatchEvent({
                type: "message",
                data,
                source: this
              });
            }
          });
        }
        send(message) {
          this.connection.send(message);
        }
        get url() {
          return this._url;
        }
        get extensions() {
          return "";
        }
        close(reason) {
          this.connection.close(reason);
        }
      }
      defineEventAttribute(WebSocket.prototype, "close");
      defineEventAttribute(WebSocket.prototype, "error");
      defineEventAttribute(WebSocket.prototype, "message");
      defineEventAttribute(WebSocket.prototype, "open");
      return WebSocket;
    }
    var WebSocketConnection = class {
      url;
      websocketMethods;
      [rpc_1.RpcPeer.PROPERTY_PROXY_PROPERTIES];
      [rpc_1.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS] = [
        "send",
        "close"
      ];
      constructor(url, websocketMethods) {
        this.url = url;
        this.websocketMethods = websocketMethods;
        this[rpc_1.RpcPeer.PROPERTY_PROXY_PROPERTIES] = {
          url
        };
      }
      send(message) {
        return this.websocketMethods.send(message);
      }
      close(message) {
        return this.websocketMethods.close(message);
      }
    };
    exports.WebSocketConnection = WebSocketConnection;
    var WebSocketSerializer = class {
      WebSocket;
      serialize(value, serializationContext) {
        throw new Error("WebSocketSerializer should only be used for deserialization.");
      }
      deserialize(serialized, serializationContext) {
        if (!this.WebSocket)
          return void 0;
        return new this.WebSocket(serialized);
      }
    };
    exports.WebSocketSerializer = WebSocketSerializer;
  }
});
var require_event_registry = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/event-registry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventRegistry = exports.EventListenerRegisterImpl = void 0;
    exports.getMixinEventName = getMixinEventName;
    var types_1 = require_dist();
    var EventListenerRegisterImpl = class {
      removeListener;
      constructor(removeListener) {
        this.removeListener = removeListener;
      }
    };
    exports.EventListenerRegisterImpl = EventListenerRegisterImpl;
    function getMixinEventName(options) {
      let { event, mixinId } = options || {};
      if (!event && typeof options === "string")
        event = options;
      if (!event)
        event = void 0;
      if (!mixinId)
        return event;
      let ret = `${event}-mixin-${mixinId}`;
      return ret;
    }
    var allowedEventInterfaces = /* @__PURE__ */ new Set([types_1.ScryptedInterface.ScryptedDevice, "Logger"]);
    var EventRegistry = class {
      systemListeners = /* @__PURE__ */ new Set();
      listeners = {};
      listen(callback) {
        const events = this.systemListeners;
        events.add(callback);
        return new EventListenerRegisterImpl(() => {
          events.delete(callback);
          callback = void 0;
        });
      }
      listenDevice(id, options, callback) {
        let event = getMixinEventName(options);
        const token = `${id}#${event}`;
        let events = this.listeners[token];
        if (!events) {
          events = /* @__PURE__ */ new Set();
          this.listeners[token] = events;
        }
        events.add(callback);
        return new EventListenerRegisterImpl(() => {
          events.delete(callback);
          callback = void 0;
        });
      }
      notify(id, eventTime, eventInterface, property, value, options) {
        const { changed, mixinId } = options || {};
        if (property && !changed)
          return false;
        const eventDetails = {
          eventId: void 0,
          eventInterface,
          eventTime,
          property,
          mixinId
        };
        return this.notifyEventDetails(id, eventDetails, value);
      }
      notifyEventDetails(id, eventDetails, value, eventInterface) {
        eventDetails.eventId ||= Math.random().toString(36).substring(2);
        eventInterface ||= eventDetails.eventInterface;
        if (eventDetails.property && !eventDetails.mixinId || allowedEventInterfaces.has(eventInterface)) {
          for (const event of this.systemListeners) {
            event(id, eventDetails, value);
          }
        }
        const events = this.listeners[`${id}#${eventInterface}`];
        if (events) {
          for (const event of events) {
            event(eventDetails, value);
          }
        }
        const allEvents = this.listeners[`${id}#${void 0}`];
        if (allEvents) {
          for (const event of allEvents) {
            event(eventDetails, value);
          }
        }
        return true;
      }
    };
    exports.EventRegistry = EventRegistry;
  }
});
var require_system = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/system.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SystemManagerImpl = void 0;
    var types_1 = require_dist();
    var event_registry_1 = require_event_registry();
    var rpc_1 = require_rpc();
    var descriptor_1 = require_descriptor();
    function newDeviceProxy(id, systemManager) {
      const handler = new DeviceProxyHandler(id, systemManager);
      return new Proxy(handler, handler);
    }
    var DeviceProxyHandler = class {
      id;
      systemManager;
      customProperties;
      device;
      constructor(id, systemManager) {
        this.id = id;
        this.systemManager = systemManager;
      }
      toPrimitive() {
        return `ScryptedDevice-${this.id}`;
      }
      ownKeys(target) {
        const interfaces = new Set(this.systemManager.state[this.id].interfaces.value);
        const methods = (0, descriptor_1.getInterfaceMethods)(this.systemManager.descriptors || types_1.ScryptedInterfaceDescriptors, interfaces);
        const properties = (0, descriptor_1.getInterfaceProperties)(this.systemManager.descriptors || types_1.ScryptedInterfaceDescriptors, interfaces);
        return [...methods, ...properties];
      }
      getOwnPropertyDescriptor(target, p3) {
        const interfaces = new Set(this.systemManager.state[this.id].interfaces.value);
        const methods = (0, descriptor_1.getInterfaceMethods)(this.systemManager.descriptors || types_1.ScryptedInterfaceDescriptors, interfaces);
        const prop = p3.toString();
        if (methods.includes(prop)) {
          return {
            configurable: true
          };
        }
        const properties = (0, descriptor_1.getInterfaceProperties)(this.systemManager.descriptors || types_1.ScryptedInterfaceDescriptors, interfaces);
        if (properties.includes(prop)) {
          return {
            configurable: true,
            value: this.systemManager.state[this.id][prop]?.value
          };
        }
      }
      deleteProperty(target, p3) {
        const prop = p3.toString();
        if (Object.keys(types_1.ScryptedInterfaceProperty).includes(prop))
          return false;
        this.customProperties ||= /* @__PURE__ */ new Map();
        this.customProperties.set(p3, void 0);
        return true;
      }
      set(target, p3, newValue, receiver) {
        const prop = p3.toString();
        if (Object.keys(types_1.ScryptedInterfaceProperty).includes(prop))
          return false;
        this.customProperties ||= /* @__PURE__ */ new Map();
        this.customProperties.set(p3, newValue);
        return true;
      }
      get(target, p3, receiver) {
        if (p3 === "id")
          return this.id;
        if (this.customProperties?.has(p3))
          return this.customProperties.get(p3);
        const handled = rpc_1.RpcPeer.handleFunctionInvocations(this, target, p3, receiver);
        if (handled)
          return handled;
        const interfaces = new Set(this.systemManager.state[this.id].interfaces?.value || []);
        const prop = p3.toString();
        const isValidProperty = this.systemManager.propertyInterfaces?.[prop] || descriptor_1.propertyInterfaces[prop];
        if (isValidProperty)
          return this.systemManager.state[this.id]?.[p3]?.value;
        if (!(0, descriptor_1.isValidInterfaceMethod)(this.systemManager.descriptors || types_1.ScryptedInterfaceDescriptors, interfaces, prop))
          return;
        if (types_1.ScryptedInterfaceDescriptors[types_1.ScryptedInterface.ScryptedDevice].methods.includes(prop))
          return this[p3].bind(this);
        return new Proxy(() => p3, this);
      }
      ensureDevice() {
        if (!this.device)
          this.device = this.systemManager.api.getDeviceById(this.id);
        return this.device;
      }
      async apply(target, thisArg, argArray) {
        const method = target();
        const device = await this.ensureDevice();
        return device[method](...argArray);
      }
      listen(event, callback) {
        return this.systemManager.listenDevice(this.id, event, callback);
      }
      async setName(name) {
        return this.systemManager.api.setDeviceProperty(this.id, types_1.ScryptedInterfaceProperty.name, name);
      }
      async setRoom(room) {
        return this.systemManager.api.setDeviceProperty(this.id, types_1.ScryptedInterfaceProperty.room, room);
      }
      async setType(type) {
        return this.systemManager.api.setDeviceProperty(this.id, types_1.ScryptedInterfaceProperty.type, type);
      }
      async setMixins(mixins) {
        const plugins = await this.systemManager.getComponent("plugins");
        await plugins.setMixins(this.id, mixins);
      }
      async probe() {
        return this.apply(() => "probe", void 0, []);
      }
    };
    var EventListenerRegisterImpl = class {
      promise;
      constructor(promise) {
        this.promise = promise;
      }
      async removeListener() {
        try {
          const register = await this.promise;
          this.promise = void 0;
          register?.removeListener();
        } catch (e6) {
          console.error("removeListener", e6);
        }
      }
    };
    function makeOneWayCallback(input) {
      const f4 = input;
      const oneways = f4[rpc_1.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS] || [];
      if (!oneways.includes(null))
        oneways.push(null);
      f4[rpc_1.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS] = oneways;
      return input;
    }
    var SystemManagerImpl = class {
      api;
      state;
      deviceProxies = {};
      log;
      events = new event_registry_1.EventRegistry();
      typesVersion;
      descriptors;
      propertyInterfaces;
      getDeviceState(id) {
        return this.state[id];
      }
      getSystemState() {
        return this.state;
      }
      getDeviceById(idOrPluginId, nativeId) {
        let id;
        if (this.state[idOrPluginId]) {
          if (nativeId != null)
            return;
          id = idOrPluginId;
        } else {
          for (const check of Object.keys(this.state)) {
            const state2 = this.state[check];
            if (!state2)
              continue;
            if (state2[types_1.ScryptedInterfaceProperty.pluginId]?.value === idOrPluginId) {
              if (state2[types_1.ScryptedInterfaceProperty.nativeId]?.value == nativeId) {
                id = check;
                break;
              }
            }
          }
        }
        if (!id)
          return;
        let proxy = this.deviceProxies[id];
        if (!proxy)
          proxy = this.deviceProxies[id] = newDeviceProxy(id, this);
        return proxy;
      }
      getDeviceByName(name) {
        for (const id of Object.keys(this.state)) {
          const s5 = this.state[id];
          if (s5.interfaces?.value?.includes(types_1.ScryptedInterface.ScryptedPlugin) && s5.pluginId?.value === name)
            return this.getDeviceById(id);
          if (s5.name.value === name)
            return this.getDeviceById(id);
        }
      }
      listen(callback) {
        return this.events.listen(makeOneWayCallback((id, eventDetails, eventData) => callback(this.getDeviceById(id), eventDetails, eventData)));
      }
      listenDevice(id, options, callback) {
        let { watch } = options || {};
        if (watch)
          return this.events.listenDevice(id, options, (eventDetails, eventData) => callback(this.getDeviceById(id), eventDetails, eventData));
        return new EventListenerRegisterImpl(this.api.listenDevice(id, options, makeOneWayCallback((eventDetails, eventData) => callback(this.getDeviceById(id), eventDetails, eventData))));
      }
      async removeDevice(id) {
        return this.api.removeDevice(id);
      }
      getComponent(id) {
        return this.api.getComponent(id);
      }
      setScryptedInterfaceDescriptors(typesVersion, descriptors) {
        this.typesVersion = typesVersion;
        this.descriptors = descriptors;
        this.propertyInterfaces = (0, descriptor_1.getPropertyInterfaces)(descriptors);
        return this.api.setScryptedInterfaceDescriptors(typesVersion, descriptors);
      }
    };
    exports.SystemManagerImpl = SystemManagerImpl;
  }
});
var require_cluster = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/cluster.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClusterManagerImpl = void 0;
    var ClusterManagerImpl = class {
      clusterMode;
      api;
      clusterWorkerId;
      clusterServicePromise;
      constructor(clusterMode, api, clusterWorkerId) {
        this.clusterMode = clusterMode;
        this.api = api;
        this.clusterWorkerId = clusterWorkerId;
      }
      getClusterWorkerId() {
        return this.clusterWorkerId;
      }
      getClusterAddress() {
        return process.env.SCRYPTED_CLUSTER_ADDRESS;
      }
      getClusterMode() {
        return this.clusterMode;
      }
      async getClusterWorkers() {
        const clusterFork = await this.getClusterService();
        return clusterFork.getClusterWorkers();
      }
      getClusterService() {
        this.clusterServicePromise ||= this.api.getComponent("cluster-fork");
        return this.clusterServicePromise;
      }
    };
    exports.ClusterManagerImpl = ClusterManagerImpl;
  }
});
var require_plugin_remote = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/plugin/plugin-remote.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupPluginRemote = setupPluginRemote;
    exports.attachPluginRemote = attachPluginRemote;
    var types_1 = require_dist();
    var rpc_1 = require_rpc();
    var rpc_buffer_serializer_1 = require_rpc_buffer_serializer();
    var device_1 = require_device();
    var endpoint_1 = require_endpoint();
    var plugin_remote_websocket_1 = require_plugin_remote_websocket();
    var system_1 = require_system();
    var cluster_1 = require_cluster();
    async function setupPluginRemote(peer, api, pluginId, hostInfo, getSystemState) {
      try {
        if (!peer.constructorSerializerMap.get(Buffer))
          peer.addSerializer(Buffer, "Buffer", new rpc_buffer_serializer_1.BufferSerializer());
        const getRemote = await peer.getParam("getRemote");
        const remote = await getRemote(api, pluginId, hostInfo);
        const accessControls = peer.tags.acl;
        const getAccessControlDeviceState = (id, state2) => {
          state2 = state2 || getSystemState()[id];
          if (accessControls && state2) {
            state2 = Object.assign({}, state2);
            for (const property of Object.keys(state2)) {
              if (accessControls.shouldRejectProperty(id, property))
                delete state2[property];
            }
            let interfaces = state2.interfaces?.value;
            if (interfaces) {
              interfaces = interfaces.filter((scryptedInterface) => !accessControls.shouldRejectInterface(id, scryptedInterface));
              state2.interfaces = {
                value: interfaces
              };
            }
          }
          return state2;
        };
        const getAccessControlSystemState = () => {
          let state2 = getSystemState();
          if (accessControls) {
            state2 = Object.assign({}, state2);
            for (const id of Object.keys(state2)) {
              if (accessControls.shouldRejectDevice(id)) {
                delete state2[id];
                continue;
              }
              state2[id] = getAccessControlDeviceState(id, state2[id]);
            }
          }
          return state2;
        };
        await remote.setSystemState(getAccessControlSystemState());
        api.listen((id, eventDetails, eventData) => {
          if (accessControls?.shouldRejectEvent(eventDetails.property === types_1.ScryptedInterfaceProperty.id ? eventData : id, eventDetails))
            return;
          if (eventDetails.eventInterface === types_1.ScryptedInterface.ScryptedDevice) {
            if (eventDetails.property === types_1.ScryptedInterfaceProperty.id) {
              remote.updateDeviceState(eventData, void 0);
            } else {
              remote.updateDeviceState(id, getAccessControlDeviceState(id));
            }
            return;
          }
          if (eventDetails.property && !eventDetails.mixinId) {
            remote.notify(id, eventDetails, getSystemState()[id]?.[eventDetails.property]).catch(() => {
            });
          } else {
            remote.notify(id, eventDetails, eventData).catch(() => {
            });
          }
        });
        return remote;
      } catch (e6) {
        throw new rpc_1.RPCResultError(peer, "error while retrieving PluginRemote", e6);
      }
    }
    function attachPluginRemote(peer, options) {
      const { createMediaManager, getServicePort, getDeviceConsole, getMixinConsole } = options || {};
      if (!peer.constructorSerializerMap.get(Buffer))
        peer.addSerializer(Buffer, "Buffer", new rpc_buffer_serializer_1.BufferSerializer());
      const ioSockets = {};
      const websocketSerializer = new plugin_remote_websocket_1.WebSocketSerializer();
      peer.addSerializer(plugin_remote_websocket_1.WebSocketConnection, "WebSocketConnection", websocketSerializer);
      let done;
      const retPromise = new Promise((resolve) => done = resolve);
      peer.params.getRemote = async (api, pluginId, hostInfo) => {
        websocketSerializer.WebSocket = (0, plugin_remote_websocket_1.createWebSocketClass)((connection, callbacks) => {
          const { url } = connection;
          if (url.startsWith("io://") || url.startsWith("ws://")) {
            const id = url.substring("xx://".length);
            ioSockets[id] = callbacks;
            callbacks.connect(void 0, {
              close: (message) => connection.close(message),
              send: (message) => connection.send(message)
            });
          } else {
            throw new Error("unsupported websocket");
          }
        });
        api = await options?.onGetRemote?.(api, pluginId) || api;
        const systemManager = new system_1.SystemManagerImpl();
        const deviceManager = new device_1.DeviceManagerImpl(systemManager, getDeviceConsole, getMixinConsole);
        const endpointManager = new endpoint_1.EndpointManagerImpl();
        const clusterManager = new cluster_1.ClusterManagerImpl(void 0, api, void 0);
        const hostMediaManager = await api.getMediaManager();
        if (!hostMediaManager) {
          peer.params["createMediaManager"] = async () => createMediaManager(systemManager, deviceManager);
        }
        const mediaManager = hostMediaManager || await createMediaManager(systemManager, deviceManager);
        peer.params["mediaManager"] = mediaManager;
        systemManager.api = api;
        deviceManager.api = api;
        const log = deviceManager.getDeviceLogger(void 0);
        systemManager.log = log;
        const ret = {
          systemManager,
          deviceManager,
          endpointManager,
          mediaManager,
          clusterManager,
          log,
          pluginHostAPI: api,
          pluginRemoteAPI: void 0,
          serverVersion: hostInfo?.serverVersion,
          connect: void 0,
          fork: void 0,
          connectRPCObject: void 0
        };
        delete peer.params.getRemote;
        endpointManager.api = api;
        endpointManager.deviceManager = deviceManager;
        endpointManager.mediaManager = mediaManager;
        endpointManager.pluginId = pluginId;
        const localStorage2 = new device_1.StorageImpl(deviceManager, void 0);
        const remote = {
          [rpc_1.RpcPeer.PROPERTY_JSON_DISABLE_SERIALIZATION]: true,
          [rpc_1.RpcPeer.PROPERTY_PROXY_ONEWAY_METHODS]: [
            "notify",
            "updateDeviceState",
            "setSystemState",
            "ioEvent",
            "setNativeId"
          ],
          getServicePort,
          async createDeviceState(id, setState) {
            return deviceManager.createDeviceState(id, setState);
          },
          async ioEvent(id, event, message) {
            const io = ioSockets[id];
            if (!io)
              return;
            switch (event) {
              case "message":
                io.data(message);
                break;
              case "close":
                io.end();
                delete ioSockets[id];
                break;
            }
          },
          async setNativeId(nativeId, id, storage) {
            if (nativeId === null)
              nativeId = void 0;
            if (id) {
              deviceManager.nativeIds.set(nativeId?.toString(), {
                id,
                storage
              });
            } else {
              deviceManager.nativeIds.delete(nativeId);
            }
          },
          async updateDeviceState(id, state2) {
            if (!state2) {
              delete systemManager.state[id];
              systemManager.events.notify(void 0, void 0, types_1.ScryptedInterface.ScryptedDevice, types_1.ScryptedInterfaceProperty.id, id, { changed: true });
            } else {
              systemManager.state[id] = state2;
              systemManager.events.notify(id, void 0, types_1.ScryptedInterface.ScryptedDevice, void 0, state2, { changed: true });
            }
          },
          async notify(id, eventTimeOrDetails, eventInterfaceOrData, property, value, changed) {
            if (typeof eventTimeOrDetails === "number") {
              const eventTime = eventTimeOrDetails;
              const eventInterface = eventInterfaceOrData;
              if (property) {
                const state2 = systemManager.state?.[id];
                if (!state2) {
                  log.w(`state not found for ${id}`);
                  return;
                }
                state2[property] = value;
                systemManager.events.notify(id, eventTime, eventInterface, property, value.value, { changed });
              } else {
                systemManager.events.notify(id, eventTime, eventInterface, property, value, { changed });
              }
            } else {
              const eventDetails = eventTimeOrDetails;
              const eventData = eventInterfaceOrData;
              if (eventDetails.property && !eventDetails.mixinId) {
                const state2 = systemManager.state?.[id];
                if (!state2) {
                  log.w(`state not found for ${id}`);
                  return;
                }
                state2[eventDetails.property] = eventData;
                systemManager.events.notifyEventDetails(id, eventDetails, eventData.value);
              } else {
                systemManager.events.notifyEventDetails(id, eventDetails, eventData);
              }
            }
          },
          async setSystemState(state2) {
            systemManager.state = state2;
            deviceManager.pruneMixinStorage();
            done(ret);
          },
          async loadZip(packageJson, zipAPI, zipOptions) {
            const params = {
              __filename: void 0,
              deviceManager,
              systemManager,
              mediaManager,
              endpointManager,
              localStorage: localStorage2,
              pluginHostAPI: api,
              // TODO:
              // 10/10/2022: remove this shim from all plugins and server.
              WebSocket: function(url) {
                if (typeof url === "string")
                  throw new Error("unsupported websocket");
                return url;
              },
              pluginRuntimeAPI: ret
            };
            params.pluginRuntimeAPI = ret;
            try {
              return await options.onLoadZip(ret, params, packageJson, zipAPI, zipOptions);
            } catch (e6) {
              console.error("plugin start/fork failed", e6);
              throw e6;
            }
          }
        };
        ret.pluginRemoteAPI = remote;
        return remote;
      };
      return retPromise;
    }
  }
});
var require_rpc_serializer = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/rpc-serializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDuplexRpcPeer = createDuplexRpcPeer;
    exports.createRpcSerializer = createRpcSerializer;
    exports.createRpcDuplexSerializer = createRpcDuplexSerializer;
    exports.createDataChannelSerializer = createDataChannelSerializer;
    var rpc_buffer_serializer_1 = require_rpc_buffer_serializer();
    var rpc_1 = require_rpc();
    function createDuplexRpcPeer(selfName, peerName, readable, writable) {
      const serializer = createRpcDuplexSerializer(writable);
      const rpcPeer = new rpc_1.RpcPeer(selfName, peerName, (message, reject, serializationContext) => {
        try {
          serializer.sendMessage(message, reject, serializationContext);
        } catch (e6) {
          reject?.(e6);
          readable.destroy();
        }
      });
      serializer.setupRpcPeer(rpcPeer);
      readable.on("data", (data) => serializer.onData(data));
      readable.on("close", serializer.onDisconnected);
      readable.on("error", serializer.onDisconnected);
      return rpcPeer;
    }
    function createRpcSerializer(options) {
      let rpcPeer;
      const { sendMessageBuffer, sendMessageFinish } = options;
      let connected = true;
      const onDisconnected = () => {
        connected = false;
        rpcPeer.kill("connection closed.");
      };
      const sendMessage = (message, reject, serializationContext) => {
        if (!connected) {
          reject?.(new Error("peer disconnected"));
          return;
        }
        const buffers = serializationContext?.buffers;
        if (buffers) {
          for (const buffer of buffers) {
            sendMessageBuffer(buffer);
          }
        }
        sendMessageFinish(message);
      };
      let pendingSerializationContext = void 0;
      const setupRpcPeer = (peer) => {
        rpcPeer = peer;
        rpcPeer.addSerializer(Buffer, "Buffer", new rpc_buffer_serializer_1.SidebandBufferSerializer());
        rpcPeer.constructorSerializerMap.set(Uint8Array, "Buffer");
      };
      const onMessageBuffer = (buffer) => {
        pendingSerializationContext = pendingSerializationContext || {};
        pendingSerializationContext.buffers ||= [];
        const buffers = pendingSerializationContext.buffers;
        buffers.push(buffer);
      };
      const onMessageFinish = (message) => {
        const messageSerializationContext = pendingSerializationContext;
        pendingSerializationContext = void 0;
        rpcPeer.handleMessage(message, messageSerializationContext);
      };
      const kill = (message) => {
        rpcPeer.kill(message);
      };
      return {
        kill,
        sendMessage,
        setupRpcPeer,
        onMessageBuffer,
        onMessageFinish,
        onDisconnected
      };
    }
    function createRpcDuplexSerializer(writable) {
      const socketSend = (type2, data) => {
        const header2 = Buffer.alloc(5);
        header2.writeUInt32BE(data.length + 1, 0);
        header2.writeUInt8(type2, 4);
        writable.write(Buffer.concat([header2, data]));
      };
      const createSocketSend = (type2) => {
        return (data) => {
          return socketSend(type2, data);
        };
      };
      const sendMessageBuffer = createSocketSend(1);
      const sendMessageFinish = createSocketSend(0);
      const serializer = createRpcSerializer({
        sendMessageBuffer,
        sendMessageFinish: (message) => sendMessageFinish(Buffer.from(JSON.stringify(message)))
      });
      let header;
      let pending;
      let offset;
      let type;
      const onData = (data) => {
        while (data.length) {
          if (!pending) {
            if (!header)
              header = data;
            else
              header = Buffer.concat([header, data]);
            if (header.length < 5)
              return;
            data = header.slice(5);
            const length = header.readUInt32BE(0) - 1;
            type = header.readUInt8(4);
            if (data.length >= length && type === 0) {
              pending = data.length === length ? data : data.slice(0, length);
              offset = length;
              data = data.slice(length);
            } else {
              pending = Buffer.alloc(length);
              offset = 0;
            }
            header = void 0;
          }
          const need = pending.length - offset;
          if (need) {
            const sub = data.slice(0, need);
            data = data.slice(need);
            pending.set(sub, offset);
            offset += sub.length;
          }
          if (offset !== pending.length)
            return;
          const payload = pending;
          pending = void 0;
          if (type === 0) {
            try {
              const message = JSON.parse(payload.toString());
              serializer.onMessageFinish(message);
            } catch (e6) {
              serializer.kill("message parse failure " + e6.message);
            }
          } else {
            serializer.onMessageBuffer(payload);
          }
        }
      };
      return {
        onData,
        setupRpcPeer: serializer.setupRpcPeer,
        sendMessage: serializer.sendMessage,
        onDisconnected: serializer.onDisconnected
      };
    }
    function createDataChannelSerializer(dc) {
      let pending;
      const MAX_PACKET_SIZE = 16384;
      function flushPending() {
        if (!pending || pending.length === 0)
          return;
        const chunks = pending;
        pending = void 0;
        for (const data of chunks) {
          let offset = 0;
          while (offset < data.length) {
            const remaining = data.length - offset;
            const chunkSize = Math.min(remaining, MAX_PACKET_SIZE);
            const chunkData = data.subarray(offset, offset + chunkSize);
            dc.send(chunkData);
            offset += chunkSize;
          }
        }
      }
      function queuePending(data) {
        const hadPending = !!pending;
        if (!pending)
          pending = [];
        pending.push(data);
        if (!hadPending) {
          setTimeout(() => flushPending(), 0);
        }
      }
      const chunkingDataChannel = {
        write: (data) => {
          queuePending(data);
        }
      };
      const duplexSerializer = createRpcDuplexSerializer(chunkingDataChannel);
      return duplexSerializer;
    }
  }
});
var require_package = __commonJS({
  "node_modules/@scrypted/client/dist/packages/client/package.json"(exports, module) {
    module.exports = {
      name: "@scrypted/client",
      version: "1.3.26",
      description: "",
      main: "dist/packages/client/src/index.js",
      scripts: {
        prebuild: "rimraf dist",
        build: "tsc --outDir dist",
        prepublishOnly: "npm run build",
        test: 'echo "Error: no test specified" && exit 1'
      },
      author: "",
      license: "ISC",
      devDependencies: {
        "@types/ip": "^1.1.3",
        "@types/node": "^24.0.10",
        "@types/ws": "^8.18.1",
        "ts-node": "^10.9.2",
        typescript: "^5.8.3"
      },
      peerDependencies: {
        "@scrypted/types": "^0.5.44"
      },
      dependencies: {
        "engine.io-client": "^6.6.3",
        "follow-redirects": "^1.15.9",
        rimraf: "^6.0.1"
      }
    };
  }
});
var require_ip = __commonJS({
  "node_modules/@scrypted/client/dist/packages/client/src/ip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isIPV4Address = isIPV4Address;
    exports.isIPV6Address = isIPV6Address;
    exports.isIPAddress = isIPAddress;
    var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
    var ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
    function isIPV4Address(ip) {
      return ipv4Regex.test(ip);
    }
    function isIPV6Address(ip) {
      return ipv6Regex.test(ip);
    }
    function isIPAddress(ip) {
      return isIPV4Address(ip) || isIPV6Address(ip);
    }
  }
});
var require_fetch = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/fetch/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchStatusCodeOk = fetchStatusCodeOk;
    exports.checkStatus = checkStatus;
    exports.getFetchMethod = getFetchMethod;
    exports.getHttpFetchAccept = getHttpFetchAccept;
    exports.hasHeader = hasHeader;
    exports.removeHeader = removeHeader;
    exports.setHeader = setHeader;
    exports.setDefaultHttpFetchAccept = setDefaultHttpFetchAccept;
    exports.createHeadersArray = createHeadersArray;
    exports.createStringOrBufferBody = createStringOrBufferBody;
    exports.domFetchParseIncomingMessage = domFetchParseIncomingMessage;
    exports.domFetch = domFetch;
    function fetchStatusCodeOk(statusCode) {
      return statusCode >= 200 && statusCode <= 299;
    }
    function checkStatus(statusCode) {
      if (!fetchStatusCodeOk(statusCode))
        throw new Error(`http response statusCode ${statusCode}`);
      return true;
    }
    function getFetchMethod(options) {
      const method = options.method || (options.body ? "POST" : "GET");
      return method;
    }
    function getHttpFetchAccept(responseType) {
      switch (responseType) {
        case "json":
          return "application/json";
        case "text":
          return "text/plain";
      }
      return;
    }
    function hasHeader(headers, key) {
      key = key.toLowerCase();
      return headers.find(([k2]) => k2.toLowerCase() === key);
    }
    function removeHeader(headers, key) {
      key = key.toLowerCase();
      const filteredHeaders = headers.filter(([headerKey, _2]) => headerKey.toLowerCase() !== key);
      headers.length = 0;
      filteredHeaders.forEach((header) => headers.push(header));
    }
    function setHeader(headers, key, value) {
      removeHeader(headers, key);
      headers.push([key, value]);
    }
    function setDefaultHttpFetchAccept(headers, responseType) {
      if (hasHeader(headers, "Accept"))
        return;
      const accept = getHttpFetchAccept(responseType);
      if (accept)
        setHeader(headers, "Accept", accept);
    }
    function createHeadersArray(headers) {
      const headersArray = [];
      if (!headers)
        return headersArray;
      if (headers instanceof Headers) {
        for (const [k2, v2] of headers.entries()) {
          headersArray.push([k2, v2]);
        }
        return headersArray;
      }
      if (headers instanceof Array) {
        for (const [k2, v2] of headers) {
          headersArray.push([k2, v2]);
        }
        return headersArray;
      }
      for (const k2 of Object.keys(headers)) {
        const v2 = headers[k2];
        headersArray.push([k2, v2]);
      }
      return headersArray;
    }
    function createStringOrBufferBody(headers, body) {
      let contentType;
      if (typeof body === "object") {
        body = JSON.stringify(body);
        contentType = "application/json";
      } else if (typeof body === "string") {
        contentType = "text/plain";
      }
      if (contentType && !hasHeader(headers, "Content-Type"))
        setHeader(headers, "Content-Type", contentType);
      if (!hasHeader(headers, "Content-Length")) {
        body = Buffer.from(body);
        setHeader(headers, "Content-Length", body.length.toString());
      }
      return body;
    }
    async function domFetchParseIncomingMessage(response, responseType) {
      switch (responseType) {
        case "json":
          return response.json();
        case "text":
          return response.text();
        case "readable":
          return response;
      }
      return new Uint8Array(await response.arrayBuffer());
    }
    async function domFetch(options) {
      const headers = createHeadersArray(options.headers);
      setDefaultHttpFetchAccept(headers, options.responseType);
      let { body } = options;
      if (body && !(body instanceof ReadableStream)) {
        body = createStringOrBufferBody(headers, body);
      }
      let controller;
      let timeout;
      if (options.timeout) {
        controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), options.timeout);
        options.signal?.addEventListener("abort", () => controller.abort(options.signal?.reason));
      }
      try {
        const { url } = options;
        const response = await fetch(url, {
          method: getFetchMethod(options),
          credentials: options.withCredentials ? "include" : void 0,
          headers,
          signal: controller?.signal || options.signal,
          body
        });
        if (options?.checkStatusCode === void 0 || options?.checkStatusCode) {
          try {
            const checker = typeof options?.checkStatusCode === "function" ? options.checkStatusCode : checkStatus;
            if (!checker(response.status))
              throw new Error(`http response statusCode ${response.status}`);
          } catch (e6) {
            response.arrayBuffer().catch(() => {
            });
            throw e6;
          }
        }
        return {
          statusCode: response.status,
          headers: response.headers,
          body: await domFetchParseIncomingMessage(response, options.responseType)
        };
      } finally {
        clearTimeout(timeout);
      }
    }
  }
});
var node_stub_exports = {};
__export(node_stub_exports, {
  default: () => node_stub_default
});
var node_stub_default;
var init_node_stub = __esm({
  "src/lib/node-stub.js"() {
    "use strict";
    node_stub_default = {};
  }
});
var require_http_fetch = __commonJS({
  "node_modules/@scrypted/client/dist/server/src/fetch/http-fetch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHttpFetchParser = getHttpFetchParser;
    exports.httpFetchParseIncomingMessage = httpFetchParseIncomingMessage;
    exports.httpFetch = httpFetch;
    var _1 = require_fetch();
    async function readMessageBuffer(response) {
      const buffers = [];
      response.on("data", (buffer) => buffers.push(buffer));
      const { once } = (init_node_stub(), __toCommonJS(node_stub_exports));
      await once(response, "end");
      return Buffer.concat(buffers);
    }
    var TextParser = {
      async parse(message) {
        return (await readMessageBuffer(message)).toString();
      }
    };
    var JSONParser = {
      async parse(message) {
        return JSON.parse((await readMessageBuffer(message)).toString());
      }
    };
    var BufferParser = {
      async parse(message) {
        return readMessageBuffer(message);
      }
    };
    var StreamParser = {
      async parse(message) {
        return message;
      }
    };
    function getHttpFetchParser(responseType) {
      switch (responseType) {
        case "json":
          return JSONParser;
        case "text":
          return TextParser;
        case "readable":
          return StreamParser;
      }
      return BufferParser;
    }
    function httpFetchParseIncomingMessage(readable, responseType) {
      return getHttpFetchParser(responseType).parse(readable);
    }
    async function httpFetch(options) {
      const headers = (0, _1.createHeadersArray)(options.headers);
      (0, _1.setDefaultHttpFetchAccept)(headers, options.responseType);
      const { once } = (init_node_stub(), __toCommonJS(node_stub_exports));
      const { PassThrough, Readable } = (init_node_stub(), __toCommonJS(node_stub_exports));
      const { http, https } = (init_node_stub(), __toCommonJS(node_stub_exports));
      const { url } = options;
      const isSecure = url.toString().startsWith("https:");
      const proto = isSecure ? https : http;
      let { body } = options;
      if (body && !(body instanceof Readable)) {
        const newBody = new PassThrough();
        newBody.write(Buffer.from((0, _1.createStringOrBufferBody)(headers, body)));
        newBody.end();
        body = newBody;
      }
      let controller;
      let timeout;
      if (options.timeout) {
        controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), options.timeout);
        options.signal?.addEventListener("abort", () => controller.abort(options.signal?.reason));
      }
      const signal = controller?.signal || options.signal;
      signal?.addEventListener("abort", () => request.destroy(new Error(options.signal?.reason || "abort")));
      const nodeHeaders = {};
      for (const [k2, v2] of headers) {
        if (nodeHeaders[k2]) {
          nodeHeaders[k2].push(v2);
        } else {
          nodeHeaders[k2] = [v2];
        }
      }
      const request = proto.request(url, {
        method: (0, _1.getFetchMethod)(options),
        rejectUnauthorized: options.rejectUnauthorized,
        family: options.family,
        headers: nodeHeaders,
        signal,
        timeout: options.timeout
      });
      if (body)
        body.pipe(request);
      else
        request.end();
      try {
        const [response] = await once(request, "response");
        if (options?.checkStatusCode === void 0 || options?.checkStatusCode) {
          try {
            const checker = typeof options?.checkStatusCode === "function" ? options.checkStatusCode : _1.checkStatus;
            if (!response.statusCode || !checker(response.statusCode))
              throw new Error(`http response statusCode ${response.statusCode}`);
          } catch (e6) {
            readMessageBuffer(response).catch(() => {
            });
            throw e6;
          }
        }
        const incomingHeaders = new Headers();
        for (const [k2, v2] of Object.entries(response.headers)) {
          for (const vv of typeof v2 === "string" ? [v2] : v2) {
            incomingHeaders.append(k2, vv);
          }
        }
        return {
          statusCode: response.statusCode,
          headers: incomingHeaders,
          body: await httpFetchParseIncomingMessage(response, options.responseType)
        };
      } finally {
        clearTimeout(timeout);
      }
    }
  }
});
var require_src = __commonJS({
  "node_modules/@scrypted/client/dist/packages/client/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o7, m2, k2, k22) {
      if (k22 === void 0) k22 = k2;
      var desc = Object.getOwnPropertyDescriptor(m2, k2);
      if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m2[k2];
        } };
      }
      Object.defineProperty(o7, k22, desc);
    } : function(o7, m2, k2, k22) {
      if (k22 === void 0) k22 = k2;
      o7[k22] = m2[k2];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o7, v2) {
      Object.defineProperty(o7, "default", { enumerable: true, value: v2 });
    } : function(o7, v2) {
      o7["default"] = v2;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
      var ownKeys = function(o7) {
        ownKeys = Object.getOwnPropertyNames || function(o8) {
          var ar = [];
          for (var k2 in o8) if (Object.prototype.hasOwnProperty.call(o8, k2)) ar[ar.length] = k2;
          return ar;
        };
        return ownKeys(o7);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k2 = ownKeys(mod), i6 = 0; i6 < k2.length; i6++) if (k2[i6] !== "default") __createBinding(result, mod, k2[i6]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    }();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScryptedClientLoginError = exports.rpc_serializer = exports.rpc = void 0;
    exports.logoutScryptedClient = logoutScryptedClient;
    exports.getCurrentBaseUrl = getCurrentBaseUrl;
    exports.loginScryptedClient = loginScryptedClient;
    exports.checkScryptedClientLogin = checkScryptedClientLogin;
    exports.redirectScryptedLogin = redirectScryptedLogin;
    exports.combineBaseUrl = combineBaseUrl;
    exports.redirectScryptedLogout = redirectScryptedLogout;
    exports.connectScryptedClient = connectScryptedClient2;
    var eio = __importStar(require_cjs3());
    var promise_utils_1 = require_promise_utils();
    var mediaobject_1 = require_mediaobject();
    var plugin_remote_1 = require_plugin_remote();
    var rpc_1 = require_rpc();
    var rpc_serializer_1 = require_rpc_serializer();
    var package_json_1 = __importDefault(require_package());
    var ip_1 = require_ip();
    var fetch_1 = require_fetch();
    var http_fetch_1 = require_http_fetch();
    exports.rpc = __importStar(require_rpc());
    exports.rpc_serializer = __importStar(require_rpc_serializer());
    var fetcher;
    try {
      if (true)
        throw new Error();
      init_node_stub();
      init_node_stub();
      fetcher = http_fetch_1.httpFetch;
    } catch (e6) {
      fetcher = fetch_1.domFetch;
    }
    var sourcePeerId = rpc_1.RpcPeer.generateId();
    function once(socket, event) {
      return new Promise((resolve, reject) => {
        const err = (e7) => {
          cleanup();
          reject(e7);
        };
        const e6 = (...args) => {
          cleanup();
          resolve(args);
        };
        const cleanup = () => {
          socket.removeListener("error", err);
          socket.removeListener(event, e6);
        };
        socket.once("error", err);
        socket.once(event, e6);
      });
    }
    function isInstalledApp() {
      return globalThis.navigator?.userAgent.includes("InstalledApp");
    }
    function isRunningStandalone() {
      return globalThis.matchMedia?.("(display-mode: standalone)").matches || isInstalledApp();
    }
    async function logoutScryptedClient(baseUrl) {
      const url = combineBaseUrl(baseUrl, "logout");
      const response = await fetcher({
        url,
        withCredentials: true,
        responseType: "json",
        rejectUnauthorized: false
      });
      return response.body;
    }
    function getCurrentBaseUrl() {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";
      let endpointPath = window.location.pathname;
      const parts = endpointPath.split("/");
      const index = parts.findIndex((p3) => p3 === "endpoint");
      if (index === -1) {
        return void 0;
      }
      const keep = parts.slice(0, index);
      keep.push("");
      url.pathname = keep.join("/");
      return url.toString();
    }
    async function loginScryptedClient(options) {
      let { baseUrl, username, password, change_password, maxAge } = options;
      if (!maxAge && isRunningStandalone())
        maxAge = 365 * 24 * 60 * 60 * 1e3;
      const url = combineBaseUrl(baseUrl, "login");
      const response = await fetcher({
        url,
        body: {
          username,
          password,
          change_password,
          maxAge
        },
        rejectUnauthorized: false,
        withCredentials: true,
        responseType: "json"
      });
      if (response.statusCode !== 200)
        throw new Error("status " + response.statusCode);
      const { body } = response;
      return {
        error: body.error,
        authorization: body.authorization,
        queryToken: body.queryToken,
        token: body.token,
        addresses: body.addresses,
        externalAddresses: body.externalAddresses,
        hostname: body.hostname,
        // the cloud plugin will include this header.
        // should maybe move this into the cloud server itself.
        scryptedCloud: response.headers.get("x-scrypted-cloud") === "true",
        directAddress: response.headers.get("x-scrypted-direct-address"),
        cloudAddress: response.headers.get("x-scrypted-cloud-address"),
        serverId: response.headers.get("x-scrypted-server-id")
      };
    }
    async function checkScryptedClientLogin(options) {
      let { baseUrl } = options || {};
      let url = combineBaseUrl(baseUrl, "login");
      const headers = new Headers();
      if (options?.previousLoginResult?.queryToken) {
        const token = options?.previousLoginResult.username + ":" + options.previousLoginResult.token;
        const hash = Buffer.from(token).toString("base64");
        headers.set("Authorization", `Basic ${hash}`);
      }
      const response = await fetcher({
        url,
        withCredentials: true,
        headers,
        rejectUnauthorized: false,
        responseType: "json"
      });
      const { body } = response;
      return {
        baseUrl,
        hostname: body.hostname,
        redirect: body.redirect,
        username: body.username,
        expiration: body.expiration,
        hasLogin: !!body.hasLogin,
        error: body.error,
        authorization: body.authorization,
        queryToken: body.queryToken,
        token: body.token,
        addresses: body.addresses,
        externalAddresses: body.externalAddresses,
        // the cloud plugin will include this header.
        // should maybe move this into the cloud server itself.
        scryptedCloud: response.headers.get("x-scrypted-cloud") === "true",
        directAddress: response.headers.get("x-scrypted-direct-address"),
        cloudAddress: response.headers.get("x-scrypted-cloud-address"),
        serverId: response.headers.get("x-scrypted-server-id")
      };
    }
    var ScryptedClientLoginError = class extends Error {
      result;
      constructor(result) {
        super(result.error);
        this.result = result;
      }
    };
    exports.ScryptedClientLoginError = ScryptedClientLoginError;
    function redirectScryptedLogin(options) {
      let { baseUrl, redirect } = options || {};
      redirect = redirect || `/endpoint/@scrypted/core/public/`;
      if (baseUrl) {
        const url = new URL(redirect, baseUrl);
        url.searchParams.set("redirect_uri", window.location.href);
        redirect = url.toString();
      } else {
        redirect = `${redirect}?redirect_uri=${encodeURIComponent(window.location.href)}`;
      }
      const redirect_uri = redirect;
      console.log("redirect_uri", redirect_uri);
      globalThis.location.href = redirect_uri;
    }
    function combineBaseUrl(baseUrl, rootPath) {
      return baseUrl ? new URL(rootPath, baseUrl).toString() : "/" + rootPath;
    }
    async function redirectScryptedLogout(baseUrl) {
      globalThis.location.href = combineBaseUrl(baseUrl, "logout");
    }
    async function connectScryptedClient2(options) {
      const start = Date.now();
      let { baseUrl, pluginId, clientName, username, password } = options;
      let authorization;
      let queryToken;
      let localAddresses;
      let externalAddresses;
      let scryptedCloud;
      let directAddress;
      let cloudAddress;
      let hostname;
      let token;
      let serverId;
      console.log("@scrypted/client", package_json_1.default.version);
      const extraHeaders = {};
      const isChrome = globalThis.navigator?.userAgent.includes("Chrome");
      const isNotChromeOrIsInstalledApp = !isChrome || isInstalledApp();
      let tryAlternateAddresses = false;
      if (username && password) {
        const loginResult = await loginScryptedClient(options);
        if (loginResult.authorization)
          extraHeaders["Authorization"] = loginResult.authorization;
        localAddresses = loginResult.addresses;
        externalAddresses = loginResult.externalAddresses;
        scryptedCloud = loginResult.scryptedCloud;
        directAddress = loginResult.directAddress;
        cloudAddress = loginResult.cloudAddress;
        authorization = loginResult.authorization;
        queryToken = loginResult.queryToken;
        token = loginResult.token;
        hostname = loginResult.hostname;
        serverId = loginResult.serverId;
        console.log("login result", Date.now() - start, loginResult);
      } else {
        let validateLoginResult = function(loginCheck2) {
          if (loginCheck2.error || loginCheck2.redirect)
            throw new ScryptedClientLoginError(loginCheck2);
          if (!loginCheck2.authorization || !loginCheck2.username || !loginCheck2.queryToken) {
            console.error(loginCheck2);
            throw new Error("malformed login result");
          }
          return loginCheck2;
        };
        const urlsToCheck = /* @__PURE__ */ new Set();
        if (options?.previousLoginResult?.token) {
          for (const u3 of [
            ...options?.previousLoginResult?.localAddresses || [],
            options?.previousLoginResult?.directAddress
          ]) {
            if (u3 && (isNotChromeOrIsInstalledApp || options.direct))
              urlsToCheck.add(u3);
          }
          for (const u3 of [
            ...options?.previousLoginResult?.externalAddresses || [],
            options?.previousLoginResult?.cloudAddress
          ]) {
            if (u3)
              urlsToCheck.add(u3);
          }
        }
        const loginCheckPromises = [...urlsToCheck].map((baseUrl2) => {
          return checkScryptedClientLogin({
            baseUrl: baseUrl2,
            previousLoginResult: options?.previousLoginResult
          }).then(validateLoginResult);
        });
        const baseUrlCheck = checkScryptedClientLogin({
          baseUrl,
          previousLoginResult: options?.previousLoginResult
        }).then(validateLoginResult);
        loginCheckPromises.push(baseUrlCheck);
        let loginCheck;
        try {
          loginCheck = await Promise.any(loginCheckPromises);
          tryAlternateAddresses ||= loginCheck.baseUrl !== baseUrl;
        } catch (e6) {
          loginCheck = await baseUrlCheck;
        }
        if (tryAlternateAddresses)
          console.log("Found direct login. Allowing alternate addresses.");
        if (loginCheck.error || loginCheck.redirect)
          throw new ScryptedClientLoginError(loginCheck);
        localAddresses = loginCheck.addresses;
        externalAddresses = loginCheck.externalAddresses;
        scryptedCloud = loginCheck.scryptedCloud;
        directAddress = loginCheck.directAddress;
        cloudAddress = loginCheck.cloudAddress;
        username = loginCheck.username;
        authorization = loginCheck.authorization;
        queryToken = loginCheck.queryToken;
        token = loginCheck.token;
        hostname = loginCheck.hostname;
        serverId = loginCheck.serverId;
        console.log("login checked", Date.now() - start, loginCheck);
      }
      let socket;
      const eioPath = `endpoint/${pluginId}/engine.io/api`;
      const eioEndpoint = baseUrl ? new URL(eioPath, baseUrl).pathname : "/" + eioPath;
      const cacheBust = Math.random().toString(36).substring(3, 10);
      const eioOptions = {
        path: eioEndpoint,
        query: {
          cacheBust
        },
        withCredentials: true,
        extraHeaders,
        rejectUnauthorized: false,
        transports: options?.transports
      };
      const explicitBaseUrl = baseUrl || `${globalThis.location.protocol}//${globalThis.location.host}`;
      const addresses = [];
      const localAddressDefault = isNotChromeOrIsInstalledApp;
      tryAlternateAddresses ||= scryptedCloud;
      if ((tryAlternateAddresses && options.local === void 0 && localAddressDefault || options.local) && localAddresses) {
        addresses.push(...localAddresses);
      }
      const directAddressDefault = directAddress && (isNotChromeOrIsInstalledApp || !(0, ip_1.isIPAddress)(directAddress));
      if ((tryAlternateAddresses && options.direct === void 0 && directAddressDefault || options.direct) && directAddress) {
        addresses.push(directAddress);
      }
      if (tryAlternateAddresses && options.direct === void 0 || options.direct) {
        if (cloudAddress)
          addresses.push(cloudAddress);
        for (const externalAddress of externalAddresses || []) {
          addresses.push(externalAddress);
        }
      }
      const tryAddresses = !!addresses.length;
      console.log({
        tryLocalAddressess: tryAddresses
      });
      const localEioOptions = {
        ...eioOptions,
        extraHeaders: {
          ...eioOptions.extraHeaders
        }
      };
      localEioOptions.extraHeaders["Authorization"] ||= authorization;
      let sockets = [];
      const promises = [];
      if (tryAddresses) {
        for (const address2 of new Set(addresses)) {
          console.log("trying", address2);
          const check = new eio.Socket(address2, localEioOptions);
          sockets.push(check);
          promises.push((async () => {
            await once(check, "open");
            return {
              connectionType: "http-direct",
              ready: check,
              address: address2
            };
          })());
        }
      }
      const p2pPromises = [...promises];
      promises.push((async () => {
        const waitDuration = tryAddresses ? 1e3 : 0;
        console.log("waiting", waitDuration);
        if (waitDuration) {
          try {
            const any2 = Promise.any(p2pPromises);
            await (0, promise_utils_1.timeoutPromise)(waitDuration, any2);
            console.log("found direct connection, aborting scrypted cloud connection");
            return;
          } catch (e6) {
          }
        }
        const check = new eio.Socket(explicitBaseUrl, eioOptions);
        sockets.push(check);
        await once(check, "open");
        return {
          ready: check,
          address: explicitBaseUrl,
          connectionType: scryptedCloud ? "http-cloud" : "http"
        };
      })());
      const any = Promise.any(promises);
      let { ready, connectionType, address, rpcPeer } = await any;
      console.log("connected", connectionType, address);
      socket = ready;
      sockets = sockets.filter((s5) => s5 !== ready);
      sockets.forEach((s5) => {
        try {
          s5.close();
        } catch (e6) {
        }
      });
      try {
        if (!rpcPeer) {
          const serializer = (0, rpc_serializer_1.createRpcSerializer)({
            sendMessageBuffer: (buffer) => socket.send(buffer),
            sendMessageFinish: (message) => socket.send(JSON.stringify(message))
          });
          rpcPeer = new rpc_1.RpcPeer(clientName || "engine.io-client", "api", (message, reject, serializationContext) => {
            try {
              serializer.sendMessage(message, reject, serializationContext);
            } catch (e6) {
              reject?.(e6);
            }
          });
          socket.on("message", (data) => {
            if (data.constructor === Buffer || data.constructor === ArrayBuffer) {
              serializer.onMessageBuffer(Buffer.from(data));
            } else {
              serializer.onMessageFinish(JSON.parse(data));
            }
          });
          serializer.setupRpcPeer(rpcPeer);
        }
        const scrypted = await (0, plugin_remote_1.attachPluginRemote)(rpcPeer, void 0);
        const { serverVersion, systemManager, deviceManager, endpointManager, mediaManager, clusterManager } = scrypted;
        console.log("api attached", Date.now() - start);
        mediaManager.createMediaObject = async (data, mimeType, options2) => {
          return new mediaobject_1.MediaObject(mimeType, data, options2);
        };
        const [admin] = await Promise.all([
          (async () => {
            try {
              const info = await systemManager.getComponent("info");
              return !!info;
            } catch (e6) {
            }
            return false;
          })()
        ]);
        console.log("api initialized", Date.now() - start);
        const userDevice = Object.keys(systemManager.getSystemState()).map((id) => systemManager.getDeviceById(id)).find((device) => device.pluginId === "@scrypted/core" && device.nativeId === `user:${username}`);
        const clusterPeers = /* @__PURE__ */ new Map();
        const finalizationRegistry = new FinalizationRegistry((clusterPeer) => {
          clusterPeer.kill("object finalized");
        });
        const ensureClusterPeer = (clusterObject, connectRPCObjectOptions) => {
          if (!connectRPCObjectOptions?.dedicatedTransport) {
            let clusterPeerPromise2 = clusterPeers.get(clusterObject.port);
            if (clusterPeerPromise2)
              return clusterPeerPromise2;
          }
          const clusterPeerPromise = (async () => {
            const eioPath2 = "engine.io/connectRPCObject";
            const eioEndpoint2 = new URL(eioPath2, address).pathname;
            const clusterPeerOptions = {
              path: eioEndpoint2,
              query: {
                cacheBust,
                clusterObject: JSON.stringify(clusterObject),
                ...queryToken
              },
              withCredentials: true,
              extraHeaders,
              rejectUnauthorized: false,
              transports: options?.transports
            };
            const clusterPeerSocket = new eio.Socket(address, clusterPeerOptions);
            let peerReady = false;
            let receiveTimeout;
            let sendTimeout;
            let clusterPeer;
            const clearTimers = () => {
              if (receiveTimeout) {
                clearTimeout(receiveTimeout);
                receiveTimeout = void 0;
              }
              if (sendTimeout) {
                clearTimeout(sendTimeout);
                sendTimeout = void 0;
              }
            };
            const resetReceiveTimeout = connectRPCObjectOptions?.dedicatedTransport?.receiveTimeout ? () => {
              if (receiveTimeout) {
                clearTimeout(receiveTimeout);
              }
              receiveTimeout = setTimeout(() => {
                if (clusterPeer) {
                  clusterPeer.kill("receive timeout");
                }
              }, connectRPCObjectOptions.dedicatedTransport.receiveTimeout);
            } : void 0;
            const resetSendTimeout = connectRPCObjectOptions?.dedicatedTransport?.sendTimeout ? () => {
              if (sendTimeout) {
                clearTimeout(sendTimeout);
              }
              sendTimeout = setTimeout(() => {
                if (clusterPeer) {
                  clusterPeer.kill("send timeout");
                }
              }, connectRPCObjectOptions.dedicatedTransport.sendTimeout);
            } : void 0;
            clusterPeerSocket.on("close", () => {
              clusterPeer?.kill("socket closed");
              if (!connectRPCObjectOptions?.dedicatedTransport) {
                clusterPeers.delete(clusterObject.port);
              }
              if (!peerReady) {
                throw new Error("peer disconnected before setup completed");
              }
            });
            try {
              await once(clusterPeerSocket, "open");
              const serializer = (0, rpc_serializer_1.createRpcDuplexSerializer)({
                write: (data) => {
                  resetSendTimeout?.();
                  clusterPeerSocket.send(data);
                }
              });
              clusterPeerSocket.on("message", (data) => {
                resetReceiveTimeout?.();
                serializer.onData(Buffer.from(data));
              });
              clusterPeer = new rpc_1.RpcPeer(clientName || "engine.io-client", "cluster-proxy", (message, reject, serializationContext) => {
                try {
                  resetSendTimeout?.();
                  serializer.sendMessage(message, reject, serializationContext);
                } catch (e6) {
                  reject?.(e6);
                }
              });
              clusterPeer.killedSafe.finally(() => {
                clearTimers();
                clusterPeerSocket.close();
              });
              serializer.setupRpcPeer(clusterPeer);
              clusterPeer.tags.localPort = sourcePeerId;
              peerReady = true;
              resetReceiveTimeout?.();
              resetSendTimeout?.();
              return clusterPeer;
            } catch (e6) {
              clearTimers();
              console.error("failure ipc connect", e6);
              clusterPeerSocket.close();
              throw e6;
            }
          })();
          if (!connectRPCObjectOptions?.dedicatedTransport) {
            clusterPeers.set(clusterObject.port, clusterPeerPromise);
          }
          return clusterPeerPromise;
        };
        const resolveObject = async (proxyId, sourcePeerPort) => {
          const sourcePeer = await clusterPeers.get(sourcePeerPort);
          if (sourcePeer?.remoteWeakProxies) {
            return Object.values(sourcePeer.remoteWeakProxies).find((v2) => v2.deref()?.__cluster?.proxyId == proxyId)?.deref();
          }
          return null;
        };
        const connectRPCObject = async (value, options2) => {
          const clusterObject = value?.__cluster;
          if (!clusterObject) {
            return value;
          }
          const { port, proxyId } = clusterObject;
          const resolved = await resolveObject(proxyId, port);
          if (resolved) {
            return resolved;
          }
          try {
            const clusterPeerPromise = ensureClusterPeer(clusterObject, options2);
            const clusterPeer = await clusterPeerPromise;
            const connectRPCObject2 = await clusterPeer.getParam("connectRPCObject");
            try {
              const newValue = await connectRPCObject2(clusterObject);
              if (!newValue)
                throw new Error("ipc object not found?");
              if (options2?.dedicatedTransport) {
                finalizationRegistry.register(newValue, clusterPeer);
              }
              return newValue;
            } catch (e6) {
              if (options2?.dedicatedTransport) {
                clusterPeer.kill("connectRPCObject failed");
              }
              throw e6;
            }
          } catch (e6) {
            console.error("failure ipc", e6);
            return value;
          }
        };
        const ret = {
          userId: userDevice?.id,
          serverVersion,
          username,
          pluginRemoteAPI: void 0,
          address,
          connectionType,
          admin,
          systemManager,
          clusterManager,
          deviceManager,
          endpointManager,
          mediaManager,
          disconnect() {
            rpcPeer.kill("disconnect requested");
          },
          pluginHostAPI: void 0,
          rpcPeer,
          loginResult: {
            username,
            token,
            directAddress,
            localAddresses,
            externalAddresses,
            scryptedCloud,
            queryToken,
            authorization,
            cloudAddress,
            hostname,
            serverId
          },
          connectRPCObject,
          fork: void 0,
          connect: void 0
        };
        socket.on("close", () => {
          rpcPeer.kill("socket closed");
        });
        rpcPeer.killed.finally(() => {
          socket.close();
          ret.onClose?.();
        });
        return ret;
      } catch (e6) {
        socket.close();
        throw e6;
      }
    }
  }
});
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e6, o7) {
    if (this._$cssResult$ = true, o7 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e6;
  }
  get styleSheet() {
    let t5 = this.o;
    const s5 = this.t;
    if (e && void 0 === t5) {
      const e6 = void 0 !== s5 && 1 === s5.length;
      e6 && (t5 = o.get(s5)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s5, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e6) => {
  const o7 = 1 === t5.length ? t5[0] : e6.reduce((e7, s5, o8) => e7 + ((t6) => {
    if (true === t6._$cssResult$) return t6.cssText;
    if ("number" == typeof t6) return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s5) + t5[o8 + 1], t5[0]);
  return new n(o7, t5, s);
};
var S = (s5, o7) => {
  if (e) s5.adoptedStyleSheets = o7.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else for (const e6 of o7) {
    const o8 = document.createElement("style"), n6 = t.litNonce;
    void 0 !== n6 && o8.setAttribute("nonce", n6), o8.textContent = e6.cssText, s5.appendChild(o8);
  }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e6 = "";
  for (const s5 of t6.cssRules) e6 += s5.cssText;
  return r(e6);
})(t5) : t5;
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s5) => t5;
var u = { toAttribute(t5, s5) {
  switch (s5) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s5) {
  let i6 = t5;
  switch (s5) {
    case Boolean:
      i6 = null !== t5;
      break;
    case Number:
      i6 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i6 = JSON.parse(t5);
      } catch (t6) {
        i6 = null;
      }
  }
  return i6;
} };
var f = (t5, s5) => !i2(t5, s5);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s5 = b) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t5, s5), !s5.noAccessor) {
      const i6 = Symbol(), h5 = this.getPropertyDescriptor(t5, i6, s5);
      void 0 !== h5 && e2(this.prototype, t5, h5);
    }
  }
  static getPropertyDescriptor(t5, s5, i6) {
    const { get: e6, set: r6 } = h(this.prototype, t5) ?? { get() {
      return this[s5];
    }, set(t6) {
      this[s5] = t6;
    } };
    return { get: e6, set(s6) {
      const h5 = e6?.call(this);
      r6?.call(this, s6), this.requestUpdate(t5, h5, i6);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s5 = [...r2(t6), ...o2(t6)];
      for (const i6 of s5) this.createProperty(i6, t6[i6]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s5 = litPropertyMetadata.get(t5);
      if (void 0 !== s5) for (const [t6, i6] of s5) this.elementProperties.set(t6, i6);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s5] of this.elementProperties) {
      const i6 = this._$Eu(t6, s5);
      void 0 !== i6 && this._$Eh.set(i6, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s5) {
    const i6 = [];
    if (Array.isArray(s5)) {
      const e6 = new Set(s5.flat(1 / 0).reverse());
      for (const s6 of e6) i6.unshift(c(s6));
    } else void 0 !== s5 && i6.push(c(s5));
    return i6;
  }
  static _$Eu(t5, s5) {
    const i6 = s5.attribute;
    return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i6 of s5.keys()) this.hasOwnProperty(i6) && (t5.set(i6, this[i6]), delete this[i6]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s5, i6) {
    this._$AK(t5, i6);
  }
  _$ET(t5, s5) {
    const i6 = this.constructor.elementProperties.get(t5), e6 = this.constructor._$Eu(t5, i6);
    if (void 0 !== e6 && true === i6.reflect) {
      const h5 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s5, i6.type);
      this._$Em = t5, null == h5 ? this.removeAttribute(e6) : this.setAttribute(e6, h5), this._$Em = null;
    }
  }
  _$AK(t5, s5) {
    const i6 = this.constructor, e6 = i6._$Eh.get(t5);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t6 = i6.getPropertyOptions(e6), h5 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e6;
      const r6 = h5.fromAttribute(s5, t6.type);
      this[e6] = r6 ?? this._$Ej?.get(e6) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t5, s5, i6, e6 = false, h5) {
    if (void 0 !== t5) {
      const r6 = this.constructor;
      if (false === e6 && (h5 = this[t5]), i6 ??= r6.getPropertyOptions(t5), !((i6.hasChanged ?? f)(h5, s5) || i6.useDefault && i6.reflect && h5 === this._$Ej?.get(t5) && !this.hasAttribute(r6._$Eu(t5, i6)))) return;
      this.C(t5, s5, i6);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t5, s5, { useDefault: i6, reflect: e6, wrapped: h5 }, r6) {
    i6 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t5) && (this._$Ej.set(t5, r6 ?? s5 ?? this[t5]), true !== h5 || void 0 !== r6) || (this._$AL.has(t5) || (this.hasUpdated || i6 || (s5 = void 0), this._$AL.set(t5, s5)), true === e6 && this._$Em !== t5 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t5));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t7, s6] of this._$Ep) this[t7] = s6;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0) for (const [s6, i6] of t6) {
        const { wrapped: t7 } = i6, e6 = this[s6];
        true !== t7 || this._$AL.has(s6) || void 0 === e6 || this.C(s6, void 0, i6, e6);
      }
    }
    let t5 = false;
    const s5 = this._$AL;
    try {
      t5 = this.shouldUpdate(s5), t5 ? (this.willUpdate(s5), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s5)) : this._$EM();
    } catch (s6) {
      throw t5 = false, this._$EM(), s6;
    }
    t5 && this._$AE(s5);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Eq &&= this._$Eq.forEach((t6) => this._$ET(t6, this[t6])), this._$EM();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
var t2 = globalThis;
var i3 = (t5) => t5;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u2 = Array.isArray;
var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t5) => (i6, ...s5) => ({ _$litType$: t5, strings: i6, values: s5 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t5, i6) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i6) : i6;
}
var N = (t5, i6) => {
  const s5 = t5.length - 1, e6 = [];
  let n6, l3 = 2 === i6 ? "<svg>" : 3 === i6 ? "<math>" : "", c5 = v;
  for (let i7 = 0; i7 < s5; i7++) {
    const s6 = t5[i7];
    let a3, u3, d3 = -1, f4 = 0;
    for (; f4 < s6.length && (c5.lastIndex = f4, u3 = c5.exec(s6), null !== u3); ) f4 = c5.lastIndex, c5 === v ? "!--" === u3[1] ? c5 = _ : void 0 !== u3[1] ? c5 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n6 = RegExp("</" + u3[2], "g")), c5 = p2) : void 0 !== u3[3] && (c5 = p2) : c5 === p2 ? ">" === u3[0] ? (c5 = n6 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c5.lastIndex - u3[2].length, a3 = u3[1], c5 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n6 = void 0);
    const x2 = c5 === p2 && t5[i7 + 1].startsWith("/>") ? " " : "";
    l3 += c5 === v ? s6 + r3 : d3 >= 0 ? (e6.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i7 : x2);
  }
  return [V(t5, l3 + (t5[s5] || "<?>") + (2 === i6 ? "</svg>" : 3 === i6 ? "</math>" : "")), e6];
};
var S2 = class _S {
  constructor({ strings: t5, _$litType$: i6 }, e6) {
    let r6;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t5.length - 1, d3 = this.parts, [f4, v2] = N(t5, i6);
    if (this.el = _S.createElement(f4, e6), P.currentNode = this.el.content, 2 === i6 || 3 === i6) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t6 of r6.getAttributeNames()) if (t6.endsWith(h2)) {
          const i7 = v2[a3++], s5 = r6.getAttribute(t6).split(o3), e7 = /([.?@])?(.*)/.exec(i7);
          d3.push({ type: 1, index: l3, name: e7[2], strings: s5, ctor: "." === e7[1] ? I : "?" === e7[1] ? L : "@" === e7[1] ? z : H }), r6.removeAttribute(t6);
        } else t6.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t6));
        if (y2.test(r6.tagName)) {
          const t6 = r6.textContent.split(o3), i7 = t6.length - 1;
          if (i7 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s5 = 0; s5 < i7; s5++) r6.append(t6[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r6.append(t6[i7], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t6 = -1;
        for (; -1 !== (t6 = r6.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l3 }), t6 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t5, i6) {
    const s5 = l2.createElement("template");
    return s5.innerHTML = t5, s5;
  }
};
function M(t5, i6, s5 = t5, e6) {
  if (i6 === E) return i6;
  let h5 = void 0 !== e6 ? s5._$Co?.[e6] : s5._$Cl;
  const o7 = a2(i6) ? void 0 : i6._$litDirective$;
  return h5?.constructor !== o7 && (h5?._$AO?.(false), void 0 === o7 ? h5 = void 0 : (h5 = new o7(t5), h5._$AT(t5, s5, e6)), void 0 !== e6 ? (s5._$Co ??= [])[e6] = h5 : s5._$Cl = h5), void 0 !== h5 && (i6 = M(t5, h5._$AS(t5, i6.values), h5, e6)), i6;
}
var R = class {
  constructor(t5, i6) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i6 }, parts: s5 } = this._$AD, e6 = (t5?.creationScope ?? l2).importNode(i6, true);
    P.currentNode = e6;
    let h5 = P.nextNode(), o7 = 0, n6 = 0, r6 = s5[0];
    for (; void 0 !== r6; ) {
      if (o7 === r6.index) {
        let i7;
        2 === r6.type ? i7 = new k(h5, h5.nextSibling, this, t5) : 1 === r6.type ? i7 = new r6.ctor(h5, r6.name, r6.strings, this, t5) : 6 === r6.type && (i7 = new Z(h5, this, t5)), this._$AV.push(i7), r6 = s5[++n6];
      }
      o7 !== r6?.index && (h5 = P.nextNode(), o7++);
    }
    return P.currentNode = l2, e6;
  }
  p(t5) {
    let i6 = 0;
    for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t5, s5, i6), i6 += s5.strings.length - 2) : s5._$AI(t5[i6])), i6++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i6, s5, e6) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s5, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === t5?.nodeType && (t5 = i6.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i6 = this) {
    t5 = M(this, t5, i6), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
  }
  O(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
  }
  _(t5) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
  }
  $(t5) {
    const { values: i6, _$litType$: s5 } = t5, e6 = "number" == typeof s5 ? this._$AC(t5) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e6) this._$AH.p(i6);
    else {
      const t6 = new R(e6, this), s6 = t6.u(this.options);
      t6.p(i6), this.T(s6), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i6 = C.get(t5.strings);
    return void 0 === i6 && C.set(t5.strings, i6 = new S2(t5)), i6;
  }
  k(t5) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s5, e6 = 0;
    for (const h5 of t5) e6 === i6.length ? i6.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i6[e6], s5._$AI(h5), e6++;
    e6 < i6.length && (this._$AR(s5 && s5._$AB.nextSibling, e6), i6.length = e6);
  }
  _$AR(t5 = this._$AA.nextSibling, s5) {
    for (this._$AP?.(false, true, s5); t5 !== this._$AB; ) {
      const s6 = i3(t5).nextSibling;
      i3(t5).remove(), t5 = s6;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i6, s5, e6, h5) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e6, this.options = h5, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
  }
  _$AI(t5, i6 = this, s5, e6) {
    const h5 = this.strings;
    let o7 = false;
    if (void 0 === h5) t5 = M(this, t5, i6, 0), o7 = !a2(t5) || t5 !== this._$AH && t5 !== E, o7 && (this._$AH = t5);
    else {
      const e7 = t5;
      let n6, r6;
      for (t5 = h5[0], n6 = 0; n6 < h5.length - 1; n6++) r6 = M(this, e7[s5 + n6], i6, n6), r6 === E && (r6 = this._$AH[n6]), o7 ||= !a2(r6) || r6 !== this._$AH[n6], r6 === A ? t5 = A : t5 !== A && (t5 += (r6 ?? "") + h5[n6 + 1]), this._$AH[n6] = r6;
    }
    o7 && !e6 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
  }
};
var z = class extends H {
  constructor(t5, i6, s5, e6, h5) {
    super(t5, i6, s5, e6, h5), this.type = 5;
  }
  _$AI(t5, i6 = this) {
    if ((t5 = M(this, t5, i6, 0) ?? A) === E) return;
    const s5 = this._$AH, e6 = t5 === A && s5 !== A || t5.capture !== s5.capture || t5.once !== s5.once || t5.passive !== s5.passive, h5 = t5 !== A && (s5 === A || e6);
    e6 && this.element.removeEventListener(this.name, this, s5), h5 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z = class {
  constructor(t5, i6, s5) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    M(this, t5);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t5, i6, s5) => {
  const e6 = s5?.renderBefore ?? i6;
  let h5 = e6._$litPart$;
  if (void 0 === h5) {
    const t6 = s5?.renderBefore ?? null;
    e6._$litPart$ = h5 = new k(i6.insertBefore(c3(), t6), t6, void 0, s5 ?? {});
  }
  return h5._$AI(t5), h5;
};
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t5 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t5.firstChild, t5;
  }
  update(t5) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.2");
var RULES = {
  feeding: { domain: "binary_sensor", translationKeys: ["feeding"], idSuffixes: ["_feeding"] },
  bowlFill1: { domain: "sensor", translationKeys: ["bowl_fill_1"], idSuffixes: ["_bowl_fill_1", "_bowl_fill_hopper_1"] },
  bowlFill2: { domain: "sensor", translationKeys: ["bowl_fill_2"], idSuffixes: ["_bowl_fill_2", "_bowl_fill_hopper_2"] },
  desiccantDays: { domain: "sensor", translationKeys: ["desiccant_days", "desiccant_left"], idSuffixes: ["_desiccant_days", "_desiccant_left"] },
  schedule: { domain: "sensor", translationKeys: ["schedule"], idSuffixes: ["_schedule"] },
  scheduleCardState: { domain: "sensor", translationKeys: ["schedule_card_state"], idSuffixes: ["_schedule_card_state"] },
  feedButton: { domain: "button", translationKeys: ["feed"], idSuffixes: ["_feed"] },
  feedButtonHopper1: { domain: "button", translationKeys: ["feed_hopper_1"], idSuffixes: ["_feed_hopper_1"] },
  feedButtonHopper2: { domain: "button", translationKeys: ["feed_hopper_2"], idSuffixes: ["_feed_hopper_2"] },
  cancelFeedButton: { domain: "button", translationKeys: ["cancel_feed"], idSuffixes: ["_cancel_feed"] },
  feedAmount: { domain: "number", translationKeys: ["feed_amount"], idSuffixes: ["_feed_amount"] },
  feedAmountHopper1: { domain: "number", translationKeys: ["feed_amount_hopper_1"], idSuffixes: ["_feed_amount_hopper_1"] },
  feedAmountHopper2: { domain: "number", translationKeys: ["feed_amount_hopper_2"], idSuffixes: ["_feed_amount_hopper_2"] },
  cloudSwitch: { domain: "switch", translationKeys: ["cloud", "petkit_cloud"], idSuffixes: ["_cloud", "_petkit_cloud"] },
  cloudConnection: { domain: "sensor", translationKeys: ["cloud_connection"], idSuffixes: ["_cloud_connection"] },
  nightVisionSwitch: { domain: "switch", translationKeys: ["night", "night_vision"], idSuffixes: ["_night", "_night_vision"] },
  statusLedSwitch: { domain: "switch", translationKeys: ["light", "status_led"], idSuffixes: ["_light", "_status_led"] },
  microphoneSwitch: { domain: "switch", translationKeys: ["microphone"], idSuffixes: ["_microphone"] },
  volume: { domain: "number", translationKeys: ["volume"], idSuffixes: ["_volume"] },
  lastSeenPet: { domain: "sensor", translationKeys: ["last_seen_pet"], idSuffixes: ["_last_seen_pet"] },
  dishBefore: { domain: "image", translationKeys: ["dish_before"], idSuffixes: ["_dish_before"] },
  dishAfter: { domain: "image", translationKeys: ["dish_after"], idSuffixes: ["_dish_after"] },
  wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] },
  lastDetection: { domain: "sensor", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionsToday: { domain: "sensor", translationKeys: ["detections_today"], idSuffixes: ["_detections_today"] },
  lastDetectionImage: { domain: "image", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  pendingFace: { domain: "image", translationKeys: ["pending_face"], idSuffixes: ["_pending_face"] }
};
function domainOf(entityId) {
  return entityId.slice(0, entityId.indexOf("."));
}
function objectIdOf(entityId) {
  return entityId.slice(entityId.indexOf(".") + 1);
}
function matchesRule(entry2, rule) {
  if (domainOf(entry2.entity_id) !== rule.domain) return false;
  if (entry2.translation_key && rule.translationKeys.includes(entry2.translation_key)) return true;
  const objectId = objectIdOf(entry2.entity_id);
  return rule.idSuffixes.some((suffix) => objectId.endsWith(suffix));
}
function catDisplayName(entry2) {
  const raw = entry2.name ?? entry2.original_name;
  if (raw) {
    return raw.replace(/\s+present$/i, "").trim() || raw;
  }
  const objectId = objectIdOf(entry2.entity_id);
  const slug = objectId.replace(/_present$/, "");
  const lastWord = slug.split("_").filter(Boolean).pop();
  if (!lastWord) return "Cat";
  return lastWord[0].toUpperCase() + lastWord.slice(1);
}
function isCatPresenceEntry(entry2) {
  if (domainOf(entry2.entity_id) !== "binary_sensor") return false;
  if (entry2.translation_key === "present" || entry2.translation_key?.endsWith("_present")) return true;
  return objectIdOf(entry2.entity_id).endsWith("_present");
}
function resolveKibbleEntities(entities, deviceId) {
  const result = { deviceId, catPresence: [] };
  const forDevice = Object.values(entities).filter(
    (e6) => e6.device_id === deviceId && !e6.disabled_by
  );
  for (const entry2 of forDevice) {
    if (domainOf(entry2.entity_id) === "camera" && !result.camera) {
      result.camera = entry2.entity_id;
      continue;
    }
    if (domainOf(entry2.entity_id) === "media_player" && !result.speaker) {
      result.speaker = entry2.entity_id;
      continue;
    }
    if (isCatPresenceEntry(entry2)) {
      result.catPresence.push({ entityId: entry2.entity_id, name: catDisplayName(entry2) });
      continue;
    }
    for (const roleEntry of Object.entries(RULES)) {
      const [role, rule] = roleEntry;
      if (result[role]) continue;
      if (matchesRule(entry2, rule)) {
        result[role] = entry2.entity_id;
        break;
      }
    }
  }
  result.catPresence.sort((a3, b3) => a3.name.localeCompare(b3.name));
  return result;
}
function resolveEntryId(devices, deviceId) {
  if (!deviceId) return void 0;
  return devices[deviceId]?.config_entries?.[0];
}
function deriveFeederStatus(coreStates, feedingState) {
  const isDown = (state2) => state2 === void 0 || state2 === "unavailable" || state2 === "unknown";
  if (coreStates.length === 0 || coreStates.every(isDown)) {
    return "unreachable";
  }
  return feedingState === "on" ? "dispensing" : "idle";
}
function statusText(status, lastFedRelative) {
  if (status === "unreachable") return "Feeder unreachable \u2014 check that kibbled is running";
  if (status === "dispensing") return "Dispensing\u2026";
  return lastFedRelative ? `Fed ${lastFedRelative}` : "Ready to feed";
}
function relativeElapsed(from, now) {
  const diffMinutes = Math.floor(Math.max(0, now.getTime() - from.getTime()) / 6e4);
  if (diffMinutes < 1) return { unit: "now", value: 0 };
  if (diffMinutes < 60) return { unit: "minutes", value: diffMinutes };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return { unit: "hours", value: diffHours };
  return { unit: "days", value: Math.floor(diffHours / 24) };
}
function relativeTimeSentence(from, now) {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const word = elapsed.unit === "minutes" ? "min" : elapsed.unit === "hours" ? "h" : "d";
  return `${elapsed.value} ${word} ago`;
}
var INITIAL_STATE = { data: null, error: null, loading: false };
var WsQuery = class {
  constructor(onChange) {
    this._lastWatched = null;
    this._requestId = 0;
    this._state = INITIAL_STATE;
    this._onChange = onChange;
  }
  get state() {
    return this._state;
  }
  /** Call every `willUpdate`. `watchKey` (see `watchKey()` below) encodes every entity this
   * query cares about; a change refetches, an unchanged key is a no-op so a query never re-runs
   * on every unrelated re-render. */
  sync(watchKey2, run) {
    if (watchKey2 === this._lastWatched) return;
    this._lastWatched = watchKey2;
    this.refresh(run);
  }
  /** Force a refetch regardless of the watch key -- a manual retry/refresh action. */
  refresh(run) {
    const requestId = ++this._requestId;
    this._state = { ...this._state, loading: true, error: null };
    this._onChange();
    run().then(
      (data) => {
        if (requestId !== this._requestId) return;
        this._state = { data, error: null, loading: false };
        this._onChange();
      },
      (err) => {
        if (requestId !== this._requestId) return;
        this._state = { ...this._state, error: describeWsError(err), loading: false };
        this._onChange();
      }
    );
  }
};
function watchKey(hass, entityIds) {
  return entityIds.filter((id) => Boolean(id)).map((id) => `${id}=${hass.states[id]?.state ?? ""}`).join("|");
}
function describeWsError(err) {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const message = err.message;
    if (typeof message === "string" && message) return message;
  }
  return "Something went wrong.";
}
var MDI = {
  cog: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
  cloudCheck: "M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z",
  cloudLock: "M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z",
  cloudAlert: "M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z",
  cloudQuestion: "M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z",
  airFilter: "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",
  wifi: "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  chevronDown: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  weatherNight: "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
  ledOn: "M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",
  microphone: "M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",
  microphoneOff: "M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",
  volumeOff: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",
  volumeHigh: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  openInNew: "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",
  speaker: "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",
  refresh: "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
};
function mdiIcon(name) {
  return w`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${MDI[name]}></path></svg>`;
}
var KIOSK_MIN_HEIGHT_PX = 440;
var HOLD_TO_FEED_MS = 600;
var KIBBLE_FALL_DURATION_MS = 900;
var KIBBLE_AMBER = "#F4A452";
var KIBBLE_AMBER_DARK = "#DE8A3A";
var KIBBLE_INK_ON_AMBER = "#3A2C28";
var KIBBLE_LIVE = "#E5484D";
var CAT_PALETTE = ["#3FA7A0", "#9A5B9E", "#7FA05A", "#4F86C6"];
function catColorAt(colorIndex) {
  const n6 = CAT_PALETTE.length;
  return CAT_PALETTE[(colorIndex % n6 + n6) % n6];
}
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
var EQUAL_FILL_THRESHOLD = 5;
function combineBowlFill(hopper1, hopper2) {
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
var VIEW_W = 240;
var VIEW_H = 150;
var CX = 120;
var RIM_Y = 40;
var RIM_X = 14;
var RIM_W = VIEW_W - RIM_X * 2;
var RIM_H = 16;
var FOOT_Y = 128;
var FOOT_X = 46;
var FOOT_W = VIEW_W - FOOT_X * 2;
var CAV_TOP = RIM_Y + 6;
var CAV_BOTTOM = 112;
var CAV_INSET = 22;
var DIVIDER_W = 8;
var TEXTURE_STEP = 9;
var SCATTER = [-0.5, -0.2, 0.1, 0.4, -0.35, 0.25, 0];
function cloverPiece(x2, y3, r6, rotationDeg) {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = (angle + rotationDeg) * Math.PI / 180;
    return w`<circle cx=${(x2 + Math.cos(rad) * r6 * 0.55).toFixed(1)} cy=${(y3 + Math.sin(rad) * r6 * 0.55).toFixed(1)} r=${(r6 * 0.62).toFixed(1)} />`;
  });
  return w`<g>${lobes}</g>`;
}
function dishPath() {
  const r6 = 10;
  const left = RIM_X;
  const right = RIM_X + RIM_W;
  const fl = FOOT_X;
  const fr = FOOT_X + FOOT_W;
  return [
    `M ${left + r6} ${RIM_Y}`,
    `H ${right - r6}`,
    `q ${r6} 0 ${r6} ${r6}`,
    `L ${fr + 4} ${FOOT_Y - r6}`,
    `q ${-2} ${r6} ${-r6 - 2} ${r6}`,
    `H ${fl + r6 - 2}`,
    `q ${-r6} 0 ${-r6 - 2} ${-r6}`,
    `L ${left} ${RIM_Y + r6}`,
    `q 0 ${-r6} ${r6} ${-r6}`,
    "Z"
  ].join(" ");
}
function cavityPath(x0, x1) {
  const r6 = 12;
  const taper = 8;
  return [
    `M ${x0} ${CAV_TOP}`,
    `H ${x1}`,
    `L ${x1 - taper} ${CAV_BOTTOM - r6}`,
    `q 0 ${r6} ${-r6} ${r6}`,
    `H ${x0 + taper + r6}`,
    `q ${-r6} 0 ${-r6} ${-r6}`,
    "Z"
  ].join(" ");
}
var KibbleBowl = class extends i4 {
  constructor() {
    super();
    this._wasFeeding = false;
    this._dropping = false;
    this.hopper1 = null;
    this.hopper2 = null;
    this.feeding = false;
  }
  static {
    this.properties = {
      hopper1: { type: Number },
      hopper2: { type: Number },
      feeding: { type: Boolean }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }
  willUpdate(changed) {
    if (changed.has("feeding")) {
      if (this.feeding && !this._wasFeeding && !prefersReducedMotion()) {
        this._dropping = true;
        clearTimeout(this._dropTimer);
        this._dropTimer = setTimeout(() => {
          this._dropping = false;
          this.requestUpdate();
        }, KIBBLE_FALL_DURATION_MS);
      }
      this._wasFeeding = this.feeding;
    }
  }
  render() {
    const display = combineBowlFill(this.hopper1, this.hopper2);
    const label = display.split ? `Bowl side 1 ${Math.round(display.hopper1)}%, side 2 ${Math.round(display.hopper2)}%` : display.combined == null ? "Bowl level unknown" : `Bowl ${Math.round(display.combined)}% full`;
    const inner0 = RIM_X + CAV_INSET;
    const inner1 = RIM_X + RIM_W - CAV_INSET;
    const cavities = display.split ? [
      { x0: inner0, x1: CX - DIVIDER_W / 2, mark: "01", fraction: display.hopper1 / 100 },
      { x0: CX + DIVIDER_W / 2, x1: inner1, mark: "02", fraction: display.hopper2 / 100 }
    ] : [{ x0: inner0, x1: inner1, mark: null, fraction: display.combined == null ? null : display.combined / 100 }];
    return b2`
      <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label=${label} preserveAspectRatio="xMidYMid meet">
        <title>${label}</title>
        <defs>
          <linearGradient id="silo-body" x1="0" x2="1">
            <stop offset="0" stop-color="var(--silo-shade)" />
            <stop offset="0.18" stop-color="var(--silo-light)" />
            <stop offset="0.62" stop-color="var(--silo-mid)" />
            <stop offset="1" stop-color="var(--silo-dark)" />
          </linearGradient>
          <linearGradient id="silo-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-light)" />
            <stop offset="1" stop-color="var(--silo-shade)" />
          </linearGradient>
          <linearGradient id="silo-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--silo-glass-edge)" />
            <stop offset="1" stop-color="var(--silo-glass)" />
          </linearGradient>
          <linearGradient id="silo-food" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--kibble-amber)" />
            <stop offset="1" stop-color="var(--kibble-amber-dark)" />
          </linearGradient>
          <filter id="silo-inner" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter>
          ${cavities.map((c5, i6) => w`<clipPath id=${`silo-win-${i6}`}><path d=${cavityPath(c5.x0, c5.x1)} /></clipPath>`)}
        </defs>
        <path class="body" d=${dishPath()} />
        <rect class="cap" x=${RIM_X} y=${RIM_Y} width=${RIM_W} height=${RIM_H} rx="8" />
        <rect class="cap-highlight" x=${RIM_X + 8} y=${RIM_Y + 4} width=${RIM_W - 16} height="4" rx="2" />
        <path class="body-edge" d=${dishPath()} />
        ${cavities.map((c5, i6) => this._renderCavity(c5, i6))}
        ${this._dropping ? this._renderFallingKibble() : A}
      </svg>
    `;
  }
  /** One cavity: recessed dark interior with an inner shadow, the level clipped to it with a
   * kibble texture and a surface highlight (nothing at zero — an empty bowl is an empty cavity,
   * not a sliver), and the printed mark on the rim above. A `null` fraction means the feeder has
   * no reading (kibble docs/34): the cavity shows a "?" rather than reading as empty, which is
   * the difference between "I don't know" and "your cat has no food". */
  _renderCavity(c5, i6) {
    const clip = `url(#silo-win-${i6})`;
    const w2 = c5.x1 - c5.x0;
    const markX = c5.x0 + w2 / 2;
    if (c5.fraction == null) {
      return w`
        <g>
          <path class="glass" d=${cavityPath(c5.x0, c5.x1)} />
          <text class="unknown" x=${markX} y=${(CAV_TOP + CAV_BOTTOM) / 2 + 2} text-anchor="middle" dominant-baseline="central">?</text>
          ${c5.mark ? w`<text class="mark" x=${markX} y=${RIM_Y + 11} text-anchor="middle">${c5.mark}</text>` : A}
        </g>
      `;
    }
    const fraction = Math.max(0, Math.min(1, c5.fraction));
    const top = CAV_BOTTOM - (CAV_BOTTOM - CAV_TOP) * fraction;
    const dots = [];
    if (fraction > 0) {
      let row = 0;
      for (let y3 = top + 6; y3 < CAV_BOTTOM; y3 += TEXTURE_STEP, row += 1) {
        const cols = Math.max(1, Math.floor(w2 / 14));
        for (let k2 = 0; k2 < cols; k2 += 1) {
          const x2 = c5.x0 + 7 + k2 * 14 + (row % 2 === 0 ? 0 : 7);
          if (x2 < c5.x1 - 6) dots.push(w`<circle cx=${x2.toFixed(1)} cy=${y3.toFixed(1)} r="2.6" />`);
        }
      }
    }
    return w`
      <g>
        <path class="glass" d=${cavityPath(c5.x0, c5.x1)} />
        <g clip-path=${clip}>
          <rect class="glass-inner" x=${c5.x0 - 2} y=${CAV_TOP - 8} width=${w2 + 4} height=${CAV_BOTTOM - CAV_TOP + 4} filter="url(#silo-inner)" />
          ${fraction > 0 ? w`
                <rect class="fill" x=${c5.x0} y=${top} width=${w2} height=${CAV_BOTTOM - top + 2} />
                <g class="texture">${dots}</g>
                <rect class="fill-surface" x=${c5.x0} y=${top} width=${w2} height="2" />
              ` : A}
        </g>
        ${c5.mark ? w`<text class="mark" x=${markX} y=${RIM_Y + 11} text-anchor="middle">${c5.mark}</text>` : A}
      </g>
    `;
  }
  _renderFallingKibble() {
    const pieces = SCATTER.map((t5, i6) => {
      const x2 = CX + t5 * 40;
      const delayMs = i6 * 70;
      const durationMs = 380;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t5 * 180).toFixed(0)}deg;--fall-to:34px;`;
      return w`<g class="drop" style=${style}>${cloverPiece(x2, 6, 6, t5 * 60)}</g>`;
    });
    return w`<g class="drops">${pieces}</g>`;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      height: 100%;
      /* The plastic: the card background lifted toward the text colour in four steps, so the
       * lit face, the mid tone, the turned edges and the rim all come from the theme. */
      --silo-base: var(--card-background-color, var(--ha-card-background, #fff));
      --silo-ink: var(--primary-text-color, #222);
      --silo-light: color-mix(in srgb, var(--silo-base) 78%, var(--silo-ink));
      --silo-mid: color-mix(in srgb, var(--silo-base) 84%, var(--silo-ink));
      --silo-shade: color-mix(in srgb, var(--silo-base) 68%, var(--silo-ink));
      --silo-dark: color-mix(in srgb, var(--silo-base) 58%, var(--silo-ink));
      /* The cavity is the bowl's interior: always darker than the plastic, in both themes, so
       * the level reads as something inside the dish. */
      --silo-glass: color-mix(in srgb, var(--silo-base) 40%, #000);
      --silo-glass-edge: color-mix(in srgb, var(--silo-base) 52%, #000);
    }
    .art {
      display: block;
      width: auto;
      max-width: var(--kibble-bowl-max-width, 190px);
      height: 100%;
      max-height: 100%;
      aspect-ratio: ${VIEW_W} / ${VIEW_H};
      margin: 0 auto;
      overflow: visible;
    }
    .body {
      fill: url(#silo-body);
    }
    /* On a light card the near-white plastic needs an edge to read as an object; on a dark
     * card the same 0.14 alpha of the text colour is invisible, which is the point. */
    .body-edge {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-opacity: 0.14;
      stroke-width: 1;
    }
    .cap {
      fill: url(#silo-cap);
    }
    .cap-highlight {
      fill: var(--silo-ink);
      opacity: 0.16;
    }
    .glass {
      fill: url(#silo-glass);
    }
    .glass-inner {
      fill: #000;
      opacity: 0.35;
    }
    .fill {
      fill: url(#silo-food);
      transition: y 500ms cubic-bezier(0.2, 0.8, 0.2, 1), height 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .texture circle {
      fill: var(--kibble-amber-dark);
      opacity: 0.55;
    }
    .fill-surface {
      fill: #fff;
      opacity: 0.5;
    }
    .unknown {
      /* Same ink as the printed rim marks, just larger: legible against the dark cavity in
       * either theme, still clearly a label rather than a level. */
      fill: var(--secondary-text-color, var(--primary-text-color));
      font-size: 36px;
      font-weight: 700;
      opacity: 0.6;
    }
    .mark {
      fill: var(--secondary-text-color, var(--primary-text-color));
      opacity: 0.7;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.14em;
      font-family: inherit;
    }
    .drops circle {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) both;
    }
    @keyframes kibble-drop {
      from {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      to {
        transform: translateY(var(--fall-to)) rotate(var(--fall-rotate));
        opacity: 0;
      }
    }
  `;
  }
};
customElements.define("kibble-bowl", KibbleBowl);
var QUICK_VALUES = [1, 2, 3, 4, 5];
var KibbleSegmentedPicker = class extends i4 {
  static {
    this.properties = {
      value: { type: Number },
      disabled: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.value = 1;
    this.disabled = false;
  }
  render() {
    return b2`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${QUICK_VALUES.map(
      (portion) => b2`
            <button
              type="button"
              role="radio"
              aria-checked=${portion === this.value}
              class="segment ${portion === this.value ? "selected" : ""}"
              ?disabled=${this.disabled}
              @click=${() => this._select(portion)}
            >
              ${portion}
            </button>
          `
    )}
      </div>
    `;
  }
  _select(portion) {
    this.dispatchEvent(new CustomEvent("portion-selected", { detail: { value: portion }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .segments {
      display: flex;
      gap: 6px;
    }
    .segment {
      flex: 1 1 0;
      min-width: var(--kibble-touch-target, 48px);
      min-height: var(--kibble-touch-target, 48px);
      /* Pill radius and a soft translucent surface instead of a 2px outline: the convention
         Mushroom/Bubble-style dashboards settled on, and it stops a row of five segments
         reading as a table of boxes. */
      border-radius: 999px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.1;
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-segmented-picker", KibbleSegmentedPicker);
var KibbleStepper = class extends i4 {
  static {
    this.properties = {
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      disabled: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.value = 1;
    this.min = 1;
    this.max = 20;
    this.step = 1;
    this.disabled = false;
  }
  render() {
    return b2`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${this.disabled || this.value <= this.min} @click=${this._decrement} aria-label="Fewer portions">
          &minus;
        </button>
        <span class="value">${this.value}</span>
        <button type="button" class="step-btn" ?disabled=${this.disabled || this.value >= this.max} @click=${this._increment} aria-label="More portions">
          &plus;
        </button>
      </div>
    `;
  }
  _decrement() {
    this._emit(Math.max(this.min, this.value - this.step));
  }
  _increment() {
    this._emit(Math.min(this.max, this.value + this.step));
  }
  _emit(value) {
    this.dispatchEvent(new CustomEvent("value-selected", { detail: { value }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .step-btn {
      width: var(--kibble-touch-target, 48px);
      height: var(--kibble-touch-target, 48px);
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      flex: none;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-btn:focus-visible {
      outline: 2px solid var(--kibble-amber-dark);
      outline-offset: 2px;
    }
    .value {
      min-width: 1.6em;
      text-align: center;
      font-size: var(--kibble-segment-size, 16px);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
    }
  `;
  }
};
customElements.define("kibble-stepper", KibbleStepper);
var KibbleHoldButton = class extends i4 {
  constructor() {
    super();
    this._holding = false;
    this._holdTimer = void 0;
    this._startHold = (event) => {
      if (this.disabled) return;
      event.preventDefault();
      this._holding = true;
      this.requestUpdate();
      clearTimeout(this._holdTimer);
      this._holdTimer = setTimeout(() => {
        this._holding = false;
        this.requestUpdate();
        this._activate();
      }, this.holdMs);
    };
    this._cancelHold = () => {
      clearTimeout(this._holdTimer);
      if (this._holding) {
        this._holding = false;
        this.requestUpdate();
      }
    };
    this.label = "Hold to feed";
    this.variant = "feed";
    this.disabled = false;
    this.holdMs = HOLD_TO_FEED_MS;
  }
  static {
    this.properties = {
      label: { type: String },
      variant: { type: String },
      disabled: { type: Boolean },
      holdMs: { type: Number, attribute: "hold-ms" }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._holdTimer);
  }
  render() {
    return b2`
      <button
        type="button"
        class="button ${this.variant} ${this._holding ? "holding" : ""}"
        ?disabled=${this.disabled}
        style=${this.variant === "feed" ? `--hold-ms: ${this.holdMs}ms` : ""}
        @pointerdown=${this.variant === "feed" ? this._startHold : void 0}
        @pointerup=${this.variant === "feed" ? this._cancelHold : void 0}
        @pointerleave=${this.variant === "feed" ? this._cancelHold : void 0}
        @pointercancel=${this.variant === "feed" ? this._cancelHold : void 0}
        @click=${this.variant === "cancel" ? this._tapActivate : void 0}
      >
        ${this.variant === "feed" ? b2`<span class="fill"></span>` : ""}
        <span class="label">${this.label}</span>
      </button>
    `;
  }
  _tapActivate() {
    if (this.disabled) return;
    this._activate();
  }
  _activate() {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .button {
      position: relative;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border: none;
      /* Fully rounded: the primary action should read as one confident pill, matching the
         segmented picker above it. */
      border-radius: 999px;
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.08s ease, box-shadow 0.15s ease;
      box-shadow: 0 1px 2px color-mix(in srgb, var(--kibble-amber-dark) 35%, transparent);
    }
    .button:active:not(:disabled) {
      transform: scale(0.985);
      box-shadow: none;
    }
    .button.cancel {
      background: color-mix(in srgb, var(--kibble-amber-dark) 12%, transparent);
      color: var(--kibble-amber-dark);
      box-shadow: none;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
    }
    .fill {
      position: absolute;
      inset: 0;
      background: var(--kibble-amber-dark);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 150ms ease-out;
    }
    .button.holding .fill {
      transform: scaleX(1);
      transition: transform var(--hold-ms, 600ms) linear;
    }
    .label {
      position: relative;
      z-index: 1;
    }
  `;
  }
};
customElements.define("kibble-hold-button", KibbleHoldButton);
var { I: t3 } = j;
var r4 = (o7) => void 0 === o7.strings;
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t5) => (...e6) => ({ _$litDirective$: t5, values: e6 });
var i5 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e6, i6) {
    this._$Ct = t5, this._$AM = e6, this._$Ci = i6;
  }
  _$AS(t5, e6) {
    return this.update(t5, e6);
  }
  update(t5, e6) {
    return this.render(...e6);
  }
};
var s4 = (i6, t5) => {
  const e6 = i6._$AN;
  if (void 0 === e6) return false;
  for (const i7 of e6) i7._$AO?.(t5, false), s4(i7, t5);
  return true;
};
var o5 = (i6) => {
  let t5, e6;
  do {
    if (void 0 === (t5 = i6._$AM)) break;
    e6 = t5._$AN, e6.delete(i6), i6 = t5;
  } while (0 === e6?.size);
};
var r5 = (i6) => {
  for (let t5; t5 = i6._$AM; i6 = t5) {
    let e6 = t5._$AN;
    if (void 0 === e6) t5._$AN = e6 = /* @__PURE__ */ new Set();
    else if (e6.has(i6)) break;
    e6.add(i6), c4(t5);
  }
};
function h3(i6) {
  void 0 !== this._$AN ? (o5(this), this._$AM = i6, r5(this)) : this._$AM = i6;
}
function n4(i6, t5 = false, e6 = 0) {
  const r6 = this._$AH, h5 = this._$AN;
  if (void 0 !== h5 && 0 !== h5.size) if (t5) if (Array.isArray(r6)) for (let i7 = e6; i7 < r6.length; i7++) s4(r6[i7], false), o5(r6[i7]);
  else null != r6 && (s4(r6, false), o5(r6));
  else s4(this, i6);
}
var c4 = (i6) => {
  i6.type == t4.CHILD && (i6._$AP ??= n4, i6._$AQ ??= h3);
};
var f3 = class extends i5 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i6, t5, e6) {
    super._$AT(i6, t5, e6), r5(this), this.isConnected = i6._$AU;
  }
  _$AO(i6, t5 = true) {
    i6 !== this.isConnected && (this.isConnected = i6, i6 ? this.reconnected?.() : this.disconnected?.()), t5 && (s4(this, i6), o5(this));
  }
  setValue(t5) {
    if (r4(this._$Ct)) this._$Ct._$AI(t5, this);
    else {
      const i6 = [...this._$Ct._$AH];
      i6[this._$Ci] = t5, this._$Ct._$AI(i6, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};
var e5 = () => new h4();
var h4 = class {
};
var o6 = /* @__PURE__ */ new WeakMap();
var n5 = e4(class extends f3 {
  render(i6) {
    return A;
  }
  update(i6, [s5]) {
    const e6 = s5 !== this.G;
    return e6 && this.rt(void 0), (e6 || this.lt !== this.ct) && (this.G = s5, this.ht = i6.options?.host, this.rt(this.ct = i6.element)), A;
  }
  rt(t5) {
    if (void 0 !== this.G) if (this.isConnected || (t5 = void 0), "function" == typeof this.G) {
      const i6 = this.ht ?? globalThis;
      let s5 = o6.get(i6);
      void 0 === s5 && (s5 = /* @__PURE__ */ new WeakMap(), o6.set(i6, s5)), void 0 !== s5.get(this.G) && this.G.call(this.ht, void 0), s5.set(this.G, t5), void 0 !== t5 && this.G.call(this.ht, t5);
    } else this.G.value = t5;
  }
  get lt() {
    return "function" == typeof this.G ? o6.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
function parseTimeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) {
    throw new Error(`Invalid schedule time "${time}"`);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid schedule time "${time}"`);
  }
  return hours * 60 + minutes;
}
function nextScheduled(entries, now) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best = null;
  for (const entry2 of entries) {
    if (!entry2.enabled) continue;
    const entryMinutes = parseTimeToMinutes(entry2.time);
    const minutesUntil = ((entryMinutes - nowMinutes) % 1440 + 1440) % 1440;
    if (best === null || minutesUntil < best.minutesUntil) {
      best = { entry: entry2, minutesUntil };
    }
  }
  return best;
}
function formatClock(time, locale) {
  const minutes = parseTimeToMinutes(time);
  const date = new Date(2e3, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}
var COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
function scheduleSummary(entries, now, locale) {
  if (entries.length === 0) {
    return "No schedule set";
  }
  const next = nextScheduled(entries, now);
  if (!next) {
    return "All feeds paused";
  }
  const enabledCount = entries.filter((entry2) => entry2.enabled).length;
  const countWord = COUNT_WORDS[enabledCount] ?? String(enabledCount);
  return `Next feed ${formatClock(next.entry.time, locale)}, ${countWord} a day`;
}
var DISPENSER_CARD_TAG = "dispenser-schedule-card";
var KibbleScheduleSummary = class extends i4 {
  constructor() {
    super();
    this._expanded = false;
    this._embedRef = e5();
    this._configureEmbed = (el) => {
      if (!el || !this.scheduleCardStateEntity) return;
      const card = el.querySelector(DISPENSER_CARD_TAG);
      if (card) {
        card.hass = this.hass;
        return;
      }
      const created = document.createElement(DISPENSER_CARD_TAG);
      created.setConfig({
        type: "custom:dispenser-schedule-card",
        device: {
          type: "custom",
          entity: this.scheduleCardStateEntity,
          max_entries: 24,
          min_amount: 1,
          max_amount: 20,
          step_amount: 1,
          status_map: ["0 -> dispensed", "1 -> failed", "2 -> pending", "3 -> dispensing"],
          status_pattern: "(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?",
          actions: {
            add: "kibble.schedule_card_add",
            edit: "kibble.schedule_card_edit",
            remove: "kibble.schedule_card_remove",
            toggle: "kibble.schedule_card_toggle"
          }
        },
        unit_of_measurement: { one: "portion", other: "portions" }
      });
      created.hass = this.hass;
      el.appendChild(created);
    };
    this.entries = [];
    this.deviceName = "Kibble";
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entries: { attribute: false },
      scheduleCardStateEntity: { type: String },
      deviceName: { type: String }
    };
  }
  updated() {
    if (this._embedRef.value && this.hass) {
      this._embedRef.value.hass = this.hass;
    }
  }
  render() {
    const now = /* @__PURE__ */ new Date();
    const summary = scheduleSummary(this.entries, now);
    return b2`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${summary}</span>
        <span class="chevron ${this._expanded ? "open" : ""}">${mdiIcon("chevronDown")}</span>
      </button>
      ${this._expanded ? b2`<div class="expanded">${this._renderExpanded()}</div>` : A}
    `;
  }
  _renderExpanded() {
    if (this._canEmbed()) {
      return b2`<div ${n5(this._configureEmbed)}></div>`;
    }
    if (this.entries.length === 0) {
      return b2`<p class="empty">No schedule set</p>`;
    }
    const sorted = [...this.entries].sort((a3, b3) => a3.time.localeCompare(b3.time));
    return b2`
      <ul class="entries">
        ${sorted.map(
      (entry2) => b2`
            <li class=${entry2.enabled ? "" : "disabled"}>
              <span class="time">${formatClock(entry2.time)}</span>
              <span class="amounts">${entry2.amount_l}g + ${entry2.amount_r}g</span>
              <span class="state">${entry2.enabled ? "On" : "Paused"}</span>
            </li>
          `
    )}
      </ul>
    `;
  }
  _canEmbed() {
    if (!customElements.get(DISPENSER_CARD_TAG)) return false;
    if (!this.scheduleCardStateEntity) return false;
    const state2 = this.hass?.states[this.scheduleCardStateEntity];
    return state2 !== void 0 && state2.state !== "unavailable";
  }
  _toggle() {
    this._expanded = !this._expanded;
    this.requestUpdate();
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: none;
      border: none;
      padding: 10px 4px;
      min-height: var(--kibble-touch-target, 48px);
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .chevron {
      display: flex;
      color: var(--secondary-text-color);
      transition: transform 0.15s ease;
    }
    .chevron.open {
      transform: rotate(180deg);
    }
    .expanded {
      padding: 0 4px 8px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
      margin: 0;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .entries li {
      display: flex;
      gap: 10px;
      align-items: baseline;
      font-size: var(--kibble-schedule-size, 14px);
      color: var(--primary-text-color);
    }
    .entries li.disabled {
      color: var(--secondary-text-color);
      text-decoration: line-through;
      text-decoration-color: var(--divider-color);
    }
    .entries .time {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      min-width: 3.5em;
    }
    .entries .amounts {
      flex: 1;
    }
    .entries .state {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
  }
};
customElements.define("kibble-schedule-summary", KibbleScheduleSummary);
var CLOUD_CONFIRM_WINDOW_MS = 3e3;
function numberAttrs(hass, entityId) {
  if (!entityId) return null;
  const state2 = hass.states[entityId];
  if (!state2) return null;
  const value = Number(state2.state);
  if (Number.isNaN(value)) return null;
  return {
    value,
    min: Number(state2.attributes.min ?? 1),
    max: Number(state2.attributes.max ?? 20),
    step: Number(state2.attributes.step ?? 1)
  };
}
var KibbleSettingsDialog = class extends i4 {
  constructor() {
    super();
    this._cloudConfirmArmed = false;
    this._cloudConfirmTimer = void 0;
    this.open = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entities: { attribute: false },
      open: { type: Boolean, reflect: true }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._cloudConfirmTimer);
  }
  render() {
    if (!this.open) return A;
    const e6 = this.entities;
    return b2`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
        </header>
        <div class="body">
          ${e6.feedButtonHopper1 || e6.feedButtonHopper2 ? this._renderHopperSection() : A}
          ${e6.feedAmount ? this._renderMoreAmountSection() : A}
          ${this._renderToggles()}
          ${e6.volume ? this._renderVolume() : A}
          ${e6.cloudSwitch ? this._renderCloud() : A}
          ${e6.wifiNetwork ? this._renderWifi() : A}
          ${e6.dishBefore || e6.dishAfter ? this._renderDishPhotos() : A}
          ${e6.speaker ? this._renderSpeaker() : A}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${mdiIcon("openInNew")}
          </button>
        </div>
      </div>
    `;
  }
  _renderMoreAmountSection() {
    const attrs = numberAttrs(this.hass, this.entities.feedAmount);
    if (!attrs) return A;
    return b2`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount, attrs)}
      </section>
    `;
  }
  _renderHopperSection() {
    const { feedAmountHopper1, feedAmountHopper2, feedButtonHopper1, feedButtonHopper2 } = this.entities;
    return b2`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">
          Targets one auger's amount byte. This feeder's firmware spins both augers anyway, so
          expect roughly double into the bowl until a hopper divider is fitted.
        </p>
        <div class="hoppers">
          ${feedAmountHopper1 ? b2`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(feedAmountHopper1, numberAttrs(this.hass, feedAmountHopper1))}
                  ${feedButtonHopper1 ? b2`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper1)}></kibble-hold-button>` : A}
                </div>
              ` : A}
          ${feedAmountHopper2 ? b2`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(feedAmountHopper2, numberAttrs(this.hass, feedAmountHopper2))}
                  ${feedButtonHopper2 ? b2`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper2)}></kibble-hold-button>` : A}
                </div>
              ` : A}
        </div>
      </section>
    `;
  }
  _renderStepper(entityId, attrs) {
    if (!attrs) return A;
    return b2`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${attrs.value <= attrs.min} @click=${() => this._setNumber(entityId, Math.max(attrs.min, attrs.value - attrs.step))}>
          &minus;
        </button>
        <span class="step-value">${attrs.value}</span>
        <button type="button" class="step-btn" ?disabled=${attrs.value >= attrs.max} @click=${() => this._setNumber(entityId, Math.min(attrs.max, attrs.value + attrs.step))}>
          &plus;
        </button>
      </div>
    `;
  }
  _renderToggles() {
    const candidates = [
      { id: this.entities.nightVisionSwitch, icon: "weatherNight", label: "Night vision" },
      { id: this.entities.statusLedSwitch, icon: "ledOn", label: "Status LED" },
      { id: this.entities.microphoneSwitch, icon: "microphone", label: "Microphone" }
    ];
    const rows = candidates.filter(
      (row) => row.id !== void 0
    );
    if (rows.length === 0) return A;
    return b2`
      <section>
        <h3>Device</h3>
        ${rows.map((row) => this._renderToggleRow(row.id, row.icon, row.label))}
      </section>
    `;
  }
  _renderToggleRow(entityId, icon, label) {
    const state2 = this.hass.states[entityId];
    const on = state2?.state === "on";
    const unavailable = !state2 || state2.state === "unavailable";
    return b2`
      <button type="button" class="toggle-row" ?disabled=${unavailable} @click=${() => this._toggleSwitch(entityId)}>
        <span class="toggle-icon">${mdiIcon(icon)}</span>
        <span class="toggle-label">${label}</span>
        <span class="toggle-pill ${on ? "on" : ""}"><span class="toggle-knob"></span></span>
      </button>
    `;
  }
  _renderVolume() {
    const attrs = numberAttrs(this.hass, this.entities.volume);
    if (!attrs) return A;
    return b2`
      <section>
        <h3>Volume</h3>
        <input
          type="range"
          min=${attrs.min}
          max=${attrs.max}
          step=${attrs.step}
          .value=${String(attrs.value)}
          @change=${(ev) => this._setNumber(this.entities.volume, Number(ev.target.value))}
        />
      </section>
    `;
  }
  _renderCloud() {
    const state2 = this.hass.states[this.entities.cloudSwitch];
    const on = state2?.state === "on";
    const connection = this.entities.cloudConnection ? this.hass.states[this.entities.cloudConnection]?.state : void 0;
    return b2`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${connection ? `Connection: ${connection}` : "Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed ? "confirming" : ""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed ? `Tap again to turn ${on ? "off" : "on"}` : on ? "On \u2014 tap to turn off" : "Off \u2014 tap to turn on"}
        </button>
      </section>
    `;
  }
  _renderWifi() {
    const state2 = this.hass.states[this.entities.wifiNetwork];
    return b2`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${state2 ? state2.state : "Unavailable"}</p>
      </section>
    `;
  }
  _renderDishPhotos() {
    const before = this.entities.dishBefore ? this.hass.states[this.entities.dishBefore] : void 0;
    const after = this.entities.dishAfter ? this.hass.states[this.entities.dishAfter] : void 0;
    if ((!before || before.state === "unavailable") && (!after || after.state === "unavailable")) return A;
    return b2`
      <section>
        <h3>Last feed</h3>
        <div class="dish-photos">
          ${before && before.state !== "unavailable" ? b2`<img src=${String(before.attributes.entity_picture ?? "")} alt="Before" />` : A}
          ${after && after.state !== "unavailable" ? b2`<img src=${String(after.attributes.entity_picture ?? "")} alt="After" />` : A}
        </div>
      </section>
    `;
  }
  _renderSpeaker() {
    const state2 = this.hass.states[this.entities.speaker];
    if (!state2) return A;
    const volume = typeof state2.attributes.volume_level === "number" ? state2.attributes.volume_level : 0.5;
    return b2`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${state2.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(volume)}
          @change=${(ev) => this.hass.callService("media_player", "volume_set", { volume_level: Number(ev.target.value) }, { entity_id: this.entities.speaker })}
        />
      </section>
    `;
  }
  _pressButton(entityId) {
    this.hass.callService("button", "press", {}, { entity_id: entityId });
  }
  _toggleSwitch(entityId) {
    this.hass.callService("switch", "toggle", {}, { entity_id: entityId });
  }
  _setNumber(entityId, value) {
    this.hass.callService("number", "set_value", { value }, { entity_id: entityId });
  }
  _onCloudToggleClick() {
    if (this._cloudConfirmArmed) {
      clearTimeout(this._cloudConfirmTimer);
      this._cloudConfirmArmed = false;
      this._toggleSwitch(this.entities.cloudSwitch);
      this.requestUpdate();
      return;
    }
    this._cloudConfirmArmed = true;
    this.requestUpdate();
    this._cloudConfirmTimer = setTimeout(() => {
      this._cloudConfirmArmed = false;
      this.requestUpdate();
    }, CLOUD_CONFIRM_WINDOW_MS);
  }
  _openDevicePage() {
    const deviceId = this.entities.deviceId;
    history.pushState(null, "", `/config/devices/device/${deviceId}`);
    window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    this._close();
  }
  _onKeydown(event) {
    if (event.key === "Escape") this._close();
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    /* When closed, render() returns nothing -- but the HOST still exists, and a host with
       position: fixed and inset: 0 is a full-viewport box that keeps receiving pointer events.
       Without this rule an invisible empty overlay sits on top of Home Assistant and silently
       eats every click on the page (sidebar included) for as long as the card is on a
       dashboard. The open property reflects to an attribute, so the closed state is styleable. */
    :host(:not([open])) {
      display: none;
    }
    :host {
      position: fixed;
      inset: 0;
      z-index: 100;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .panel {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: min(380px, 100vw);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.3));
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      position: sticky;
      top: 0;
      background: inherit;
    }
    h2 {
      margin: 0;
      font-size: 20px;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 48px;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .body {
      padding: 8px 16px 24px;
      display: flex;
      flex-direction: column;
    }
    section {
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    h3 {
      margin: 0 0 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .hint {
      margin: 0 0 10px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .hoppers {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .hopper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-label {
      font-weight: 600;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .step-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font-size: 22px;
      cursor: pointer;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .step-value {
      min-width: 2.5em;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .toggle-row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      background: none;
      border: none;
      color: var(--primary-text-color);
      font: inherit;
      padding: 10px 0;
      min-height: 48px;
      cursor: pointer;
    }
    .toggle-row:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .toggle-icon {
      font-size: 20px;
      color: var(--secondary-text-color);
    }
    .toggle-label {
      flex: 1;
      text-align: left;
    }
    .toggle-pill {
      width: 42px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      position: relative;
      transition: background-color 0.15s ease;
    }
    .toggle-pill.on {
      background: var(--kibble-amber);
    }
    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ha-card-background, white);
      transition: transform 0.15s ease;
    }
    .toggle-pill.on .toggle-knob {
      transform: translateX(18px);
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--kibble-amber);
    }
    .cloud-toggle {
      width: 100%;
      min-height: 48px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .cloud-toggle.confirming {
      border-color: var(--kibble-amber-dark);
      color: var(--kibble-amber-dark);
    }
    .dish-photos {
      display: flex;
      gap: 10px;
    }
    .dish-photos img {
      width: 50%;
      border-radius: 8px;
      object-fit: cover;
      aspect-ratio: 4 / 3;
    }
    .device-link {
      margin-top: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 0;
      align-self: flex-start;
    }
  `;
  }
};
customElements.define("kibble-settings-dialog", KibbleSettingsDialog);
var MAX_CACHED_IMAGES = 200;
function kibbleImageUrl(entryId, kind, name) {
  const kindPath = kind.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `/api/kibble/${encodeURIComponent(entryId)}/image/${kindPath}/${encodeURIComponent(name)}`;
}
var ImageUrlCache = class {
  constructor() {
    this._urls = /* @__PURE__ */ new Map();
    this._pending = /* @__PURE__ */ new Map();
  }
  /** Returns a cached object URL synchronously when already known; otherwise starts the fetch
   * (once per path, even under concurrent callers) and calls `onReady` when it settles.
   * `onReady` receives `null` on failure -- callers show a broken-image fallback rather than
   * nothing, so a crop that failed to load once doesn't look like a crop that never existed. */
  get(hass, path, onReady) {
    const cached = this._urls.get(path);
    if (cached) {
      this._urls.delete(path);
      this._urls.set(path, cached);
      return cached;
    }
    const pending = this._pending.get(path);
    if (pending) {
      pending.then(() => onReady(this._urls.get(path) ?? null));
      return null;
    }
    const request = this._fetch(hass, path).then((url) => {
      this._pending.delete(path);
      if (url) this._remember(path, url);
      onReady(url);
    });
    this._pending.set(path, request);
    return null;
  }
  async _fetch(hass, path) {
    if (!hass.fetchWithAuth) return null;
    try {
      const response = await hass.fetchWithAuth(path);
      if (!response.ok) return null;
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }
  _remember(path, url) {
    this._urls.set(path, url);
    while (this._urls.size > MAX_CACHED_IMAGES) {
      const oldestPath = this._urls.keys().next().value;
      if (oldestPath === void 0) break;
      const oldestUrl = this._urls.get(oldestPath);
      this._urls.delete(oldestPath);
      if (oldestUrl) URL.revokeObjectURL(oldestUrl);
    }
  }
  /** Revoke every cached URL. Call from `disconnectedCallback`. */
  dispose() {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    this._pending.clear();
  }
};
function catSilhouette() {
  return w`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `;
}
function fallbackCatColor(name) {
  let hash = 0;
  for (let i6 = 0; i6 < name.length; i6++) {
    hash = hash * 31 + name.charCodeAt(i6) | 0;
  }
  return catColorAt(hash);
}
var KibbleAvatar = class extends i4 {
  constructor() {
    super();
    this._cache = new ImageUrlCache();
    this._imageUrl = null;
    this._resolvedPath = null;
    this.name = null;
    this.colorIndex = null;
    this.sampleName = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      name: { type: String },
      colorIndex: { type: Number, attribute: "color-index" },
      entryId: { type: String, attribute: "entry-id" },
      sampleName: { type: String, attribute: "sample-name" }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._cache.dispose();
  }
  willUpdate() {
    const path = this.entryId && this.name && this.sampleName ? kibbleImageUrl(this.entryId, `sample/${this.name}`, this.sampleName) : null;
    if (path === this._resolvedPath) return;
    this._resolvedPath = path;
    this._imageUrl = null;
    if (!path || !this.hass) return;
    this._imageUrl = this._cache.get(this.hass, path, (url) => {
      if (this._resolvedPath !== path) return;
      this._imageUrl = url;
      this.requestUpdate();
    });
  }
  render() {
    if (!this.name) {
      return b2`<div class="avatar neutral">${catSilhouette()}</div>`;
    }
    const color = this.colorIndex != null ? catColorAt(this.colorIndex) : fallbackCatColor(this.name);
    return b2`
      <div class="avatar" style="--kibble-avatar-color: ${color}">
        ${this._imageUrl ? b2`<img src=${this._imageUrl} alt="" />` : b2`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: inline-block;
      width: var(--kibble-avatar-size, 32px);
      height: var(--kibble-avatar-size, 32px);
      flex: 0 0 auto;
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: var(--kibble-avatar-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent);
      color: var(--secondary-text-color);
      padding: 18%;
      box-sizing: border-box;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .monogram {
      color: #fff;
      font-weight: 600;
      font-size: calc(var(--kibble-avatar-size, 32px) * 0.42);
      line-height: 1;
      user-select: none;
    }
  `;
  }
};
customElements.define("kibble-avatar", KibbleAvatar);
var import_client = __toESM(require_src(), 1);
function findScryptedToken(hass) {
  for (const entry2 of Object.values(hass.entities ?? {})) {
    if (entry2.platform === "scrypted" && entry2.entity_id.startsWith("sensor.scrypted_token")) {
      const state2 = hass.states[entry2.entity_id]?.state;
      if (state2 && state2 !== "unavailable" && state2 !== "unknown") return state2;
    }
  }
  return void 0;
}
var BrowserSignalingSession = class {
  constructor() {
    this.options = {
      proxy: true,
      userAgent: navigator.userAgent,
      capabilities: {
        audio: RTCRtpReceiver.getCapabilities?.("audio") ?? { codecs: [], headerExtensions: [] },
        video: RTCRtpReceiver.getCapabilities?.("video") ?? { codecs: [], headerExtensions: [] }
      },
      screen: { devicePixelRatio: window.devicePixelRatio, width: screen.width, height: screen.height }
    };
    this.__proxy_props = { options: this.options };
  }
  async getOptions() {
    return this.options;
  }
  createPeerConnection(setup) {
    if (this.pc) return this.pc;
    const pc = new RTCPeerConnection(setup.configuration);
    this.pc = pc;
    pc.addEventListener("iceconnectionstatechange", () => {
      if (["disconnected", "failed", "closed"].includes(pc.iceConnectionState)) this.onClosed?.();
    });
    const remote = new MediaStream();
    pc.addEventListener("track", (ev) => {
      remote.addTrack(ev.track);
      this.onTrack?.(remote);
    });
    if (setup.datachannel) pc.createDataChannel(setup.datachannel.label, setup.datachannel.dict);
    if (setup.audio) {
      const audio = pc.addTransceiver("audio", setup.audio);
      if (setup.audio.direction === "sendrecv" || setup.audio.direction === "sendonly") this.microphone = audio.sender;
    }
    if (setup.video) pc.addTransceiver("video", setup.video);
    return pc;
  }
  async createLocalDescription(type, setup, sendIceCandidate) {
    const pc = this.createPeerConnection(setup);
    const gathered = new Promise((resolve) => {
      pc.onicecandidate = (ev) => {
        if (ev.candidate) void sendIceCandidate?.(JSON.parse(JSON.stringify(ev.candidate)));
        else resolve();
      };
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === "complete") resolve();
      };
    });
    const local = type === "offer" ? await pc.createOffer({ offerToReceiveAudio: !!setup.audio, offerToReceiveVideo: !!setup.video }) : await pc.createAnswer();
    const set = pc.setLocalDescription(local);
    if (sendIceCandidate) return { type: local.type, sdp: local.sdp };
    await set;
    await gathered;
    const final = pc.localDescription ?? local;
    return { type: final.type, sdp: final.sdp };
  }
  async setRemoteDescription(description, setup) {
    await this.createPeerConnection(setup).setRemoteDescription(description);
  }
  async addIceCandidate(candidate) {
    await this.pc?.addIceCandidate(candidate);
  }
  async endSession() {
  }
  /** Attaches the microphone on first enable (a `sendrecv` transceiver was already negotiated,
   * so `replaceTrack` needs no renegotiation), then just flips `enabled`. */
  async setMicrophone(enabled) {
    if (!this.microphone) throw new Error("this stream has no return-audio channel");
    if (enabled && !this.micTrack) {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micTrack = mic.getAudioTracks()[0];
      await this.microphone.replaceTrack(this.micTrack);
    }
    if (this.micTrack) this.micTrack.enabled = enabled;
  }
  close() {
    this.micTrack?.stop();
    this.pc?.getSenders().forEach((s5) => s5.track?.stop());
    this.pc?.close();
    this.pc = void 0;
  }
};
var ScryptedLive = class {
  constructor(onChange) {
    this.state = "idle";
    this.hasIntercom = false;
    this.onChange = onChange;
  }
  async open(target, video) {
    this.close();
    this.setState("connecting");
    try {
      const baseUrl = `${location.origin}/api/scrypted/${target.token}/`;
      const client = await (0, import_client.connectScryptedClient)({ baseUrl, pluginId: "@scrypted/core", clientName: "kibble-card" });
      this.client = client;
      const device = client.systemManager.getDeviceById(target.deviceId);
      if (!device) throw new Error(`Scrypted has no device ${target.deviceId}`);
      const interfaces = device.interfaces ?? [];
      if (!interfaces.includes("RTCSignalingChannel")) throw new Error(`${device.name} has no WebRTC channel in Scrypted`);
      this.hasIntercom = interfaces.includes("Intercom");
      const session = new BrowserSignalingSession();
      this.session = session;
      session.onTrack = (stream) => {
        if (video.srcObject !== stream) {
          video.srcObject = stream;
          void video.play().catch(() => void 0);
        }
        this.setState("live");
      };
      session.onClosed = () => {
        if (this.session === session) this.fail("stream disconnected");
      };
      const channel = device;
      this.control = await channel.startRTCSignalingSession(session);
    } catch (e6) {
      this.fail(e6 instanceof Error ? e6.message : String(e6));
      throw e6;
    }
  }
  /** Push-to-talk. The mic track is attached on first use, then only `enabled` flips; Scrypted's
   * session control is told to start/stop feeding the camera's `Intercom` so the feeder's
   * speaker session lasts exactly as long as the button is held. */
  async talk(enabled) {
    if (!this.session) throw new Error("not connected");
    await this.session.setMicrophone(enabled);
    await this.control?.setPlayback({ audio: enabled, video: true });
  }
  close() {
    void this.control?.setPlayback({ audio: false, video: true }).catch(() => void 0);
    this.control = void 0;
    this.session?.close();
    this.session = void 0;
    this.client?.disconnect?.();
    this.client = void 0;
    if (this.state !== "idle") this.setState("idle");
  }
  fail(message) {
    this.error = message;
    this.session?.close();
    this.session = void 0;
    this.setState("error");
  }
  setState(state2) {
    this.state = state2;
    if (state2 !== "error") this.error = void 0;
    this.onChange();
  }
};
var RECONNECT_BASE_MS = 1e3;
var RECONNECT_MAX_MS = 3e4;
function nextReconnectDelay(current) {
  return Math.min(current * 2, RECONNECT_MAX_MS);
}
var STALL_MS = 8e3;
var STALL_CHECK_INTERVAL_MS = 2e3;
var HIDDEN_PAUSE_MS = 6e4;
var KibbleLiveHero = class extends i4 {
  constructor() {
    super();
    this._starting = false;
    this._backoffMs = RECONNECT_BASE_MS;
    this._lastProgress = 0;
    this._hiddenPaused = false;
    this._live = new ScryptedLive(() => {
      this._tick = (this._tick ?? 0) + 1;
    });
    this._start = async () => {
      const token = findScryptedToken(this.hass);
      if (!token || !this.scryptedId) return;
      this._starting = true;
      this._playing = true;
      this._lastProgress = performance.now();
      await this.updateComplete;
      const video = this.renderRoot.querySelector("#video");
      if (!video) {
        this._starting = false;
        return;
      }
      try {
        await this._live.open({ deviceId: this.scryptedId, token }, video);
        this._reconnecting = false;
        this._backoffMs = RECONNECT_BASE_MS;
      } catch {
        this._beginReconnect();
        return;
      } finally {
        this._starting = false;
      }
    };
    this._onTimeUpdate = () => {
      this._lastProgress = performance.now();
    };
    this._checkStall = () => {
      if (!this._playing || this._reconnecting || document.hidden) return;
      if (performance.now() - this._lastProgress > STALL_MS) this._beginReconnect();
    };
    this._onVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(this._hiddenTimer);
        this._hiddenTimer = setTimeout(this._pauseForHidden, HIDDEN_PAUSE_MS);
        return;
      }
      clearTimeout(this._hiddenTimer);
      this._hiddenTimer = void 0;
      if (this._hiddenPaused) {
        this._hiddenPaused = false;
        this._backoffMs = RECONNECT_BASE_MS;
        this.requestUpdate();
        return;
      }
      if (this._playing) this._lastProgress = performance.now();
    };
    this._pauseForHidden = () => {
      this._hiddenTimer = void 0;
      if (!this._playing && !this._reconnecting) return;
      this._hiddenPaused = true;
      this._reconnecting = false;
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = void 0;
      this._live.close();
      this._playing = false;
      this._talking = false;
    };
    this._stop = () => {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = void 0;
      clearTimeout(this._hiddenTimer);
      this._hiddenTimer = void 0;
      this._live.close();
      this._playing = false;
      this._talking = false;
      this._starting = false;
      this._reconnecting = false;
      this._hiddenPaused = false;
      this._backoffMs = RECONNECT_BASE_MS;
    };
    this._toggleMute = () => {
      this._muted = !this._muted;
      this._applyMute();
    };
    this._applyMute = () => {
      const video = this.renderRoot.querySelector("#video");
      if (!video) return;
      video.muted = this._muted;
      void video.play().catch(() => void 0);
    };
    this._toggleTalk = async () => {
      const next = !this._talking;
      this._talking = next;
      try {
        await this._live.talk(next);
      } catch {
        if (next) this._talking = false;
      }
    };
    this._playing = false;
    this._talking = false;
    this._muted = true;
    this._reconnecting = false;
    this._tick = 0;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      cameraEntity: { attribute: false },
      scryptedId: { attribute: false },
      _playing: { state: true },
      _talking: { state: true },
      _muted: { state: true },
      _reconnecting: { state: true },
      _tick: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    this._stallCheckInterval = setInterval(this._checkStall, STALL_CHECK_INTERVAL_MS);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    clearInterval(this._stallCheckInterval);
    this._stallCheckInterval = void 0;
    this._stop();
  }
  /** The stream starts on its own as soon as the card knows where to get it; the still stays
   * underneath until the first frame paints, so the hand-over is seamless. A session that turns
   * out to be dead (peer connection disconnected/failed/closed) reroutes through the same
   * reconnect path a stall does, instead of leaving a frozen or blank video up forever. */
  updated() {
    if (this._live.state === "error" && this._playing) {
      this._beginReconnect();
      return;
    }
    if (this._playing || this._starting || this._reconnecting || this._hiddenPaused) return;
    if (!this.hass || !this.scryptedId || !findScryptedToken(this.hass)) return;
    void this._start();
  }
  render() {
    return b2`
      <div class="frame">
        ${this._renderStill()}
        ${this._playing ? this._renderVideo() : A}
        ${this._reconnecting ? b2`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${mdiIcon("refresh")}</div>` : A}
        <div class="controls">
          ${this._playing ? b2`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                title=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${mdiIcon(this._muted ? "volumeOff" : "volumeHigh")}
              </button>` : A}
          ${this._playing && this._live.hasIntercom ? b2`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                title=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${mdiIcon(this._talking ? "microphone" : "microphoneOff")}
              </button>` : A}
        </div>
        ${this._live.state === "error" && !this._reconnecting ? b2`<div class="note error">${this._live.error}</div>` : A}
      </div>
    `;
  }
  _renderVideo() {
    return b2`<video
      id="video"
      autoplay
      playsinline
      ?muted=${this._muted}
      @loadedmetadata=${this._applyMute}
      @timeupdate=${this._onTimeUpdate}
    ></video>`;
  }
  _renderStill() {
    if (!this.cameraEntity) return b2`<div class="placeholder">No camera on this device</div>`;
    if (customElements.get("hui-image")) {
      return b2`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;
    }
    const src = this.hass.states[this.cameraEntity]?.attributes.entity_picture;
    return typeof src === "string" ? b2`<img src=${src} alt="The feeder's camera" />` : b2`<div class="placeholder">Camera unavailable</div>`;
  }
  /** Tears down whatever's left of a dead session and schedules the next attempt on the
   * exponential backoff (`lib/reconnect.ts`), capped at 30s. Idempotent against being called
   * again while an attempt is already pending -- a second stall/error signal arriving before the
   * backoff timer fires doesn't reset or duplicate it. */
  _beginReconnect() {
    this._playing = false;
    this._reconnecting = true;
    this._talking = false;
    this._live.close();
    if (this._reconnectTimer !== void 0) return;
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = void 0;
      void this._start();
    }, this._backoffMs);
    this._backoffMs = nextReconnectDelay(this._backoffMs);
  }
  static {
    this.styles = i`
    :host {
      display: block;
      height: 100%;
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #101010;
    }
    video,
    img,
    hui-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    video {
      position: absolute;
      inset: 0;
    }
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    .controls {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
      pointer-events: none;
    }
    .chip {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      cursor: pointer;
      backdrop-filter: blur(2px);
      transition: background 120ms ease, color 120ms ease;
    }
    .chip svg {
      font-size: 20px;
    }
    .chip:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    .chip.talk {
      user-select: none;
    }
    .chip.talk[aria-pressed="true"] {
      background: var(--kibble-amber, #f2a33c);
      color: var(--kibble-ink-on-amber, #241a07);
    }
    .reconnect {
      position: absolute;
      top: 8px;
      left: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      pointer-events: none;
    }
    .reconnect svg {
      font-size: 16px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .reconnect svg {
        animation: kibble-reconnect-spin 1.1s linear infinite;
      }
    }
    @keyframes kibble-reconnect-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .note {
      position: absolute;
      left: 8px;
      bottom: 54px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .note.error {
      color: var(--error-color, #ff8a80);
    }
  `;
  }
};
customElements.define("kibble-live-hero", KibbleLiveHero);
async function bubbleCardAvailable() {
  if (customElements.get("bubble-card")) return true;
  await Promise.race([customElements.whenDefined("bubble-card"), new Promise((r6) => setTimeout(r6, 2e3))]);
  return Boolean(customElements.get("bubble-card"));
}
var KibbleBubbleRow = class extends i4 {
  constructor() {
    super(...arguments);
    this._builtFor = "";
  }
  static {
    this.properties = {
      hass: { attribute: false },
      config: { attribute: false }
    };
  }
  updated() {
    void this._sync();
  }
  async _sync() {
    if (!this.config) return;
    const key = JSON.stringify(this.config);
    if (key !== this._builtFor) {
      this._builtFor = key;
      const helpers = await window.loadCardHelpers?.();
      if (!helpers || key !== this._builtFor) return;
      const next = helpers.createCardElement({ type: "custom:bubble-card", ...this.config });
      this._element?.remove();
      this._element = next;
      this.renderRoot.querySelector(".slot")?.appendChild(next);
    }
    if (this._element && this.hass) this._element.hass = this.hass;
  }
  render() {
    return b2`<div class="slot"></div>`;
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .slot > * {
      /* Bubble rows carry their own outer margin for stacking; the card lays them out itself. */
      --bubble-margin: 0;
    }
  `;
  }
};
customElements.define("kibble-bubble-row", KibbleBubbleRow);
var SCHEMA = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "scrypted_id", selector: { text: {} } },
  { name: "settings_hash", selector: { text: {} } },
  { name: "schedule_hash", selector: { text: {} } }
];
var FIELD_LABELS = {
  device_id: "Kibble device",
  name: "Name (optional)",
  scrypted_id: "Scrypted camera id (live view + talk)",
  settings_hash: "Settings pop-up hash (optional)",
  schedule_hash: "Schedule handled by dashboard (optional hash)"
};
var KibbleCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._computeLabel = (field) => FIELD_LABELS[field.name] ?? field.name;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true }
    };
  }
  setConfig(config) {
    this._config = config;
  }
  render() {
    if (!this._config) return A;
    if (customElements.get("ha-form")) {
      return b2`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `;
    }
    return this._renderFallback();
  }
  _renderFallback() {
    const entities = Object.values(this.hass?.entities ?? {});
    const devices = Object.values(this.hass?.devices ?? {}).filter(
      (device) => entities.some((entity) => entity.device_id === device.id && entity.platform === "kibble")
    );
    return b2`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${(event) => this._updateDeviceId(event.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${devices.map(
      (device) => b2`<option value=${device.id} ?selected=${device.id === this._config?.device_id}>${device.name_by_user ?? device.name}</option>`
    )}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name ?? ""}
            @change=${(event) => this._updateName(event.target.value)}
          />
        </label>
        <label>
          <span>Settings pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#settings"
            .value=${this._config?.settings_hash ?? ""}
            @change=${(event) => this._updateSettingsHash(event.target.value)}
          />
        </label>
        <label>
          <span>Schedule pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#schedule"
            .value=${this._config?.schedule_hash ?? ""}
            @change=${(event) => this._updateScheduleHash(event.target.value)}
          />
        </label>
      </div>
    `;
  }
  _formValueChanged(event) {
    this._config = event.detail.value;
    this._fireConfigChanged();
  }
  _updateDeviceId(value) {
    if (!this._config) return;
    this._config = { ...this._config, device_id: value };
    this._fireConfigChanged();
  }
  _updateName(value) {
    if (!this._config) return;
    this._config = { ...this._config, name: value || void 0 };
    this._fireConfigChanged();
  }
  _updateSettingsHash(value) {
    if (!this._config) return;
    this._config = { ...this._config, settings_hash: value || void 0 };
    this._fireConfigChanged();
  }
  _updateScheduleHash(value) {
    if (!this._config) return;
    this._config = { ...this._config, schedule_hash: value || void 0 };
    this._fireConfigChanged();
  }
  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `;
  }
};
customElements.define("kibble-card-editor", KibbleCardEditor);
function detectionHeadline(item) {
  if (item.kind === "identified") return item.paired_class === "eat" ? `${item.cat} ate` : `${item.cat} was here`;
  if (item.kind === "eat") return "A cat ate";
  return "A cat came by";
}
function filterVisits(items, showVisits) {
  if (showVisits) return items;
  return items.filter((item) => item.kind !== "visit");
}
function feedSummary(item) {
  const scheduled = !item.manual;
  if (item.amount == null) return { headline: "Fed", scheduled };
  const portionWord = item.amount === 1 ? "portion" : "portions";
  const hopperClause = item.hopper && item.hopper !== "both" ? ` from hopper ${item.hopper}` : "";
  return { headline: `Fed ${item.amount} ${portionWord}${hopperClause}`, scheduled };
}
function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function dayLabel(date, now) {
  if (dayKey(date) === dayKey(now)) return "Today";
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (dayKey(date) === dayKey(yesterday)) return "Yesterday";
  return date.toLocaleDateString(void 0, { weekday: "long", month: "short", day: "numeric" });
}
function groupByDay(items, now) {
  const days = [];
  let currentKey = null;
  for (const item of items) {
    const date = new Date(item.ts * 1e3);
    const key = dayKey(date);
    if (key !== currentKey) {
      currentKey = key;
      days.push({ label: dayLabel(date, now), items: [] });
    }
    days[days.length - 1].items.push(item);
  }
  return days;
}
var KibbleLightbox = class extends i4 {
  constructor() {
    super();
    this._closeButtonRef = e5();
    this._keydownHandler = (event) => {
      if (event.key === "Escape" && this.open) {
        event.preventDefault();
        this._close();
      }
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.imageUrl = null;
    this.alt = "";
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      imageUrl: { type: String },
      alt: { type: String }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      this._closeButtonRef.value?.focus();
    }
  }
  render() {
    if (!this.open) return A;
    return b2`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.alt || "Photo"}>
        <div class="frame" @click=${(event) => event.stopPropagation()}>
          ${this.imageUrl ? b2`<img src=${this.imageUrl} alt=${this.alt} />` : A}
          <button type="button" class="close" aria-label="Close" ${n5(this._closeButtonRef)} @click=${this._close}>
            ${mdiIcon("close")}
          </button>
        </div>
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 32px;
      box-sizing: border-box;
    }
    .frame {
      position: relative;
      max-width: min(90vw, 720px);
      max-height: 90vh;
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 90vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .close {
      position: absolute;
      top: -16px;
      right: -16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: #fff;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .backdrop {
        animation: kibble-lightbox-fade 120ms ease-out;
      }
    }
    @keyframes kibble-lightbox-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  }
};
customElements.define("kibble-lightbox", KibbleLightbox);
var SCHEMA2 = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "limit", selector: { number: { min: 1, mode: "box" } } },
  { name: "show_visits", selector: { boolean: {} } }
];
var FIELD_LABELS2 = {
  device_id: "Kibble device",
  name: "Name (optional)",
  limit: "Rows before \u201CShow more\u201D (optional, default 30)",
  show_visits: "Show bare \u201Ca cat came by\u201D rows (optional, default off)"
};
var KibbleTimelineCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._computeLabel = (field) => FIELD_LABELS2[field.name] ?? field.name;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true }
    };
  }
  setConfig(config) {
    this._config = config;
  }
  render() {
    if (!this._config) return A;
    if (customElements.get("ha-form")) {
      return b2`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA2}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `;
    }
    return this._renderFallback();
  }
  _renderFallback() {
    const entities = Object.values(this.hass?.entities ?? {});
    const devices = Object.values(this.hass?.devices ?? {}).filter(
      (device) => entities.some((entity) => entity.device_id === device.id && entity.platform === "kibble")
    );
    return b2`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${(event) => this._updateDeviceId(event.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${devices.map(
      (device) => b2`<option value=${device.id} ?selected=${device.id === this._config?.device_id}>${device.name_by_user ?? device.name}</option>`
    )}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name ?? ""}
            @change=${(event) => this._updateName(event.target.value)}
          />
        </label>
        <label>
          <span>Rows before "Show more" (optional, default 30)</span>
          <input
            type="number"
            min="1"
            .value=${this._config?.limit != null ? String(this._config.limit) : ""}
            @change=${(event) => this._updateLimit(event.target.value)}
          />
        </label>
        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${this._config?.show_visits ?? false}
            @change=${(event) => this._updateShowVisits(event.target.checked)}
          />
          <span>Show bare "a cat came by" rows</span>
        </label>
      </div>
    `;
  }
  _formValueChanged(event) {
    this._config = event.detail.value;
    this._fireConfigChanged();
  }
  _updateDeviceId(value) {
    if (!this._config) return;
    this._config = { ...this._config, device_id: value };
    this._fireConfigChanged();
  }
  _updateName(value) {
    if (!this._config) return;
    this._config = { ...this._config, name: value || void 0 };
    this._fireConfigChanged();
  }
  _updateLimit(value) {
    if (!this._config) return;
    const parsed = Number(value);
    this._config = { ...this._config, limit: value && Number.isFinite(parsed) ? parsed : void 0 };
    this._fireConfigChanged();
  }
  _updateShowVisits(value) {
    if (!this._config) return;
    this._config = { ...this._config, show_visits: value ? true : void 0 };
    this._fireConfigChanged();
  }
  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input:not([type="checkbox"]) {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
    .checkbox {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .checkbox input {
      width: 18px;
      height: 18px;
    }
  `;
  }
};
customElements.define("kibble-timeline-card-editor", KibbleTimelineCardEditor);
var EMPTY_ENTITIES = { deviceId: "", catPresence: [] };
var DEFAULT_LIMIT = 30;
var KibbleTimelineCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES;
    this._timelineQuery = new WsQuery(() => this.requestUpdate());
    this._imageCache = new ImageUrlCache();
    this._lightboxTrigger = null;
    this._showMore = () => {
      this._visibleCount += this._config?.limit ?? DEFAULT_LIMIT;
    };
    this._retryTimeline = () => {
      const callWS = this.hass?.callWS;
      if (!callWS || !this._entryId) return;
      const entryId = this._entryId;
      const includeVisits = this._config?.show_visits === true;
      this._timelineQuery.refresh(
        () => callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: includeVisits }).then((r6) => r6)
      );
    };
    this._closeLightbox = () => {
      this._lightboxUrl = null;
      this._lightboxTrigger?.focus();
      this._lightboxTrigger = null;
    };
    this._visibleCount = DEFAULT_LIMIT;
    this._lightboxUrl = null;
    this._lightboxAlt = "";
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _visibleCount: { state: true },
      _lightboxUrl: { state: true },
      _lightboxAlt: { state: true }
    };
  }
  setConfig(config) {
    if (!config.device_id) {
      throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
    this._visibleCount = config.limit ?? DEFAULT_LIMIT;
  }
  getCardSize() {
    return 6;
  }
  static getStubConfig(hass) {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry2) => entry2.platform === "kibble");
    return { type: "custom:kibble-timeline-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-timeline-card-editor");
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._imageCache.dispose();
  }
  willUpdate() {
    const deviceId = this._config?.device_id;
    if (this.hass && deviceId && (this.hass.entities !== this._resolvedEntities || this.hass.devices !== this._resolvedDevices || deviceId !== this._resolvedDeviceId)) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDevices = this.hass.devices;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, deviceId);
    }
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const includeVisits = this._config?.show_visits === true;
      const key = `${watchKey(this.hass, [this._entities.lastDetection, this._entities.feeding, this._entities.dishAfter])}|visits=${includeVisits}`;
      this._timelineQuery.sync(
        key,
        () => callWS({ type: "kibble/timeline", entry_id: entryId, include_visits: includeVisits }).then((r6) => r6)
      );
    }
  }
  render() {
    if (!this._config || !this.hass) return A;
    const timelineState = this._timelineQuery.state;
    const items = filterVisits(timelineState.data?.items ?? [], this._config.show_visits === true);
    const visible = items.slice(0, this._visibleCount);
    const days = groupByDay(visible, /* @__PURE__ */ new Date());
    const hasMore = items.length > visible.length;
    const showEmpty = !timelineState.error && !timelineState.loading && timelineState.data !== null && days.length === 0;
    return b2`
      <ha-card>
        <div class="container">
          ${this._config.name ? b2`<div class="label">${this._config.name}</div>` : A}
          <div class="rail">
            ${timelineState.error ? this._renderError(timelineState.error) : A}
            ${showEmpty ? this._renderEmpty() : A}
            ${days.map((day) => this._renderDay(day))}
            ${hasMore ? b2`<button type="button" class="show-more" @click=${this._showMore}>Show more</button>` : A}
          </div>
        </div>
      </ha-card>
      <kibble-lightbox
        ?open=${this._lightboxUrl !== null}
        .imageUrl=${this._lightboxUrl}
        .alt=${this._lightboxAlt}
        @close-requested=${this._closeLightbox}
      ></kibble-lightbox>
    `;
  }
  _renderEmpty() {
    return b2`<p class="empty">Nothing to show yet. Feeds and visits appear here as they happen.</p>`;
  }
  _renderError(message) {
    return b2`
      <div class="error">
        <span>Couldn't load the timeline. ${message}</span>
        <button type="button" @click=${this._retryTimeline}>Try again</button>
      </div>
    `;
  }
  _renderDay(day) {
    return b2`
      <div class="day">
        <div class="day-label">${day.label}</div>
        <div class="day-items">${day.items.map((item) => this._renderItem(item))}</div>
      </div>
    `;
  }
  _renderItem(item) {
    if (item.kind === "identified") return this._renderIdentified(item);
    if (item.kind === "eat") return this._renderEat(item);
    if (item.kind === "visit") return this._renderVisit(item);
    return this._renderFeed(item);
  }
  /** The named cat that was actually at the bowl -- no avatar (the name is already the first
   * word of the sentence) and the *live* image from the paired eat/visit, never a stored
   * training sample. */
  _renderIdentified(item) {
    const time = this._timeLabel(item.ts);
    return b2`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${item.image && this._entryId ? this._renderThumb(kibbleImageUrl(this._entryId, item.image_kind, item.image), `${item.cat}, ${time}`) : A}
      </div>
    `;
  }
  /** An "eat" with nobody identified nearby -- still worth a row (food left the bowl), just
   * never a guessed name. */
  _renderEat(item) {
    const time = this._timeLabel(item.ts);
    return b2`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${item.image && this._entryId ? this._renderThumb(kibbleImageUrl(this._entryId, "event", item.image), `A cat, ${time}`) : A}
      </div>
    `;
  }
  /** Only ever rendered when `show_visits` opts back into the noise this card hides by
   * default -- see `lib/timeline.ts#filterVisits`. */
  _renderVisit(item) {
    const time = this._timeLabel(item.ts);
    return b2`
      <div class="row">
        <span class="time">${time}</span>
        <span class="row-text">${detectionHeadline(item)}</span>
        ${item.image && this._entryId ? this._renderThumb(kibbleImageUrl(this._entryId, "event", item.image), `A cat, ${time}`) : A}
      </div>
    `;
  }
  _renderFeed(item) {
    const time = this._timeLabel(item.ts);
    const entryId = this._entryId;
    const summary = feedSummary(item);
    return b2`
      <div class="row row-feed">
        <span class="time">${time}</span>
        <span class="row-text feed-text">
          ${summary.headline}${summary.scheduled ? b2` <span class="quiet">(scheduled)</span>` : A}
        </span>
        <div class="feed-thumbs">
          ${item.before && entryId ? this._renderCaptionedThumb(kibbleImageUrl(entryId, "feed", item.before), `Bowl before the ${time} feed`, "before") : A}
          ${item.after && entryId ? this._renderCaptionedThumb(kibbleImageUrl(entryId, "feed", item.after), `Bowl after the ${time} feed`, "after") : A}
        </div>
      </div>
    `;
  }
  _renderThumb(path, alt) {
    const url = this._imageCache.get(this.hass, path, () => this.requestUpdate());
    return b2`
      <button type="button" class="thumb" ?disabled=${!url} aria-label=${`View photo: ${alt}`} @click=${(event) => this._openLightbox(event, url, alt)}>
        ${url ? b2`<img src=${url} alt="" loading="lazy" />` : A}
      </button>
    `;
  }
  _renderCaptionedThumb(path, alt, caption) {
    return b2`
      <div class="thumb-slot">
        ${this._renderThumb(path, alt)}
        <span class="thumb-caption">${caption}</span>
      </div>
    `;
  }
  _timeLabel(ts) {
    return new Date(ts * 1e3).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
  }
  _openLightbox(event, url, alt) {
    if (!url) return;
    this._lightboxTrigger = event.currentTarget;
    this._lightboxUrl = url;
    this._lightboxAlt = alt;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      padding: 4px 0 12px;
    }
    .label {
      padding: 12px 16px 0;
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      padding: 24px 16px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 8px 16px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button {
      flex: 0 0 auto;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .day-label {
      padding: 14px 16px 6px 68px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      margin-left: 60px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
    }
    .row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 6px 16px 6px 12px;
    }
    .time {
      position: absolute;
      left: -60px;
      width: 48px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .row-text {
      flex: 1 1 auto;
      min-width: 0;
      font-size: var(--kibble-text-body);
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-feed {
      min-height: 56px;
    }
    .feed-text {
      font-weight: 500;
    }
    .feed-thumbs {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex: 0 0 auto;
    }
    .thumb-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .thumb-caption {
      font-size: 10px;
      color: var(--secondary-text-color);
    }
    .quiet {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .thumb {
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      overflow: hidden;
    }
    .thumb:disabled {
      cursor: default;
    }
    .thumb:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .thumb img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .show-more {
      align-self: flex-start;
      margin: 12px 16px 0 68px;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 8px 14px;
      font: inherit;
      font-size: var(--kibble-text-body);
      font-weight: 500;
      cursor: pointer;
      min-height: 40px;
    }
    .show-more:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    @container (max-width: 360px) {
      .day-label {
        padding-left: 52px;
      }
      .day-items {
        margin-left: 44px;
      }
      .time {
        left: -44px;
        width: 36px;
        font-size: 11px;
      }
      .row {
        padding-right: 10px;
      }
    }
  `;
  }
};
customElements.define("kibble-timeline-card", KibbleTimelineCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-timeline-card",
  name: "Kibble Timeline",
  description: "Today's feeds and who's been by, one rail, newest first, with day separators and photos.",
  preview: true
});
function chooseSuggestion(crop, confidence, knownCats) {
  if (crop.guess && crop.guess.score >= confidence && knownCats.has(crop.guess.cat)) {
    return { cat: crop.guess.cat, source: "classifier" };
  }
  if (crop.vendor_cat && knownCats.has(crop.vendor_cat)) {
    return { cat: crop.vendor_cat, source: "vendor" };
  }
  return null;
}
var CROP_SIZE_PX = 224;
var INITIAL_SELECTION_FRACTION = 0.7;
var MIN_SELECTION_FRACTION = 0.15;
var KibbleCropDialog = class extends i4 {
  constructor() {
    super();
    this._imgRef = e5();
    this._canvasRef = e5();
    this._cancelButtonRef = e5();
    this._objectUrl = null;
    this._resolvedFile = null;
    this._naturalWidth = 0;
    this._naturalHeight = 0;
    this._selection = null;
    this._lastBlob = null;
    this._dragState = null;
    this._keydownHandler = (event) => {
      if (event.key === "Escape" && this.open) {
        event.preventDefault();
        this._close();
      }
    };
    this._onImageLoad = () => {
      const img = this._imgRef.value;
      if (!img) return;
      this._naturalWidth = img.naturalWidth;
      this._naturalHeight = img.naturalHeight;
      const size = Math.min(this._naturalWidth, this._naturalHeight) * INITIAL_SELECTION_FRACTION;
      this._selection = { x: (this._naturalWidth - size) / 2, y: (this._naturalHeight - size) / 2, size };
      this.requestUpdate();
      this._drawPreview();
    };
    this._onPointerMove = (event) => {
      const drag = this._dragState;
      if (!drag || drag.pointerId !== event.pointerId || drag.scale === 0) return;
      event.preventDefault();
      const dx = (event.clientX - drag.startClientX) / drag.scale;
      const dy = (event.clientY - drag.startClientY) / drag.scale;
      if (drag.mode === "move") {
        this._selection = this._clamp({ ...drag.startSelection, x: drag.startSelection.x + dx, y: drag.startSelection.y + dy });
      } else {
        const delta = Math.max(dx, dy);
        this._selection = this._clamp({ ...drag.startSelection, size: drag.startSelection.size + delta });
      }
      this.requestUpdate();
      this._drawPreview();
    };
    this._endDrag = (event) => {
      if (this._dragState?.pointerId === event.pointerId) this._dragState = null;
    };
    this._onSelectionKeydown = (event) => {
      if (!this._selection || this._naturalWidth === 0) return;
      const step = Math.max(2, Math.round(Math.min(this._naturalWidth, this._naturalHeight) * 0.02));
      const sel = { ...this._selection };
      switch (event.key) {
        case "ArrowLeft":
          sel.x -= step;
          break;
        case "ArrowRight":
          sel.x += step;
          break;
        case "ArrowUp":
          sel.y -= step;
          break;
        case "ArrowDown":
          sel.y += step;
          break;
        case "+":
        case "=":
          sel.x -= step / 2;
          sel.y -= step / 2;
          sel.size += step;
          break;
        case "-":
        case "_":
          sel.x += step / 2;
          sel.y += step / 2;
          sel.size -= step;
          break;
        default:
          return;
      }
      event.preventDefault();
      this._selection = this._clamp(sel);
      this.requestUpdate();
      this._drawPreview();
    };
    this._useCrop = () => {
      const canvas = this._canvasRef.value;
      if (!canvas || !this._selection) return;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          this._lastBlob = blob;
          this.dispatchEvent(new CustomEvent("use-crop", { detail: { blob }, bubbles: true, composed: true }));
        },
        "image/jpeg",
        0.9
      );
    };
    this._retry = () => {
      if (!this._lastBlob) return;
      this.dispatchEvent(new CustomEvent("use-crop", { detail: { blob: this._lastBlob }, bubbles: true, composed: true }));
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.file = null;
    this.catName = null;
    this.queueIndex = 0;
    this.queueTotal = 1;
    this.busy = false;
    this.error = null;
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      file: { attribute: false },
      catName: { type: String, attribute: "cat-name" },
      queueIndex: { type: Number, attribute: "queue-index" },
      queueTotal: { type: Number, attribute: "queue-total" },
      busy: { type: Boolean },
      error: { type: String }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
  }
  willUpdate() {
    if (this.file !== this._resolvedFile) {
      this._resolvedFile = this.file;
      if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
      this._objectUrl = this.file ? URL.createObjectURL(this.file) : null;
      this._naturalWidth = 0;
      this._naturalHeight = 0;
      this._selection = null;
      this._lastBlob = null;
    }
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      this._cancelButtonRef.value?.focus();
    }
  }
  render() {
    if (!this.open) return A;
    const showQueue = this.queueTotal > 1;
    const isLast = this.queueIndex >= this.queueTotal - 1;
    return b2`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${`Crop a photo of ${this.catName ?? "this cat"}`}>
        <div class="sheet" @click=${(event) => event.stopPropagation()}>
          <div class="heading">
            <span>Add a photo of ${this.catName ?? "this cat"}</span>
            ${showQueue ? b2`<span class="queue">Photo ${this.queueIndex + 1} of ${this.queueTotal}</span>` : A}
          </div>
          <div class="stage">
            ${this._objectUrl ? b2`<img ${n5(this._imgRef)} src=${this._objectUrl} alt="" @load=${this._onImageLoad} />` : A}
            ${this._selection ? this._renderSelection() : A}
          </div>
          <div class="preview-row">
            <canvas ${n5(this._canvasRef)} class="preview" width=${CROP_SIZE_PX} height=${CROP_SIZE_PX} aria-hidden="true"></canvas>
            <p class="hint">
              Drag the square to cover the cat's face, drag its corner to resize. This becomes the training photo
              -- ${CROP_SIZE_PX}\u00d7${CROP_SIZE_PX}.
            </p>
          </div>
          ${this.error ? b2`
                <div class="error">
                  <span>${this.error}</span>
                  <button type="button" @click=${this._retry}>Try again</button>
                </div>
              ` : A}
          <div class="actions">
            <button type="button" class="cancel" ${n5(this._cancelButtonRef)} ?disabled=${this.busy} @click=${this._close}>
              ${showQueue && !isLast ? "Skip" : "Cancel"}
            </button>
            <button type="button" class="use" ?disabled=${this.busy || !this._selection} @click=${this._useCrop}>
              ${this.busy ? "Uploading\u2026" : "Use this crop"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  _renderSelection() {
    const img = this._imgRef.value;
    const sel = this._selection;
    if (!img || !sel || this._naturalWidth === 0) return A;
    const imgRect = img.getBoundingClientRect();
    const stageRect = img.parentElement.getBoundingClientRect();
    const scale = imgRect.width / this._naturalWidth;
    const left = imgRect.left - stageRect.left + sel.x * scale;
    const top = imgRect.top - stageRect.top + sel.y * scale;
    const size = sel.size * scale;
    return b2`
      <div
        class="selection"
        tabindex="0"
        role="group"
        aria-label="Face crop area"
        style="left: ${left}px; top: ${top}px; width: ${size}px; height: ${size}px;"
        @pointerdown=${(event) => this._beginDrag(event, "move")}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
        @keydown=${this._onSelectionKeydown}
      >
        <div
          class="handle"
          @pointerdown=${(event) => this._beginDrag(event, "resize")}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._endDrag}
          @pointercancel=${this._endDrag}
        ></div>
      </div>
    `;
  }
  _beginDrag(event, mode) {
    if (mode === "resize") event.stopPropagation();
    const img = this._imgRef.value;
    if (!img || !this._selection || this._naturalWidth === 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    this._dragState = {
      mode,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startSelection: { ...this._selection },
      scale: img.getBoundingClientRect().width / this._naturalWidth
    };
  }
  _clamp(sel) {
    const maxSize = Math.min(this._naturalWidth, this._naturalHeight);
    const minSize = Math.max(8, maxSize * MIN_SELECTION_FRACTION);
    const size = Math.min(Math.max(sel.size, minSize), maxSize);
    const x2 = Math.min(Math.max(sel.x, 0), this._naturalWidth - size);
    const y3 = Math.min(Math.max(sel.y, 0), this._naturalHeight - size);
    return { x: x2, y: y3, size };
  }
  _drawPreview() {
    const canvas = this._canvasRef.value;
    const img = this._imgRef.value;
    const sel = this._selection;
    if (!canvas || !img || !sel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CROP_SIZE_PX, CROP_SIZE_PX);
    ctx.drawImage(img, sel.x, sel.y, sel.size, sel.size, 0, 0, CROP_SIZE_PX, CROP_SIZE_PX);
  }
  static {
    this.styles = i`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 420px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .queue {
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .stage {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      border-radius: 8px;
      max-height: 50vh;
    }
    .stage img {
      display: block;
      max-width: 100%;
      max-height: 50vh;
      user-select: none;
      -webkit-user-drag: none;
    }
    .selection {
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #fff;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      cursor: move;
      touch-action: none;
    }
    .selection:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .handle {
      position: absolute;
      right: -9px;
      bottom: -9px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid var(--primary-color, #03a9f4);
      cursor: nwse-resize;
      touch-action: none;
    }
    .preview-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .preview {
      flex: 0 0 auto;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
    .error button {
      flex: 0 0 auto;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .actions button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .cancel {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .use {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .actions button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .actions button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-crop-dialog", KibbleCropDialog);
var KibbleFacePicker = class extends i4 {
  constructor() {
    super();
    this._firstButtonRef = e5();
    this._keydownHandler = (event) => {
      if (event.key === "Escape" && this.open) {
        event.preventDefault();
        this._close();
      }
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.cats = [];
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      hass: { attribute: false },
      cats: { attribute: false },
      entryId: { type: String }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      this._firstButtonRef.value?.focus();
    }
  }
  render() {
    if (!this.open) return A;
    return b2`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Choose a cat">
        <div class="sheet" @click=${(event) => event.stopPropagation()}>
          <div class="heading">Choose a cat</div>
          <div class="rows">
            ${this.cats.map(
      (cat, index) => b2`
                <button type="button" class="row" ${index === 0 ? n5(this._firstButtonRef) : A} @click=${() => this._choose(cat.name)}>
                  <kibble-avatar
                    .hass=${this.hass}
                    .name=${cat.name}
                    .colorIndex=${cat.color_index}
                    .entryId=${this.entryId}
                    .sampleName=${cat.avatar}
                  ></kibble-avatar>
                  <span>${cat.name}</span>
                </button>
              `
    )}
            <button type="button" class="row" ${this.cats.length === 0 ? n5(this._firstButtonRef) : A} @click=${() => this._choose("not_a_cat")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Not a cat</span>
            </button>
            <button type="button" class="row" @click=${() => this._choose("other")}>
              <kibble-avatar .name=${null}></kibble-avatar>
              <span>Skip</span>
            </button>
          </div>
          <button type="button" class="cancel" @click=${this._close}>Cancel</button>
        </div>
      </div>
    `;
  }
  _choose(cat) {
    this.dispatchEvent(new CustomEvent("choice", { detail: { cat }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
    }
    @media (min-width: 480px) {
      .backdrop {
        align-items: center;
      }
    }
    .sheet {
      width: 100%;
      max-width: 360px;
      max-height: 80vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      padding: 16px;
      box-sizing: border-box;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    .heading {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      padding-bottom: 8px;
    }
    .rows {
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 4px;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
      border-radius: 8px;
    }
    .row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .row:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    kibble-avatar {
      --kibble-avatar-size: 32px;
    }
    .cancel {
      width: 100%;
      margin-top: 8px;
      min-height: 44px;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
  `;
  }
};
customElements.define("kibble-face-picker", KibbleFacePicker);
var SCHEMA3 = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "confidence", selector: { number: { min: 0, max: 1, step: 0.05, mode: "box" } } }
];
var FIELD_LABELS3 = {
  device_id: "Kibble device",
  name: "Name (optional)",
  confidence: "Classifier confidence needed to suggest it (optional, default 0.7)"
};
var KibbleCatsCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._computeLabel = (field) => FIELD_LABELS3[field.name] ?? field.name;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true }
    };
  }
  setConfig(config) {
    this._config = config;
  }
  render() {
    if (!this._config) return A;
    if (customElements.get("ha-form")) {
      return b2`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA3}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      `;
    }
    return this._renderFallback();
  }
  _renderFallback() {
    const entities = Object.values(this.hass?.entities ?? {});
    const devices = Object.values(this.hass?.devices ?? {}).filter(
      (device) => entities.some((entity) => entity.device_id === device.id && entity.platform === "kibble")
    );
    return b2`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${(event) => this._updateDeviceId(event.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${devices.map(
      (device) => b2`<option value=${device.id} ?selected=${device.id === this._config?.device_id}>${device.name_by_user ?? device.name}</option>`
    )}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name ?? ""}
            @change=${(event) => this._updateName(event.target.value)}
          />
        </label>
        <label>
          <span>Classifier confidence needed to suggest it (optional, default 0.7)</span>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            .value=${this._config?.confidence != null ? String(this._config.confidence) : ""}
            @change=${(event) => this._updateConfidence(event.target.value)}
          />
        </label>
      </div>
    `;
  }
  _formValueChanged(event) {
    this._config = event.detail.value;
    this._fireConfigChanged();
  }
  _updateDeviceId(value) {
    if (!this._config) return;
    this._config = { ...this._config, device_id: value };
    this._fireConfigChanged();
  }
  _updateName(value) {
    if (!this._config) return;
    this._config = { ...this._config, name: value || void 0 };
    this._fireConfigChanged();
  }
  _updateConfidence(value) {
    if (!this._config) return;
    const parsed = Number(value);
    this._config = { ...this._config, confidence: value && Number.isFinite(parsed) ? parsed : void 0 };
    this._fireConfigChanged();
  }
  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    .fallback {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    select,
    input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
    }
  `;
  }
};
customElements.define("kibble-cats-card-editor", KibbleCatsCardEditor);
var EMPTY_ENTITIES2 = { deviceId: "", catPresence: [] };
function catSectionId(name) {
  return `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
function catFromHash(hash) {
  const match = /^#cat=(.+)$/.exec(hash);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
var DEFAULT_CONFIDENCE = 0.7;
var UNDO_WINDOW_MS = 5e3;
var DELETE_CONFIRM_WINDOW_MS = 3e3;
var KibbleCatsCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES2;
    this._catsQuery = new WsQuery(() => this.requestUpdate());
    this._pendingQuery = new WsQuery(() => this.requestUpdate());
    this._sampleQueries = /* @__PURE__ */ new Map();
    this._imageCache = new ImageUrlCache();
    this._lastPendingData = null;
    this._pickerTrigger = null;
    this._fileInputRef = e5();
    this._scrolledTo = null;
    this._onLocationChanged = () => {
      this._scrolledTo = null;
      this.requestUpdate();
    };
    this._onCatMenuFocusOut = (event) => {
      const container = event.currentTarget;
      const next = event.relatedTarget;
      if (!next || !container.contains(next)) this._closeCatMenu();
    };
    this._onCatMenuKeydown = (event) => {
      if (event.key !== "Escape") return;
      const trigger = event.currentTarget.querySelector(".cat-menu-trigger");
      this._closeCatMenu();
      trigger?.focus();
    };
    this._onFilesChosen = (event) => {
      const input = event.target;
      const files = input.files ? Array.from(input.files).filter((file) => file.type.startsWith("image/")) : [];
      input.value = "";
      if (files.length === 0) return;
      this._uploadQueue = files;
      this._uploadQueueTotal = files.length;
      this._uploadError = null;
    };
    this._onUseCrop = (event) => {
      const cat = this._uploadCat;
      if (!cat) return;
      this._uploadBusy = true;
      this._uploadError = null;
      this._blobToBase64(event.detail.blob).then((jpegB64) => {
        const request = this._callWS("kibble/faces/upload", { cat, jpeg_b64: jpegB64 });
        if (!request) throw new Error("Not connected.");
        return request;
      }).then((result) => {
        this._uploadBusy = false;
        if (result.low_quality) this._uploadNotice = "The model isn't confident this is a face.";
        this._advanceUploadQueue();
        this._refreshAll();
      }).catch((err) => {
        this._uploadBusy = false;
        this._uploadError = describeWsError(err);
      });
    };
    this._onCropDialogClosed = () => {
      this._advanceUploadQueue();
    };
    this._closePicker = () => {
      this._pickerCrop = null;
      this._pickerTrigger?.focus();
      this._pickerTrigger = null;
    };
    this._onPickerChoice = (event) => {
      const crop = this._pickerCrop;
      this._pickerCrop = null;
      if (crop) this._confirm(crop, event.detail.cat);
    };
    this._hiddenCrops = /* @__PURE__ */ new Set();
    this._pickerCrop = null;
    this._undo = null;
    this._addName = "";
    this._addBusy = false;
    this._addError = null;
    this._actionError = null;
    this._openMenuFor = null;
    this._deleteConfirmFor = null;
    this._uploadQueue = [];
    this._uploadQueueTotal = 0;
    this._uploadCat = null;
    this._uploadBusy = false;
    this._uploadError = null;
    this._uploadNotice = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _hiddenCrops: { state: true },
      _pickerCrop: { state: true },
      _undo: { state: true },
      _addName: { state: true },
      _addBusy: { state: true },
      _addError: { state: true },
      _actionError: { state: true },
      _openMenuFor: { state: true },
      _deleteConfirmFor: { state: true },
      _uploadQueue: { state: true },
      _uploadQueueTotal: { state: true },
      _uploadCat: { state: true },
      _uploadBusy: { state: true },
      _uploadError: { state: true },
      _uploadNotice: { state: true }
    };
  }
  setConfig(config) {
    if (!config.device_id) {
      throw new Error("Kibble Cats card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }
  getCardSize() {
    return 8;
  }
  static getStubConfig(hass) {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry2) => entry2.platform === "kibble");
    return { type: "custom:kibble-cats-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-cats-card-editor");
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("location-changed", this._onLocationChanged);
    window.addEventListener("hashchange", this._onLocationChanged);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("location-changed", this._onLocationChanged);
    window.removeEventListener("hashchange", this._onLocationChanged);
    this._imageCache.dispose();
    clearTimeout(this._undoTimer);
    clearTimeout(this._deleteConfirmTimer);
  }
  _confidence() {
    return this._config?.confidence ?? DEFAULT_CONFIDENCE;
  }
  updated() {
    const target = catFromHash(window.location.hash);
    if (!target || this._scrolledTo === target) return;
    const section = this.renderRoot.querySelector(`#${CSS.escape(catSectionId(target))}`);
    if (!section) return;
    this._scrolledTo = target;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.classList.add("lit");
    setTimeout(() => section.classList.remove("lit"), 2400);
  }
  willUpdate() {
    const deviceId = this._config?.device_id;
    if (this.hass && deviceId && (this.hass.entities !== this._resolvedEntities || this.hass.devices !== this._resolvedDevices || deviceId !== this._resolvedDeviceId)) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDevices = this.hass.devices;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, deviceId);
    }
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      const key = watchKey(this.hass, [this._entities.pendingFace, this._entities.lastSeenPet]);
      this._catsQuery.sync(key, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
      this._pendingQuery.sync(key, () => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r6) => r6));
      for (const cat of this._catsQuery.state.data?.cats ?? []) {
        if (this._sampleQueries.has(cat.name)) continue;
        const query = new WsQuery(() => this.requestUpdate());
        this._sampleQueries.set(cat.name, query);
      }
      const samplesKey = watchKey(this.hass, [this._entities.pendingFace]);
      for (const [name, query] of this._sampleQueries) {
        query.sync(samplesKey, () => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r6) => r6));
      }
    }
    if (this._pendingQuery.state.data !== this._lastPendingData) {
      this._lastPendingData = this._pendingQuery.state.data;
      this._hiddenCrops = /* @__PURE__ */ new Set();
    }
  }
  render() {
    if (!this._config || !this.hass) return A;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const allCrops = this._pendingQuery.state.data?.crops ?? [];
    const crops = allCrops.filter((crop) => !this._hiddenCrops.has(crop.name));
    const catNames = new Set(cats.map((cat) => cat.name));
    const presentNames = new Set(
      this._entities.catPresence.filter((p3) => this.hass.states[p3.entityId]?.state === "on").map((p3) => p3.name)
    );
    const uploadFile = this._uploadQueue[0] ?? null;
    const uploadIndex = this._uploadQueueTotal - this._uploadQueue.length;
    return b2`
      <ha-card>
        <div class="container">
          ${this._config.name ? b2`<div class="label">${this._config.name}</div>` : A}
          ${this._actionError ? this._renderActionError() : A}
          ${this._uploadNotice ? this._renderUploadNotice() : A}
          <section class="header">
            ${cats.length === 0 ? b2`<p class="empty">No cats yet. Add one to start training.</p>` : b2`<div class="cat-list">${cats.map((cat) => this._renderCatHeader(cat, presentNames.has(cat.name)))}</div>`}
            ${this._renderAddCat()}
          </section>
          <section class="inbox">
            <div class="inbox-heading">
              <span>${crops.length === 1 ? "1 to review" : `${crops.length} to review`}</span>
            </div>
            ${this._pendingQuery.state.error ? this._renderPendingError() : A}
            ${crops.length === 0 && !this._pendingQuery.state.error ? b2`<p class="empty">Nothing to review. New crops arrive when the feeder identifies a cat in view.</p>` : b2`<div class="crop-grid" @keydown=${this._onGridKeydown}>${crops.map((crop) => this._renderCrop(crop, catNames))}</div>`}
          </section>
          ${cats.map((cat) => this._renderGallery(cat))}
        </div>
      </ha-card>
      ${this._undo ? this._renderUndo(this._undo) : A}
      <kibble-face-picker
        ?open=${this._pickerCrop !== null}
        .hass=${this.hass}
        .cats=${cats}
        .entryId=${this._entryId}
        @choice=${this._onPickerChoice}
        @close-requested=${this._closePicker}
      ></kibble-face-picker>
      <input type="file" accept="image/*" multiple class="visually-hidden" ${n5(this._fileInputRef)} @change=${this._onFilesChosen} />
      <kibble-crop-dialog
        ?open=${uploadFile !== null}
        .file=${uploadFile}
        .catName=${this._uploadCat}
        .queueIndex=${uploadIndex}
        .queueTotal=${this._uploadQueueTotal}
        .busy=${this._uploadBusy}
        .error=${this._uploadError}
        @use-crop=${this._onUseCrop}
        @close-requested=${this._onCropDialogClosed}
      ></kibble-crop-dialog>
    `;
  }
  _renderCatHeader(cat, present) {
    const seen = cat.last_seen != null ? `seen ${relativeTimeSentence(new Date(cat.last_seen * 1e3), /* @__PURE__ */ new Date())}` : "not seen yet";
    return b2`
      <div class="cat">
        <kibble-avatar
          class=${present ? "present" : ""}
          .hass=${this.hass}
          .name=${cat.name}
          .colorIndex=${cat.color_index}
          .entryId=${this._entryId}
          .sampleName=${cat.avatar}
        ></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-meta">${cat.samples === 1 ? "1 sample" : `${cat.samples} samples`}, ${seen}</span>
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-expanded=${this._openMenuFor === cat.name}
            aria-label=${`Options for ${cat.name}`}
            @click=${() => this._toggleCatMenu(cat.name)}
          >
            &#8942;
          </button>
          ${this._openMenuFor === cat.name ? this._renderCatMenu(cat) : A}
        </div>
      </div>
    `;
  }
  _renderAddCat() {
    return b2`
      <form class="add-cat" @submit=${this._onAddCatSubmit}>
        <input
          type="text"
          placeholder="Add a cat"
          aria-label="New cat's name"
          .value=${this._addName}
          ?disabled=${this._addBusy}
          @input=${(event) => {
      this._addName = event.target.value;
    }}
        />
        <button type="submit" ?disabled=${this._addBusy || !this._addName.trim()}>Add a cat</button>
        ${this._addError ? b2`<span class="inline-error">${this._addError}</span>` : A}
      </form>
    `;
  }
  async _onAddCatSubmit(event) {
    event.preventDefault();
    const name = this._addName.trim();
    if (!name || !this._entities.deviceId) return;
    this._addBusy = true;
    this._addError = null;
    try {
      await this.hass.callService("kibble", "add_cat", { device_id: this._entities.deviceId, name });
      this._addName = "";
      this._refreshCats();
    } catch (err) {
      this._addError = describeWsError(err);
    } finally {
      this._addBusy = false;
    }
  }
  _renderCatMenu(cat) {
    const confirming = this._deleteConfirmFor === cat.name;
    return b2`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${() => this._startAddPhotos(cat.name)}>Add photos</button>
        <button type="button" role="menuitem" class="danger ${confirming ? "confirming" : ""}" @click=${() => this._onDeleteCatClick(cat.name)}>
          ${confirming ? "Tap again to delete" : "Delete cat\u2026"}
        </button>
      </div>
    `;
  }
  _toggleCatMenu(name) {
    this._openMenuFor = this._openMenuFor === name ? null : name;
  }
  _closeCatMenu() {
    this._openMenuFor = null;
    clearTimeout(this._deleteConfirmTimer);
    this._deleteConfirmFor = null;
  }
  /** Tap-twice confirm, the same window/pattern `kibble-settings-dialog`'s cloud toggle uses --
   * deleting a cat is destructive (it drops every labelled sample and the classifier model) so
   * it needs a second, deliberate tap rather than a single accidental one. */
  _onDeleteCatClick(name) {
    if (this._deleteConfirmFor === name) {
      clearTimeout(this._deleteConfirmTimer);
      this._deleteConfirmFor = null;
      this._openMenuFor = null;
      this._deleteCat(name);
      return;
    }
    this._deleteConfirmFor = name;
    this._deleteConfirmTimer = setTimeout(() => {
      this._deleteConfirmFor = null;
      this.requestUpdate();
    }, DELETE_CONFIRM_WINDOW_MS);
  }
  _deleteCat(name) {
    const request = this._callWS("kibble/cats/delete", { name });
    if (!request) return;
    request.then(() => {
      this._sampleQueries.delete(name);
      this._refreshCats();
    }).catch((err) => {
      this._actionError = { message: `Couldn't delete ${name}. ${describeWsError(err)}`, retry: () => this._deleteCat(name) };
    });
  }
  _startAddPhotos(name) {
    this._openMenuFor = null;
    this._uploadCat = name;
    this._fileInputRef.value?.click();
  }
  _advanceUploadQueue() {
    this._uploadQueue = this._uploadQueue.slice(1);
    this._uploadError = null;
    if (this._uploadQueue.length === 0) {
      this._uploadCat = null;
      this._uploadQueueTotal = 0;
    }
  }
  /** Pure base64, no `data:` URL prefix -- the integration base64-decodes this straight into
   * the raw JPEG bytes `POST /faces/upload` expects. */
  _blobToBase64(blob) {
    return blob.arrayBuffer().then((buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i6 = 0; i6 < bytes.length; i6++) binary += String.fromCharCode(bytes[i6]);
      return btoa(binary);
    });
  }
  /** Shared `entry_id`-injecting wrapper for the three cat-management commands this card calls
   * over WS directly (delete cat, upload a sample, delete an uploaded sample) -- `null` when
   * the connection or entry isn't resolved yet, the same guard every WS call site here already
   * repeats individually. */
  _callWS(type, payload) {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return null;
    return callWS({ type, entry_id: entryId, ...payload }).then((r6) => r6);
  }
  _renderUploadNotice() {
    return b2`
      <div class="notice">
        <span>${this._uploadNotice}</span>
        <button
          type="button"
          aria-label="Dismiss"
          @click=${() => {
      this._uploadNotice = null;
    }}
        >
          &times;
        </button>
      </div>
    `;
  }
  _renderCrop(crop, catNames) {
    const suggestion = chooseSuggestion(crop, this._confidence(), catNames);
    const path = this._entryId ? kibbleImageUrl(this._entryId, "pending", crop.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return b2`
      <div class="crop">
        <button
          type="button"
          class="crop-thumb"
          ?disabled=${!url}
          aria-label=${suggestion ? `Confirm ${suggestion.cat}` : "Choose a cat for this crop"}
          @click=${() => this._onCropTap(crop, suggestion)}
        >
          ${url ? b2`<img src=${url} alt="" loading="lazy" />` : A}
        </button>
        <button type="button" class="chooser" aria-label="Choose a cat for this crop" @click=${(e6) => this._openPicker(crop, e6)}>&#8942;</button>
        <div class="chip ${suggestion ? `chip-${suggestion.source}` : "chip-empty"}">
          ${suggestion ? b2`${suggestion.cat}<span class="mark">${suggestion.source === "classifier" ? "AI" : "ID"}</span>` : "Tap to choose"}
        </div>
      </div>
    `;
  }
  _onGridKeydown(event) {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const grid = event.currentTarget;
    const buttons = [...grid.querySelectorAll(".crop-thumb")];
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex === -1) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = buttons[(currentIndex + delta + buttons.length) % buttons.length];
    next?.focus();
  }
  _onCropTap(crop, suggestion) {
    if (!suggestion) {
      this._pickerCrop = crop;
      return;
    }
    this._confirm(crop, suggestion.cat);
  }
  _openPicker(crop, event) {
    this._pickerTrigger = event.currentTarget;
    this._pickerCrop = crop;
  }
  _confirm(crop, cat) {
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this._hiddenCrops = new Set(this._hiddenCrops).add(crop.name);
    const displayCat = cat === "not_a_cat" ? "Not a cat" : cat === "other" ? "Skip" : cat;
    this.hass.callService("kibble", "label_face", { device_id: deviceId, crop_id: crop.name, cat }).then(() => {
      this._refreshAll();
      this._setUndo({
        message: `Labelled as ${displayCat}. `,
        run: () => {
          this.hass.callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: crop.name }).then(() => this._refreshAll());
        }
      });
    }).catch((err) => {
      const next = new Set(this._hiddenCrops);
      next.delete(crop.name);
      this._hiddenCrops = next;
      this._actionError = { message: `Couldn't label this crop. ${describeWsError(err)}`, retry: () => this._confirm(crop, cat) };
    });
  }
  _setUndo(action) {
    clearTimeout(this._undoTimer);
    this._undo = action;
    this._undoTimer = setTimeout(() => {
      this._undo = null;
    }, UNDO_WINDOW_MS);
  }
  _renderUndo(action) {
    return b2`
      <div class="undo-bar" role="status">
        <span>${action.message}</span>
        <button
          type="button"
          @click=${() => {
      clearTimeout(this._undoTimer);
      this._undo = null;
      action.run();
    }}
        >
          Undo
        </button>
      </div>
    `;
  }
  _renderActionError() {
    const error = this._actionError;
    if (!error) return A;
    return b2`
      <div class="error">
        <span>${error.message}</span>
        <button
          type="button"
          @click=${() => {
      this._actionError = null;
      error.retry();
    }}
        >
          Try again
        </button>
      </div>
    `;
  }
  _renderPendingError() {
    const message = this._pendingQuery.state.error;
    if (!message) return A;
    return b2`
      <div class="error">
        <span>Couldn't load the review queue. ${message}</span>
        <button type="button" @click=${() => this._refreshPending()}>Try again</button>
      </div>
    `;
  }
  /** Per cat: the feeder's own captures first ("Sightings", newest first, each with when it
   * happened -- this is exactly what the "last here" on the feeder view counts, so tapping that
   * tile lands here and finds the same evidence), then the reference photos someone uploaded. */
  _renderGallery(cat) {
    const query = this._sampleQueries.get(cat.name);
    const samples = query?.state.data?.samples ?? [];
    if (samples.length === 0 && cat.samples === 0) return A;
    const sightings = samples.filter((sample) => !sample.name.startsWith("upload-")).sort((a3, b3) => b3.ts - a3.ts);
    const references = samples.filter((sample) => sample.name.startsWith("upload-")).sort((a3, b3) => b3.ts - a3.ts);
    const now = /* @__PURE__ */ new Date();
    return b2`
      <section class="gallery" id=${catSectionId(cat.name)}>
        <div class="gallery-header">
          <kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color_index} .entryId=${this._entryId} .sampleName=${cat.avatar}></kibble-avatar>
          <span class="gallery-name">${cat.name}</span>
          <span class="gallery-sub">${sightings.length === 0 ? "No sightings yet" : sightings.length === 1 ? "1 sighting" : `${sightings.length} sightings`}</span>
        </div>
        ${sightings.length > 0 ? b2`<div class="gallery-grid">
              ${sightings.map((sample) => this._renderSample(cat.name, sample, relativeTimeSentence(new Date(sample.ts * 1e3), now)))}
            </div>` : A}
        ${references.length > 0 ? b2`<div class="gallery-sub">${references.length === 1 ? "1 reference photo" : `${references.length} reference photos`}</div>
              <div class="gallery-grid">${references.map((sample) => this._renderSample(cat.name, sample, null))}</div>` : A}
      </section>
    `;
  }
  _renderSample(catName, sample, caption) {
    const path = this._entryId ? kibbleImageUrl(this._entryId, `sample/${catName}`, sample.name) : null;
    const url = path ? this._imageCache.get(this.hass, path, () => this.requestUpdate()) : null;
    return b2`
      <div class="sample">
        ${url ? b2`<img src=${url} alt="" loading="lazy" title=${new Date(sample.ts * 1e3).toLocaleString()} />` : A}
        <button type="button" class="remove" aria-label=${`Remove this sample of ${catName}`} @click=${() => this._removeSample(catName, sample)}>
          ${"\xD7"}
        </button>
        ${caption ? b2`<span class="caption">${caption}</span>` : A}
      </div>
    `;
  }
  /** `upload-*` samples came in through `kibble/faces/upload`, never through the pending-crop
   * inbox -- unlabelling would try to move a name `GET /faces/pending` never produced, so
   * removing one goes through the dedicated `kibble/faces/delete_sample` command instead. */
  _removeSample(cat, sample) {
    if (sample.name.startsWith("upload-")) {
      const request = this._callWS("kibble/faces/delete_sample", { cat, name: sample.name });
      if (!request) return;
      request.then(() => this._refreshAll()).catch((err) => {
        this._actionError = { message: `Couldn't remove this sample. ${describeWsError(err)}`, retry: () => this._removeSample(cat, sample) };
      });
      return;
    }
    if (!this._entities.deviceId) return;
    const deviceId = this._entities.deviceId;
    this.hass.callService("kibble", "unlabel_face", { device_id: deviceId, cat, name: sample.name }).then(() => this._refreshAll()).catch((err) => {
      this._actionError = { message: `Couldn't remove this sample. ${describeWsError(err)}`, retry: () => this._removeSample(cat, sample) };
    });
  }
  _refreshCats() {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
  }
  _refreshPending() {
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    this._pendingQuery.refresh(() => callWS({ type: "kibble/faces/pending", entry_id: entryId }).then((r6) => r6));
  }
  _refreshAll() {
    this._refreshCats();
    this._refreshPending();
    const callWS = this.hass?.callWS;
    if (!callWS || !this._entryId) return;
    const entryId = this._entryId;
    for (const [name, query] of this._sampleQueries) {
      query.refresh(() => callWS({ type: "kibble/faces/samples", entry_id: entryId, cat: name }).then((r6) => r6));
    }
  }
  static {
    this.styles = i`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      overflow: hidden;
    }
    .container {
      container-type: inline-size;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .label {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-body);
    }
    .error button,
    .inline-error {
      font-size: var(--kibble-text-caption);
    }
    .error button {
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      cursor: pointer;
      min-height: 36px;
    }
    .notice {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-caption);
    }
    .notice button {
      flex: 0 0 auto;
      border: none;
      background: none;
      color: inherit;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      min-width: 32px;
      min-height: 32px;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 40px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }
    .cat-name {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .cat-meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .cat-menu {
      position: relative;
      margin-left: auto;
    }
    .cat-menu-trigger {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
    }
    .cat-menu-trigger:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 5;
      margin-top: 4px;
      min-width: 160px;
      display: flex;
      flex-direction: column;
      padding: 6px;
      border-radius: 10px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 4px 16px rgba(0, 0, 0, 0.25));
    }
    .menu button {
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: var(--kibble-text-body);
      text-align: left;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      min-height: 40px;
    }
    .menu button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .menu .danger {
      color: var(--error-color, #db4437);
    }
    .menu .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    .cat-menu-trigger:focus-visible,
    .menu button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    .add-cat {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .add-cat input {
      min-height: 40px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 10px;
      font: inherit;
      font-size: var(--kibble-text-body);
    }
    .add-cat button {
      min-height: 40px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      padding: 0 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .add-cat button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .inline-error {
      color: var(--error-color, #db4437);
    }
    .inbox {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .inbox-heading {
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .crop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .crop {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .crop-thumb {
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .crop-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .crop-thumb:focus-visible,
    .chooser:focus-visible,
    .remove:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible,
    .undo-bar button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chooser {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: pointer;
      line-height: 1;
      font-size: 14px;
    }
    .chip {
      font-size: 11px;
      text-align: center;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .chip-classifier {
      color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .chip-vendor {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .mark {
      font-size: 9px;
      font-weight: 700;
      padding: 0 4px;
      border-radius: 4px;
      background: color-mix(in srgb, currentColor 16%, transparent);
    }
    .undo-bar {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 999px;
      background: #222;
      color: #fff;
      font-size: var(--kibble-text-body);
      z-index: 10;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .undo-bar button {
      border: none;
      background: none;
      color: #8ecbff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .undo-bar {
        animation: kibble-undo-in 150ms ease-out;
      }
    }
    @keyframes kibble-undo-in {
      from {
        opacity: 0;
        transform: translate(-50%, 8px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .gallery {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
      scroll-margin-top: 16px;
    }
    .gallery-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      outline: 2px solid transparent;
      outline-offset: 4px;
      transition: outline-color 600ms ease;
    }
    .gallery.lit .gallery-header {
      outline-color: var(--kibble-amber, #f2a33c);
    }
    .gallery-name {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .gallery-sub {
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .sample .caption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1px 3px;
      font-size: 10px;
      line-height: 1.2;
      color: #fff;
      background: rgba(0, 0, 0, 0.55);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 0 0 8px 8px;
    }
    .gallery-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sample {
      position: relative;
      width: 56px;
      height: 56px;
    }
    .sample img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
    @container (max-width: 360px) {
      .crop-grid {
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      }
    }
  `;
  }
};
customElements.define("kibble-cats-card", KibbleCatsCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-cats-card",
  name: "Kibble Cats",
  description: "Enrolled cats -- delete or add training photos -- plus a one-tap inbox for the feeder's own face crops.",
  preview: true
});
var EMPTY_ENTITIES3 = { deviceId: "", catPresence: [] };
var PORTION_OPTIONS = [1, 2, 3, 4, 5];
var FEED_ROW_STYLES = `
  .bubble-button-card-container { background: var(--kibble-amber, #f2a33c) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;
function portionStyles(selected, disabled) {
  return `
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${selected ? "background: var(--kibble-amber, #f2a33c) !important;" : ""} ${disabled ? "opacity: 0.5;" : ""} }
  .bubble-button-card { padding: 0 !important; }
  .bubble-name-container { margin: 0 !important; width: 100%; justify-content: center; }
  .bubble-name { width: 100%; justify-content: center; text-align: center; font-size: 17px; font-weight: 600; ${selected ? "color: var(--kibble-ink-on-amber, #241a07) !important;" : ""} }
`;
}
var FEEDING_ROW_STYLES = `
  .bubble-button-card-container { background: var(--error-color, #d9534f) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: #fff !important; }
`;
var KibbleCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES3;
    this._catsQuery = new WsQuery(() => this.requestUpdate());
    this._onBubbleAction = (event) => {
      const detail = event.detail;
      const action = detail?.config?.[`${detail.action}_action`];
      if (action?.action !== "fire-dom-event" || !action.kibble) return;
      event.stopPropagation();
      if (action.kibble === "portion" && typeof action.portion === "number" && this._entities.feedAmount) {
        this.hass.callService("number", "set_value", { value: action.portion }, { entity_id: this._entities.feedAmount });
      } else if (action.kibble === "feed") {
        this._onFeedActivate();
      } else if (action.kibble === "cancel") {
        this._onCancelActivate();
      }
    };
    this._onFeedActivate = () => {
      if (!this._entities.deviceId) return;
      const amount = this._numberState(this._entities.feedAmount) ?? 1;
      this.hass.callService("kibble", "feed", { device_id: this._entities.deviceId, hopper: "both", amount });
    };
    this._onCancelActivate = () => {
      if (!this._entities.deviceId) return;
      this.hass.callService("kibble", "cancel_feed", { device_id: this._entities.deviceId });
    };
    this._openSettings = () => {
      const hash = this._config?.settings_hash;
      if (hash) {
        history.pushState(null, "", hash);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
        return;
      }
      this._settingsOpen = true;
    };
    this._closeSettings = () => {
      this._settingsOpen = false;
    };
    this._settingsOpen = false;
    this._bubble = false;
    void bubbleCardAvailable().then((ok) => {
      this._bubble = ok;
    });
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _settingsOpen: { state: true },
      _bubble: { state: true }
    };
  }
  setConfig(config) {
    if (!config.device_id) {
      throw new Error("Kibble card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }
  getCardSize() {
    return 6;
  }
  static getStubConfig(hass) {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry2) => entry2.platform === "kibble");
    return { type: "custom:kibble-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-card-editor");
  }
  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const height = rect?.height ?? this.getBoundingClientRect().height;
      const width = rect?.width ?? this.getBoundingClientRect().width;
      this.classList.toggle("kiosk", height >= KIOSK_MIN_HEIGHT_PX);
      this.classList.toggle("compact", width < 640 && height > 0 && height <= 520);
    });
    this._resizeObserver.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }
  willUpdate() {
    const deviceId = this._config?.device_id;
    if (this.hass && deviceId && (this.hass.entities !== this._resolvedEntities || this.hass.devices !== this._resolvedDevices || deviceId !== this._resolvedDeviceId)) {
      this._resolvedEntities = this.hass.entities;
      this._resolvedDevices = this.hass.devices;
      this._resolvedDeviceId = deviceId;
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, deviceId);
      this._entryId = resolveEntryId(this.hass.devices ?? {}, deviceId);
    }
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS && this._entities.lastSeenPet) {
      const entryId = this._entryId;
      this._catsQuery.sync(
        watchKey(this.hass, [this._entities.lastSeenPet]),
        () => callWS({ type: "kibble/cats", entry_id: entryId }).then((result) => result)
      );
    }
  }
  render() {
    if (!this._config || !this.hass) return A;
    const e6 = this._entities;
    const feedingState = e6.feeding ? this.hass.states[e6.feeding]?.state : void 0;
    const coreIds = [e6.feeding, e6.bowlFill1, e6.bowlFill2, e6.schedule].filter((id) => Boolean(id));
    const coreStates = coreIds.map((id) => this.hass.states[id]?.state);
    const status = deriveFeederStatus(coreStates, feedingState);
    const feeding = feedingState === "on";
    const hopper1 = this._numberState(e6.bowlFill1);
    const hopper2 = this._numberState(e6.bowlFill2);
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e6.feedAmount) ?? 1;
    const overlay = this._heroOverlay(status);
    return b2`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cameraEntity=${e6.camera}
                  .scryptedId=${this._config.scrypted_id}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!overlay.live}></span>
                ${overlay.catName ? b2`<kibble-avatar
                      .hass=${this.hass}
                      .name=${overlay.catName}
                      .colorIndex=${overlay.colorIndex}
                      .entryId=${this._entryId}
                      .sampleName=${overlay.avatarSample}
                    ></kibble-avatar>` : A}
                <span class="hero-status-text" data-tone=${overlay.tone}>${overlay.text}</span>
              </div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${mdiIcon("cog")}</button>
              ${this._config.name ? b2`<div class="name-chip">${this._config.name}</div>` : A}
            </div>
            <div class="side">
            <kibble-bowl class="bowl-block" .hopper1=${hopper1} .hopper2=${hopper2} .feeding=${feeding}></kibble-bowl>
            <div class="feed-controls" @hass-action=${this._onBubbleAction}>
              ${this._bubble ? b2`<div class="portions">
                      ${this._portionConfigs(feedAmount, status === "unreachable" || feeding).map(
      (config) => b2`<kibble-bubble-row .hass=${this.hass} .config=${config}></kibble-bubble-row>`
    )}
                    </div>
                    <kibble-bubble-row .hass=${this.hass} .config=${this._feedRowConfig(feeding, status === "unreachable")}></kibble-bubble-row>` : b2`<kibble-segmented-picker
                      class="picker-full"
                      .value=${feedAmount}
                      ?disabled=${status === "unreachable" || feeding}
                      @portion-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${feedAmount}
                      ?disabled=${status === "unreachable" || feeding}
                      @value-selected=${this._onPortionSelected}
                    ></kibble-stepper>
                    <kibble-hold-button
                      .label=${feeding ? "Cancel" : "Hold to feed"}
                      .variant=${feeding ? "cancel" : "feed"}
                      ?disabled=${status === "unreachable"}
                      @activate=${feeding ? this._onCancelActivate : this._onFeedActivate}
                    ></kibble-hold-button>`}
            </div>
            ${this._config.schedule_hash ? A : b2`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${scheduleEntries}
                  .scheduleCardStateEntity=${e6.scheduleCardState}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e6} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `;
  }
  _numberState(entityId) {
    if (!entityId) return null;
    const value = Number(this.hass.states[entityId]?.state);
    return Number.isFinite(value) ? value : null;
  }
  /** The video status overlay's full view model. `tone` is "error" only for unreachable (the
   * one case that's actually a problem) and "amber" for dispensing (an active, positive state,
   * matching the accent used everywhere else feeding is in progress); everything else is plain
   * overlay text. The avatar fields are populated only in the idle "who was last seen" case. */
  _heroOverlay(status) {
    const cameraId = this._entities.camera;
    const cameraState = cameraId ? this.hass.states[cameraId] : void 0;
    const live = cameraState !== void 0 && cameraState.state !== "unavailable";
    if (status === "unreachable") {
      return { text: statusText(status, null), tone: "error", live, catName: null, colorIndex: null, avatarSample: null };
    }
    if (status === "dispensing") {
      return { text: statusText(status, null), tone: "amber", live, catName: null, colorIndex: null, avatarSample: null };
    }
    const seen = this._catSeen();
    if (!seen) {
      return { text: "Ready to feed", tone: "normal", live, catName: null, colorIndex: null, avatarSample: null };
    }
    const roster = this._catsQuery.state.data?.cats.find((cat) => cat.name === seen.name) ?? null;
    return {
      text: `${seen.name} seen ${seen.relative}`,
      tone: "normal",
      live,
      catName: seen.name,
      colorIndex: roster?.color_index ?? null,
      avatarSample: roster?.avatar ?? null
    };
  }
  /** Who was last seen and how long ago, straight off `lastSeenPet`'s own state/`last_changed` --
   * `null` covers both "no such entity" and the sensor's own unknown/unavailable idle value. */
  _catSeen() {
    const id = this._entities.lastSeenPet;
    const entityState = id ? this.hass.states[id] : void 0;
    if (!entityState || entityState.state === "unavailable" || entityState.state.toLowerCase() === "unknown") {
      return null;
    }
    return { name: entityState.state, relative: relativeTimeSentence(new Date(entityState.last_changed), /* @__PURE__ */ new Date()) };
  }
  _scheduleEntries() {
    const id = this._entities.schedule;
    if (!id) return [];
    const attrs = this.hass.states[id]?.attributes;
    const entries = attrs?.entries;
    return Array.isArray(entries) ? entries : [];
  }
  // The two Bubble rows. Bubble handles the gestures (tap / hold) and reports them as HA's
  // standard `hass-action` event carrying the action config, so each action here is a
  // `fire-dom-event` tagged with a `kibble` verb the handler below dispatches on.
  _portionConfigs(selected, disabled) {
    const none = { action: "none" };
    return PORTION_OPTIONS.map((portion) => {
      const actions = {
        tap_action: disabled ? none : { action: "fire-dom-event", kibble: "portion", portion },
        double_tap_action: none,
        hold_action: none
      };
      return {
        card_type: "button",
        button_type: "name",
        name: String(portion),
        show_icon: false,
        show_state: false,
        styles: portionStyles(portion === selected, disabled),
        // Bubble wires top-level actions to the icon and `button_action` to the button body.
        ...actions,
        button_action: actions
      };
    });
  }
  _feedRowConfig(feeding, disabled) {
    const none = { action: "none" };
    const actions = {
      tap_action: feeding && !disabled ? { action: "fire-dom-event", kibble: "cancel" } : none,
      double_tap_action: none,
      hold_action: !feeding && !disabled ? { action: "fire-dom-event", kibble: "feed" } : none
    };
    return {
      card_type: "button",
      button_type: "name",
      name: disabled ? "Feeder unreachable" : feeding ? "Feeding\u2026 tap to cancel" : "Hold to feed",
      icon: feeding ? "mdi:stop-circle-outline" : "mdi:bowl-mix",
      styles: feeding ? FEEDING_ROW_STYLES : FEED_ROW_STYLES,
      ...actions,
      button_action: actions
    };
  }
  _onPortionSelected(event) {
    if (!this._entities.feedAmount) return;
    this.hass.callService("number", "set_value", { value: event.detail.value }, { entity_id: this._entities.feedAmount });
  }
  static {
    this.styles = i`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${r(KIBBLE_AMBER)};
      --kibble-amber-dark: ${r(KIBBLE_AMBER_DARK)};
      --kibble-ink-on-amber: ${r(KIBBLE_INK_ON_AMBER)};
      --kibble-live: ${r(KIBBLE_LIVE)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
    }
    :host(.kiosk) {
      --kibble-touch-target: 60px;
      --kibble-feed-button-height: 72px;
      --kibble-number-size: 42px;
      --kibble-feed-label-size: 22px;
      --kibble-status-size: 27px;
      --kibble-segment-size: 20px;
      --kibble-schedule-size: 17px;
    }
    ha-card {
      overflow: hidden;
      height: 100%;
      display: block;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      height: 100%;
    }
    .root {
      display: grid;
      height: 100%;
      overflow-y: auto;
      gap: 10px;
      padding-bottom: 10px;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "bowl" "feed" "schedule";
    }
    /* The feeder's streams are 16:10 (1152x720 sub, 1728x1080 main): the hero keeps that ratio
     * so the fisheye frame is never cropped or stretched to fit a layout guess. */
    .side {
      display: contents;
    }
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 10;
      background: #1c1c1c;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #bbb;
      font-size: 14px;
    }
    /* The live dot + latest cat + avatar: the one thing this restyle puts front and center --
     * "who has been by" belongs on the video itself, not buried in a footer row. */
    .hero-status {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: calc(100% - 56px);
      width: fit-content;
      padding: 5px 10px 5px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--kibble-live);
      flex: 0 0 auto;
    }
    .live-dot[hidden] {
      display: none;
    }
    .hero-status kibble-avatar {
      --kibble-avatar-size: 20px;
    }
    .hero-status-text {
      font-size: 13px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero-status-text[data-tone="amber"] {
      color: var(--kibble-amber);
    }
    .hero-status-text[data-tone="error"] {
      color: var(--error-color, #ff8a80);
    }
    .gear-button {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      cursor: pointer;
    }
    .name-chip {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
    }
    .bowl-block {
      grid-area: bowl;
      padding: 8px 14px 0;
      --kibble-bowl-max-width: 300px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .portions {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .portions > * {
      min-width: 0;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .feed-controls .picker-full {
      display: none;
    }
    .feed-controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .feed-controls .picker-full {
        display: block;
      }
      .feed-controls .picker-compact {
        display: none;
      }
    }
    .schedule-row {
      grid-area: schedule;
      padding: 0 10px 6px;
    }
    :host(.compact) .root {
      gap: 6px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }
    :host(.compact) .bowl-block {
      padding-top: 2px;
      --kibble-bowl-max-width: 260px;
    }

    /* >=640px: two columns, camera left, silo/feed/schedule stacked right. The camera is 60%
     * of the card at 16:10, so the row is exactly 0.6 * 10/16 = 37.5% of the card width tall;
     * the right column is boxed to that same height so it can never outgrow the video. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto;
        grid-template-areas: "hero side";
        gap: 4px;
        padding-bottom: 0;
        height: auto;
        overflow: visible;
      }
      .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto auto;
        height: calc(100cqw * 0.6 * 10 / 16);
        min-height: 0;
      }
      .bowl-block,
      .feed-controls {
        grid-area: unset;
        align-self: start;
        justify-self: stretch;
        z-index: 0;
        margin: 0;
        width: auto;
        background: none;
        border-radius: 0;
      }
      .bowl-block {
        grid-area: unset;
        align-self: stretch;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 300px;
      }
      .bowl-block > * {
        height: 100%;
        max-height: 100%;
      }
      .feed-controls {
        grid-area: unset;
        padding: 6px 16px 12px;
        --kibble-touch-target: 48px;
        --kibble-segment-size: 16px;
      }
      .schedule-row {
        grid-area: unset;
        padding: 2px 16px 10px;
        align-self: start;
      }
    }
  `;
  }
};
customElements.define("kibble-card", KibbleCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-card",
  name: "Kibble",
  description: "The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",
  preview: true
});

// src/lib/resolve-entities.ts
var RULES2 = {
  feeding: { domain: "binary_sensor", translationKeys: ["feeding"], idSuffixes: ["_feeding"] },
  bowlFill1: { domain: "sensor", translationKeys: ["bowl_fill_1"], idSuffixes: ["_bowl_fill_1", "_bowl_fill_hopper_1"] },
  bowlFill2: { domain: "sensor", translationKeys: ["bowl_fill_2"], idSuffixes: ["_bowl_fill_2", "_bowl_fill_hopper_2"] },
  desiccantDays: { domain: "sensor", translationKeys: ["desiccant_days", "desiccant_left"], idSuffixes: ["_desiccant_days", "_desiccant_left"] },
  schedule: { domain: "sensor", translationKeys: ["schedule"], idSuffixes: ["_schedule"] },
  scheduleCardState: { domain: "sensor", translationKeys: ["schedule_card_state"], idSuffixes: ["_schedule_card_state"] },
  feedButton: { domain: "button", translationKeys: ["feed"], idSuffixes: ["_feed"] },
  feedButtonHopper1: { domain: "button", translationKeys: ["feed_hopper_1"], idSuffixes: ["_feed_hopper_1"] },
  feedButtonHopper2: { domain: "button", translationKeys: ["feed_hopper_2"], idSuffixes: ["_feed_hopper_2"] },
  cancelFeedButton: { domain: "button", translationKeys: ["cancel_feed"], idSuffixes: ["_cancel_feed"] },
  feedAmount: { domain: "number", translationKeys: ["feed_amount"], idSuffixes: ["_feed_amount"] },
  feedAmountHopper1: { domain: "number", translationKeys: ["feed_amount_hopper_1"], idSuffixes: ["_feed_amount_hopper_1"] },
  feedAmountHopper2: { domain: "number", translationKeys: ["feed_amount_hopper_2"], idSuffixes: ["_feed_amount_hopper_2"] },
  cloudSwitch: { domain: "switch", translationKeys: ["cloud", "petkit_cloud"], idSuffixes: ["_cloud", "_petkit_cloud"] },
  cloudConnection: { domain: "sensor", translationKeys: ["cloud_connection"], idSuffixes: ["_cloud_connection"] },
  nightVisionSwitch: { domain: "switch", translationKeys: ["night", "night_vision"], idSuffixes: ["_night", "_night_vision"] },
  statusLedSwitch: { domain: "switch", translationKeys: ["light", "status_led"], idSuffixes: ["_light", "_status_led"] },
  microphoneSwitch: { domain: "switch", translationKeys: ["microphone"], idSuffixes: ["_microphone"] },
  volume: { domain: "number", translationKeys: ["volume"], idSuffixes: ["_volume"] },
  lastSeenPet: { domain: "sensor", translationKeys: ["last_seen_pet"], idSuffixes: ["_last_seen_pet"] },
  dishBefore: { domain: "image", translationKeys: ["dish_before"], idSuffixes: ["_dish_before"] },
  dishAfter: { domain: "image", translationKeys: ["dish_after"], idSuffixes: ["_dish_after"] },
  wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] },
  lastDetection: { domain: "sensor", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionsToday: { domain: "sensor", translationKeys: ["detections_today"], idSuffixes: ["_detections_today"] },
  lastDetectionImage: { domain: "image", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  pendingFace: { domain: "image", translationKeys: ["pending_face"], idSuffixes: ["_pending_face"] }
};
function domainOf2(entityId) {
  return entityId.slice(0, entityId.indexOf("."));
}
function objectIdOf2(entityId) {
  return entityId.slice(entityId.indexOf(".") + 1);
}
function matchesRule2(entry2, rule) {
  if (domainOf2(entry2.entity_id) !== rule.domain) return false;
  if (entry2.translation_key && rule.translationKeys.includes(entry2.translation_key)) return true;
  const objectId = objectIdOf2(entry2.entity_id);
  return rule.idSuffixes.some((suffix) => objectId.endsWith(suffix));
}
function catDisplayName2(entry2) {
  const raw = entry2.name ?? entry2.original_name;
  if (raw) {
    return raw.replace(/\s+present$/i, "").trim() || raw;
  }
  const objectId = objectIdOf2(entry2.entity_id);
  const slug = objectId.replace(/_present$/, "");
  const lastWord = slug.split("_").filter(Boolean).pop();
  if (!lastWord) return "Cat";
  return lastWord[0].toUpperCase() + lastWord.slice(1);
}
function isCatPresenceEntry2(entry2) {
  if (domainOf2(entry2.entity_id) !== "binary_sensor") return false;
  if (entry2.translation_key === "present" || entry2.translation_key?.endsWith("_present")) return true;
  return objectIdOf2(entry2.entity_id).endsWith("_present");
}
function resolveKibbleEntities2(entities, deviceId) {
  const result = { deviceId, catPresence: [] };
  const forDevice = Object.values(entities).filter(
    (e6) => e6.device_id === deviceId && !e6.disabled_by
  );
  for (const entry2 of forDevice) {
    if (domainOf2(entry2.entity_id) === "camera" && !result.camera) {
      result.camera = entry2.entity_id;
      continue;
    }
    if (domainOf2(entry2.entity_id) === "media_player" && !result.speaker) {
      result.speaker = entry2.entity_id;
      continue;
    }
    if (isCatPresenceEntry2(entry2)) {
      result.catPresence.push({ entityId: entry2.entity_id, name: catDisplayName2(entry2) });
      continue;
    }
    for (const roleEntry of Object.entries(RULES2)) {
      const [role, rule] = roleEntry;
      if (result[role]) continue;
      if (matchesRule2(entry2, rule)) {
        result[role] = entry2.entity_id;
        break;
      }
    }
  }
  result.catPresence.sort((a3, b3) => a3.name.localeCompare(b3.name));
  return result;
}

// dev/fixtures.ts
var DEVICE_ID = "kibble-device-1";
var ENTRY_ID = "kibble-entry-1";
function entry(entityId, translationKey) {
  return { entity_id: entityId, device_id: DEVICE_ID, platform: "kibble", translation_key: translationKey, disabled_by: null };
}
function state(entityId, value, attributes = {}, lastChanged) {
  const changed = lastChanged ?? (/* @__PURE__ */ new Date()).toISOString();
  return { entity_id: entityId, state: value, attributes, last_changed: changed, last_updated: changed };
}
var SCHEDULE_ENTRIES = [
  { id: "a1", time: "07:30", amount_l: 5, amount_r: 5, enabled: true },
  { id: "a2", time: "12:00", amount_l: 3, amount_r: 3, enabled: true },
  { id: "a3", time: "18:00", amount_l: 5, amount_r: 5, enabled: false }
];
function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 6e4).toISOString();
}
var DEVICE = {
  id: DEVICE_ID,
  name: "Cat Feeder",
  name_by_user: null,
  model: "YumShare Dual 2",
  manufacturer: "Petkit",
  config_entries: [ENTRY_ID]
};
var ENTITY_IDS = {
  camera: "camera.plant_room_cat_feeder",
  feeding: "binary_sensor.plant_room_cat_feeder_feeding",
  bowlFill1: "sensor.plant_room_cat_feeder_bowl_fill_1",
  bowlFill2: "sensor.plant_room_cat_feeder_bowl_fill_2",
  desiccantDays: "sensor.plant_room_cat_feeder_desiccant_days",
  schedule: "sensor.plant_room_cat_feeder_schedule",
  feedButton: "button.plant_room_cat_feeder_feed",
  feedButtonHopper1: "button.plant_room_cat_feeder_feed_hopper_1",
  feedButtonHopper2: "button.plant_room_cat_feeder_feed_hopper_2",
  cancelFeedButton: "button.plant_room_cat_feeder_cancel_feed",
  feedAmount: "number.plant_room_cat_feeder_feed_amount",
  feedAmountHopper1: "number.plant_room_cat_feeder_feed_amount_hopper_1",
  feedAmountHopper2: "number.plant_room_cat_feeder_feed_amount_hopper_2",
  cloudSwitch: "switch.plant_room_cat_feeder_petkit_cloud",
  cloudConnection: "sensor.plant_room_cat_feeder_cloud_connection",
  nightVisionSwitch: "switch.plant_room_cat_feeder_night_vision",
  statusLedSwitch: "switch.plant_room_cat_feeder_status_led",
  microphoneSwitch: "switch.plant_room_cat_feeder_microphone",
  volume: "number.plant_room_cat_feeder_volume",
  lastSeenPet: "sensor.plant_room_cat_feeder_last_seen_pet",
  wifiNetwork: "sensor.plant_room_cat_feeder_wifi_network",
  lastDetection: "sensor.plant_room_cat_feeder_last_detection",
  detectionsToday: "sensor.plant_room_cat_feeder_detections_today",
  lastDetectionImage: "image.plant_room_cat_feeder_last_detection",
  dishBefore: "image.plant_room_cat_feeder_dish_before",
  dishAfter: "image.plant_room_cat_feeder_dish_after",
  pendingFace: "image.plant_room_cat_feeder_pending_face"
};
function registryFor(includeWifi) {
  const registry = {
    [ENTITY_IDS.camera]: entry(ENTITY_IDS.camera, ""),
    [ENTITY_IDS.feeding]: entry(ENTITY_IDS.feeding, "feeding"),
    [ENTITY_IDS.bowlFill1]: entry(ENTITY_IDS.bowlFill1, "bowl_fill_1"),
    [ENTITY_IDS.bowlFill2]: entry(ENTITY_IDS.bowlFill2, "bowl_fill_2"),
    [ENTITY_IDS.desiccantDays]: entry(ENTITY_IDS.desiccantDays, "desiccant_days"),
    [ENTITY_IDS.schedule]: entry(ENTITY_IDS.schedule, "schedule"),
    [ENTITY_IDS.feedButton]: entry(ENTITY_IDS.feedButton, "feed"),
    [ENTITY_IDS.feedButtonHopper1]: entry(ENTITY_IDS.feedButtonHopper1, "feed_hopper_1"),
    [ENTITY_IDS.feedButtonHopper2]: entry(ENTITY_IDS.feedButtonHopper2, "feed_hopper_2"),
    [ENTITY_IDS.cancelFeedButton]: entry(ENTITY_IDS.cancelFeedButton, "cancel_feed"),
    [ENTITY_IDS.feedAmount]: entry(ENTITY_IDS.feedAmount, "feed_amount"),
    [ENTITY_IDS.feedAmountHopper1]: entry(ENTITY_IDS.feedAmountHopper1, "feed_amount_hopper_1"),
    [ENTITY_IDS.feedAmountHopper2]: entry(ENTITY_IDS.feedAmountHopper2, "feed_amount_hopper_2"),
    [ENTITY_IDS.cloudSwitch]: entry(ENTITY_IDS.cloudSwitch, "cloud"),
    [ENTITY_IDS.cloudConnection]: entry(ENTITY_IDS.cloudConnection, "cloud_connection"),
    [ENTITY_IDS.nightVisionSwitch]: entry(ENTITY_IDS.nightVisionSwitch, "night"),
    [ENTITY_IDS.statusLedSwitch]: entry(ENTITY_IDS.statusLedSwitch, "light"),
    [ENTITY_IDS.microphoneSwitch]: entry(ENTITY_IDS.microphoneSwitch, "microphone"),
    [ENTITY_IDS.volume]: entry(ENTITY_IDS.volume, "volume"),
    [ENTITY_IDS.lastSeenPet]: entry(ENTITY_IDS.lastSeenPet, "last_seen_pet"),
    [ENTITY_IDS.lastDetection]: entry(ENTITY_IDS.lastDetection, "last_detection"),
    [ENTITY_IDS.detectionsToday]: entry(ENTITY_IDS.detectionsToday, "detections_today"),
    [ENTITY_IDS.lastDetectionImage]: entry(ENTITY_IDS.lastDetectionImage, "last_detection"),
    [ENTITY_IDS.dishBefore]: entry(ENTITY_IDS.dishBefore, "dish_before"),
    [ENTITY_IDS.dishAfter]: entry(ENTITY_IDS.dishAfter, "dish_after"),
    [ENTITY_IDS.pendingFace]: entry(ENTITY_IDS.pendingFace, "pending_face")
  };
  if (includeWifi) {
    registry[ENTITY_IDS.wifiNetwork] = entry(ENTITY_IDS.wifiNetwork, "wifi_network");
  }
  return registry;
}
function scheduleState() {
  const enabledCount = SCHEDULE_ENTRIES.filter((e6) => e6.enabled).length;
  return state(ENTITY_IDS.schedule, String(SCHEDULE_ENTRIES.length), {
    entries: SCHEDULE_ENTRIES,
    last_modified: minutesAgo(180),
    friendly_name: `${enabledCount} scheduled`
  });
}
function buildIdle() {
  const states = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "streaming", { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "off", {}, minutesAgo(126)),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "62", { unit_of_measurement: "%" }),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "65", { unit_of_measurement: "%" }),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "12", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "on"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "connected"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "6", { min: 0, max: 9, step: 1 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Kitty", { score: 0.94 }, minutesAgo(126)),
    // An unidentified visit: Kibble saw a cat but did not match it to Kitty or Pancake, so the
    // row shows the class ("Seen") and never a guessed name.
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, minutesAgo(14), { class: "visit" }),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "16", {
      by_class: { visit: 16 },
      capped: false
    }),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, minutesAgo(14), {
      entity_picture: "./camera-frame.svg"
    }),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(390), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(390), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(6), { status: "pending" })
  };
  return { device: DEVICE, entities: registryFor(false), states };
}
function buildDispensing() {
  const states = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "streaming", { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "on", {}, minutesAgo(0)),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "40", { unit_of_measurement: "%" }),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "71", { unit_of_measurement: "%" }),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "3", { unit_of_measurement: "d" }),
    [ENTITY_IDS.schedule]: scheduleState(),
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "5", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "off"),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "blocked"),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "off"),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "on"),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "on"),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "6", { min: 0, max: 9, step: 1 }),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Pancake", { score: 0.88 }, minutesAgo(1)),
    // Mid-dispense: the cat that tripped the detection is still at the bowl.
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, minutesAgo(1), {
      class: "eat",
      cat: "Pancake"
    }),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "9", { by_class: { visit: 7, eat: 2 } }),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, minutesAgo(1), {
      entity_picture: "./camera-frame.svg"
    }),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, minutesAgo(1), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, minutesAgo(1), { entity_picture: "./camera-frame.svg" }),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, minutesAgo(1), { status: "pending" }),
    [ENTITY_IDS.wifiNetwork]: state(ENTITY_IDS.wifiNetwork, "Good (-52 dBm)")
  };
  return { device: DEVICE, entities: registryFor(true), states };
}
function buildUnreachable() {
  const states = {
    [ENTITY_IDS.camera]: state(ENTITY_IDS.camera, "unavailable", {}),
    [ENTITY_IDS.feeding]: state(ENTITY_IDS.feeding, "unavailable", {}),
    [ENTITY_IDS.bowlFill1]: state(ENTITY_IDS.bowlFill1, "unavailable", {}),
    [ENTITY_IDS.bowlFill2]: state(ENTITY_IDS.bowlFill2, "unavailable", {}),
    [ENTITY_IDS.desiccantDays]: state(ENTITY_IDS.desiccantDays, "unavailable", {}),
    [ENTITY_IDS.schedule]: state(ENTITY_IDS.schedule, "unavailable", {}),
    // HA-local (RestoreEntity) state, not device-backed — stays available per number.py.
    [ENTITY_IDS.feedAmount]: state(ENTITY_IDS.feedAmount, "3", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper1]: state(ENTITY_IDS.feedAmountHopper1, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.feedAmountHopper2]: state(ENTITY_IDS.feedAmountHopper2, "2", { min: 1, max: 20, step: 1 }),
    [ENTITY_IDS.cloudSwitch]: state(ENTITY_IDS.cloudSwitch, "unavailable", {}),
    [ENTITY_IDS.cloudConnection]: state(ENTITY_IDS.cloudConnection, "unavailable", {}),
    [ENTITY_IDS.nightVisionSwitch]: state(ENTITY_IDS.nightVisionSwitch, "unavailable", {}),
    [ENTITY_IDS.statusLedSwitch]: state(ENTITY_IDS.statusLedSwitch, "unavailable", {}),
    [ENTITY_IDS.microphoneSwitch]: state(ENTITY_IDS.microphoneSwitch, "unavailable", {}),
    [ENTITY_IDS.volume]: state(ENTITY_IDS.volume, "unavailable", {}),
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "unavailable", {}),
    [ENTITY_IDS.lastDetection]: state(ENTITY_IDS.lastDetection, "unavailable", {}),
    [ENTITY_IDS.detectionsToday]: state(ENTITY_IDS.detectionsToday, "unavailable", {}),
    [ENTITY_IDS.lastDetectionImage]: state(ENTITY_IDS.lastDetectionImage, "unavailable", {}),
    [ENTITY_IDS.dishBefore]: state(ENTITY_IDS.dishBefore, "unavailable", {}),
    [ENTITY_IDS.dishAfter]: state(ENTITY_IDS.dishAfter, "unavailable", {}),
    [ENTITY_IDS.pendingFace]: state(ENTITY_IDS.pendingFace, "unavailable", {})
  };
  return { device: DEVICE, entities: registryFor(false), states };
}
function buildFixture(scenario) {
  if (scenario === "idle") return buildIdle();
  if (scenario === "dispensing") return buildDispensing();
  return buildUnreachable();
}
function secondsAgo(minutes) {
  return Math.floor(Date.now() / 1e3) - minutes * 60;
}
function localTime(hour, minute, daysAgo = 0) {
  const d3 = /* @__PURE__ */ new Date();
  d3.setDate(d3.getDate() - daysAgo);
  d3.setHours(hour, minute, 0, 0);
  return Math.floor(d3.getTime() / 1e3);
}
var CATS = [
  { name: "Kitty", samples: 12, last_seen: secondsAgo(126), avatar: "1789500000-kitty.jpg", vendor_pet_id: 101321480, color_index: 0 },
  { name: "Pancake", samples: 11, last_seen: secondsAgo(1), avatar: "1789500600-pancake.jpg", vendor_pet_id: 101321488, color_index: 1 }
];
var PENDING_CROPS = [
  { name: `${secondsAgo(340)}-101321480.jpg`, ts: secondsAgo(340), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.91 } },
  { name: `${secondsAgo(325)}-101321488.jpg`, ts: secondsAgo(325), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: { cat: "Pancake", score: 0.85 } },
  { name: `${secondsAgo(310)}-101321480.jpg`, ts: secondsAgo(310), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.88 } },
  // Disagreement: the classifier isn't confident, and the feeder's own vendor id says Kitty --
  // the suggestion chip should defer to the vendor id here, not the low-confidence guess.
  { name: `${secondsAgo(295)}-101321480.jpg`, ts: secondsAgo(295), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Pancake", score: 0.45 } },
  { name: `${secondsAgo(280)}-101321488.jpg`, ts: secondsAgo(280), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: null },
  { name: `${secondsAgo(265)}-101321480.jpg`, ts: secondsAgo(265), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: null },
  // No classifier guess and no vendor match at all -- tapping this one has nothing to confirm.
  { name: `${secondsAgo(250)}-unknown.jpg`, ts: secondsAgo(250), vendor_pet_id: null, vendor_cat: null, guess: null },
  { name: `${secondsAgo(235)}-101321480.jpg`, ts: secondsAgo(235), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: { cat: "Kitty", score: 0.73 } },
  // Below the confidence bar with no vendor match to fall back to: also no suggestion.
  { name: `${secondsAgo(220)}-101321480.jpg`, ts: secondsAgo(220), vendor_pet_id: 101321480, vendor_cat: null, guess: { cat: "Kitty", score: 0.3 } },
  { name: `${secondsAgo(205)}-101321488.jpg`, ts: secondsAgo(205), vendor_pet_id: 101321488, vendor_cat: "Pancake", guess: { cat: "Pancake", score: 0.95 } },
  { name: `${secondsAgo(190)}-unknown.jpg`, ts: secondsAgo(190), vendor_pet_id: null, vendor_cat: null, guess: null },
  // Exactly at the default confidence threshold -- still counts as confident.
  { name: `${secondsAgo(175)}-101321480.jpg`, ts: secondsAgo(175), vendor_pet_id: 101321480, vendor_cat: null, guess: { cat: "Kitty", score: 0.7 } },
  { name: `${secondsAgo(160)}-101321480.jpg`, ts: secondsAgo(160), vendor_pet_id: 101321480, vendor_cat: "Kitty", guess: null },
  // Just below threshold with no vendor match either.
  { name: `${secondsAgo(6)}-101321488.jpg`, ts: secondsAgo(6), vendor_pet_id: 101321488, vendor_cat: null, guess: { cat: "Pancake", score: 0.68 } }
];
function samplesFor(catName, count, startMinutesAgo) {
  return Array.from({ length: count }, (_2, i6) => {
    const ts = secondsAgo(startMinutesAgo + i6 * 720);
    return { name: `${ts}-${catName.toLowerCase()}.jpg`, ts };
  });
}
function uploadSamplesFor(catName, count, startMinutesAgo) {
  return Array.from({ length: count }, (_2, i6) => {
    const ts = secondsAgo(startMinutesAgo + i6 * 20);
    return { name: `upload-${ts}000.jpg`, ts };
  });
}
var SAMPLES_BY_CAT = {
  Kitty: samplesFor("Kitty", 12, 200),
  Pancake: [...samplesFor("Pancake", 9, 400), ...uploadSamplesFor("Pancake", 2, 15)]
};
var TIMELINE_ITEMS = [
  { kind: "identified", ts: localTime(18, 4), cat: "Pancake", paired_class: "eat", image: `${localTime(18, 4)}-event.jpg`, image_kind: "track" },
  { kind: "identified", ts: localTime(17, 22), cat: "Pancake", paired_class: "face", image: `${localTime(17, 22)}-event.jpg`, image_kind: "event" },
  { kind: "visit", ts: localTime(15, 50), image: `${localTime(15, 50)}-event.jpg` },
  { kind: "identified", ts: localTime(12, 10), cat: "Kitty", paired_class: "eat", image: `${localTime(12, 10)}-event.jpg`, image_kind: "track" },
  {
    kind: "feed",
    ts: localTime(12, 0),
    amount: 3,
    hopper: "both",
    manual: true,
    before: `${localTime(12, 0)}-before.jpg`,
    after: `${localTime(12, 0)}-after.jpg`
  },
  { kind: "identified", ts: localTime(9, 45), cat: "Kitty", paired_class: null, image: null, image_kind: "track" },
  { kind: "eat", ts: localTime(8, 5), image: `${localTime(8, 5)}-event.jpg` },
  {
    kind: "feed",
    ts: localTime(7, 30),
    amount: 5,
    hopper: "both",
    manual: false,
    before: `${localTime(7, 30)}-before.jpg`,
    after: `${localTime(7, 30)}-after.jpg`
  },
  { kind: "identified", ts: localTime(7, 28), cat: "Kitty", paired_class: "eat", image: `${localTime(7, 28)}-event.jpg`, image_kind: "track" },
  { kind: "identified", ts: localTime(19, 10, 1), cat: "Pancake", paired_class: "eat", image: `${localTime(19, 10, 1)}-event.jpg`, image_kind: "track" },
  {
    kind: "feed",
    ts: localTime(18, 0, 1),
    amount: 5,
    hopper: "1",
    manual: true,
    before: `${localTime(18, 0, 1)}-before.jpg`,
    after: `${localTime(18, 0, 1)}-after.jpg`
  },
  { kind: "eat", ts: localTime(12, 15, 1), image: `${localTime(12, 15, 1)}-event.jpg` },
  { kind: "feed", ts: localTime(7, 30, 1), amount: null, hopper: null, manual: false, before: null, after: null },
  { kind: "visit", ts: localTime(7, 10, 1), image: null }
];

// dev/mock-hass.ts
function createMockHass(scenario, onChange) {
  const fixture = buildFixture(scenario);
  const states = { ...fixture.states };
  const resolved = resolveKibbleEntities2(fixture.entities, fixture.device.id);
  const cats = CATS.map((cat) => ({ ...cat }));
  const pending = [...PENDING_CROPS];
  const samplesByCat = Object.fromEntries(
    Object.entries(SAMPLES_BY_CAT).map(([cat, samples]) => [cat, [...samples]])
  );
  const timelineItems = [...TIMELINE_ITEMS];
  function notify() {
    hass.states = { ...states };
    onChange?.();
  }
  function touchPendingFace() {
    const id = resolved.pendingFace;
    const current = id ? states[id] : void 0;
    if (!id || !current) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    states[id] = { ...current, state: now, last_changed: now, last_updated: now };
  }
  const hass = {
    states,
    entities: fixture.entities,
    devices: { [fixture.device.id]: fixture.device },
    themes: {},
    language: "en",
    callService: async (domain, service, data, target) => {
      console.log("[mock hass] callService", { domain, service, data, target });
      const entityId = target?.entity_id ?? void 0;
      if (domain === "number" && service === "set_value" && entityId && states[entityId]) {
        states[entityId] = { ...states[entityId], state: String(data?.value ?? "") };
        notify();
      }
      if (domain === "switch" && service === "toggle" && entityId && states[entityId]) {
        const next = states[entityId].state === "on" ? "off" : "on";
        states[entityId] = { ...states[entityId], state: next };
        notify();
      }
      if (domain === "kibble" && service === "label_face") {
        const cropId = data?.crop_id;
        const cat = data?.cat;
        const index = cropId ? pending.findIndex((crop) => crop.name === cropId) : -1;
        if (index !== -1 && cat) {
          const [crop] = pending.splice(index, 1);
          if (crop && cat !== "not_a_cat" && cat !== "other") {
            const gallery = samplesByCat[cat] ?? (samplesByCat[cat] = []);
            gallery.push({ name: crop.name, ts: crop.ts });
            const rosterEntry = cats.find((c5) => c5.name === cat);
            if (rosterEntry) {
              rosterEntry.samples = gallery.length;
              rosterEntry.last_seen = Math.max(rosterEntry.last_seen ?? 0, crop.ts);
            }
          }
          touchPendingFace();
          notify();
        }
      }
      if (domain === "kibble" && service === "unlabel_face") {
        const cat = data?.cat;
        const name = data?.name;
        const gallery = cat ? samplesByCat[cat] : void 0;
        const index = gallery && name ? gallery.findIndex((sample) => sample.name === name) : -1;
        if (gallery && index !== -1) {
          const [sample] = gallery.splice(index, 1);
          const rosterEntry = cats.find((c5) => c5.name === cat);
          if (rosterEntry) rosterEntry.samples = gallery.length;
          if (sample) pending.push({ name: sample.name, ts: sample.ts, vendor_pet_id: null, vendor_cat: null, guess: null });
          touchPendingFace();
          notify();
        }
      }
      if (domain === "kibble" && service === "add_cat") {
        const name = data?.name;
        if (name && !cats.some((c5) => c5.name === name)) {
          cats.push({ name, samples: 0, last_seen: null, avatar: null, vendor_pet_id: null, color_index: cats.length });
          notify();
        }
      }
      return void 0;
    },
    callWS: async (msg) => {
      const type = msg.type;
      if (type === "kibble/timeline") {
        const includeVisits = msg.include_visits === true;
        const items = includeVisits ? timelineItems : timelineItems.filter((item) => item.kind !== "visit");
        return { items: [...items] };
      }
      if (type === "kibble/cats") {
        return { cats: cats.map((cat) => ({ ...cat })) };
      }
      if (type === "kibble/cats/delete") {
        const name = msg.name;
        const index = name ? cats.findIndex((cat) => cat.name === name) : -1;
        if (!name || index === -1) throw { code: "not_found", message: `Unknown cat ${String(name)}` };
        cats.splice(index, 1);
        delete samplesByCat[name];
        notify();
        return {};
      }
      if (type === "kibble/faces/pending") {
        return { crops: [...pending] };
      }
      if (type === "kibble/faces/samples") {
        const cat = msg.cat;
        return { samples: cat ? [...samplesByCat[cat] ?? []] : [] };
      }
      if (type === "kibble/faces/upload") {
        const cat = msg.cat;
        const rosterEntry = cat ? cats.find((c5) => c5.name === cat) : void 0;
        if (!cat || !rosterEntry) throw { code: "not_found", message: `Unknown cat ${String(cat)}` };
        const gallery = samplesByCat[cat] ?? (samplesByCat[cat] = []);
        const ts = Math.floor(Date.now() / 1e3);
        const name = `upload-${Date.now()}.jpg`;
        gallery.push({ name, ts });
        rosterEntry.samples = gallery.length;
        rosterEntry.last_seen = Math.max(rosterEntry.last_seen ?? 0, ts);
        notify();
        const lowQuality = gallery.length % 3 === 0;
        return lowQuality ? { name, samples: gallery.length, low_quality: true } : { name, samples: gallery.length };
      }
      if (type === "kibble/faces/delete_sample") {
        const cat = msg.cat;
        const name = msg.name;
        const gallery = cat ? samplesByCat[cat] : void 0;
        const index = gallery && name ? gallery.findIndex((sample) => sample.name === name) : -1;
        if (!gallery || index === -1) throw { code: "not_found", message: "Unknown sample" };
        gallery.splice(index, 1);
        const rosterEntry = cats.find((c5) => c5.name === cat);
        if (rosterEntry) rosterEntry.samples = gallery.length;
        notify();
        return {};
      }
      throw { code: "unknown_command", message: `Unknown command: ${String(type)}` };
    },
    fetchWithAuth: async (input) => {
      const path = typeof input === "string" ? input : "";
      if (path.startsWith("/api/kibble/")) {
        return fetch("./face-crop.svg");
      }
      return new Response(null, { status: 404 });
    }
  };
  return hass;
}

// dev/app.ts
var TAG_FOR_CARD = {
  hero: "kibble-card",
  timeline: "kibble-timeline-card",
  cats: "kibble-cats-card"
};
function configFor(card, params, name) {
  if (card === "timeline") {
    const config2 = { type: "custom:kibble-timeline-card", device_id: DEVICE_ID };
    if (name) config2.name = name;
    const limit = params.get("limit");
    if (limit) config2.limit = Number(limit);
    const showVisits = params.get("show_visits");
    if (showVisits) config2.show_visits = showVisits === "true";
    return config2;
  }
  if (card === "cats") {
    const config2 = { type: "custom:kibble-cats-card", device_id: DEVICE_ID };
    if (name) config2.name = name;
    const confidence = params.get("confidence");
    if (confidence) config2.confidence = Number(confidence);
    return config2;
  }
  const config = { type: "custom:kibble-card", device_id: DEVICE_ID };
  if (name) config.name = name;
  const settingsHash = params.get("settings_hash");
  if (settingsHash) config.settings_hash = settingsHash;
  const scheduleHash = params.get("schedule_hash");
  if (scheduleHash) config.schedule_hash = scheduleHash;
  return config;
}
async function main() {
  const params = new URLSearchParams(location.search);
  const card = params.get("card") ?? "hero";
  const scenario = params.get("scenario") ?? "idle";
  const theme = params.get("theme") ?? "light";
  const width = Number(params.get("width") ?? "400");
  const heightParam = params.get("height");
  const height = heightParam ? Number(heightParam) : null;
  const name = params.get("name") ?? void 0;
  document.documentElement.classList.toggle("dark", theme === "dark");
  const container = document.getElementById("container");
  if (!container) throw new Error("missing #container");
  container.style.width = `${width}px`;
  container.style.height = height ? `${height}px` : "auto";
  const tag = TAG_FOR_CARD[card];
  await customElements.whenDefined(tag);
  const element = document.createElement(tag);
  element.setConfig(configFor(card, params, name));
  const hass = createMockHass(scenario, () => {
    element.hass = { ...hass };
  });
  element.hass = hass;
  container.appendChild(element);
  await element.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  window.__kibbleReady = true;
}
void main();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=app.js.map
