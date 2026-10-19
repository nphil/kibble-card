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

// node_modules/engine.io-parser/build/cjs/commons.js
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

// node_modules/engine.io-parser/build/cjs/encodePacket.browser.js
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

// node_modules/engine.io-parser/build/cjs/contrib/base64-arraybuffer.js
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

// node_modules/engine.io-parser/build/cjs/decodePacket.browser.js
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

// node_modules/engine.io-parser/build/cjs/index.js
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
      let state = 0;
      let expectedLength = -1;
      let isBinary = false;
      return new TransformStream({
        transform(chunk, controller) {
          chunks.push(chunk);
          while (true) {
            if (state === 0) {
              if (totalLength(chunks) < 1) {
                break;
              }
              const header = concatChunks(chunks, 1);
              isBinary = (header[0] & 128) === 128;
              expectedLength = header[0] & 127;
              if (expectedLength < 126) {
                state = 3;
              } else if (expectedLength === 126) {
                state = 1;
              } else {
                state = 2;
              }
            } else if (state === 1) {
              if (totalLength(chunks) < 2) {
                break;
              }
              const headerArray = concatChunks(chunks, 2);
              expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
              state = 3;
            } else if (state === 2) {
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
              state = 3;
            } else {
              if (totalLength(chunks) < expectedLength) {
                break;
              }
              const data = concatChunks(chunks, expectedLength);
              controller.enqueue((0, decodePacket_js_1.decodePacket)(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
              state = 0;
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

// node_modules/@socket.io/component-emitter/lib/cjs/index.js
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

// node_modules/engine.io-client/build/cjs/globals.js
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

// node_modules/engine.io-client/build/cjs/util.js
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

// node_modules/engine.io-client/build/cjs/contrib/parseqs.js
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

// node_modules/ms/index.js
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

// node_modules/debug/src/common.js
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

// node_modules/debug/src/browser.js
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

// node_modules/engine.io-client/build/cjs/transport.js
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

// node_modules/engine.io-client/build/cjs/transports/polling.js
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

// node_modules/engine.io-client/build/cjs/contrib/has-cors.js
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

// node_modules/engine.io-client/build/cjs/transports/polling-xhr.js
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

// node_modules/engine.io-client/build/cjs/transports/websocket.js
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

// node_modules/engine.io-client/build/cjs/transports/webtransport.js
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

// node_modules/engine.io-client/build/cjs/transports/index.js
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

// node_modules/engine.io-client/build/cjs/contrib/parseuri.js
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

// node_modules/engine.io-client/build/cjs/socket.js
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

// node_modules/engine.io-client/build/cjs/transports/polling-fetch.js
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

// node_modules/engine.io-client/build/cjs/index.js
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

// node_modules/@scrypted/client/dist/common/src/promise-utils.js
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

// node_modules/@scrypted/client/dist/server/src/rpc.js
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
      constructor(peer, entry, constructorName, proxyProps, proxyOneWayMethods) {
        this.peer = peer;
        this.entry = entry;
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
      finalizers = new FinalizationRegistry((entry) => this.finalize(entry));
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
      finalize(entry) {
        _RpcPeer.remotesCollected++;
        delete this.remoteWeakProxies[entry.id];
        const rpcFinalize = {
          __local_proxy_id: entry.id,
          __local_proxy_finalizer_id: entry.finalizerId,
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

// node_modules/@scrypted/client/dist/server/src/plugin/mediaobject.js
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

// node_modules/@scrypted/types/dist/index.js
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

// node_modules/@scrypted/client/dist/server/src/rpc-buffer-serializer.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/descriptor.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/plugin-state-check.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/device.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/endpoint.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/plugin-remote-websocket.js
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

// node_modules/@scrypted/client/dist/server/src/event-registry.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/system.js
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
            const state = this.state[check];
            if (!state)
              continue;
            if (state[types_1.ScryptedInterfaceProperty.pluginId]?.value === idOrPluginId) {
              if (state[types_1.ScryptedInterfaceProperty.nativeId]?.value == nativeId) {
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

// node_modules/@scrypted/client/dist/server/src/plugin/cluster.js
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

// node_modules/@scrypted/client/dist/server/src/plugin/plugin-remote.js
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
        const getAccessControlDeviceState = (id, state) => {
          state = state || getSystemState()[id];
          if (accessControls && state) {
            state = Object.assign({}, state);
            for (const property of Object.keys(state)) {
              if (accessControls.shouldRejectProperty(id, property))
                delete state[property];
            }
            let interfaces = state.interfaces?.value;
            if (interfaces) {
              interfaces = interfaces.filter((scryptedInterface) => !accessControls.shouldRejectInterface(id, scryptedInterface));
              state.interfaces = {
                value: interfaces
              };
            }
          }
          return state;
        };
        const getAccessControlSystemState = () => {
          let state = getSystemState();
          if (accessControls) {
            state = Object.assign({}, state);
            for (const id of Object.keys(state)) {
              if (accessControls.shouldRejectDevice(id)) {
                delete state[id];
                continue;
              }
              state[id] = getAccessControlDeviceState(id, state[id]);
            }
          }
          return state;
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
          async updateDeviceState(id, state) {
            if (!state) {
              delete systemManager.state[id];
              systemManager.events.notify(void 0, void 0, types_1.ScryptedInterface.ScryptedDevice, types_1.ScryptedInterfaceProperty.id, id, { changed: true });
            } else {
              systemManager.state[id] = state;
              systemManager.events.notify(id, void 0, types_1.ScryptedInterface.ScryptedDevice, void 0, state, { changed: true });
            }
          },
          async notify(id, eventTimeOrDetails, eventInterfaceOrData, property, value, changed) {
            if (typeof eventTimeOrDetails === "number") {
              const eventTime = eventTimeOrDetails;
              const eventInterface = eventInterfaceOrData;
              if (property) {
                const state = systemManager.state?.[id];
                if (!state) {
                  log.w(`state not found for ${id}`);
                  return;
                }
                state[property] = value;
                systemManager.events.notify(id, eventTime, eventInterface, property, value.value, { changed });
              } else {
                systemManager.events.notify(id, eventTime, eventInterface, property, value, { changed });
              }
            } else {
              const eventDetails = eventTimeOrDetails;
              const eventData = eventInterfaceOrData;
              if (eventDetails.property && !eventDetails.mixinId) {
                const state = systemManager.state?.[id];
                if (!state) {
                  log.w(`state not found for ${id}`);
                  return;
                }
                state[eventDetails.property] = eventData;
                systemManager.events.notifyEventDetails(id, eventDetails, eventData.value);
              } else {
                systemManager.events.notifyEventDetails(id, eventDetails, eventData);
              }
            }
          },
          async setSystemState(state) {
            systemManager.state = state;
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

// node_modules/@scrypted/client/dist/server/src/rpc-serializer.js
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

// node_modules/@scrypted/client/dist/packages/client/package.json
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

// node_modules/@scrypted/client/dist/packages/client/src/ip.js
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

// node_modules/@scrypted/client/dist/server/src/fetch/index.js
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

// src/lib/node-stub.js
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

// node_modules/@scrypted/client/dist/server/src/fetch/http-fetch.js
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

// node_modules/@scrypted/client/dist/packages/client/src/index.js
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

// node_modules/@lit/reactive-element/css-tag.js
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

// node_modules/@lit/reactive-element/reactive-element.js
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

// node_modules/lit-html/lit-html.js
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

// node_modules/lit-element/lit-element.js
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

// src/lib/resolve-entities.ts
var RULES = {
  feeding: { domain: "binary_sensor", translationKeys: ["feeding"], idSuffixes: ["_feeding"] },
  eating: { domain: "binary_sensor", translationKeys: ["eating"], idSuffixes: ["_eating"] },
  bowlFill: { domain: "sensor", translationKeys: ["bowl_fill", "bowl_fill_1"], idSuffixes: ["_bowl_fill", "_bowl_fill_1", "_bowl_fill_hopper_1"] },
  hopperLevel1: { domain: "sensor", translationKeys: ["hopper_1_level"], idSuffixes: ["_hopper_1_level"] },
  hopperLevel2: { domain: "sensor", translationKeys: ["hopper_2_level"], idSuffixes: ["_hopper_2_level"] },
  hopperRemaining1: { domain: "sensor", translationKeys: ["hopper_1_remaining"], idSuffixes: ["_hopper_1_remaining"] },
  hopperRemaining2: { domain: "sensor", translationKeys: ["hopper_2_remaining"], idSuffixes: ["_hopper_2_remaining"] },
  markFullHopper1: { domain: "button", translationKeys: ["hopper_1_full"], idSuffixes: ["_hopper_1_full"] },
  markFullHopper2: { domain: "button", translationKeys: ["hopper_2_full"], idSuffixes: ["_hopper_2_full"] },
  markFullBoth: { domain: "button", translationKeys: ["hopper_full"], idSuffixes: ["_hopper_full"] },
  hopperDivider: { domain: "switch", translationKeys: ["hopper_divider"], idSuffixes: ["_hopper_divider"] },
  hopperFood1: { domain: "text", translationKeys: ["hopper_1_food"], idSuffixes: ["_hopper_1_food"] },
  hopperFood2: { domain: "text", translationKeys: ["hopper_2_food"], idSuffixes: ["_hopper_2_food"] },
  desiccantDays: { domain: "sensor", translationKeys: ["desiccant_days", "desiccant_left"], idSuffixes: ["_desiccant_days", "_desiccant_left"] },
  schedule: { domain: "sensor", translationKeys: ["schedule"], idSuffixes: ["_schedule"] },
  scheduleCardState: { domain: "sensor", translationKeys: ["schedule_card_state"], idSuffixes: ["_schedule_card_state"] },
  feedButton: { domain: "button", translationKeys: ["feed"], idSuffixes: ["_feed"] },
  feedButtonHopper1: { domain: "button", translationKeys: ["feed_hopper_1"], idSuffixes: ["_feed_hopper_1"] },
  feedButtonHopper2: { domain: "button", translationKeys: ["feed_hopper_2"], idSuffixes: ["_feed_hopper_2"] },
  cancelFeedButton: { domain: "button", translationKeys: ["cancel_feed"], idSuffixes: ["_cancel_feed"] },
  callCatsButton: { domain: "button", translationKeys: ["call_cats"], idSuffixes: ["_call_cats"] },
  feedAmount: { domain: "number", translationKeys: ["feed_amount"], idSuffixes: ["_feed_amount"] },
  feedAmountHopper1: { domain: "number", translationKeys: ["feed_amount_hopper_1"], idSuffixes: ["_feed_amount_hopper_1"] },
  feedAmountHopper2: { domain: "number", translationKeys: ["feed_amount_hopper_2"], idSuffixes: ["_feed_amount_hopper_2"] },
  cloudSwitch: { domain: "switch", translationKeys: ["cloud", "petkit_cloud"], idSuffixes: ["_cloud", "_petkit_cloud"] },
  stackSelect: { domain: "select", translationKeys: ["stack"], idSuffixes: ["_stack"] },
  cloudConnection: { domain: "sensor", translationKeys: ["cloud_connection"], idSuffixes: ["_cloud_connection"] },
  nightVisionSwitch: { domain: "switch", translationKeys: ["night", "night_vision"], idSuffixes: ["_night", "_night_vision"] },
  statusLedSwitch: { domain: "switch", translationKeys: ["light", "status_led"], idSuffixes: ["_light", "_status_led"] },
  microphoneSwitch: { domain: "switch", translationKeys: ["microphone"], idSuffixes: ["_microphone"] },
  lastSeenPet: { domain: "sensor", translationKeys: ["last_seen_pet"], idSuffixes: ["_last_seen_pet"] },
  dishBefore: { domain: "image", translationKeys: ["dish_before"], idSuffixes: ["_dish_before"] },
  dishAfter: { domain: "image", translationKeys: ["dish_after"], idSuffixes: ["_dish_after"] },
  wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] },
  lastDetection: { domain: "sensor", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionsToday: { domain: "sensor", translationKeys: ["detections_today"], idSuffixes: ["_detections_today"] },
  lastDetectionImage: { domain: "image", translationKeys: ["last_detection"], idSuffixes: ["_last_detection"] },
  detectionOverlaySwitch: { domain: "switch", translationKeys: ["detection_overlay"], idSuffixes: ["_detection_overlay"] }
};
function domainOf(entityId) {
  return entityId.slice(0, entityId.indexOf("."));
}
function objectIdOf(entityId) {
  return entityId.slice(entityId.indexOf(".") + 1);
}
function matchesRule(entry, rule) {
  if (domainOf(entry.entity_id) !== rule.domain) return false;
  if (entry.translation_key && rule.translationKeys.includes(entry.translation_key)) return true;
  const objectId = objectIdOf(entry.entity_id);
  return rule.idSuffixes.some((suffix) => objectId.endsWith(suffix));
}
function catDisplayName(entry) {
  const raw = entry.name ?? entry.original_name;
  if (raw) {
    return raw.replace(/\s+present$/i, "").trim() || raw;
  }
  const objectId = objectIdOf(entry.entity_id);
  const slug = objectId.replace(/_present$/, "");
  const lastWord = slug.split("_").filter(Boolean).pop();
  if (!lastWord) return "Cat";
  return lastWord[0].toUpperCase() + lastWord.slice(1);
}
function isCatPresenceEntry(entry) {
  if (domainOf(entry.entity_id) !== "binary_sensor") return false;
  if (entry.translation_key === "present" || entry.translation_key?.endsWith("_present")) return true;
  return objectIdOf(entry.entity_id).endsWith("_present");
}
function resolveKibbleEntities(entities, deviceId) {
  const result = { deviceId, catPresence: [] };
  const forDevice = Object.values(entities).filter(
    (e6) => e6.device_id === deviceId && !e6.disabled_by
  );
  for (const entry of forDevice) {
    if (domainOf(entry.entity_id) === "camera" && !result.camera) {
      result.camera = entry.entity_id;
      continue;
    }
    if (domainOf(entry.entity_id) === "media_player" && !result.speaker) {
      result.speaker = entry.entity_id;
      continue;
    }
    if (isCatPresenceEntry(entry)) {
      result.catPresence.push({ entityId: entry.entity_id, name: catDisplayName(entry) });
      continue;
    }
    for (const roleEntry of Object.entries(RULES)) {
      const [role, rule] = roleEntry;
      if (result[role]) continue;
      if (matchesRule(entry, rule)) {
        result[role] = entry.entity_id;
        break;
      }
    }
  }
  result.catPresence.sort((a3, b3) => a3.name.localeCompare(b3.name));
  return result;
}

// src/lib/entry-id.ts
function resolveEntryId(devices, deviceId) {
  if (!deviceId) return void 0;
  return devices[deviceId]?.config_entries?.[0];
}

// src/lib/feeding.ts
function deriveFeederStatus(coreStates, feedingState) {
  const isDown = (state) => state === void 0 || state === "unavailable" || state === "unknown";
  if (coreStates.length === 0 || coreStates.every(isDown)) {
    return "unreachable";
  }
  return feedingState === "on" ? "dispensing" : "idle";
}
function statusText(status, lastFedRelative) {
  if (status === "unreachable") return "Feeder unreachable. Check that kibbled is running";
  if (status === "dispensing") return "Dispensing\u2026";
  return lastFedRelative ? `Fed ${lastFedRelative}` : "Ready to feed";
}

// src/lib/relative-time.ts
function relativeElapsed(from, now) {
  const diffMinutes = Math.floor(Math.max(0, now.getTime() - from.getTime()) / 6e4);
  if (diffMinutes < 1) return { unit: "now", value: 0 };
  if (diffMinutes < 60) return { unit: "minutes", value: diffMinutes };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return { unit: "hours", value: diffHours };
  return { unit: "days", value: Math.floor(diffHours / 24) };
}
function relativeTimeCompact(from, now) {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const suffix = elapsed.unit === "minutes" ? "m" : elapsed.unit === "hours" ? "h" : "d";
  return `${elapsed.value}${suffix} ago`;
}
function relativeTimeSentence(from, now) {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const word = elapsed.unit === "minutes" ? "min" : elapsed.unit === "hours" ? "h" : "d";
  return `${elapsed.value} ${word} ago`;
}

// src/lib/ws-query.ts
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
  /** Optimistically rewrites cached `data` in place, without touching `loading`/`error` or
   * starting a new request -- for a mutation whose own response already tells the caller the
   * new truth (an avatar change, say), so the UI reflects it before the next full refetch lands
   * rather than waiting on one. A no-op while there is no data yet to patch. */
  patch(updater) {
    if (this._state.data === null) return;
    this._state = { ...this._state, data: updater(this._state.data) };
    this._onChange();
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

// src/lib/image-cache.ts
var MAX_CACHED_IMAGES = 200;
var ImageUrlCache = class {
  constructor() {
    this._urls = /* @__PURE__ */ new Map();
    this._refs = /* @__PURE__ */ new Map();
    this._pending = /* @__PURE__ */ new Set();
    this._waiters = /* @__PURE__ */ new Map();
  }
  /** Returns a cached object URL synchronously when already known (and marks it referenced);
   * otherwise starts the fetch (once per id, even under concurrent callers), marks it
   * referenced, and calls `onReady` once it settles. `onReady` receives `null` on failure --
   * callers show a neutral/broken placeholder rather than nothing, so a crop that failed to
   * load once doesn't look like a crop that never existed. A failed fetch is not cached: the
   * next `acquire` for the same id retries.
   *
   * Every `acquire` MUST be matched by exactly one later `release(asset.id)` once the caller
   * stops displaying this asset -- an unreleased reference keeps its blob URL alive forever. */
  acquire(hass, asset, onReady) {
    const id = asset.id;
    this._refs.set(id, (this._refs.get(id) ?? 0) + 1);
    const cached = this._urls.get(id);
    if (cached !== void 0) return cached;
    const waiters = this._waiters.get(id) ?? /* @__PURE__ */ new Set();
    waiters.add(onReady);
    this._waiters.set(id, waiters);
    if (!this._pending.has(id)) {
      this._pending.add(id);
      void this._fetch(hass, asset.url).then((url) => {
        this._pending.delete(id);
        const pendingWaiters = this._waiters.get(id);
        this._waiters.delete(id);
        if (url && (this._refs.get(id) ?? 0) > 0) {
          this._urls.set(id, url);
        } else if (url) {
          URL.revokeObjectURL(url);
        }
        for (const waiter of pendingWaiters ?? []) waiter(url);
      });
    }
    return null;
  }
  /** Drops one reference. Once an id's reference count reaches zero it becomes eligible for
   * eviction, but is not revoked immediately -- it stays cached (and instantly reusable) until
   * the cache actually needs the room, so paging back to a recently-shown asset is still free.
   *
   * The eviction check itself is deferred by one microtask rather than run inline: a re-render
   * that swaps one element showing this asset for a replacement (a template branch changing
   * shape, for instance) disposes the old element and connects the new one within the same
   * synchronous DOM patch, so the replacement's own `acquire` for the very same id normally
   * lands moments later in the same microtask turn. Evicting inline here would let that brief,
   * spurious zero-reference dip win the race and revoke a blob URL its own replacement was
   * about to reuse, leaving that element waiting on a cache entry that no longer exists.
   * Deferring gives any same-turn re-acquire a chance to land first and cancel this check. */
  release(assetId) {
    const next = (this._refs.get(assetId) ?? 0) - 1;
    if (next > 0) {
      this._refs.set(assetId, next);
      return;
    }
    this._refs.delete(assetId);
    queueMicrotask(() => {
      if ((this._refs.get(assetId) ?? 0) > 0) return;
      this._evictIfOverCap();
    });
  }
  _evictIfOverCap() {
    if (this._urls.size <= MAX_CACHED_IMAGES) return;
    for (const [id, url] of this._urls) {
      if (this._urls.size <= MAX_CACHED_IMAGES) break;
      if ((this._refs.get(id) ?? 0) > 0) continue;
      this._urls.delete(id);
      URL.revokeObjectURL(url);
    }
  }
  async _fetch(hass, url) {
    if (!hass.fetchWithAuth) return null;
    try {
      const response = await hass.fetchWithAuth(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }
  /** Revokes every cached URL regardless of reference count. Call once, from the card (not a
   * per-row component) that owns this cache's whole lifetime, in `disconnectedCallback`. */
  dispose() {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    this._refs.clear();
    this._pending.clear();
    this._waiters.clear();
  }
};
var AssetRef = class {
  constructor() {
    this._acquiredId = null;
    this._cache = null;
    this._url = null;
  }
  get url() {
    return this._url;
  }
  sync(hass, cache, asset, onChange) {
    const nextId = asset?.id ?? null;
    if (nextId !== this._acquiredId) {
      this._release();
      this._url = null;
    }
    if (!asset || !hass || !cache || this._acquiredId === asset.id) return;
    this._acquiredId = asset.id;
    this._cache = cache;
    const id = asset.id;
    const url = cache.acquire(hass, asset, (result) => {
      if (this._acquiredId !== id) return;
      this._url = result;
      onChange();
    });
    if (url !== null) this._url = url;
  }
  _release() {
    if (this._acquiredId && this._cache) this._cache.release(this._acquiredId);
    this._acquiredId = null;
    this._cache = null;
  }
  dispose() {
    this._release();
    this._url = null;
  }
};

// src/lib/mdi-icons.ts
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
  fullscreen: "M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z",
  fullscreenExit: "M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z",
  weatherNight: "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
  ledOn: "M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z",
  microphone: "M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",
  microphoneOff: "M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,11.16L9,5.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11L15,11.16M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H6.7C6.7,14 9.24,16.1 12,16.1C12.81,16.1 13.6,15.91 14.31,15.58L12.65,13.92L12,14A3,3 0 0,1 9,11V10.28L3,4.27L4.27,3Z",
  volumeOff: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",
  volumeHigh: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  openInNew: "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",
  speaker: "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",
  refresh: "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
  check: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
  dotsVertical: "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  helpCircle: "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C9.79,6 8,7.79 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",
  eye: "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",
  eyeOff: "M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",
  deleteOutline: "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",
  undo: "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",
  plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  cat: "M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z"
};
function mdiIcon(name) {
  return w`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${MDI[name]}></path></svg>`;
}

// package.json
var version = "0.26.0";

// src/styles/tokens.ts
var KIOSK_MIN_HEIGHT_PX = 440;
var HOLD_TO_FEED_MS = 1500;
var KIBBLE_FALL_DURATION_MS = 900;
var KIBBLE_FEED = "#43A96A";
var KIBBLE_FEED_DARK = "#2F8551";
var KIBBLE_INK_ON_FEED = "#10301D";
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

// src/lib/hopper-status.ts
function parseHopperLevel(state) {
  return state === "empty" || state === "low" || state === "ok" ? state : null;
}
function parseHopperRemaining(state) {
  if (!state) return null;
  const raw = state.state;
  const portions = raw === "unknown" || raw === "unavailable" || raw === "" ? null : Number(raw);
  const attrs = state.attributes ?? {};
  return {
    portions: portions != null && Number.isFinite(portions) ? portions : null,
    fullAt: typeof attrs.full_at === "string" ? attrs.full_at : null,
    portionsSinceFull: typeof attrs.portions_since_full === "number" ? attrs.portions_since_full : null,
    fullToLow: typeof attrs.full_to_low === "number" ? attrs.full_to_low : null
  };
}
var HOPPER_LOW_LINE = 0.34;
var STEP_FILL = {
  empty: 0,
  low: 0.2,
  ok: 0.64
};
function agoSentence(from, now) {
  const elapsed = relativeElapsed(from, now);
  if (elapsed.unit === "now") return "just now";
  const word = elapsed.unit === "minutes" ? "minute" : elapsed.unit === "hours" ? "hour" : "day";
  return `${elapsed.value} ${word}${elapsed.value === 1 ? "" : "s"} ago`;
}
function parseFullAt(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}
var ASSUMED_FULL_TO_LOW = 30;
function unlearnedFullFraction(portionsSinceFull, compartments) {
  const since = portionsSinceFull ?? 0;
  const drained = 1 - since / (ASSUMED_FULL_TO_LOW * compartments);
  return Math.max(STEP_FILL.ok, Math.min(1, drained));
}
function estimateFraction(portions, fullToLow) {
  const ratio = fullToLow > 0 ? Math.max(0, Math.min(1, portions / fullToLow)) : 0;
  return HOPPER_LOW_LINE + (1 - HOPPER_LOW_LINE) * ratio;
}
function hopperView(index, level, remaining, now = /* @__PURE__ */ new Date()) {
  const compartments = index === null ? 2 : 1;
  const fullAt = parseFullAt(remaining?.fullAt ?? null);
  const portionsSinceFull = remaining?.portionsSinceFull ?? null;
  const sinceClause = portionsSinceFull != null && portionsSinceFull > 0 ? `, ${portionsSinceFull} portion${portionsSinceFull === 1 ? "" : "s"} since` : "";
  const filledSentence = fullAt ? `Filled ${agoSentence(fullAt, now)}${sinceClause}` : null;
  if (level === null) {
    return { index, level: null, tone: "unknown", headline: "Unknown", fillFraction: null, detail: null };
  }
  if (level === "low" || level === "empty") {
    return { index, level, tone: level, headline: level === "low" ? "Low" : "Empty", fillFraction: STEP_FILL[level], detail: filledSentence };
  }
  if (remaining?.portions != null && remaining.fullToLow != null && remaining.fullToLow > 0) {
    const { portions, fullToLow } = remaining;
    const rounded = Math.round(portions);
    const estimateSentence = `About ${rounded} portion${rounded === 1 ? "" : "s"} left`;
    return {
      index,
      level,
      tone: "ok",
      headline: `About ${rounded} left`,
      fillFraction: estimateFraction(portions, fullToLow),
      detail: fullAt ? `${estimateSentence} \xB7 filled ${agoSentence(fullAt, now)}` : estimateSentence
    };
  }
  if (fullAt) {
    return {
      index,
      level,
      tone: "ok",
      headline: `Filled ${relativeTimeCompact(fullAt, now)}`,
      fillFraction: unlearnedFullFraction(portionsSinceFull, compartments),
      detail: filledSentence
    };
  }
  return { index, level, tone: "ok", headline: "Stocked", fillFraction: STEP_FILL.ok, detail: null };
}
function hopperName(view) {
  return view.index === null ? "Hopper" : `Hopper ${view.index}`;
}
function hopperFoodName(state) {
  if (!state || state.state === "unavailable" || state.state === "unknown") return null;
  const trimmed = state.state.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function foodForHopper(index, food1, food2) {
  if (index === 1) return food1;
  if (index === 2) return food2;
  return null;
}
function hopperDisplayName(view, food) {
  if (view.index === null) return hopperName(view);
  const trimmed = food?.trim();
  return trimmed ? trimmed : hopperName(view);
}
function hopperAriaLabel(view, food = null) {
  const name = hopperDisplayName(view, food);
  if (view.tone === "unknown") return `${name}: level unknown`;
  const base = `${name}: ${view.headline}`;
  return view.detail ? `${base}. ${view.detail}` : base;
}
var SEVERITY = { empty: 0, low: 1, ok: 2 };
function sumKnown(a3, b3) {
  return a3 == null || b3 == null ? null : a3 + b3;
}
function combinedHopper(level1, level2, remaining1, remaining2) {
  const levels = [level1, level2].filter((l3) => l3 !== null);
  const level = levels.length === 0 ? null : levels.reduce((a3, b3) => SEVERITY[a3] <= SEVERITY[b3] ? a3 : b3);
  if (!remaining1 && !remaining2) return { level, remaining: null };
  const fullAts = [remaining1?.fullAt, remaining2?.fullAt].filter((v2) => typeof v2 === "string");
  const since = [remaining1?.portionsSinceFull, remaining2?.portionsSinceFull].filter((v2) => typeof v2 === "number");
  return {
    level,
    remaining: {
      portions: sumKnown(remaining1?.portions ?? null, remaining2?.portions ?? null),
      fullAt: fullAts.length ? fullAts.reduce((a3, b3) => Date.parse(a3) >= Date.parse(b3) ? a3 : b3) : null,
      portionsSinceFull: since.length ? since.reduce((a3, b3) => a3 + b3, 0) : null,
      fullToLow: sumKnown(remaining1?.fullToLow ?? null, remaining2?.fullToLow ?? null)
    }
  };
}
function hopperViews(single, level1, level2, remaining1, remaining2, now = /* @__PURE__ */ new Date()) {
  if (!single) return [hopperView(1, level1, remaining1, now), hopperView(2, level2, remaining2, now)];
  const { level, remaining } = combinedHopper(level1, level2, remaining1, remaining2);
  return [hopperView(null, level, remaining, now)];
}

// src/lib/calibration.ts
var TRANSITIONS = {
  "choose-hopper": { start: "confirm-empty" },
  "confirm-empty": { "empty-confirmed": "collecting" },
  collecting: { capture: "collecting", "review-full": "mark-full" },
  "mark-full": { "full-marked": "offer-inherit" },
  "offer-inherit": { "inherit-resolved": "done" },
  done: { restart: "choose-hopper" }
};
function nextCalibrationStep(step, event) {
  return TRANSITIONS[step][event] ?? step;
}
function canReviewFull(points) {
  return points.some((point) => point.portions > 0);
}
function detectScoreRegression(points, newPoint) {
  const previous = points[points.length - 1];
  if (!previous || newPoint.score >= previous.score) return null;
  return { previousPortions: previous.portions, previousScore: previous.score, newScore: newPoint.score };
}
function calibrationStatus(hopper) {
  if (!hopper) return { kind: "never", inheritedFromDisplay: null, measuredAt: null, note: null, finished: false };
  const inheritedFrom = typeof hopper.source === "object" ? hopper.source.inherited_from : null;
  return {
    kind: inheritedFrom !== null ? "inherited" : "measured",
    inheritedFromDisplay: inheritedFrom !== null ? inheritedFrom + 1 : null,
    measuredAt: hopper.measured_at,
    note: hopper.note || null,
    finished: hopper.full_portions != null
  };
}
function calibratedPercent(hopper, rawScore) {
  if (!hopper || hopper.full_portions == null || hopper.full_score == null) return null;
  const points = [...hopper.points].sort((a3, b3) => a3.portions - b3.portions);
  const first = points[0];
  if (!first) return null;
  if (rawScore <= first.score) return 0;
  if (rawScore >= hopper.full_score) return 100;
  for (let i6 = 1; i6 < points.length; i6 += 1) {
    const prev = points[i6 - 1];
    const curr = points[i6];
    if (rawScore > curr.score) continue;
    const span = curr.score - prev.score;
    const fraction = span <= 0 ? 0 : (rawScore - prev.score) / span;
    const portionAtScore = prev.portions + fraction * (curr.portions - prev.portions);
    const percent2 = portionAtScore / hopper.full_portions * 100;
    return Math.max(0, Math.min(100, percent2));
  }
  return 100;
}
function displayCalibrationHopper(state) {
  if (!state) return null;
  return state.hoppers[0] ?? state.hoppers[1] ?? null;
}

// src/lib/pour.ts
function effectivePourSource(pourSource, singleHopper) {
  return pourSource ?? (singleHopper ? "1" : "both");
}

// src/components/kibble-bowl.ts
var ART_VIEW_W = 300;
var ART_VIEW_H = 250;
var HOPPER_X = 70;
var HOPPER_W = 160;
var HOPPER_Y = 16;
var HOPPER_H = 116;
var HOPPER_R = 24;
var CHUTE_TOP = 132;
var CHUTE_BOTTOM = 160;
var BOWL_CX = 150;
var BOWL_RIM_Y = 182;
var BOWL_RX = 72;
var BOWL_RY = 7;
var BOWL_FOOT_Y = 238;
var BOWL_WALL = 5;
var MAX_DROP_MS = 6e4;
var FOOD_1 = { top: "#f0b774", mid: "#c9853f", deep: "#8e5424", hi: "#ffe1b8" };
var FOOD_2 = { top: "#f6e7cc", mid: "#dcc19a", deep: "#b3916a", hi: "#fffaf0" };
var FINISH = {
  frosted: {
    name: "Frosted glass",
    body: ["#1f2835", "#141a23"],
    stroke: "#ffffff26",
    sheen: 0.1,
    chute: ["#8b98a6", "#4d5864"],
    bowl: ["#262f3b", "#11161d"],
    rim: "#c3ccd6",
    light: false
  },
  ceramic: {
    name: "Soft ceramic",
    body: ["#ffffff", "#e7edf3"],
    stroke: "#1a253122",
    sheen: 0.45,
    chute: ["#c9d2db", "#9aa7b4"],
    bowl: ["#ffffff", "#dfe6ee"],
    rim: "#ffffff",
    light: true
  }
};
var TONE_COLOR = {
  ok: "var(--kibble-feed, #43a96a)",
  low: "var(--kibble-amber-dark, #de8a3a)",
  empty: "var(--error-color, #db4437)",
  unknown: "var(--secondary-text-color, #8b98a6)"
};
function cloverPiece(x2, y3, r6, rotationDeg) {
  const lobes = [0, 120, 240].map((angle) => {
    const rad = (angle + rotationDeg) * Math.PI / 180;
    return w`<circle cx=${(x2 + Math.cos(rad) * r6 * 0.55).toFixed(1)} cy=${(y3 + Math.sin(rad) * r6 * 0.55).toFixed(1)} r=${(r6 * 0.62).toFixed(1)} />`;
  });
  return w`<g>${lobes}</g>`;
}
function textureDefs() {
  return w`
    <pattern id="tex-dot" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.13" />
      <circle cx="5.5" cy="5.5" r="1.2" fill="#fff" opacity="0.09" />
    </pattern>
    <pattern id="tex-fleck" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <path d="M1 2h4M7 6h3M2 7h2" stroke="#6b5234" stroke-width="1.3" stroke-linecap="round" opacity="0.28" />
      <path d="M6 1.5h2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    </pattern>
  `;
}
function foodGradient(id, food) {
  return w`
    <linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${food.top} />
      <stop offset="0.55" stop-color=${food.mid} />
      <stop offset="1" stop-color=${food.deep} />
    </linearGradient>
  `;
}
function foodLevel(x2, top, w2, bottom, gradientId, textureId, hi) {
  const h5 = bottom - top;
  return w`
    <rect x=${x2} y=${top} width=${w2} height=${h5} fill="url(#${gradientId})" />
    <rect x=${x2} y=${top} width=${w2} height=${h5} fill="url(#${textureId})" />
    <rect x=${x2} y=${top} width=${w2} height="2" fill=${hi} opacity="0.85" />
  `;
}
function hopperArt(finish, compartments) {
  const single = compartments.length === 1;
  const foodLayer = compartments.map(
    (c5) => c5.fraction > 0.01 ? foodLevel(c5.x, HOPPER_Y + 6 + (HOPPER_H - 12) * (1 - c5.fraction), c5.w, HOPPER_Y + HOPPER_H, c5.gradientId, c5.textureId, c5.food.hi) : A
  );
  return w`
    <defs>
      <linearGradient id="hopper-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${finish.body[0]} />
        <stop offset="1" stop-color=${finish.body[1]} />
      </linearGradient>
      <linearGradient id="hopper-sheen" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.08" stop-color="#fff" stop-opacity=${finish.sheen} />
        <stop offset="0.22" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.85" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.95" stop-color="#fff" stop-opacity=${finish.sheen * 0.6} />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="hopper-inner-shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=${finish.light ? 0.06 : 0.35} />
        <stop offset="0.12" stop-color="#000" stop-opacity="0" />
        <stop offset="0.88" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity=${finish.light ? 0.08 : 0.4} />
      </linearGradient>
      ${textureDefs()}
      ${foodGradient("hopper-food-1", FOOD_1)}
      ${foodGradient("hopper-food-2", FOOD_2)}
      <clipPath id="hopper-interior-clip">
        <rect x=${HOPPER_X + 3} y=${HOPPER_Y + 3} width=${HOPPER_W - 6} height=${HOPPER_H - 6} rx=${HOPPER_R - 3} />
      </clipPath>
      <filter id="hopper-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x=${HOPPER_X} y=${HOPPER_Y + 6} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="#000" opacity=${finish.light ? 0.08 : 0.35} filter="url(#hopper-shadow-blur)" />
    <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="url(#hopper-body)" />
    <g clip-path="url(#hopper-interior-clip)">
      ${foodLayer}
      <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} fill="url(#hopper-inner-shadow)" />
    </g>
    ${single ? A : w`<line x1=${HOPPER_X + HOPPER_W / 2} x2=${HOPPER_X + HOPPER_W / 2} y1=${HOPPER_Y + 8} y2=${HOPPER_Y + HOPPER_H - 8} stroke=${finish.light ? "#1a253140" : "#ffffff40"} stroke-width="2" stroke-linecap="round" />`}
    <rect x=${HOPPER_X} y=${HOPPER_Y} width=${HOPPER_W} height=${HOPPER_H} rx=${HOPPER_R} fill="url(#hopper-sheen)" />
    <rect x=${HOPPER_X + 0.75} y=${HOPPER_Y + 0.75} width=${HOPPER_W - 1.5} height=${HOPPER_H - 1.5} rx=${HOPPER_R} fill="none" stroke=${finish.stroke} stroke-width="1.5" />
    <path d="M${HOPPER_X + HOPPER_R} ${HOPPER_Y + 1.5} H${HOPPER_X + HOPPER_W - HOPPER_R}" stroke="#fff" stroke-opacity=${finish.light ? 0.9 : 0.18} stroke-width="1.2" stroke-linecap="round" />
  `;
}
function chuteArt(finish, active) {
  const top = CHUTE_TOP;
  const bottom = CHUTE_BOTTOM;
  return w`
    <defs>
      <linearGradient id="chute-body" x1="0" x2="1">
        <stop offset="0" stop-color=${finish.chute[1]} />
        <stop offset="0.45" stop-color=${finish.chute[0]} />
        <stop offset="1" stop-color=${finish.chute[1]} />
      </linearGradient>
    </defs>
    <path
      d="M104 ${top} L196 ${top} Q192 ${top + 4} 170 ${bottom - 6} L163 ${bottom} L137 ${bottom} L130 ${bottom - 6} Q108 ${top + 4} 104 ${top} Z"
      fill="url(#chute-body)"
      stroke=${finish.light ? "#1a253120" : "#00000040"}
    />
    <rect
      x="139"
      y=${bottom - 3}
      width="22"
      height="4"
      rx="2"
      fill=${active ? "#f7c948" : finish.light ? "#6b7886" : "#0a0d12"}
      style=${active ? "filter:drop-shadow(0 0 6px #f7c948)" : ""}
    />
  `;
}
function bowlLevelY(fraction) {
  const innerFoot = BOWL_FOOT_Y - BOWL_WALL;
  const depth = innerFoot - BOWL_RIM_Y;
  return innerFoot - depth * Math.max(0, Math.min(1, fraction));
}
function bowlInteriorPath() {
  const cx = BOWL_CX;
  const rimY = BOWL_RIM_Y;
  const innerX = BOWL_RX - BOWL_WALL;
  const innerFoot = BOWL_FOOT_Y - BOWL_WALL;
  return `M${cx - innerX} ${rimY} C${cx - innerX + 2} ${rimY + 37} ${cx - 38} ${innerFoot} ${cx} ${innerFoot} C${cx + 38} ${innerFoot} ${cx + innerX - 2} ${rimY + 37} ${cx + innerX} ${rimY} Z`;
}
function bowlArt(finish, fraction, mix) {
  const cx = BOWL_CX;
  const rimY = BOWL_RIM_Y;
  const rx = BOWL_RX;
  const ry = BOWL_RY;
  const foot = BOWL_FOOT_Y;
  const outer = `M${cx - rx} ${rimY} C${cx - rx + 2} ${rimY + 40} ${cx - 42} ${foot} ${cx} ${foot} C${cx + 42} ${foot} ${cx + rx - 2} ${rimY + 40} ${cx + rx} ${rimY} Z`;
  const innerFoot = foot - BOWL_WALL;
  const inner = bowlInteriorPath();
  const f4 = fraction == null ? 0 : Math.max(0, Math.min(1, fraction));
  const clampedMix = Math.max(0, Math.min(1, mix));
  const level = bowlLevelY(f4);
  const w2 = rx * 2;
  const showFood = f4 > 0.02;
  const showMix = showFood && clampedMix > 0.01;
  const mixFrom = Math.max(0, 1 - clampedMix - 0.06).toFixed(3);
  const mixTo = Math.min(1, 1 - clampedMix + 0.06).toFixed(3);
  return w`
    <defs>
      ${foodGradient("bowl-food-1", FOOD_1)}
      ${foodGradient("bowl-food-2", FOOD_2)}
      <clipPath id="bowl-interior-clip"><path d=${inner} /></clipPath>
      <linearGradient id="bowl-wall" x1="0" x2="1">
        <stop offset="0" stop-color=${finish.bowl[0]} stop-opacity="0.55" />
        <stop offset="0.2" stop-color="#fff" stop-opacity=${finish.light ? 0.5 : 0.1} />
        <stop offset="0.45" stop-color=${finish.bowl[1]} stop-opacity="0.25" />
        <stop offset="0.9" stop-color="#fff" stop-opacity=${finish.light ? 0.3 : 0.06} />
        <stop offset="1" stop-color=${finish.bowl[0]} stop-opacity="0.55" />
      </linearGradient>
      <linearGradient id="bowl-mix-gradient" x1="0" x2="1">
        <stop offset=${mixFrom} stop-color="#fff" stop-opacity="0" />
        <stop offset=${mixTo} stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="bowl-mix-mask" maskContentUnits="userSpaceOnUse">
        <rect x=${cx - rx} y=${rimY - 10} width=${w2} height=${foot - rimY + 20} fill="url(#bowl-mix-gradient)" />
      </mask>
    </defs>
    <ellipse cx=${cx} cy=${foot + 5} rx=${rx * 0.7} ry="5" fill="#000" opacity=${finish.light ? 0.1 : 0.4} />
    <path d=${inner} fill=${finish.light ? "#e9eef3" : "#0b0f15"} />
    <g clip-path="url(#bowl-interior-clip)">
      ${showFood ? w`
            <rect x=${cx - rx} y=${level} width=${w2} height=${innerFoot - level + 2} fill="url(#bowl-food-1)" />
            <rect x=${cx - rx} y=${level} width=${w2} height=${innerFoot - level + 2} fill="url(#tex-dot)" />
            ${showMix ? w`<g mask="url(#bowl-mix-mask)">
                  <rect x=${cx - rx} y=${level} width=${w2} height=${innerFoot - level + 2} fill="url(#bowl-food-2)" />
                  <rect x=${cx - rx} y=${level} width=${w2} height=${innerFoot - level + 2} fill="url(#tex-fleck)" />
                </g>` : A}
            <rect x=${cx - rx} y=${level} width=${w2} height="2" fill="#fff" opacity="0.55" />
          ` : A}
    </g>
    <path d=${outer} fill="url(#bowl-wall)" stroke=${finish.light ? "#1a253126" : "#ffffff30"} stroke-width="1.5" />
    <ellipse cx=${cx} cy=${rimY} rx=${rx} ry=${ry} fill="none" stroke=${finish.light ? "#ffffff" : finish.rim} stroke-width="2.5" />
  `;
}
function pourColorsFor(source) {
  if (source === "1") return [FOOD_1.mid, FOOD_1.top, FOOD_1.deep];
  if (source === "2") return [FOOD_2.mid, FOOD_2.top, FOOD_2.deep];
  return [FOOD_1.mid, FOOD_1.top, FOOD_2.mid, FOOD_2.top];
}
var POUR_CYCLE_MS = 600;
var POUR_LANES = [
  { dx: -1.3, rotationDeg: -10, phase: 0 },
  { dx: 1.1, rotationDeg: 14, phase: 1 / 3 },
  { dx: -0.2, rotationDeg: 4, phase: 2 / 3 }
];
function pourPieces(colors, portions, outletX, outletY, targetY) {
  const lanes = portions >= 3 ? POUR_LANES : POUR_LANES.slice(0, 2);
  const distance = (targetY - outletY).toFixed(1);
  const pieces = lanes.map((lane, i6) => {
    const delayMs = Math.round(lane.phase * POUR_CYCLE_MS);
    const style = `--fall-delay:${delayMs}ms;--fall-duration:${POUR_CYCLE_MS}ms;--fall-to:${distance}px;`;
    return w`<g class="pour-piece" style=${style} fill=${colors[i6 % colors.length]}>${cloverPiece(outletX + lane.dx, outletY, 3.6, lane.rotationDeg)}</g>`;
  });
  return w`
    <defs>
      <clipPath id="pour-clip">
        <rect x=${outletX - 6} y=${CHUTE_BOTTOM - 4} width="12" height=${BOWL_RIM_Y - CHUTE_BOTTOM + 4} />
        <path d=${bowlInteriorPath()} />
      </clipPath>
    </defs>
    <g class="pour-pieces" clip-path="url(#pour-clip)">${pieces}</g>
  `;
}
function bowlTitle(fraction, calibratedPercentValue, isEstimate) {
  if (fraction == null) return "Bowl level unknown";
  const percent2 = calibratedPercentValue != null ? calibratedPercentValue : fraction * 100;
  return isEstimate ? `Bowl about ${Math.round(percent2)}% full` : `Bowl ${Math.round(percent2)}% full`;
}
function hopperGroupTitle(hoppers, food1, food2) {
  if (hoppers.length === 1) return `${hopperDisplayName(hoppers[0], null)}: ${hoppers[0].headline}`;
  return hoppers.map((view) => `${hopperDisplayName(view, foodForHopper(view.index, food1, food2))}: ${view.headline}`).join(", ");
}
function renderChip(view, food, onActivate) {
  const name = hopperDisplayName(view, food);
  const label = hopperAriaLabel(view, food);
  return b2`
    <button type="button" class="chip" data-tone=${view.tone} style=${`--chip-c:${TONE_COLOR[view.tone]}`} aria-label=${label} title=${view.detail ?? ""} @click=${onActivate}>
      <span class="chip-dot"></span>
      <span class="chip-name">${name}</span>
      <span class="chip-word">${view.headline}</span>
    </button>
  `;
}
var KibbleBowl = class extends i4 {
  constructor() {
    super();
    this._wasFeeding = false;
    this._dropping = false;
    this.fill = null;
    this.hopperLevel1 = null;
    this.hopperLevel2 = null;
    this.hopperRemaining1 = null;
    this.hopperRemaining2 = null;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this.feeding = false;
    this.portions = 1;
    this.calibration = null;
    this.darkMode = false;
    this.bowlMix = 0;
    this.pourSource = null;
  }
  static {
    this.properties = {
      fill: { type: Number },
      hopperLevel1: { type: String },
      hopperLevel2: { type: String },
      hopperRemaining1: { attribute: false },
      hopperRemaining2: { attribute: false },
      singleHopper: { type: Boolean },
      food1: { type: String },
      food2: { type: String },
      feeding: { type: Boolean },
      portions: { type: Number },
      calibration: { attribute: false },
      darkMode: { type: Boolean },
      bowlMix: { type: Number },
      pourSource: { attribute: false },
      fillSource: { type: String }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }
  _openHopperDetail() {
    this.dispatchEvent(new CustomEvent("hopper-detail-requested", { bubbles: true, composed: true }));
  }
  willUpdate(changed) {
    if (changed.has("feeding")) {
      if (this.feeding && !this._wasFeeding) {
        clearTimeout(this._dropTimer);
        this._dropping = true;
        this._dropTimer = setTimeout(() => {
          this._dropping = false;
          this.requestUpdate();
        }, MAX_DROP_MS);
      } else if (!this.feeding && this._wasFeeding && this._dropping) {
        clearTimeout(this._dropTimer);
        this._dropTimer = setTimeout(() => {
          this._dropping = false;
          this.requestUpdate();
        }, KIBBLE_FALL_DURATION_MS);
      }
      this._wasFeeding = this.feeding;
    }
  }
  _compartments(hoppers) {
    if (hoppers.length === 1) {
      const view = hoppers[0];
      return [{ x: HOPPER_X, w: HOPPER_W, fraction: view.fillFraction ?? 0, food: FOOD_1, gradientId: "hopper-food-1", textureId: "tex-dot", toneColor: TONE_COLOR[view.tone] }];
    }
    const [view1, view2] = hoppers;
    return [
      { x: HOPPER_X, w: HOPPER_W / 2, fraction: view1.fillFraction ?? 0, food: FOOD_1, gradientId: "hopper-food-1", textureId: "tex-dot", toneColor: TONE_COLOR[view1.tone] },
      { x: HOPPER_X + HOPPER_W / 2, w: HOPPER_W / 2, fraction: view2.fillFraction ?? 0, food: FOOD_2, gradientId: "hopper-food-2", textureId: "tex-fleck", toneColor: TONE_COLOR[view2.tone] }
    ];
  }
  render() {
    const finish = this.darkMode ? FINISH.frosted : FINISH.ceramic;
    const hoppers = hopperViews(this.singleHopper, this.hopperLevel1, this.hopperLevel2, this.hopperRemaining1, this.hopperRemaining2);
    const compartments = this._compartments(hoppers);
    const calibratedFillPercent = this.fill == null ? null : calibratedPercent(this.calibration, this.fill / 100);
    const fraction = this.fill == null ? null : this.fill / 100;
    const source = effectivePourSource(this.pourSource, this.singleHopper);
    const pourColors = pourColorsFor(source);
    const outletY = CHUTE_BOTTOM - 2;
    const level = bowlLevelY(fraction ?? 0);
    const isEstimate = this.fillSource === "estimate";
    const artLabel = `${hopperGroupTitle(hoppers, this.food1, this.food2)}. ${bowlTitle(fraction, calibratedFillPercent, isEstimate)}`;
    return b2`
      <svg class="art" viewBox="0 0 ${ART_VIEW_W} ${ART_VIEW_H}" role="img" aria-label=${artLabel} preserveAspectRatio="xMidYMid meet">
        <g class="hopper-scene">
          <title>${hopperGroupTitle(hoppers, this.food1, this.food2)}</title>
          ${hopperArt(finish, compartments)}
        </g>
        ${chuteArt(finish, this.feeding)}
        <g class="bowl-scene">
          <title>${bowlTitle(fraction, calibratedFillPercent, isEstimate)}</title>
          ${bowlArt(finish, fraction, this.bowlMix)}
        </g>
        ${this._dropping && !prefersReducedMotion() ? pourPieces(pourColors, this.portions, BOWL_CX, outletY, level) : A}
      </svg>
      ${calibratedFillPercent != null ? b2`<div class="calibrated" role="status">${Math.round(calibratedFillPercent)}% full <span class="raw">\u00b7 raw ${Math.round(this.fill)}</span></div>` : A}
      <div class="chips">${hoppers.map((view) => renderChip(view, foodForHopper(view.index, this.food1, this.food2), () => this._openHopperDetail()))}</div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--kibble-rhythm, 10px);
      width: 100%;
    }
    /* width:100% + aspect-ratio gives .art its natural preferred size, same as always -- the
     * new part is min-height: 0, overriding the flex automatic-minimum-size default (which
     * clamps shrinking to an item's own preferred size for anything with an intrinsic aspect
     * ratio and overflow:visible). Without it, a squeezed host (kibble-card.ts's >=960px
     * side-by-side tier, where this column's own height is capped to match the video) could
     * not actually shrink .art at all -- it just kept its natural ~256px height and visually
     * overflowed straight through .calibrated/.chips below it and into whatever sits past this
     * component entirely. flex-shrink is 1 by default; .calibrated/.chips are flex: none
     * (below) and never give up their own space, so a genuine squeeze always comes out of .art
     * first -- preserveAspectRatio="xMidYMid meet" on the svg itself (render(), above) is what
     * then scales the actual artwork down to whatever smaller box results, instead of cropping
     * or distorting it. */
    .art {
      display: block;
      width: 100%;
      aspect-ratio: ${ART_VIEW_W} / ${ART_VIEW_H};
      min-height: 0;
      overflow: visible;
    }
    /* The calibrated readout: a real, meaningful number now that a curve exists, so unlike the
     * raw score it earns primary-text weight -- the raw figure stays too, just secondary, since
     * every existing threshold elsewhere is still keyed to it, never this one. */
    .calibrated {
      flex: none;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: var(--primary-text-color);
    }
    .calibrated .raw {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .chips {
      flex: none;
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      width: 100%;
    }
    .chip {
      flex: 1 1 0;
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      font: inherit;
      color: inherit;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    .chip:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }
    .chip-dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--chip-c);
      box-shadow: 0 0 6px var(--chip-c);
    }
    .chip-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .chip-word {
      flex: none;
      font-size: 12px;
      font-weight: 700;
    }
    .chip[data-tone="low"] .chip-word {
      color: var(--kibble-amber-dark);
    }
    .chip[data-tone="empty"] .chip-word {
      color: var(--error-color, #db4437);
    }
    .pour-piece {
      transform-box: fill-box;
      animation: kibble-pour-fall var(--fall-duration) linear var(--fall-delay) infinite both;
    }
    /* Position samples position at t^2 (0, 0.04, 0.178, 0.415, 0.713, 1) -- true quadratic
     * ease-in between those stops, so the fall visibly accelerates like a dropped object
     * instead of following a stock easing curve. The last stretch (90-100%) holds at the
     * landed position for a brief squash-and-release settle, then fades into the pile. */
    @keyframes kibble-pour-fall {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      6% {
        opacity: 1;
      }
      18% {
        transform: translateY(calc(var(--fall-to) * 0.04));
      }
      38% {
        transform: translateY(calc(var(--fall-to) * 0.178));
      }
      58% {
        transform: translateY(calc(var(--fall-to) * 0.415));
      }
      76% {
        transform: translateY(calc(var(--fall-to) * 0.713));
      }
      90% {
        transform: translateY(var(--fall-to));
      }
      96% {
        transform: translateY(var(--fall-to)) scale(1.15, 0.82);
        opacity: 1;
      }
      100% {
        transform: translateY(var(--fall-to)) scale(1);
        opacity: 0;
      }
    }
  `;
  }
};
customElements.define("kibble-bowl", KibbleBowl);

// src/lib/dual-feed.ts
function dualFeedPlan(amount1, amount2) {
  if (amount1 > 0 && amount2 > 0) return { hopper: "both", amount: amount1, amount2 };
  if (amount1 > 0) return { hopper: "1", amount: amount1 };
  if (amount2 > 0) return { hopper: "2", amount: amount2 };
  return null;
}

// src/lib/popup-hash.ts
function popupForHash(hash, config) {
  if (!config) return null;
  const detectionAreasHash = config.detection_areas_hash ?? "#detection-areas";
  if (hash === detectionAreasHash) return "detection-areas";
  const calibrateHash = config.calibrate_hash ?? "#calibrate";
  if (hash === calibrateHash) return "calibrate";
  return null;
}

// src/lib/bowl-mix.ts
var BOWL_MIX_MAX_AGE_MS = 12 * 60 * 60 * 1e3;
function deriveBowlMix(events, singleHopper, now = /* @__PURE__ */ new Date()) {
  if (singleHopper) return 0;
  const cutoffSeconds = (now.getTime() - BOWL_MIX_MAX_AGE_MS) / 1e3;
  for (const event of events) {
    if (event.kind !== "feed" || event.start < cutoffSeconds) continue;
    const sides = event.feed?.sides;
    if (!sides || sides.length === 0) continue;
    const total = sides.reduce((sum, side) => sum + side.portions, 0);
    if (total <= 0) continue;
    const hopper2Portions = sides.find((side) => side.hopper === 2)?.portions ?? 0;
    return hopper2Portions / total;
  }
  return 0;
}

// src/lib/feed-request.ts
var FEED_REQUEST_IDLE = { phase: "idle", elapsedMs: 0 };
var DEFAULT_FEED_REQUEST_CONFIG = { timeoutMs: 1e4 };
function feedRequestSubmitted() {
  return { phase: "requesting", elapsedMs: 0 };
}
function feedRequestTick(state, deltaMs, config) {
  if (state.phase !== "requesting") return state;
  const elapsedMs = state.elapsedMs + deltaMs;
  if (elapsedMs >= config.timeoutMs) return { phase: "timeout", elapsedMs: config.timeoutMs };
  return { phase: "requesting", elapsedMs };
}
function feedRequestFeedingChanged(state, feeding) {
  if (feeding) return { phase: "feeding", elapsedMs: 0 };
  if (state.phase === "feeding") return FEED_REQUEST_IDLE;
  return state;
}
function feedRequestReset() {
  return FEED_REQUEST_IDLE;
}

// src/components/kibble-segmented-picker.ts
var KibbleSegmentedPicker = class extends i4 {
  static {
    this.properties = {
      value: { type: String },
      options: { attribute: false },
      groupLabel: { type: String, attribute: "group-label" },
      disabled: { type: Boolean },
      /** Segments size to their own label instead of splitting the row evenly -- for the hopper
       * choice, where "Both" and a long food name have no business being the same width. Unset
       * (the portion amount's plain digits) keeps the original equal-width segments. */
      contentFit: { type: Boolean, attribute: "content-fit" }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.options = [];
    this.groupLabel = "";
    this.disabled = false;
    this.contentFit = false;
  }
  render() {
    return b2`
      <div class="segments" role="radiogroup" aria-label=${this.groupLabel}>
        ${this.options.map(
      (option) => b2`
            <button
              type="button"
              role="radio"
              aria-checked=${option.value === this.value}
              class="segment ${option.value === this.value ? "selected" : ""}"
              ?disabled=${this.disabled}
              @click=${() => this._select(option.value)}
            >
              <span class="segment-label">${option.label}</span>
            </button>
          `
    )}
      </div>
    `;
  }
  _select(value) {
    this.dispatchEvent(new CustomEvent("option-selected", { detail: { value }, bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: block;
      container-type: inline-size;
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
      overflow: hidden;
      padding: 0 4px;
      box-sizing: border-box;
      transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease;
    }
    /* Segments size to their own label (a caller opts in for variable-length text, e.g. the
       hopper choice's "Both" vs. a food name) instead of splitting the row evenly -- "Both"
       stays narrow, a long food name gets the room it actually needs. Falls back to a smaller
       label size before ever truncating, since a name silently getting cut off is worse than a
       slightly smaller one staying whole. */
    :host([content-fit]) .segment {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 14px;
    }
    @container (max-width: 300px) {
      :host([content-fit]) .segment-label {
        font-size: 13px;
      }
    }
    /* A text label (the hopper choice's "Both"/food names) can run longer than a single
       portion digit ever does -- truncated with an ellipsis rather than wrapping or blowing
       out the pill's fixed touch-target width. */
    .segment-label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Press feedback -- the small tactile detail that makes a touch panel feel native. */
    .segment:active:not(:disabled) {
      transform: scale(0.96);
    }
    .segment.selected {
      /* The selected portion belongs to the feed action, not to the food, so it carries the
         action colour -- an amber pill above a green button read as two unrelated controls.
         Fallback hex matches styles/tokens.ts's KIBBLE_FEED/KIBBLE_INK_ON_FEED: this picker
         is also used standalone (dev/parts.html) outside kibble-card's own :host scope,
         which is the only place these custom properties are otherwise ever set. */
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .segment:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .segment:focus-visible {
      outline: 2px solid var(--kibble-feed-dark, #2f8551);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-segmented-picker", KibbleSegmentedPicker);

// src/components/kibble-stepper.ts
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

// node_modules/lit-html/directive-helpers.js
var { I: t3 } = j;
var r4 = (o7) => void 0 === o7.strings;

// node_modules/lit-html/directive.js
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

// node_modules/lit-html/async-directive.js
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

// node_modules/lit-html/directives/ref.js
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

// src/lib/hold-progress.ts
var HOLD_IDLE = { phase: "idle", elapsedMs: 0, firedStages: [], releaseProgress: 0 };
var DEFAULT_HOLD_CONFIG = {
  durationMs: 1500,
  // Thirds read as more deliberate stage-ups than quarters, and holding the third tier off
  // until 86% leaves a real "just before completion" gap before the near-complete zone takes
  // over -- see that zone's own comment for why the two never overlap.
  stageThresholds: [0.33, 0.66, 0.86],
  // Starts just after the third stage tier locks in, so the tremble/glow ramp reads as pure
  // anticipation on a settled gold tier rather than fighting a colour change mid-tremble.
  nearCompleteAt: 0.88,
  // A fast ease-out, but with enough room to actually read as a deliberate settle rather than
  // a snap back to zero.
  drainMs: 300
};
function holdPress() {
  return { phase: "charging", elapsedMs: 0, firedStages: [], releaseProgress: 0 };
}
function holdTick(state, deltaMs, config) {
  if (state.phase === "charging") {
    const elapsedMs = state.elapsedMs + deltaMs;
    if (elapsedMs >= config.durationMs) {
      return { phase: "completed", elapsedMs: config.durationMs, firedStages: state.firedStages, releaseProgress: 0 };
    }
    return { ...state, elapsedMs };
  }
  if (state.phase === "draining") {
    const elapsedMs = state.elapsedMs + deltaMs;
    if (elapsedMs >= config.drainMs) return HOLD_IDLE;
    return { ...state, elapsedMs };
  }
  return state;
}
function holdRelease(state, config) {
  if (state.phase !== "charging") return state;
  const progress = Math.min(1, state.elapsedMs / config.durationMs);
  return { phase: "draining", elapsedMs: 0, firedStages: [], releaseProgress: progress };
}
function holdProgress(state, config) {
  if (state.phase === "idle") return 0;
  if (state.phase === "completed") return 1;
  if (state.phase === "charging") return Math.min(1, state.elapsedMs / config.durationMs);
  const drained = config.drainMs > 0 ? Math.min(1, state.elapsedMs / config.drainMs) : 1;
  return state.releaseProgress * (1 - drained);
}
function holdNearComplete(state, config) {
  if (state.phase !== "charging") return false;
  return holdProgress(state, config) >= config.nearCompleteAt;
}
function holdNewlyCrossedStages(state, config) {
  if (state.phase !== "charging") return [];
  const progress = holdProgress(state, config);
  const crossed = [];
  config.stageThresholds.forEach((threshold, index) => {
    if (progress >= threshold && !state.firedStages.includes(index)) crossed.push(index);
  });
  return crossed;
}
function holdMarkStagesFired(state, indices) {
  if (indices.length === 0) return state;
  return { ...state, firedStages: [...state.firedStages, ...indices] };
}

// src/lib/haptics.ts
function fireHaptic(kind) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("haptic", { detail: kind }));
}

// src/components/kibble-hold-button.ts
var SETTLE_MS = 600;
var STATIC_GLOW_MS = 260;
var STATIC_GLOW_COMPLETE_MS = 450;
var EMBLEM_INSET_PX = 6;
var TIER_COLORS = ["#34d3c3", "#9b87f5", "#f7c948"];
function easeOutCubic(t5) {
  const inv = 1 - t5;
  return 1 - inv * inv * inv;
}
var KibbleHoldButton = class extends i4 {
  constructor() {
    super();
    this._holdState = HOLD_IDLE;
    this._config = DEFAULT_HOLD_CONFIG;
    this._pointerId = null;
    this._rafId = null;
    this._lastFrameMs = 0;
    this._reducedMotion = false;
    this._completed = false;
    this._buttonRef = e5();
    this._tapFlashRef = e5();
    this._shockRef = e5();
    this._ringRef = e5();
    this._triangle1Ref = e5();
    this._triangle2Ref = e5();
    this._dotRefs = Array.from({ length: 8 }, () => e5());
    // ---- Press / release entry points (pointer and keyboard share the same core) ----
    this._onPointerDown = (event) => {
      if (this.disabled || this._holdState.phase === "charging") return;
      event.preventDefault();
      const button = event.currentTarget;
      try {
        button.setPointerCapture(event.pointerId);
        this._pointerId = event.pointerId;
      } catch {
      }
      this._begin();
    };
    this._onPointerUp = (event) => {
      if (this._pointerId !== null && event.pointerId !== this._pointerId) return;
      this._release();
    };
    this._onKeyDown = (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      if (event.repeat) return;
      if (this.disabled || this._holdState.phase === "charging") return;
      event.preventDefault();
      this._begin();
    };
    this._onKeyUp = (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      this._release();
    };
    this._onBlur = () => {
      this._release();
    };
    /** Cancels the browser's own long-press handling so the gesture belongs to this button. */
    this._suppressOsGesture = (event) => {
      event.preventDefault();
    };
    this._tapActivate = () => {
      if (this.disabled) return;
      if (!this._prefersReducedMotion()) this._playTapPulse();
      this._activate();
    };
    this._chargeFrame = (nowMs) => {
      const deltaMs = Math.min(48, nowMs - this._lastFrameMs);
      this._lastFrameMs = nowMs;
      const previousPhase = this._holdState.phase;
      this._holdState = holdTick(this._holdState, deltaMs, this._config);
      const crossed = holdNewlyCrossedStages(this._holdState, this._config);
      if (crossed.length > 0) {
        this._holdState = holdMarkStagesFired(this._holdState, crossed);
        this._onStagesCrossed();
      }
      this._paintProgress(this._displayProgress());
      if (previousPhase !== "completed" && this._holdState.phase === "completed") {
        this._onCompleted();
        return;
      }
      if (this._holdState.phase === "charging" || this._holdState.phase === "draining") {
        this._rafId = requestAnimationFrame(this._chargeFrame);
      } else {
        this._rafId = null;
        this.requestUpdate();
      }
    };
    this.label = "Hold to feed";
    this.variant = "feed";
    this.disabled = false;
    this.holdMs = HOLD_TO_FEED_MS;
    this.pending = false;
  }
  static {
    this.properties = {
      label: { type: String },
      variant: { type: String },
      disabled: { type: Boolean },
      holdMs: { type: Number, attribute: "hold-ms" },
      pending: { type: Boolean }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopChargeLoop();
    clearTimeout(this._settleTimer);
    clearTimeout(this._staticGlowTimer);
    this._holdState = HOLD_IDLE;
    this._pointerId = null;
  }
  firstUpdated() {
    this._paintProgress(0);
  }
  updated(changed) {
    if (changed.has("disabled") && this.disabled) this._release();
    if (changed.has("holdMs")) this._config = { ...DEFAULT_HOLD_CONFIG, durationMs: this._duration() };
  }
  _duration() {
    return Number.isFinite(this.holdMs) && this.holdMs > 0 ? this.holdMs : HOLD_TO_FEED_MS;
  }
  _prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }
  _emblemTemplate() {
    const dots = this._dotRefs.map((dotRef, index) => {
      const angle = index / this._dotRefs.length * Math.PI * 2;
      const cx = (24 + Math.cos(angle) * 21).toFixed(2);
      const cy = (24 + Math.sin(angle) * 21).toFixed(2);
      return w`<circle ${n5(dotRef)} class="dot" cx=${cx} cy=${cy} r="1.8"></circle>`;
    });
    return w`
      <svg viewBox="0 0 48 48">
        <circle class="ring-static" cx="24" cy="24" r="21"></circle>
        <g class="spin">
          <circle ${n5(this._ringRef)} class="stroke" cx="24" cy="24" r="21" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
          <g class="dots">${dots}</g>
        </g>
        <g class="spin2">
          <polygon ${n5(this._triangle1Ref)} class="stroke" points="24,8 37.9,32 10.1,32" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
          <polygon ${n5(this._triangle2Ref)} class="stroke" points="24,40 10.1,16 37.9,16" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></polygon>
        </g>
        <circle class="core" cx="24" cy="24" r="3"></circle>
      </svg>
    `;
  }
  render() {
    const isFeed = this.variant === "feed";
    const phase = this._holdState.phase;
    const classes = [
      "button",
      isFeed ? "feed" : "cancel",
      phase === "charging" ? "holding" : "",
      this._completed ? "completed" : "",
      isFeed && this.pending ? "pending" : "",
      this._reducedMotion ? "reduced-motion" : ""
    ].filter(Boolean).join(" ");
    const accessibleLabel = phase === "charging" ? `${this.label}. Keep holding to continue.` : this.label;
    return b2`
      <div class="frame">
        <button
          type="button"
          ${n5(this._buttonRef)}
          class=${classes}
          aria-label=${accessibleLabel}
          ?disabled=${this.disabled}
          @pointerdown=${isFeed ? this._onPointerDown : void 0}
          @pointerup=${isFeed ? this._onPointerUp : void 0}
          @pointerleave=${isFeed ? this._onPointerUp : void 0}
          @pointercancel=${isFeed ? this._onPointerUp : void 0}
          @lostpointercapture=${isFeed ? this._onPointerUp : void 0}
          @keydown=${isFeed ? this._onKeyDown : void 0}
          @keyup=${isFeed ? this._onKeyUp : void 0}
          @blur=${isFeed ? this._onBlur : void 0}
          @click=${isFeed ? void 0 : this._tapActivate}
          @contextmenu=${this._suppressOsGesture}
          @selectstart=${this._suppressOsGesture}
          @dragstart=${this._suppressOsGesture}
        >
          ${isFeed ? b2`
                <span class="clip"><span class="fill"></span><span class="edge"></span></span>
                <span class="emblem">${this._emblemTemplate()}</span>
                <span class="shock" ${n5(this._shockRef)} aria-hidden="true"></span>
                <span class="flash" aria-hidden="true"></span>
                <span class="label">
                  <span class="label-text">${this.label}</span>
                  <span class="label-check" aria-hidden="true">${mdiIcon("check")}</span>
                </span>
              ` : b2`<span class="tap-flash" ${n5(this._tapFlashRef)} aria-hidden="true"></span>
                <span class="label"><span class="label-text">${this.label}</span></span>`}
        </button>
      </div>
    `;
  }
  _begin() {
    this._reducedMotion = this._prefersReducedMotion();
    this._config = { ...DEFAULT_HOLD_CONFIG, durationMs: this._duration() };
    this._holdState = holdPress();
    this._completed = false;
    clearTimeout(this._settleTimer);
    this.requestUpdate();
    this._paintProgress(0);
    this._lastFrameMs = performance.now();
    this._stopChargeLoop();
    this._rafId = requestAnimationFrame(this._chargeFrame);
  }
  _release() {
    this._releasePointerCapture();
    this._pointerId = null;
    if (this._holdState.phase !== "charging") return;
    this._holdState = holdRelease(this._holdState, this._config);
    this.requestUpdate();
  }
  _releasePointerCapture() {
    const id = this._pointerId;
    const button = this._buttonRef.value;
    if (id === null || !button) return;
    try {
      if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
    } catch {
    }
  }
  _playTapPulse() {
    const button = this._buttonRef.value;
    const flash = this._tapFlashRef.value;
    button?.classList.remove("tap-pulse");
    flash?.classList.remove("flash-pulse");
    void button?.offsetWidth;
    button?.classList.add("tap-pulse");
    flash?.classList.add("flash-pulse");
  }
  _activate() {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }
  // ---- The charge/drain animation loop ----
  _stopChargeLoop() {
    if (this._rafId != null) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }
  /** 0..1 fill to actually paint. Charging/idle/completed pass `holdProgress` straight through;
   * draining eases it (fast start, gentle settle) so a cancelled hold reads as a deliberate
   * release, not a value simply snapping to zero. */
  _displayProgress() {
    const raw = holdProgress(this._holdState, this._config);
    if (this._holdState.phase !== "draining" || this._config.drainMs <= 0) return raw;
    const releaseProgress = this._holdState.releaseProgress;
    if (releaseProgress <= 0) return 0;
    const drained = Math.min(1, this._holdState.elapsedMs / this._config.drainMs);
    return releaseProgress * (1 - easeOutCubic(drained));
  }
  /** Which of the three tiers (teal/violet/gold) the current progress has reached. */
  _tierColor(progress) {
    let index = 0;
    for (const threshold of this._config.stageThresholds) {
      if (progress >= threshold) index += 1;
    }
    return TIER_COLORS[Math.min(index, TIER_COLORS.length - 1)];
  }
  /** Writes the current progress straight to the DOM: the pill's `--p`/`--c` custom properties
   * (drive the CSS fill wash, edge line, and ambient glow), the emblem's ring/triangle
   * `strokeDashoffset` (the "drawing itself" effect), its eight dots lighting up in turn, and
   * the tension tremble class. Called every animation frame plus a couple of fixed points
   * (press start, settle) so the emblem is never left mid-frame. */
  _paintProgress(rawProgress) {
    const button = this._buttonRef.value;
    if (!button) return;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const tierColor = this._tierColor(progress);
    button.style.setProperty("--p", progress.toFixed(4));
    button.style.setProperty("--c", tierColor);
    const trembling = holdNearComplete(this._holdState, this._config) && !this._reducedMotion;
    button.classList.toggle("tense", trembling);
    const segment = (from, to) => Math.max(0, Math.min(1, (progress - from) / (to - from)));
    const dashOffset = (drawn) => (100 - drawn * 100).toFixed(2);
    this._ringRef.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0, 0.45)));
    this._triangle1Ref.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0.3, 0.7)));
    this._triangle2Ref.value?.setAttribute("stroke-dashoffset", dashOffset(segment(0.6, 0.95)));
    this._dotRefs.forEach((dotRef, index) => {
      dotRef.value?.classList.toggle("lit", progress >= (index + 1) / (this._dotRefs.length + 1));
    });
  }
  _onStagesCrossed() {
    fireHaptic("light");
    this._pulseShock(false);
  }
  /** Retriggers the shock glow's CSS animation (or, under reduced motion, its static
   * equivalent) via a forced reflow, so a fresh pulse -- another tier, or completion right on
   * the heels of the third tier -- always restarts from scratch instead of being a no-op
   * because the class was already present. `intense` is completion's slightly brighter,
   * longer-lingering variant of the same glow; everything else (colour, duration under full
   * motion) is shared with a tier crossing's own pulse. */
  _pulseShock(intense) {
    const shock = this._shockRef.value;
    if (!shock) return;
    clearTimeout(this._staticGlowTimer);
    shock.classList.remove("go", "static");
    shock.classList.toggle("complete", intense);
    void shock.offsetWidth;
    if (this._reducedMotion) {
      shock.classList.add("static");
      this._staticGlowTimer = window.setTimeout(
        () => shock.classList.remove("static", "complete"),
        intense ? STATIC_GLOW_COMPLETE_MS : STATIC_GLOW_MS
      );
      return;
    }
    shock.classList.add("go");
  }
  _onCompleted() {
    this._releasePointerCapture();
    this._pointerId = null;
    this._completed = true;
    this.requestUpdate();
    fireHaptic("success");
    this._pulseShock(true);
    this._activate();
    this._settleTimer = window.setTimeout(() => {
      this._completed = false;
      this._holdState = HOLD_IDLE;
      this._paintProgress(0);
      this.requestUpdate();
    }, SETTLE_MS);
  }
  static {
    this.styles = i`
    :host {
      display: block;
      /* The pill sits on the card, not floating free of it: base/edge/text all derive from the
       * card's own theme variables, mixed so the pill reads as slightly raised in both a dark
       * and a light theme rather than only working for the one it was tuned against. */
      --kibble-pill-surface: var(--ha-card-background, var(--card-background-color, #1e2533));
      --kibble-pill-ink: var(--primary-text-color, #eef2f7);
      --kibble-pill-edge: var(--divider-color, color-mix(in srgb, var(--kibble-pill-ink) 16%, transparent));
    }
    .frame {
      position: relative;
      display: block;
    }
    .button {
      position: relative;
      z-index: 1;
      width: 100%;
      height: var(--kibble-feed-button-height, 56px);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      isolation: isolate;
      /* Not clipped: the shock glow and the emblem's completion flare both need to bloom a few
       * pixels past the pill's own rounded edge. Only .clip (the fill + edge line) is cropped. */
      overflow: visible;
      cursor: pointer;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      outline: none;
      font: inherit;
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      background: color-mix(in srgb, var(--kibble-pill-surface) 92%, var(--kibble-pill-ink) 8%);
      border: 1px solid var(--kibble-pill-edge);
      color: var(--kibble-pill-ink);
      --kibble-glow: color-mix(
        in srgb,
        color-mix(in srgb, var(--c, #34d3c3) 60%, var(--accent-color, var(--primary-color, #34d3c3)) 40%) 82%,
        var(--kibble-pill-surface) 18%
      );
      box-shadow:
        0 1px 0 0 rgba(255, 255, 255, 0.14) inset,
        0 3px 10px 0 rgba(0, 0, 0, 0.16),
        0 0 calc(var(--p, 0) * 9px) color-mix(in srgb, var(--kibble-glow) calc(var(--p, 0) * 45%), transparent);
      transition: transform 140ms cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 200ms ease, background 160ms ease, color 160ms ease;
    }
    .button.holding {
      transform: scale(0.975);
    }
    .button.tense {
      animation: kibble-seal-tense 80ms linear infinite;
    }
    .button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .button.completed {
      background: linear-gradient(135deg, #f2c14e, #f6da8a);
      border-color: transparent;
      color: #2a1d00;
      animation: kibble-seal-pop 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .clip {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0;
      transform-origin: left;
      transform: scaleX(var(--p, 0));
      background: linear-gradient(90deg, color-mix(in srgb, var(--c, #34d3c3) 16%, transparent), color-mix(in srgb, var(--c, #34d3c3) 46%, transparent));
    }
    .button.completed .fill {
      background: transparent;
    }
    .edge {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(var(--p, 0) * 100% - 1px);
      width: 3px;
      background: var(--c, #34d3c3);
      box-shadow: 0 0 9px 2px var(--c, #34d3c3);
      opacity: calc(min(0.85, var(--p, 0) * 6));
    }
    .button.completed .edge {
      opacity: 0;
    }
    .emblem {
      position: absolute;
      left: ${EMBLEM_INSET_PX}px;
      top: 50%;
      transform: translateY(-50%);
      width: calc(var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px);
      height: calc(var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px);
      z-index: 2;
      pointer-events: none;
    }
    .emblem svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .ring-static {
      fill: none;
      stroke: currentColor;
      stroke-opacity: 0.16;
      stroke-width: 1.5;
    }
    .stroke {
      fill: none;
      stroke: var(--c, #34d3c3);
      stroke-width: 1.8;
      filter: drop-shadow(0 0 1.8px var(--c, #34d3c3));
    }
    .spin {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 8s linear infinite;
    }
    .spin2 {
      transform-origin: 24px 24px;
      animation: kibble-seal-spin 5s linear infinite reverse;
    }
    .button.holding .spin {
      animation-duration: 1.6s;
    }
    .button.holding .spin2 {
      animation-duration: 1.2s;
    }
    .dots .dot {
      fill: color-mix(in srgb, currentColor 22%, transparent);
      transition: fill 140ms ease;
    }
    .dots .dot.lit {
      fill: currentColor;
    }
    .core {
      fill: var(--c, #34d3c3);
    }
    .button.completed .emblem {
      animation: kibble-seal-flare 700ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .button.pending .emblem {
      animation: kibble-seal-pulse 1.8s ease-in-out infinite;
    }
    .shock {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      box-shadow: 0 0 0 0 transparent;
      pointer-events: none;
    }
    .shock.go {
      animation: kibble-seal-shock 560ms cubic-bezier(0.2, 0.7, 0.3, 1);
    }
    .shock.go.complete {
      animation-name: kibble-seal-shock-complete;
    }
    .shock.static {
      opacity: 0.3;
      box-shadow: 0 0 6px 2px var(--kibble-glow, #34d3c3);
    }
    .shock.static.complete {
      opacity: 0.4;
      box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
    }
    .flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, #f7c948) 70%, white 30%);
      opacity: 0;
      pointer-events: none;
      z-index: 3;
    }
    .button.completed .flash {
      animation: kibble-seal-flash 480ms ease-out;
    }
    .button.cancel {
      --kibble-glow: color-mix(in srgb, var(--accent-color, var(--primary-color, #34d3c3)) 78%, var(--kibble-pill-surface) 22%);
      transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 140ms ease;
    }
    .button.cancel:active {
      transform: scale(0.97);
    }
    .tap-flash {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: color-mix(in srgb, var(--kibble-glow, var(--primary-color, #34d3c3)) 65%, white 25%);
      opacity: 0;
      pointer-events: none;
    }
    .tap-flash.flash-pulse {
      animation: kibble-tap-flash 260ms ease-out;
    }
    .button.tap-pulse {
      animation: kibble-tap-pulse 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-select: none;
      pointer-events: none;
    }
    /* Nudged right of true-centre by the emblem's own footprint, so the text optically balances
     * against it instead of sitting dead-centre and crowding it. Cancel has no emblem. */
    .button.feed .label {
      padding-left: calc(${EMBLEM_INSET_PX}px + (var(--kibble-feed-button-height, 56px) - ${EMBLEM_INSET_PX * 2}px) + 8px);
    }
    .label-text {
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .label-check {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35em;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .button.completed .label-text {
      opacity: 0;
      transform: scale(0.85);
    }
    .button.completed .label-check {
      opacity: 1;
      transform: scale(1);
    }
    @media (prefers-reduced-motion: reduce) {
      .button {
        transition: box-shadow 160ms ease, background 160ms ease, color 160ms ease;
      }
      .button.holding,
      .button.cancel:active {
        transform: none;
      }
      .button.tense,
      .spin,
      .spin2,
      .button.completed,
      .button.completed .emblem,
      .button.pending .emblem,
      .shock.go,
      .button.completed .flash,
      .tap-flash.flash-pulse,
      .button.tap-pulse {
        animation: none;
      }
      .label-text,
      .label-check {
        transition: opacity 180ms ease;
        transform: none !important;
      }
    }
    @keyframes kibble-seal-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-seal-tense {
      0% {
        translate: 0 0;
      }
      25% {
        translate: -1px 0.5px;
      }
      50% {
        translate: 1px -0.5px;
      }
      75% {
        translate: -0.5px -0.5px;
      }
      100% {
        translate: 0 0;
      }
    }
    @keyframes kibble-seal-shock {
      0% {
        opacity: 0.35;
        box-shadow: 0 0 0 0 var(--kibble-glow, #34d3c3);
      }
      60% {
        opacity: 0.28;
        box-shadow: 0 0 5px 1px var(--kibble-glow, #34d3c3);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 7px 2px var(--kibble-glow, #34d3c3);
      }
    }
    @keyframes kibble-seal-shock-complete {
      0% {
        opacity: 0.48;
        box-shadow: 0 0 1px 0 var(--kibble-glow, #f7c948);
      }
      55% {
        opacity: 0.4;
        box-shadow: 0 0 5px 2px var(--kibble-glow, #f7c948);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 6px 3px var(--kibble-glow, #f7c948);
      }
    }
    @keyframes kibble-seal-flash {
      0% {
        opacity: 0.32;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes kibble-seal-flare {
      0% {
        transform: translateY(-50%) scale(1);
      }
      40% {
        transform: translateY(-50%) scale(1.2);
      }
      100% {
        transform: translateY(-50%) scale(1);
      }
    }
    @keyframes kibble-seal-pulse {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.92;
      }
    }
    @keyframes kibble-seal-pop {
      0% {
        transform: scale(0.975);
      }
      45% {
        transform: scale(1.045);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-pulse {
      0% {
        transform: scale(1);
      }
      40% {
        transform: scale(1.035);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes kibble-tap-flash {
      0% {
        opacity: 0;
      }
      30% {
        opacity: 0.16;
      }
      100% {
        opacity: 0;
      }
    }
  `;
  }
};
customElements.define("kibble-hold-button", KibbleHoldButton);

// src/lib/schedule.ts
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
  for (const entry of entries) {
    if (!entry.enabled) continue;
    const entryMinutes = parseTimeToMinutes(entry.time);
    const minutesUntil = ((entryMinutes - nowMinutes) % 1440 + 1440) % 1440;
    if (best === null || minutesUntil < best.minutesUntil) {
      best = { entry, minutesUntil };
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
  const enabledCount = entries.filter((entry) => entry.enabled).length;
  const countWord = COUNT_WORDS[enabledCount] ?? String(enabledCount);
  return `Next feed ${formatClock(next.entry.time, locale)}, ${countWord} a day`;
}
var MAX_SCHEDULE_PORTIONS = 20;
function portionsWord(count) {
  return count === 1 ? "1 portion" : `${count} portions`;
}
function hopperLabel(index, food) {
  const name = food?.trim();
  return name ? name : `Hopper ${index}`;
}
function entryAmountsLabel(entry, single, food1, food2) {
  if (single) return portionsWord(Math.max(entry.amount_l, entry.amount_r));
  const parts = [];
  if (entry.amount_l > 0) parts.push(`${hopperLabel(1, food1)} ${entry.amount_l}`);
  if (entry.amount_r > 0) parts.push(`${hopperLabel(2, food2)} ${entry.amount_r}`);
  return parts.length > 0 ? parts.join(" + ") : "No food";
}
function sortScheduleEntries(entries) {
  return [...entries].sort((a3, b3) => parseTimeToMinutes(a3.time) - parseTimeToMinutes(b3.time));
}
function draftProblem(draft) {
  if (!/^\d{1,2}:\d{2}$/.test(draft.time.trim())) return "Pick a time";
  try {
    parseTimeToMinutes(draft.time);
  } catch {
    return "Pick a time";
  }
  for (const amount of [draft.amount_l, draft.amount_r]) {
    if (!Number.isInteger(amount) || amount < 0 || amount > MAX_SCHEDULE_PORTIONS) {
      return `Portions go from 0 to ${MAX_SCHEDULE_PORTIONS}`;
    }
  }
  if (draft.amount_l === 0 && draft.amount_r === 0) return "Pick at least one portion";
  return null;
}
function toServiceTime(time) {
  const minutes = parseTimeToMinutes(time);
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}:00`;
}
function scheduleAddData(deviceId, draft) {
  return {
    device_id: deviceId,
    time: toServiceTime(draft.time),
    hopper1_g: draft.amount_l,
    hopper2_g: draft.amount_r,
    enabled: true
  };
}
function scheduleSetEntries(entries, entryId, draft) {
  if (!entries.some((entry) => entry.id === entryId)) {
    throw new Error("That feed was removed meanwhile. Reopen the schedule and try again.");
  }
  return entries.map(
    (entry) => entry.id === entryId ? { entry_id: entry.id, time: toServiceTime(draft.time), hopper1_g: draft.amount_l, hopper2_g: draft.amount_r, enabled: entry.enabled } : { entry_id: entry.id, time: toServiceTime(entry.time), hopper1_g: entry.amount_l, hopper2_g: entry.amount_r, enabled: entry.enabled }
  );
}
function serviceErrorMessage(error) {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (typeof error === "object" && error !== null) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  return "Home Assistant did not accept the change";
}

// src/components/kibble-schedule-editor.ts
var NEW_DRAFT = { time: "12:00", amount_l: 1, amount_r: 0 };
var KibbleScheduleEditor = class extends i4 {
  constructor() {
    super();
    this._openNew = () => {
      this._error = null;
      this._confirmRemove = false;
      this._draft = { ...NEW_DRAFT };
      this._target = "new";
    };
    this._closeForm = () => {
      this._target = null;
      this._confirmRemove = false;
    };
    this._onTimeInput = (event) => {
      this._draft = { ...this._draft, time: event.target.value };
    };
    this._onSubmit = (event) => {
      event.preventDefault();
      void this._save();
    };
    this.entries = [];
    this.food1 = null;
    this.food2 = null;
    this._target = null;
    this._draft = { ...NEW_DRAFT };
    this._confirmRemove = false;
    this._busy = false;
    this._error = null;
    this._toggling = /* @__PURE__ */ new Set();
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entries: { attribute: false },
      deviceId: { type: String },
      food1: { type: String },
      food2: { type: String },
      _target: { state: true },
      _draft: { state: true },
      _confirmRemove: { state: true },
      _busy: { state: true },
      _error: { state: true },
      _toggling: { state: true }
    };
  }
  willUpdate(changed) {
    if (changed.has("entries") && this._target !== null && this._target !== "new" && !this.entries.some((entry) => entry.id === this._target)) {
      this._closeForm();
    }
  }
  render() {
    const sorted = sortScheduleEntries(this.entries);
    return b2`
      ${this._error ? b2`<p class="error" role="alert">${this._error}</p>` : A}
      ${sorted.length === 0 && this._target !== "new" ? b2`<p class="empty">No feeds scheduled</p>` : A}
      <ul class="entries">
        ${sorted.map((entry) => b2`<li>${this._target === entry.id ? this._renderForm(entry) : this._renderRow(entry)}</li>`)}
      </ul>
      ${this._target === "new" ? b2`<div class="form-slot">${this._renderForm(null)}</div>` : b2`
            <button type="button" class="add" ?disabled=${this._busy || !this.deviceId} @click=${this._openNew}>
              <span class="add-icon">${mdiIcon("plus")}</span><span>Add feed</span>
            </button>
          `}
    `;
  }
  _renderRow(entry) {
    const label = `${formatClock(entry.time)}, ${entryAmountsLabel(entry, false, this.food1, this.food2)}, ${entry.enabled ? "on" : "paused"}`;
    return b2`
      <div class="row ${entry.enabled ? "" : "paused"}">
        <button type="button" class="row-main" aria-label="Edit feed: ${label}" ?disabled=${this._busy} @click=${() => this._openEdit(entry)}>
          <span class="time">${formatClock(entry.time)}</span>
          ${this._renderAmount(hopperLabel(1, this.food1), entry.amount_l)} ${this._renderAmount(hopperLabel(2, this.food2), entry.amount_r)}
        </button>
        <button
          type="button"
          class="switch ${entry.enabled ? "on" : ""}"
          role="switch"
          aria-checked=${entry.enabled}
          aria-label="${formatClock(entry.time)} feed ${entry.enabled ? "on" : "paused"}"
          ?disabled=${this._busy || this._toggling.has(entry.id)}
          @click=${() => this._toggle(entry)}
        >
          <span class="track"><span class="thumb"></span></span>
          <span class="switch-word">${entry.enabled ? "On" : "Paused"}</span>
        </button>
      </div>
    `;
  }
  _renderAmount(name, amount) {
    return b2`
      <span class="amount ${amount === 0 ? "zero" : ""}">
        <span class="amount-name">${name}</span>
        <span class="amount-value">${amount}</span>
      </span>
    `;
  }
  _renderForm(entry) {
    if (entry && this._confirmRemove) return this._renderRemoveConfirm(entry);
    const draft = this._draft;
    const problem = draftProblem(draft);
    const name1 = hopperLabel(1, this.food1);
    const name2 = hopperLabel(2, this.food2);
    return b2`
      <form class="form" @submit=${this._onSubmit} novalidate>
        <h3>${entry ? "Edit feed" : "Add feed"}</h3>
        <label class="field">
          <span class="field-label">Time</span>
          <input type="time" step="60" required .value=${draft.time} ?disabled=${this._busy} @input=${this._onTimeInput} />
        </label>
        <div class="field">
          <span class="field-label">${name1}</span>
          <kibble-stepper
            .value=${draft.amount_l}
            .min=${0}
            .max=${MAX_SCHEDULE_PORTIONS}
            aria-label="${name1} portions"
            ?disabled=${this._busy}
            @value-selected=${(event) => this._setAmount("amount_l", event)}
          ></kibble-stepper>
        </div>
        <div class="field">
          <span class="field-label">${name2}</span>
          <kibble-stepper
            .value=${draft.amount_r}
            .min=${0}
            .max=${MAX_SCHEDULE_PORTIONS}
            aria-label="${name2} portions"
            ?disabled=${this._busy}
            @value-selected=${(event) => this._setAmount("amount_r", event)}
          ></kibble-stepper>
        </div>
        ${problem ? b2`<p class="hint" role="status">${problem}</p>` : A}
        <div class="actions">
          ${entry ? b2`<button type="button" class="btn danger-text" ?disabled=${this._busy} @click=${() => this._confirmRemove = true}>
                <span class="btn-icon">${mdiIcon("deleteOutline")}</span><span>Remove</span>
              </button>` : A}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${this._closeForm}>Cancel</button>
          <button type="submit" class="btn primary" ?disabled=${this._busy || problem !== null}>${this._busy ? "Saving\u2026" : "Save"}</button>
        </div>
      </form>
    `;
  }
  _renderRemoveConfirm(entry) {
    return b2`
      <div class="form" role="alertdialog" aria-label="Remove this feed?">
        <h3>Remove the ${formatClock(entry.time)} feed?</h3>
        <p class="confirm-text">
          ${entryAmountsLabel(entry, false, this.food1, this.food2)} will no longer be given at that time. This cannot be undone.
        </p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${this._busy} @click=${() => this._confirmRemove = false}>Keep</button>
          <button type="button" class="btn danger" ?disabled=${this._busy} @click=${() => this._remove(entry)}>
            ${this._busy ? "Removing\u2026" : "Remove feed"}
          </button>
        </div>
      </div>
    `;
  }
  _openEdit(entry) {
    this._error = null;
    this._confirmRemove = false;
    this._draft = { time: entry.time.padStart(5, "0"), amount_l: entry.amount_l, amount_r: entry.amount_r };
    this._target = entry.id;
  }
  _setAmount(side, event) {
    event.stopPropagation();
    this._draft = { ...this._draft, [side]: event.detail.value };
  }
  /** Runs one write: marks the editor busy, clears the previous error, and on a rejection shows
   * why. Resolves `true` only when Home Assistant accepted the call. */
  async _run(failure, call) {
    this._error = null;
    this._busy = true;
    try {
      await call();
      return true;
    } catch (error) {
      this._error = `${failure}: ${serviceErrorMessage(error)}`;
      return false;
    } finally {
      this._busy = false;
    }
  }
  async _save() {
    const target = this._target;
    if (target === null || draftProblem(this._draft) !== null) return;
    const deviceId = this.deviceId;
    if (!deviceId) {
      this._error = "Could not save the feed: the feeder was not found";
      return;
    }
    const draft = this._draft;
    const saved = await this._run(
      "Could not save the feed",
      () => target === "new" ? this.hass.callService("kibble", "schedule_add", scheduleAddData(deviceId, draft)) : this.hass.callService("kibble", "schedule_set", { device_id: deviceId, entries: scheduleSetEntries(this.entries, target, draft) })
    );
    if (saved) {
      fireHaptic("success");
      this._closeForm();
    }
  }
  async _remove(entry) {
    const deviceId = this.deviceId;
    if (!deviceId) {
      this._error = "Could not remove the feed: the feeder was not found";
      return;
    }
    const removed = await this._run(
      "Could not remove the feed",
      () => this.hass.callService("kibble", "schedule_remove", { device_id: deviceId, entry_id: entry.id })
    );
    if (removed) this._closeForm();
  }
  async _toggle(entry) {
    const deviceId = this.deviceId;
    if (!deviceId) return;
    this._error = null;
    this._toggling = new Set(this._toggling).add(entry.id);
    try {
      await this.hass.callService("kibble", "schedule_set_enabled", { device_id: deviceId, entry_id: entry.id, enabled: !entry.enabled });
    } catch (error) {
      this._error = `Could not ${entry.enabled ? "pause" : "turn on"} the feed: ${serviceErrorMessage(error)}`;
    } finally {
      const next = new Set(this._toggling);
      next.delete(entry.id);
      this._toggling = next;
    }
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .entries {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .entries li {
      border-top: 1px solid var(--divider-color);
    }
    .entries li:first-child {
      border-top: none;
    }
    .empty {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-schedule-size, 14px);
    }
    .error {
      margin: 0 0 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: var(--kibble-schedule-size, 14px);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row.paused .time,
    .row.paused .amount-value {
      color: var(--secondary-text-color);
    }
    .row-main {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: 4.6em 1fr 1fr;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 6px 0;
      background: none;
      border: none;
      font: inherit;
      color: var(--primary-text-color);
      text-align: left;
      cursor: pointer;
    }
    .time {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .amount-name {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .amount-value {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .amount.zero .amount-value {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .switch {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 0 0 4px;
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .switch-word {
      min-width: 3.6em;
      text-align: left;
    }
    .track {
      position: relative;
      width: 40px;
      height: 24px;
      border-radius: 12px;
      background: var(--divider-color);
      transition: background 0.15s ease;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      transition: transform 0.15s ease;
    }
    .switch.on .track {
      background: var(--kibble-feed, #43a96a);
    }
    .switch.on .thumb {
      transform: translateX(16px);
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--kibble-amber-dark, #de8a3a);
      outline-offset: 2px;
    }
    .add {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      min-height: var(--kibble-touch-target, 48px);
      padding: 0 12px 0 0;
      background: none;
      border: none;
      font: inherit;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .add-icon {
      display: flex;
      font-size: 20px;
    }
    .form-slot {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 8px 0;
      padding: 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .field-label {
      min-width: 0;
      font-size: var(--kibble-schedule-size, 14px);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input[type="time"] {
      min-height: 44px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 2px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
      font-variant-numeric: tabular-nums;
    }
    kibble-stepper {
      flex: none;
    }
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .confirm-text {
      margin: 0;
      font-size: var(--kibble-schedule-size, 14px);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .spacer {
      flex: 1;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .btn.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .btn.danger {
      border-color: transparent;
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .btn.danger-text {
      border-color: transparent;
      padding: 0 8px;
      color: var(--error-color, #db4437);
    }
    .btn-icon {
      display: flex;
      font-size: 18px;
    }
    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }
  `;
  }
};
customElements.define("kibble-schedule-editor", KibbleScheduleEditor);

// src/components/kibble-schedule-summary.ts
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
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entries: { attribute: false },
      scheduleCardStateEntity: { type: String },
      deviceName: { type: String },
      singleHopper: { type: Boolean },
      deviceId: { type: String },
      food1: { type: String },
      food2: { type: String }
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
    if (!this.singleHopper) {
      return b2`<kibble-schedule-editor
        .hass=${this.hass}
        .entries=${this.entries}
        .deviceId=${this.deviceId}
        .food1=${this.food1}
        .food2=${this.food2}
      ></kibble-schedule-editor>`;
    }
    if (this._canEmbed()) {
      return b2`<div ${n5(this._configureEmbed)}></div>`;
    }
    if (this.entries.length === 0) {
      return b2`<p class="empty">No schedule set</p>`;
    }
    const sorted = sortScheduleEntries(this.entries);
    return b2`
      <ul class="entries">
        ${sorted.map(
      (entry) => b2`
            <li class=${entry.enabled ? "" : "disabled"}>
              <span class="time">${formatClock(entry.time)}</span>
              <span class="amounts">${entryAmountsLabel(entry, true)}</span>
              <span class="state">${entry.enabled ? "On" : "Paused"}</span>
            </li>
          `
    )}
      </ul>
    `;
  }
  _canEmbed() {
    if (!customElements.get(DISPENSER_CARD_TAG)) return false;
    if (!this.scheduleCardStateEntity) return false;
    const state = this.hass?.states[this.scheduleCardStateEntity];
    return state !== void 0 && state.state !== "unavailable";
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

// src/components/kibble-calibration-dialog.ts
var CALIBRATION_BUSY_CODE = "calibration_busy";
function portionWord(portions) {
  return `${portions} portion${portions === 1 ? "" : "s"}`;
}
function formatScore(score) {
  return String(Math.round(score * 100));
}
var KibbleCalibrationDialog = class extends i4 {
  constructor() {
    super();
    this._closeButtonRef = e5();
    this._keydownHandler = (event) => {
      if (event.key === "Escape" && this.open) this._close();
    };
    this._loadCalibration = () => {
      const callWS = this.hass?.callWS;
      const entryId = this.entryId;
      if (!callWS || !entryId) {
        this._loadError = "Not connected.";
        return;
      }
      this._loading = true;
      this._loadError = null;
      callWS({ type: "kibble/calibration", entry_id: entryId }).then(
        (result) => {
          this._calibration = result;
          this._loading = false;
        },
        (err) => {
          this._loadError = describeWsError(err);
          this._loading = false;
        }
      );
    };
    this._confirmEmpty = () => {
      if (this._hopper === null) return;
      const hopper = this._hopper;
      const note = this._note.trim();
      this._runAction({ action: "begin", hopper, ...note ? { note } : {} }, this._confirmEmpty, () => {
        this._runAction({ action: "point", hopper, portions: 0 }, this._confirmEmpty, (state) => {
          this._calibration = state;
          this._regression = null;
          this._step = nextCalibrationStep(this._step, "empty-confirmed");
        });
      });
    };
    this._capturePoint = () => {
      if (this._hopper === null) return;
      const hopper = this._hopper;
      const points = this._hopperData(hopper)?.points ?? [];
      const portions = (points[points.length - 1]?.portions ?? 0) + 1;
      this._runAction({ action: "point", hopper, portions }, this._capturePoint, (state) => {
        const newPoint = state.hoppers[hopper]?.points.find((point) => point.portions === portions);
        this._regression = newPoint ? detectScoreRegression(points, newPoint) : null;
        this._calibration = state;
        this._step = nextCalibrationStep(this._step, "capture");
      });
    };
    this._confirmMarkFull = () => {
      if (this._hopper === null || this._markFullPortions === null) return;
      const hopper = this._hopper;
      const portions = this._markFullPortions;
      this._runAction({ action: "full", hopper, portions }, this._confirmMarkFull, (state) => {
        this._calibration = state;
        this._step = this.singleHopper ? "done" : nextCalibrationStep(this._step, "full-marked");
      });
    };
    this._acceptInherit = () => {
      if (this._hopper === null) return;
      const from = this._hopper;
      const to = from === 0 ? 1 : 0;
      this._runAction({ action: "inherit", hopper: to, from }, this._acceptInherit, (state) => {
        this._calibration = state;
        this._inheritedTo = to;
        this._step = nextCalibrationStep(this._step, "inherit-resolved");
      });
    };
    this._runClear = () => {
      if (this._hopper === null) return;
      const hopper = this._hopper;
      this._runAction({ action: "clear", hopper }, this._runClear, (state) => {
        this._calibration = state;
      });
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this.entryId = void 0;
    this._resetWizard();
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entryId: { attribute: false },
      open: { type: Boolean, reflect: true },
      singleHopper: { type: Boolean },
      food1: { type: String },
      food2: { type: String },
      _step: { state: true },
      _hopper: { state: true },
      _calibration: { state: true },
      _loading: { state: true },
      _loadError: { state: true },
      _note: { state: true },
      _busy: { state: true },
      _error: { state: true },
      _waitingForBowl: { state: true },
      _regression: { state: true },
      _markFullPortions: { state: true },
      _clearConfirmArmed: { state: true },
      _inheritedTo: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._clearConfirmTimer);
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      this._resetWizard();
      this._closeButtonRef.value?.focus();
      this._loadCalibration();
    }
  }
  _resetWizard() {
    this._step = "choose-hopper";
    this._hopper = null;
    this._calibration = null;
    this._loading = false;
    this._loadError = null;
    this._note = "";
    this._busy = false;
    this._error = null;
    this._waitingForBowl = false;
    this._regression = null;
    this._markFullPortions = null;
    this._clearConfirmArmed = false;
    this._inheritedTo = null;
  }
  _hopperData(index) {
    if (index === null || !this._calibration) return null;
    return this._calibration.hoppers[index];
  }
  /** Every mutating call shares this: busy/error bookkeeping, the daemon's one special-cased
   * failure code, and telling the bowl display a finished/discarded curve may have changed. */
  _runAction(action, retry, onSuccess) {
    const callWS = this.hass?.callWS;
    const entryId = this.entryId;
    if (!callWS || !entryId) return;
    this._busy = true;
    this._error = null;
    this._waitingForBowl = false;
    callWS({ type: "kibble/calibration/action", entry_id: entryId, ...action }).then(
      (result) => {
        this._busy = false;
        onSuccess(result);
        this.dispatchEvent(new CustomEvent("calibration-changed", { bubbles: true, composed: true }));
      },
      (err) => {
        this._busy = false;
        if (err?.code === CALIBRATION_BUSY_CODE) {
          this._waitingForBowl = true;
          return;
        }
        this._error = { message: describeWsError(err), retry };
      }
    );
  }
  _selectHopper(index) {
    this._hopper = index;
    this._error = null;
  }
  _beginRequested() {
    this._note = "";
    this._step = nextCalibrationStep(this._step, "start");
  }
  _reviewFull() {
    this._markFullPortions = null;
    this._step = nextCalibrationStep(this._step, "review-full");
  }
  /** "Not now" resolves the offer with no daemon call at all -- declining isn't an action the
   * curve needs to remember, it just means this session doesn't touch the other hopper. */
  _declineInherit() {
    this._inheritedTo = null;
    this._step = nextCalibrationStep(this._step, "inherit-resolved");
  }
  /** Same tap-twice window `kibble-settings-dialog`'s cloud/stack toggles use -- clearing a
   * finished curve is exactly as consequential as those, so it gets the same second-tap guard
   * rather than firing on one accidental click. */
  _clearRequested() {
    if (this._clearConfirmArmed) {
      clearTimeout(this._clearConfirmTimer);
      this._clearConfirmArmed = false;
      this._runClear();
      return;
    }
    this._clearConfirmArmed = true;
    this._clearConfirmTimer = setTimeout(() => {
      this._clearConfirmArmed = false;
    }, 3e3);
  }
  _restart() {
    const other = this._hopper === 0 ? 1 : this._hopper === 1 ? 0 : null;
    this._step = nextCalibrationStep(this._step, "restart");
    this._hopper = other;
    this._note = "";
    this._markFullPortions = null;
    this._regression = null;
    this._inheritedTo = null;
    this._clearConfirmArmed = false;
  }
  render() {
    if (!this.open) return A;
    return b2`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label="Calibrate bowl">
        <div class="sheet" @click=${(event) => event.stopPropagation()}>
          <header>
            <span>Calibrate bowl</span>
            <button type="button" class="icon-button" ${n5(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          <div class="body">
            ${!this.hass?.callWS || !this.entryId ? b2`<p class="hint">Calibration isn't available right now.</p>` : this._renderStep()}
          </div>
        </div>
      </div>
    `;
  }
  _renderStep() {
    switch (this._step) {
      case "choose-hopper":
        return this._renderChooseHopper();
      case "confirm-empty":
        return this._renderConfirmEmpty();
      case "collecting":
        return this._renderCollecting();
      case "mark-full":
        return this._renderMarkFull();
      case "offer-inherit":
        return this._renderOfferInherit();
      case "done":
        return this._renderDone();
    }
  }
  /** "Hopper" (single mode -- there is only one physical side to calibrate) or "Hopper N"
   * (dual). Every instructional string in the wizard names the physical side this way. */
  _hopperLabel(index) {
    return this.singleHopper ? "Hopper" : `Hopper ${index + 1}`;
  }
  /** The choose-hopper picker row's own label -- the one screen where naming the food (not
   * just the side) actually helps pick the right one, e.g. "Hopper 1 \u00b7 Kibble". */
  _hopperRowLabel(index) {
    const base = this._hopperLabel(index);
    if (this.singleHopper) return base;
    const food = (index === 0 ? this.food1 : this.food2)?.trim();
    return food ? `${base} \xB7 ${food}` : base;
  }
  _renderChooseHopper() {
    if (this._loading) return b2`<p class="hint">Loading calibration\u2026</p>`;
    if (this._loadError) {
      return b2`
        <div class="error">
          <span>Couldn't load calibration. ${this._loadError}</span>
          <button type="button" @click=${this._loadCalibration}>Try again</button>
        </div>
      `;
    }
    const indices = this.singleHopper ? [0] : [0, 1];
    return b2`
      <p class="hint">
        ${this.singleHopper ? "Dispensing known portions into an empty bowl builds the curve your fill reading is interpreted against." : "Pick a hopper. Each side keeps its own curve, since the two hoppers can hold different food."}
      </p>
      <div class="hopper-rows">${indices.map((index) => this._renderHopperRow(index))}</div>
      ${this._hopper !== null ? this._renderHopperActions(this._hopper) : A}
    `;
  }
  _renderHopperRow(index) {
    const status = calibrationStatus(this._hopperData(index));
    return b2`
      <button type="button" class="hopper-row ${this._hopper === index ? "selected" : ""}" @click=${() => this._selectHopper(index)}>
        <span class="hopper-row-label">${this._hopperRowLabel(index)}</span>
        <span class="hopper-row-status">${this._statusLine(status)}</span>
        ${status.note ? b2`<span class="hopper-row-note">${status.note}</span>` : A}
      </button>
    `;
  }
  _statusLine(status) {
    if (status.kind === "never") return "Never calibrated";
    const when = status.measuredAt ? relativeTimeSentence(new Date(status.measuredAt * 1e3), /* @__PURE__ */ new Date()) : null;
    const finished = status.finished ? "" : " (unfinished)";
    if (status.kind === "inherited") {
      return `Inherited from Hopper ${status.inheritedFromDisplay}${when ? ` \xB7 ${when}` : ""}${finished}`;
    }
    return `Measured${when ? ` ${when}` : ""}${finished}`;
  }
  _renderHopperActions(index) {
    const status = calibrationStatus(this._hopperData(index));
    const label = this._hopperLabel(index);
    if (status.kind === "never") {
      return b2`<button type="button" class="primary" @click=${() => this._beginRequested()}>Calibrate ${label}</button>`;
    }
    return b2`
      <div class="hopper-actions">
        <button type="button" class="danger ${this._clearConfirmArmed ? "confirming" : ""}" ?disabled=${this._busy} @click=${() => this._clearRequested()}>
          ${this._clearConfirmArmed ? "Tap again to clear" : "Clear calibration"}
        </button>
        <button type="button" class="primary" @click=${() => this._beginRequested()}>Recalibrate ${label}</button>
      </div>
      ${this._renderError()}
    `;
  }
  _renderConfirmEmpty() {
    const index = this._hopper;
    if (index === null) return A;
    const label = this._hopperLabel(index);
    const alreadyCalibrated = calibrationStatus(this._hopperData(index)).kind !== "never";
    return b2`
      <p class="hint">Make sure ${label}'s side of the bowl is completely empty, then start.</p>
      ${alreadyCalibrated ? b2`<div class="warning">Starting discards ${label}'s existing calibration.</div>` : A}
      <label class="field">
        <span>What food is this? (optional)</span>
        <input
          type="text"
          .value=${this._note}
          placeholder="e.g. freeze-dried on this side"
          @input=${(event) => {
      this._note = event.target.value;
    }}
        />
      </label>
      ${this._waitingForBowl ? this._renderWaitingForBowl() : A}
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._confirmEmpty}>${this._busy ? "Starting\u2026" : "Bowl is empty, start"}</button>
      </div>
    `;
  }
  _renderCollecting() {
    const index = this._hopper;
    if (index === null) return A;
    const points = this._hopperData(index)?.points ?? [];
    return b2`
      <p class="hint">Dispense one portion into ${this._hopperLabel(index)}'s side yourself, then capture the reading.</p>
      ${this._renderCurve(points)}
      ${this._regression ? b2`<div class="warning">
            This step's score (${formatScore(this._regression.newScore)}) is lower than the previous step's (${formatScore(this._regression.previousScore)}). A
            curve that dips can't be interpolated. Recapture this step before continuing.
          </div>` : A}
      ${this._waitingForBowl ? this._renderWaitingForBowl() : A}
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy || !canReviewFull(points)} @click=${() => this._reviewFull()}>This is full</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._capturePoint}>${this._busy ? "Capturing\u2026" : "Capture reading"}</button>
      </div>
    `;
  }
  _renderCurve(points) {
    if (points.length === 0) return A;
    return b2`
      <ul class="curve">
        ${points.map((point, i6) => {
      const previous = i6 > 0 ? points[i6 - 1] : null;
      const dropped = previous !== null && point.score < previous.score;
      return b2`
            <li class="curve-row ${dropped ? "dropped" : ""}">
              <span>${portionWord(point.portions)}</span>
              <span class="score">${formatScore(point.score)}</span>
            </li>
          `;
    })}
      </ul>
    `;
  }
  _renderMarkFull() {
    const index = this._hopper;
    if (index === null) return A;
    const points = (this._hopperData(index)?.points ?? []).filter((point) => point.portions > 0);
    return b2`
      <p class="hint">Which step looked full?</p>
      <ul class="curve selectable">
        ${points.map(
      (point) => b2`
            <li>
              <button type="button" class="curve-choice ${this._markFullPortions === point.portions ? "selected" : ""}" @click=${() => this._markFullPortions = point.portions}>
                <span>${portionWord(point.portions)}</span>
                <span class="score">${formatScore(point.score)}</span>
              </button>
            </li>
          `
    )}
      </ul>
      ${this._renderError()}
      <div class="actions">
        <button type="button" class="primary" ?disabled=${this._busy || this._markFullPortions === null} @click=${this._confirmMarkFull}>
          ${this._busy ? "Saving\u2026" : this._markFullPortions === null ? "Mark full" : `Mark full at ${portionWord(this._markFullPortions)}`}
        </button>
      </div>
    `;
  }
  _renderOfferInherit() {
    const from = this._hopper;
    if (from === null) return A;
    const to = from === 0 ? 1 : 0;
    const otherHasData = calibrationStatus(this._hopperData(to)).kind !== "never";
    return b2`
      <p class="hint">${this._hopperLabel(from)} is calibrated.</p>
      <p class="hint">
        Copy this curve to ${this._hopperLabel(to)}? Only do this if it's the same food in both hoppers. This is a shortcut for
        "same food," not a second measurement.${otherHasData ? b2` This replaces ${this._hopperLabel(to)}'s existing calibration.` : A}
      </p>
      ${this._renderError()}
      <div class="actions">
        <button type="button" ?disabled=${this._busy} @click=${() => this._declineInherit()}>Not now</button>
        <button type="button" class="primary" ?disabled=${this._busy} @click=${this._acceptInherit}>${this._busy ? "Copying\u2026" : `Copy to ${this._hopperLabel(to)}`}</button>
      </div>
    `;
  }
  _renderDone() {
    const index = this._hopper;
    if (index === null) return A;
    return b2`
      <p class="hint">${this._hopperLabel(index)} is calibrated.${this._inheritedTo !== null ? b2` Copied to ${this._hopperLabel(this._inheritedTo)} too.` : A}</p>
      <div class="actions">
        ${this.singleHopper ? A : b2`<button type="button" @click=${() => this._restart()}>Calibrate the other hopper</button>`}
        <button type="button" class="primary" @click=${this._close}>Done</button>
      </div>
    `;
  }
  _renderWaitingForBowl() {
    const retry = this._step === "collecting" ? this._capturePoint : this._confirmEmpty;
    return b2`
      <div class="warning">
        <span>No clear bowl reading right now. Something may be in the way, or the feeder hasn't reported one yet. Try again in a moment.</span>
        <button
          type="button"
          @click=${() => {
      this._waitingForBowl = false;
      retry();
    }}
        >
          Try again
        </button>
      </div>
    `;
  }
  _renderError() {
    const error = this._error;
    if (!error) return A;
    return b2`
      <div class="error">
        <span>${error.message}</span>
        <button
          type="button"
          @click=${() => {
      this._error = null;
      error.retry();
    }}
        >
          Try again
        </button>
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
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hint {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field input {
      min-height: 44px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      padding: 0 12px;
      box-sizing: border-box;
    }
    .hopper-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hopper-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      min-height: 48px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-sizing: border-box;
    }
    .hopper-row.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .hopper-row-label {
      font-weight: 600;
    }
    .hopper-row-status,
    .hopper-row-note {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hopper-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .curve {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 220px;
      overflow-y: auto;
    }
    .curve-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
    .curve-row.dropped {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 16%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
      font-weight: 600;
    }
    .curve .score {
      font-weight: 600;
    }
    .curve.selectable {
      gap: 6px;
    }
    .curve-choice {
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-height: 44px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      box-sizing: border-box;
    }
    .curve-choice.selected {
      border-color: var(--primary-color, #03a9f4);
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    button {
      min-height: 44px;
      border-radius: 8px;
      border: none;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      padding: 0 16px;
    }
    .actions button:not(.primary):not(.danger) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
    }
    .danger {
      background: none;
      border: 2px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .danger.confirming {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .warning,
    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .warning {
      background: color-mix(in srgb, var(--kibble-amber-dark, #de8a3a) 12%, transparent);
      color: var(--kibble-amber-dark, #de8a3a);
    }
    .error {
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
    }
    .warning button,
    .error button {
      flex: 0 0 auto;
      min-height: 32px;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
    }
  `;
  }
};
customElements.define("kibble-calibration-dialog", KibbleCalibrationDialog);

// src/lib/detection-areas.ts
function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}
function clientPointToNormalized(clientX, clientY, imageRect) {
  if (imageRect.width <= 0 || imageRect.height <= 0) return { x: 0, y: 0 };
  return {
    x: clampUnit((clientX - imageRect.left) / imageRect.width),
    y: clampUnit((clientY - imageRect.top) / imageRect.height)
  };
}
function normalizedAreaFromPoints(start, end) {
  return [
    Math.min(start.x, end.x),
    Math.min(start.y, end.y),
    Math.max(start.x, end.x),
    Math.max(start.y, end.y)
  ];
}
function areaWidth(area) {
  return Math.max(0, area[2] - area[0]);
}
function areaHeight(area) {
  return Math.max(0, area[3] - area[1]);
}
function isDrawableArea(area, minimumFraction = 0.01) {
  return areaWidth(area) >= minimumFraction && areaHeight(area) >= minimumFraction;
}
function normalizeWireArea(value) {
  if (!Array.isArray(value) || value.length !== 4) return null;
  const values = value.map(Number);
  if (values.some((n6) => !Number.isFinite(n6))) return null;
  const area = [values[0], values[1], values[2], values[3]];
  if (area.some((n6) => n6 < 0 || n6 > 1) || areaWidth(area) <= 0 || areaHeight(area) <= 0) return null;
  return area;
}
function normalizeWireAreas(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const area = normalizeWireArea(entry);
    return area ? [area] : [];
  });
}
var HANDLE_IDS = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
function handlePoint(area, handle) {
  const [x1, y1, x2, y22] = area;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y22) / 2;
  switch (handle) {
    case "nw":
      return { x: x1, y: y1 };
    case "n":
      return { x: midX, y: y1 };
    case "ne":
      return { x: x2, y: y1 };
    case "e":
      return { x: x2, y: midY };
    case "se":
      return { x: x2, y: y22 };
    case "s":
      return { x: midX, y: y22 };
    case "sw":
      return { x: x1, y: y22 };
    case "w":
      return { x: x1, y: midY };
  }
}
var MIN_AREA_SIZE = 0.02;
function resizeAreaFromHandle(area, handle, point, minSize = MIN_AREA_SIZE) {
  let [x1, y1, x2, y22] = area;
  const px = clampUnit(point.x);
  const py = clampUnit(point.y);
  if (handle === "nw" || handle === "w" || handle === "sw") x1 = Math.min(px, x2 - minSize);
  if (handle === "ne" || handle === "e" || handle === "se") x2 = Math.max(px, x1 + minSize);
  if (handle === "nw" || handle === "n" || handle === "ne") y1 = Math.min(py, y22 - minSize);
  if (handle === "sw" || handle === "s" || handle === "se") y22 = Math.max(py, y1 + minSize);
  return [x1, y1, x2, y22];
}
function moveArea(area, dx, dy) {
  const width = areaWidth(area);
  const height = areaHeight(area);
  const x1 = Math.min(Math.max(area[0] + dx, 0), Math.max(0, 1 - width));
  const y1 = Math.min(Math.max(area[1] + dy, 0), Math.max(0, 1 - height));
  return [x1, y1, x1 + width, y1 + height];
}
var DEFAULT_BOWL_ROI = [1 / 3, 2 / 3, 2 / 3, 1];

// src/lib/boxes.ts
function percent(value) {
  return String(Math.round(value * 1e4) / 100) + "%";
}
function boxRect(box) {
  return {
    left: percent(box[0]),
    top: percent(box[1]),
    width: percent(box[2] - box[0]),
    height: percent(box[3] - box[1])
  };
}
function boxInCrop(box, crop) {
  const cropWidth = crop[2] - crop[0];
  const cropHeight = crop[3] - crop[1];
  if (cropWidth <= 0 || cropHeight <= 0 || box[2] <= box[0] || box[3] <= box[1]) return null;
  const left = Math.max(box[0], crop[0]);
  const top = Math.max(box[1], crop[1]);
  const right = Math.min(box[2], crop[2]);
  const bottom = Math.min(box[3], crop[3]);
  if (right <= left || bottom <= top) return null;
  return [
    (left - crop[0]) / cropWidth,
    (top - crop[1]) / cropHeight,
    (right - crop[0]) / cropWidth,
    (bottom - crop[1]) / cropHeight
  ];
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function overlaps(a3, b3, gap) {
  return a3.left < b3.left + b3.width + gap && a3.left + a3.width + gap > b3.left && a3.top < b3.top + b3.height + gap && a3.top + a3.height + gap > b3.top;
}
function placeLabels(labels, width, height, gap = 4, safeTopInset = 0) {
  const safeTop = Math.max(0, safeTopInset);
  const ordered = [...labels].sort((a3, b3) => a3.box[0] + a3.box[2] - (b3.box[0] + b3.box[2]));
  const placed = [];
  for (const label of ordered) {
    const pillHeight = label.height ?? 22;
    const maxLeft = Math.max(0, width - label.width);
    const maxTop = Math.max(0, height - pillHeight);
    const anchorX = label.box[0] * width;
    const boxTop = label.box[1] * height;
    const flipped = boxTop - pillHeight - gap < safeTop;
    const preferredLeft = clamp(anchorX, 0, maxLeft);
    const insideTop = Math.max(boxTop + gap, safeTop);
    const preferredTop = clamp(flipped ? insideTop : boxTop - pillHeight - gap, 0, maxTop);
    const xCandidates = /* @__PURE__ */ new Set([preferredLeft, 0, maxLeft]);
    for (const prior of placed) {
      xCandidates.add(clamp(prior.left + prior.width + gap, 0, maxLeft));
      xCandidates.add(clamp(prior.left - label.width - gap, 0, maxLeft));
    }
    const xs = [...xCandidates].sort((a3, b3) => Math.abs(a3 - preferredLeft) - Math.abs(b3 - preferredLeft));
    const yCandidates = [preferredTop];
    const rowStep = pillHeight + gap;
    for (let offset = rowStep; offset <= height; offset += rowStep) {
      const below = preferredTop + offset;
      const above = preferredTop - offset;
      if (below <= maxTop) yCandidates.push(below);
      if (above >= (flipped ? insideTop : safeTop)) yCandidates.push(above);
    }
    let chosen;
    for (const top of yCandidates) {
      for (const left of xs) {
        const candidate = { key: label.key, left, top, flipped, width: label.width, height: pillHeight };
        if (!placed.some((prior) => overlaps(candidate, prior, gap))) {
          chosen = candidate;
          break;
        }
      }
      if (chosen) break;
    }
    placed.push(chosen ?? { key: label.key, left: preferredLeft, top: preferredTop, flipped, width: label.width, height: pillHeight });
  }
  return placed.map(({ key, left, top, flipped }) => ({ key, left, top, flipped }));
}

// src/components/kibble-detection-areas-dialog.ts
var VISION_POLL_MS = 1e3;
var NUDGE_STEP = 0.01;
var UNDO_LIMIT = 50;
var HANDLE_CURSOR = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize"
};
var KibbleDetectionAreasDialog = class extends i4 {
  constructor() {
    super();
    this._imageRef = e5();
    this._cancelRef = e5();
    this._imageUrl = null;
    this._imagePath = null;
    this._objectUrl = null;
    this._masks = [];
    this._bowl = DEFAULT_BOWL_ROI;
    this._baseline = null;
    this._selected = null;
    this._hidden = /* @__PURE__ */ new Set();
    this._undoStack = [];
    /** New-mask drag (empty stage -> a fresh rectangle), mirrors the stage's own pointer capture. */
    this._drawStart = null;
    this._drawing = null;
    this._pointerId = null;
    /** Existing-shape drag (move or resize), captured on the shape/handle element itself. */
    this._edit = null;
    this._showDetections = false;
    this._visionFrame = null;
    this._visionTimer = void 0;
    this._confirmDiscard = false;
    this._loading = false;
    this._saving = false;
    this._error = null;
    this._loadGeneration = 0;
    this._onImageLoad = () => {
      this.requestUpdate();
    };
    // ---- detection overlay polling -------------------------------------------------------------
    this._pollVision = () => {
      const callWS = this.hass?.callWS;
      const entryId = this.entryId;
      if (!callWS || !entryId) return;
      callWS({ type: "kibble/vision/last", entry_id: entryId }).then(
        (result) => {
          this._visionFrame = result.frame;
          this.requestUpdate();
        },
        () => {
        }
      );
    };
    this._toggleDetections = () => {
      this._showDetections = !this._showDetections;
      if (this._showDetections) {
        this._pollVision();
        this._visionTimer = setInterval(this._pollVision, VISION_POLL_MS);
      } else {
        this._stopVisionPolling();
      }
      this.requestUpdate();
    };
    // ---- drawing a new mask on empty stage ------------------------------------------------------
    this._onStagePointerDown = (event) => {
      if (this._saving || event.button !== 0) return;
      const image = this._imageRef.value;
      if (!image) return;
      const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      this._selected = null;
      this._drawStart = point;
      this._drawing = [point.x, point.y, point.x, point.y];
      this._pointerId = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      this.requestUpdate();
    };
    this._onStageMove = (event) => {
      if (this._pointerId !== event.pointerId || !this._drawStart) return;
      const image = this._imageRef.value;
      if (!image) return;
      const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      this._drawing = normalizedAreaFromPoints(this._drawStart, point);
      this.requestUpdate();
    };
    this._onStageUp = (event) => {
      if (this._pointerId !== event.pointerId || !this._drawStart) return;
      const image = this._imageRef.value;
      if (image) {
        const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
        const area = normalizedAreaFromPoints(this._drawStart, point);
        if (isDrawableArea(area)) {
          this._pushUndo();
          this._masks = [...this._masks, area];
          this._selected = { kind: "mask", index: this._masks.length - 1 };
        }
      }
      this._finishStageDraw(event);
    };
    this._onStageCancel = (event) => {
      if (this._pointerId !== event.pointerId) return;
      this._finishStageDraw(event);
    };
    // ---- moving/resizing an existing mask or the bowl zone ---------------------------------------
    this._beginMove = (event, target) => {
      if (this._saving || event.button !== 0) return;
      event.stopPropagation();
      const image = this._imageRef.value;
      if (!image) return;
      this._pushUndo();
      this._selected = target;
      const start = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      this._edit = { pointerId: event.pointerId, target, handle: null, start, original: this._areaFor(target) };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      this.requestUpdate();
    };
    this._beginResize = (event, target, handle) => {
      if (this._saving || event.button !== 0) return;
      event.stopPropagation();
      const image = this._imageRef.value;
      if (!image) return;
      this._pushUndo();
      this._selected = target;
      const start = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      this._edit = { pointerId: event.pointerId, target, handle, start, original: this._areaFor(target) };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      this.requestUpdate();
    };
    this._onEditMove = (event) => {
      const edit = this._edit;
      if (!edit || edit.pointerId !== event.pointerId) return;
      const image = this._imageRef.value;
      if (!image) return;
      const point = clientPointToNormalized(event.clientX, event.clientY, image.getBoundingClientRect());
      const next = edit.handle ? resizeAreaFromHandle(edit.original, edit.handle, point) : moveArea(edit.original, point.x - edit.start.x, point.y - edit.start.y);
      this._setAreaFor(edit.target, next);
      this.requestUpdate();
    };
    this._onEditEnd = (event) => {
      const edit = this._edit;
      if (!edit || edit.pointerId !== event.pointerId) return;
      const target = event.currentTarget;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
      this._edit = null;
      this.requestUpdate();
    };
    // ---- selection, visibility, delete, reset ----------------------------------------------------
    this._selectTarget = (target) => {
      this._selected = target;
      this.requestUpdate();
    };
    this._toggleVisibility = (index) => {
      const next = new Set(this._hidden);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        if (this._selected?.kind === "mask" && this._selected.index === index) this._selected = null;
      }
      this._hidden = next;
      this.requestUpdate();
    };
    this._deleteMask = (index) => {
      this._pushUndo();
      this._masks = this._masks.filter((_2, current) => current !== index);
      this._hidden = new Set([...this._hidden].filter((hiddenIndex) => hiddenIndex !== index).map((hiddenIndex) => hiddenIndex > index ? hiddenIndex - 1 : hiddenIndex));
      if (this._selected?.kind === "mask") {
        if (this._selected.index === index) this._selected = null;
        else if (this._selected.index > index) this._selected = { kind: "mask", index: this._selected.index - 1 };
      }
      this.requestUpdate();
    };
    this._resetBowl = () => {
      this._pushUndo();
      this._bowl = DEFAULT_BOWL_ROI;
      this.requestUpdate();
    };
    this._undo = () => {
      const previous = this._undoStack.pop();
      if (!previous) return;
      this._masks = previous.masks;
      this._bowl = previous.bowl;
      this._selected = null;
      this.requestUpdate();
    };
    // ---- keyboard -----------------------------------------------------------------------------
    this._onKeydown = (event) => {
      if (event.key === "Escape" && !this._saving) {
        event.preventDefault();
        this._requestClose();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !this._saving) {
        event.preventDefault();
        this._undo();
        return;
      }
      if (!this._selected || this._saving) return;
      const nudge = {
        ArrowLeft: { x: -NUDGE_STEP, y: 0 },
        ArrowRight: { x: NUDGE_STEP, y: 0 },
        ArrowUp: { x: 0, y: -NUDGE_STEP },
        ArrowDown: { x: 0, y: NUDGE_STEP }
      };
      const delta = nudge[event.key];
      if (delta) {
        event.preventDefault();
        this._pushUndo();
        const area = this._areaFor(this._selected);
        const next = event.shiftKey ? resizeAreaFromHandle(area, "se", { x: area[2] + delta.x, y: area[3] + delta.y }) : moveArea(area, delta.x, delta.y);
        this._setAreaFor(this._selected, next);
        this.requestUpdate();
        return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && this._selected.kind === "mask") {
        event.preventDefault();
        this._deleteMask(this._selected.index);
      }
    };
    this._requestClose = () => {
      if (this._saving) return;
      if (this._isDirty() && !this._confirmDiscard) {
        this._confirmDiscard = true;
        this.requestUpdate();
        return;
      }
      this._confirmDiscard = false;
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this._keepEditing = () => {
      this._confirmDiscard = false;
      this.requestUpdate();
    };
    this.open = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      cameraEntity: { attribute: false },
      entryId: { attribute: false },
      open: { type: Boolean, reflect: true }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._revokeObjectUrl();
    this._stopVisionPolling();
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      this._cancelRef.value?.focus();
      void this._loadEditor();
    }
    if (changed.has("open") && !this.open) {
      this._drawStart = null;
      this._drawing = null;
      this._pointerId = null;
      this._edit = null;
      this._selected = null;
      this._confirmDiscard = false;
      this._showDetections = false;
      this._stopVisionPolling();
    }
  }
  render() {
    if (!this.open) return A;
    const canSave = !this._loading && !this._saving && Boolean(this.entryId);
    return b2`
      <div class="backdrop" @click=${this._requestClose}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detection-areas-title"
          @click=${(event) => event.stopPropagation()}
          @keydown=${this._onKeydown}
        >
          <header class="header">
            <h2 id="detection-areas-title">Detection areas</h2>
            <button type="button" class="icon-button" aria-label="Close" @click=${this._requestClose}>${mdiIcon("close")}</button>
          </header>

          <div class="body">
            <div class="toolbar" role="group" aria-label="Editor tools">
              <button
                type="button"
                class="toggle-pill ${this._showDetections ? "active" : ""}"
                aria-pressed=${this._showDetections}
                @click=${this._toggleDetections}
              >
                <span class="swatch detections"></span>Show detections
              </button>
              <button
                type="button"
                class="quiet-button"
                ?disabled=${!this._undoStack.length || this._saving}
                @click=${this._undo}
              >
                ${mdiIcon("undo")}Undo
              </button>
            </div>

            <div class="stage-wrap">
              ${this._imageUrl ? this._renderStage() : b2`<div class="empty-stage">${this._loading ? "Loading camera still\u2026" : "Camera still unavailable"}</div>`}
            </div>

            ${this._error ? b2`<p class="error" role="alert">${this._error}</p>` : A}

            <div class="lists">
              <section class="mask-section">
                <h3>Ignore masks</h3>
                ${this._masks.length ? b2`<ul class="mask-list">${this._masks.map((area, index) => this._renderMaskRow(area, index))}</ul>` : A}
              </section>
              <section class="mask-section">
                <h3>Bowl zone</h3>
                ${this._renderBowlRow()}
              </section>
            </div>
          </div>

          <footer class="footer">${this._confirmDiscard ? this._renderDiscardConfirm() : this._renderFooterActions(canSave)}</footer>
        </section>
      </div>
    `;
  }
  _renderFooterActions(canSave) {
    return b2`
      <button type="button" class="cancel" ${n5(this._cancelRef)} ?disabled=${this._saving} @click=${this._requestClose}>Cancel</button>
      <button type="button" class="save" ?disabled=${!canSave} @click=${this._save}>${this._saving ? "Saving\u2026" : "Save"}</button>
    `;
  }
  _renderDiscardConfirm() {
    return b2`
      <p class="discard-prompt" role="alert">Discard unsaved changes?</p>
      <button type="button" class="quiet-button" @click=${this._keepEditing}>Keep editing</button>
      <button type="button" class="cancel discard" @click=${this._requestClose}>Discard</button>
    `;
  }
  // ---- stage ------------------------------------------------------------------------------
  /** Handles for the selected shape are rendered here, as siblings of `.shape`, positioned
   * relative to the STAGE (the same coordinate space `handlePoint` returns) -- NOT nested
   * inside `.shape`. `.shape` itself is already offset and scaled to the mask's own box via
   * its own left/top/width/height percentages; a handle nested inside it would have its
   * stage-fraction coordinates re-interpreted as a fraction of that already-scaled box,
   * bunching every handle into one corner instead of spanning the shape's corners and edges. */
  _renderStage() {
    const selectedArea = this._selected ? this._areaFor(this._selected) : null;
    const ratio = this._stageAspectRatio();
    const stageStyle = `aspect-ratio:${ratio};width:min(100%, calc(min(60vh, 640px) * ${ratio}));`;
    return b2`
      <div
        class="stage"
        style=${stageStyle}
        @pointerdown=${this._onStagePointerDown}
        @pointermove=${this._onStageMove}
        @pointerup=${this._onStageUp}
        @pointercancel=${this._onStageCancel}
      >
        <img ${n5(this._imageRef)} src=${this._imageUrl} alt="Feeder camera still" @load=${this._onImageLoad} />
        ${this._showDetections ? this._renderDetections() : A}
        ${this._masks.length === 0 ? b2`<p class="stage-hint" aria-hidden="true">Drag to mask an area</p>` : A}
        ${this._renderShape(this._bowl, { kind: "bowl" }, this._selected?.kind === "bowl", "bowl", "Bowl zone")}
        ${this._masks.map((area, index) => {
      if (this._hidden.has(index)) return A;
      const selected = this._selected?.kind === "mask" && this._selected.index === index;
      return this._renderShape(area, { kind: "mask", index }, selected, "mask", `Mask ${index + 1}`);
    })}
        ${this._drawing ? this._renderDrawingPreview(this._drawing) : A}
        ${this._selected && selectedArea ? HANDLE_IDS.map((handle) => this._renderHandle(selectedArea, this._selected, handle)) : A}
      </div>
    `;
  }
  _renderDetections() {
    const detections = this._visionFrame?.detections ?? [];
    return detections.map((detection) => {
      const rect = boxRect([detection.x1, detection.y1, detection.x2, detection.y2]);
      const style = `left:${rect.left};top:${rect.top};width:${rect.width};height:${rect.height};`;
      return b2`<div class="detection ${detection.admitted ? "" : "quiet"}" style=${style}></div>`;
    });
  }
  _renderShape(area, target, selected, kindClass, label) {
    const style = `left:${area[0] * 100}%;top:${area[1] * 100}%;width:${areaWidth(area) * 100}%;height:${areaHeight(area) * 100}%;`;
    return b2`
      <div class="shape ${kindClass} ${selected ? "selected" : ""}" style=${style}>
        <button
          type="button"
          class="shape-body"
          aria-label="${label}${selected ? ", selected" : ""}"
          @pointerdown=${(event) => this._beginMove(event, target)}
          @pointermove=${this._onEditMove}
          @pointerup=${this._onEditEnd}
          @pointercancel=${this._onEditEnd}
          @click=${() => this._selectTarget(target)}
          @contextmenu=${(event) => this._onShapeContextMenu(event, target)}
        >
          <span class="shape-tag">${label}</span>
        </button>
      </div>
    `;
  }
  _renderHandle(area, target, handle) {
    const point = handlePoint(area, handle);
    const style = `left:${point.x * 100}%;top:${point.y * 100}%;cursor:${HANDLE_CURSOR[handle]};`;
    return b2`
      <div
        class="handle"
        style=${style}
        aria-hidden="true"
        @pointerdown=${(event) => this._beginResize(event, target, handle)}
        @pointermove=${this._onEditMove}
        @pointerup=${this._onEditEnd}
        @pointercancel=${this._onEditEnd}
      >
        <span class="handle-dot"></span>
      </div>
    `;
  }
  _renderDrawingPreview(area) {
    const style = `left:${area[0] * 100}%;top:${area[1] * 100}%;width:${areaWidth(area) * 100}%;height:${areaHeight(area) * 100}%;`;
    return b2`<div class="shape mask drawing" style=${style}><div class="shape-body"></div></div>`;
  }
  // ---- lists --------------------------------------------------------------------------------
  _renderMaskRow(area, index) {
    const selected = this._selected?.kind === "mask" && this._selected.index === index;
    const hidden = this._hidden.has(index);
    return b2`
      <li class="mask-row ${selected ? "selected" : ""}">
        <button type="button" class="mask-row-label" @click=${() => this._selectTarget({ kind: "mask", index })}>
          <span class="swatch exclude"></span>Mask ${index + 1}
        </button>
        <button
          type="button"
          class="icon-button"
          aria-label="${hidden ? "Show" : "Hide"} mask ${index + 1}"
          @click=${() => this._toggleVisibility(index)}
        >
          ${mdiIcon(hidden ? "eyeOff" : "eye")}
        </button>
        <button type="button" class="icon-button" aria-label="Delete mask ${index + 1}" @click=${() => this._deleteMask(index)}>
          ${mdiIcon("deleteOutline")}
        </button>
      </li>
    `;
  }
  _renderBowlRow() {
    const selected = this._selected?.kind === "bowl";
    return b2`
      <div class="mask-row bowl-row ${selected ? "selected" : ""}">
        <button type="button" class="mask-row-label" @click=${() => this._selectTarget({ kind: "bowl" })}>
          <span class="swatch bowl"></span>Bowl zone
        </button>
        <button type="button" class="quiet-button" @click=${this._resetBowl}>Reset</button>
      </div>
    `;
  }
  // ---- data loading -------------------------------------------------------------------------
  async _loadEditor() {
    const generation = ++this._loadGeneration;
    this._error = null;
    this._selected = null;
    this._drawing = null;
    this._undoStack = [];
    this._hidden = /* @__PURE__ */ new Set();
    this._confirmDiscard = false;
    this._loading = true;
    this.requestUpdate();
    await Promise.all([this._loadAreas(), this._loadImage()]);
    if (generation === this._loadGeneration) {
      this._loading = false;
      this.requestUpdate();
    }
  }
  async _loadAreas() {
    const callWS = this.hass?.callWS;
    if (!callWS || !this.entryId) {
      this._masks = [];
      this._bowl = DEFAULT_BOWL_ROI;
      this._baseline = { masks: [], bowl: DEFAULT_BOWL_ROI };
      return;
    }
    try {
      const [areas, bowl] = await Promise.all([
        callWS({ type: "kibble/vision/areas", entry_id: this.entryId }),
        callWS({ type: "kibble/vision/bowl", entry_id: this.entryId })
      ]);
      this._masks = normalizeWireAreas(areas.exclude);
      this._bowl = normalizeWireArea(bowl.bowl_roi) ?? DEFAULT_BOWL_ROI;
    } catch (error) {
      this._error = describeWsError(error);
      this._masks = [];
      this._bowl = DEFAULT_BOWL_ROI;
    }
    this._baseline = { masks: this._masks, bowl: this._bowl };
  }
  async _loadImage() {
    const entity = this.cameraEntity ? this.hass?.states[this.cameraEntity] : void 0;
    const path = typeof entity?.attributes.entity_picture === "string" ? entity.attributes.entity_picture : null;
    if (path === this._imagePath && this._imageUrl) return;
    this._imagePath = path;
    if (!path) {
      if (!this._imageUrl) this.requestUpdate();
      return;
    }
    if (!this.hass.fetchWithAuth) {
      this._imageUrl = path;
      this.requestUpdate();
      return;
    }
    try {
      const response = await this.hass.fetchWithAuth(path);
      if (!response.ok) throw new Error("Camera still could not be loaded.");
      const blob = await response.blob();
      const nextObjectUrl = URL.createObjectURL(blob);
      this._revokeObjectUrl();
      this._objectUrl = nextObjectUrl;
      this._imageUrl = nextObjectUrl;
    } catch (error) {
      if (!this._imageUrl) this._error = error instanceof Error ? error.message : "Camera still could not be loaded.";
    }
    this.requestUpdate();
  }
  /** The real snapshot's own width/height ratio -- an aspect-ratio-correct `.stage` box is
   * what fills it edge to edge with no letterbox bands, instead of the stage falling back to
   * some unrelated block-flow height. Priority: the loaded `<img>`'s own decoded size (most
   * authoritative, and already the exact box mask coordinates are drawn against), else the
   * most recent `kibble/vision/last` frame's `w`/`h` (present before the image has loaded, if
   * detection polling happens to already be running), else a plain 16:9 guess. */
  _stageAspectRatio() {
    const img = this._imageRef.value;
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) return img.naturalWidth / img.naturalHeight;
    if (this._visionFrame?.w && this._visionFrame?.h) return this._visionFrame.w / this._visionFrame.h;
    return 16 / 9;
  }
  _stopVisionPolling() {
    if (this._visionTimer !== void 0) clearInterval(this._visionTimer);
    this._visionTimer = void 0;
  }
  _finishStageDraw(event) {
    const target = event.currentTarget;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    this._pointerId = null;
    this._drawStart = null;
    this._drawing = null;
    this.requestUpdate();
  }
  _onShapeContextMenu(event, target) {
    event.preventDefault();
    if (target.kind === "mask") this._deleteMask(target.index);
  }
  _areaFor(target) {
    return target.kind === "bowl" ? this._bowl : this._masks[target.index];
  }
  _setAreaFor(target, area) {
    if (target.kind === "bowl") this._bowl = area;
    else this._masks = this._masks.map((mask, index) => index === target.index ? area : mask);
  }
  // ---- undo -------------------------------------------------------------------------------
  _pushUndo() {
    this._undoStack.push({ masks: this._masks, bowl: this._bowl });
    if (this._undoStack.length > UNDO_LIMIT) this._undoStack.shift();
  }
  // ---- save / close / unsaved guard --------------------------------------------------------
  _isDirty() {
    if (!this._baseline) return false;
    const round = (area) => area.map((n6) => Math.round(n6 * 1e4)).join(",");
    if (this._masks.length !== this._baseline.masks.length) return true;
    if (round(this._bowl) !== round(this._baseline.bowl)) return true;
    return this._masks.some((area, index) => round(area) !== round(this._baseline.masks[index]));
  }
  async _save() {
    const callWS = this.hass?.callWS;
    if (!callWS || !this.entryId) return;
    this._saving = true;
    this._error = null;
    this.requestUpdate();
    try {
      try {
        await callWS({ type: "kibble/vision/areas/set", entry_id: this.entryId, exclude: this._masks });
      } catch (error) {
        throw new Error(`Could not save masks. ${describeWsError(error)}`);
      }
      try {
        await callWS({ type: "kibble/vision/bowl/set", entry_id: this.entryId, bowl_roi: this._bowl });
      } catch (error) {
        throw new Error(`Masks saved, but the bowl zone failed to save. ${describeWsError(error)}`);
      }
      const [areas, bowl] = await Promise.all([
        callWS({ type: "kibble/vision/areas", entry_id: this.entryId }),
        callWS({ type: "kibble/vision/bowl", entry_id: this.entryId })
      ]);
      this._masks = normalizeWireAreas(areas.exclude);
      this._bowl = normalizeWireArea(bowl.bowl_roi) ?? DEFAULT_BOWL_ROI;
      this._baseline = { masks: this._masks, bowl: this._bowl };
      this._undoStack = [];
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (error) {
      this._error = error instanceof Error ? error.message : "Could not save detection areas.";
    } finally {
      this._saving = false;
      this.requestUpdate();
    }
    if (!this._error) this._requestClose();
  }
  _revokeObjectUrl() {
    if (this._objectUrl) URL.revokeObjectURL(this._objectUrl);
    this._objectUrl = null;
  }
  static {
    this.styles = i`
    :host(:not([open])) { display: none; }
    :host {
      position: fixed;
      inset: 0;
      z-index: 120;
      color: var(--primary-text-color);
    }
    .backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      padding: clamp(12px, 3vw, 32px);
      background: rgba(0, 0, 0, 0.76);
      overflow: auto;
    }
    .panel {
      width: min(980px, 100%);
      min-height: min(720px, 100%);
      margin: auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      border-radius: 18px;
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: 0 18px 70px rgba(0, 0, 0, 0.42);
    }
    .header {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      padding: 22px 26px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    h2 { margin: 0 0 6px; font-size: 23px; }
    .header p { max-width: 690px; margin: 0; color: var(--secondary-text-color); line-height: 1.45; }
    .icon-button {
      width: 44px;
      height: 44px;
      min-height: 44px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 30px;
      line-height: 1;
      cursor: pointer;
    }
    header .icon-button svg { width: 20px; height: 20px; }
    .mask-list .icon-button svg { width: 18px; height: 18px; }
    .body { display: flex; flex: 1; flex-direction: column; gap: 14px; padding: 20px 26px; }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 650;
      cursor: pointer;
    }
    .toggle-pill.active {
      color: var(--primary-text-color);
      border-color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
    }
    .swatch { display: inline-block; width: 11px; height: 11px; border-radius: 3px; flex: 0 0 auto; }
    .swatch.detections { background: var(--primary-color, #03a9f4); border: 1px solid var(--primary-color, #03a9f4); }
    .swatch.exclude { background: rgba(224, 80, 78, 0.5); border: 1px solid #f16a66; }
    .swatch.bowl { background: color-mix(in srgb, var(--primary-color, #03a9f4) 25%, transparent); border: 1px solid var(--primary-color, #03a9f4); }
    /* No flex:1/flex-centering here on purpose: .stage already sizes itself precisely to the
     * snapshot's own aspect ratio and centers itself horizontally (its own margin: 0 auto) --
     * a flex-grow wrap would stretch taller than that exact height on a tall viewport and
     * center the (correctly-sized but now shorter) stage inside itself, showing this wrap's
     * own dark background as letterbox bands around an otherwise edge-to-edge image.
     * Shrink-wrapping keeps the wrap exactly as tall as the image, every time. */
    .stage-wrap { border-radius: 12px; background: #101314; overflow: hidden; }
    .stage { position: relative; max-height: min(60vh, 640px); margin: 0 auto; overflow: hidden; touch-action: none; cursor: crosshair; }
    .stage img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .empty-stage { min-height: 280px; display: grid; place-items: center; color: var(--secondary-text-color); }

    .detection { position: absolute; border: 1.5px dashed rgba(255, 255, 255, 0.85); border-radius: 3px; pointer-events: none; }
    .detection.quiet { border-color: rgba(255, 255, 255, 0.4); border-style: dotted; }

    .shape { position: absolute; min-width: 0; min-height: 0; }
    .shape-body {
      position: absolute;
      inset: 0;
      padding: 0;
      margin: 0;
      border: 2px solid;
      border-radius: 4px;
      color: #fff;
      font: inherit;
      font-size: 12px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      cursor: move;
      overflow: hidden;
      text-align: left;
      touch-action: none;
    }
    .shape-tag { position: absolute; top: 5px; left: 6px; white-space: nowrap; }
    .shape.mask .shape-body {
      border-color: #f16a66;
      background-image: repeating-linear-gradient(45deg, rgba(224, 80, 78, 0.32) 0 6px, rgba(224, 80, 78, 0.12) 6px 12px);
    }
    .shape.bowl .shape-body {
      border-color: var(--primary-color, #03a9f4);
      border-style: dashed;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      cursor: move;
    }
    .shape.drawing { pointer-events: none; }
    .shape.drawing .shape-body { border: 2px dashed #f16a66; background: rgba(224, 80, 78, 0.18); opacity: 0.9; }
    .shape.selected .shape-body { border-width: 3px; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85), 0 0 0 5px rgba(255, 255, 255, 0.18); }
    .shape-body:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

    .handle {
      position: absolute;
      width: 44px;
      height: 44px;
      margin: -22px 0 0 -22px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .handle-dot { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 2px solid #24180a; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }

    .error { margin: 0; color: var(--error-color, #ff8a80); }
    .stage-hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 4px 10px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      pointer-events: none;
    }

    .lists { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .mask-section h3 { margin: 0 0 8px; font-size: 14px; font-weight: 650; color: var(--primary-text-color); }
    .mask-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
    .mask-row, .bowl-row { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
    .mask-row.selected, .bowl-row.selected { background: var(--secondary-background-color, rgba(127, 127, 127, 0.13)); }
    .mask-row-label {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 0 8px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .quiet-button, .cancel, .save {
      min-height: 44px;
      padding: 0 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .quiet-button svg, .toggle-pill svg { width: 16px; height: 16px; }
    button:disabled { opacity: 0.45; cursor: default; }
    .mask-row-label:focus-visible,
    .icon-button:focus-visible,
    .quiet-button:focus-visible,
    .toggle-pill:focus-visible,
    .save:focus-visible,
    .cancel:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .footer { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; padding: 16px 26px 22px; border-top: 1px solid var(--divider-color); }
    .discard-prompt { flex: 1; min-width: 160px; margin: 0; color: var(--primary-text-color); font-weight: 600; }
    .save { border-color: var(--kibble-amber, #e8ab4f); background: var(--kibble-amber, #e8ab4f); color: var(--kibble-ink-on-amber, #24180a); }
    .cancel.discard { border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); }

    @media (max-width: 640px) {
      .backdrop { padding: 0; }
      .panel { min-height: 100%; border: 0; border-radius: 0; }
      .header, .body, .footer { padding-left: 18px; padding-right: 18px; }
      .lists { grid-template-columns: 1fr; gap: 16px; }
    }
  `;
  }
};
customElements.define("kibble-detection-areas-dialog", KibbleDetectionAreasDialog);

// src/lib/before-after.ts
var WIPE_MIN = 0;
var WIPE_MAX = 100;
var WIPE_DEFAULT = 50;
var WIPE_STEP = 5;
function clampWipePosition(value) {
  if (Number.isNaN(value)) return WIPE_DEFAULT;
  return Math.min(WIPE_MAX, Math.max(WIPE_MIN, value));
}
function wipePositionForKey(current, key) {
  switch (key) {
    case "ArrowLeft":
    case "ArrowDown":
      return clampWipePosition(current - WIPE_STEP);
    case "ArrowRight":
    case "ArrowUp":
      return clampWipePosition(current + WIPE_STEP);
    case "Home":
      return WIPE_MIN;
    case "End":
      return WIPE_MAX;
    default:
      return null;
  }
}
function wipePositionForPointer(clientX, rect) {
  if (rect.width <= 0) return WIPE_DEFAULT;
  return clampWipePosition((clientX - rect.left) / rect.width * 100);
}
function resolveCompareSides(beforeSrc, afterSrc) {
  const before = beforeSrc || null;
  const after = afterSrc || null;
  return { before, after, hasPair: before !== null && after !== null };
}

// src/components/kibble-before-after.ts
var KibbleBeforeAfter = class extends i4 {
  constructor() {
    super();
    this._frameRef = e5();
    this._beginDrag = (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      this._updateFromPointer(event.clientX);
    };
    this._onDrag = (event) => {
      if (event.buttons === 0) return;
      event.preventDefault();
      this._updateFromPointer(event.clientX);
    };
    this._endDrag = (event) => {
      const target = event.currentTarget;
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    };
    this._onHandleKeydown = (event) => {
      const next = wipePositionForKey(this._wipePosition, event.key);
      if (next === null) return;
      event.preventDefault();
      this._wipePosition = next;
    };
    this.beforeSrc = null;
    this.afterSrc = null;
    this.beforeLabel = "Before";
    this.afterLabel = "After";
    this.caption = null;
    this.aspect = 16 / 9;
    this._mode = "split";
    this._wipePosition = WIPE_DEFAULT;
  }
  static {
    this.properties = {
      beforeSrc: { type: String },
      afterSrc: { type: String },
      beforeLabel: { type: String },
      afterLabel: { type: String },
      caption: { type: String },
      aspect: { type: Number },
      _mode: { state: true },
      _wipePosition: { state: true }
    };
  }
  render() {
    const sides = resolveCompareSides(this.beforeSrc, this.afterSrc);
    if (!sides.before && !sides.after) return A;
    if (!sides.hasPair) {
      const src = sides.before ?? sides.after;
      const label = sides.before ? this.beforeLabel : this.afterLabel;
      return b2`
        <figure class="tile">
          <div class="frame" style="aspect-ratio: ${this.aspect};">
            <img src=${src} alt=${label} loading="lazy" />
            <span class="tag tag-solo">${label}</span>
          </div>
          ${this.caption ? b2`<figcaption>${this.caption}</figcaption>` : A}
        </figure>
      `;
    }
    return b2`
      <figure class="tile">
        <div class="frame" style="aspect-ratio: ${this.aspect};">
          ${this._mode === "split" ? this._renderSplit(sides.before, sides.after) : this._renderWipe(sides.before, sides.after)}
          <div class="mode-toggle" role="group" aria-label="Compare view">
            <button
              type="button"
              class="mode-btn ${this._mode === "split" ? "selected" : ""}"
              aria-pressed=${this._mode === "split"}
              @click=${() => this._setMode("split")}
            >
              Split
            </button>
            <button
              type="button"
              class="mode-btn ${this._mode === "wipe" ? "selected" : ""}"
              aria-pressed=${this._mode === "wipe"}
              @click=${() => this._setMode("wipe")}
            >
              Wipe
            </button>
          </div>
        </div>
        ${this.caption ? b2`<figcaption>${this.caption}</figcaption>` : A}
      </figure>
    `;
  }
  _renderSplit(before, after) {
    return b2`
      <div class="split">
        <div class="half">
          <img src=${before} alt=${this.beforeLabel} loading="lazy" />
          <span class="tag">${this.beforeLabel}</span>
        </div>
        <div class="divider"></div>
        <div class="half">
          <img src=${after} alt=${this.afterLabel} loading="lazy" />
          <span class="tag">${this.afterLabel}</span>
        </div>
      </div>
    `;
  }
  _renderWipe(before, after) {
    const pos = this._wipePosition;
    return b2`
      <div
        class="wipe"
        ${n5(this._frameRef)}
        @pointerdown=${this._beginDrag}
        @pointermove=${this._onDrag}
        @pointerup=${this._endDrag}
        @pointercancel=${this._endDrag}
      >
        <img class="layer" src=${after} alt=${this.afterLabel} loading="lazy" />
        <div class="layer clip" style="clip-path: inset(0 ${100 - pos}% 0 0);">
          <img src=${before} alt=${this.beforeLabel} loading="lazy" />
        </div>
        <span class="tag tag-before">${this.beforeLabel}</span>
        <span class="tag tag-after">${this.afterLabel}</span>
        <div
          class="handle"
          role="slider"
          tabindex="0"
          aria-label="Reveal before vs after"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Math.round(pos)}
          aria-valuetext=${`${Math.round(pos)}% ${this.beforeLabel.toLowerCase()}`}
          style="left: ${pos}%;"
          @keydown=${this._onHandleKeydown}
        >
          <span class="grip"></span>
        </div>
      </div>
    `;
  }
  _setMode(mode) {
    this._mode = mode;
  }
  _updateFromPointer(clientX) {
    const rect = this._frameRef.value?.getBoundingClientRect();
    if (!rect) return;
    this._wipePosition = wipePositionForPointer(clientX, rect);
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .tile {
      margin: 0;
    }
    .frame {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      touch-action: none;
    }
    .frame > img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    figcaption {
      margin-top: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tag {
      position: absolute;
      top: 8px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      pointer-events: none;
    }
    .tag-solo {
      left: 8px;
    }
    /* Split */
    .split {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .half {
      position: relative;
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
    }
    .half img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .half .tag {
      left: 8px;
    }
    .half:last-child .tag {
      left: auto;
      right: 8px;
    }
    .divider {
      flex: 0 0 auto;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    }
    /* Wipe */
    .wipe {
      position: absolute;
      inset: 0;
      cursor: ew-resize;
    }
    .wipe .layer {
      position: absolute;
      inset: 0;
    }
    .wipe .layer img,
    .wipe img.layer {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .wipe .clip {
      overflow: hidden;
    }
    .tag-before {
      left: 8px;
    }
    .tag-after {
      right: 8px;
    }
    .handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      cursor: ew-resize;
    }
    .handle:focus-visible {
      outline: none;
    }
    .handle:focus-visible .grip {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .grip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    /* Mode toggle */
    .mode-toggle {
      position: absolute;
      /* Bottom, not top, so it never sits over the "After"/wipe tags, which are always top:
       * 8px regardless of mode (see .tag above) -- top-right previously hid "After" under
       * this control entirely. */
      bottom: 8px;
      right: 8px;
      display: flex;
      gap: 2px;
      padding: 2px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
    }
    .mode-btn {
      border: none;
      background: none;
      color: #fff;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      min-height: 28px;
    }
    .mode-btn.selected {
      background: var(--kibble-amber, #f4a452);
      color: var(--kibble-ink-on-amber, #3a2c28);
    }
    .mode-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: -2px;
    }
  `;
  }
};
customElements.define("kibble-before-after", KibbleBeforeAfter);

// src/components/kibble-settings-dialog.ts
var CLOUD_CONFIRM_WINDOW_MS = 3e3;
function numberAttrs(hass, entityId) {
  if (!entityId) return null;
  const state = hass.states[entityId];
  if (!state) return null;
  const value = Number(state.state);
  if (Number.isNaN(value)) return null;
  return {
    value,
    min: Number(state.attributes.min ?? 1),
    max: Number(state.attributes.max ?? 20),
    step: Number(state.attributes.step ?? 1)
  };
}
var KibbleSettingsDialog = class extends i4 {
  constructor() {
    super();
    this._cloudConfirmArmed = false;
    this._cloudConfirmTimer = void 0;
    this._stackConfirmArmed = false;
    this._stackConfirmTimer = void 0;
    this.open = false;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this._calibrationOpen = false;
    this._detectionAreasOpen = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entities: { attribute: false },
      entryId: { attribute: false },
      open: { type: Boolean, reflect: true },
      singleHopper: { type: Boolean },
      food1: { type: String },
      food2: { type: String },
      _calibrationOpen: { state: true },
      _detectionAreasOpen: { state: true }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._cloudConfirmTimer);
    clearTimeout(this._stackConfirmTimer);
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
          ${e6.bowlFill ? this._renderCalibrationSection() : A}
          ${e6.camera ? this._renderCameraSection() : A}
          ${e6.feedAmount ? this._renderMoreAmountSection() : A}
          ${this._renderToggles()}
          ${e6.cloudSwitch ? this._renderCloud() : A}
          ${e6.stackSelect ? this._renderStack() : A}
          ${e6.wifiNetwork ? this._renderWifi() : A}
          ${e6.dishBefore || e6.dishAfter ? this._renderDishPhotos() : A}
          ${e6.speaker ? this._renderSpeaker() : A}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${mdiIcon("openInNew")}
          </button>
        </div>
      </div>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this.entryId}
        .singleHopper=${this.singleHopper}
        .food1=${this.food1}
        .food2=${this.food2}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
      ></kibble-calibration-dialog>
      <kibble-detection-areas-dialog
        .hass=${this.hass}
        .cameraEntity=${e6.camera}
        .entryId=${this.entryId}
        ?open=${this._detectionAreasOpen}
        @close-requested=${this._closeDetectionAreas}
      ></kibble-detection-areas-dialog>
    `;
  }
  _renderCameraSection() {
    return b2`
      <section>
        <h3>Camera</h3>
        <p class="hint">Choose which parts of the camera frame the detector should use.</p>
        <button type="button" class="cloud-toggle" @click=${this._openDetectionAreas}>
          Detection areas
        </button>
      </section>
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
          Targets one auger's amount byte directly. This feeder's firmware has been observed to
          spin both augers regardless, so expect roughly double into the bowl.
        </p>
        <div class="hoppers">
          ${feedAmountHopper1 ? b2`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(1)}</span>
                  ${this._renderStepper(feedAmountHopper1, numberAttrs(this.hass, feedAmountHopper1))}
                  ${feedButtonHopper1 ? b2`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper1)}></kibble-hold-button>` : A}
                </div>
              ` : A}
          ${feedAmountHopper2 && !this.singleHopper ? b2`
                <div class="hopper">
                  <span class="hopper-label">${this._hopperFeedLabel(2)}</span>
                  ${this._renderStepper(feedAmountHopper2, numberAttrs(this.hass, feedAmountHopper2))}
                  ${feedButtonHopper2 ? b2`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(feedButtonHopper2)}></kibble-hold-button>` : A}
                </div>
              ` : A}
        </div>
      </section>
    `;
  }
  /** "Hopper" with the divider out -- there is only one physical side to target, so the
   * per-side index stops meaning anything -- otherwise the hopper's own food name once dual
   * mode has one set, falling back to plain "Hopper N". */
  _hopperFeedLabel(index) {
    if (this.singleHopper) return "Hopper";
    const food = index === 1 ? this.food1 : this.food2;
    return food ?? `Hopper ${index}`;
  }
  /** Just the entry point -- picking a hopper, seeing its status, and every action beyond that
   * (begin/capture/mark full/inherit/clear) is the wizard dialog's own job, not this panel's. */
  _renderCalibrationSection() {
    return b2`
      <section>
        <h3>Bowl calibration</h3>
        <p class="hint">
          Turns the bowl's raw fill reading into a real percentage by dispensing known portions
          into an empty bowl.${this.singleHopper ? A : " Each hopper keeps its own curve."}
        </p>
        <button type="button" class="cloud-toggle" @click=${this._openCalibration}>Calibrate bowl</button>
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
    const state = this.hass.states[entityId];
    const on = state?.state === "on";
    const unavailable = !state || state.state === "unavailable";
    return b2`
      <button type="button" class="toggle-row" ?disabled=${unavailable} @click=${() => this._toggleSwitch(entityId)}>
        <span class="toggle-icon">${mdiIcon(icon)}</span>
        <span class="toggle-label">${label}</span>
        <span class="toggle-pill ${on ? "on" : ""}"><span class="toggle-knob"></span></span>
      </button>
    `;
  }
  _renderCloud() {
    const state = this.hass.states[this.entities.cloudSwitch];
    const on = state?.state === "on";
    const connection = this.entities.cloudConnection ? this.hass.states[this.entities.cloudConnection]?.state : void 0;
    return b2`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${connection ? `Connection: ${connection}` : "Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed ? "confirming" : ""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed ? `Tap again to turn ${on ? "off" : "on"}` : on ? "On, tap to turn off" : "Off, tap to turn on"}
        </button>
      </section>
    `;
  }
  _renderWifi() {
    const state = this.hass.states[this.entities.wifiNetwork];
    return b2`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${state ? state.state : "Unavailable"}</p>
      </section>
    `;
  }
  _renderDishPhotos() {
    const before = this.entities.dishBefore ? this.hass.states[this.entities.dishBefore] : void 0;
    const after = this.entities.dishAfter ? this.hass.states[this.entities.dishAfter] : void 0;
    const beforeAvailable = before && before.state !== "unavailable";
    const afterAvailable = after && after.state !== "unavailable";
    if (!beforeAvailable && !afterAvailable) return A;
    return b2`
      <section>
        <h3>Last feed</h3>
        <kibble-before-after
          .beforeSrc=${beforeAvailable ? String(before.attributes.entity_picture ?? "") : null}
          .afterSrc=${afterAvailable ? String(after.attributes.entity_picture ?? "") : null}
          aspect="1.333"
        ></kibble-before-after>
      </section>
    `;
  }
  _renderSpeaker() {
    const state = this.hass.states[this.entities.speaker];
    if (!state) return A;
    const volume = typeof state.attributes.volume_level === "number" ? state.attributes.volume_level : 0.5;
    return b2`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${state.state}</p>
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
  /** Which userland the feeder boots. Switching reboots it (~40 s offline), so it takes the
   *  same tap-twice confirm as the cloud toggle. The entity is unavailable on agents that
   *  predate it, in which case the section is simply absent. */
  _renderStack() {
    const state = this.hass.states[this.entities.stackSelect];
    if (!state || state.state === "unavailable") return A;
    const running = state.state;
    const other = running === "librefeed" ? "vendor" : "librefeed";
    const label = (v2) => v2 === "librefeed" ? "KibbleOS" : "Petkit stack";
    return b2`
      <section>
        <h3>Stack</h3>
        <p class="hint">Running ${label(running)}. Switching reboots the feeder; it is back in about a minute.</p>
        <button type="button" class="cloud-toggle ${this._stackConfirmArmed ? "confirming" : ""}" @click=${this._onStackClick}>
          ${this._stackConfirmArmed ? `Tap again to boot ${label(other)}` : `Switch to ${label(other)}`}
        </button>
      </section>
    `;
  }
  _onStackClick() {
    const state = this.hass.states[this.entities.stackSelect];
    const other = state?.state === "librefeed" ? "vendor" : "librefeed";
    if (this._stackConfirmArmed) {
      clearTimeout(this._stackConfirmTimer);
      this._stackConfirmArmed = false;
      void this.hass.callService("select", "select_option", { entity_id: this.entities.stackSelect, option: other });
      this.requestUpdate();
      return;
    }
    this._stackConfirmArmed = true;
    this.requestUpdate();
    this._stackConfirmTimer = setTimeout(() => {
      this._stackConfirmArmed = false;
      this.requestUpdate();
    }, CLOUD_CONFIRM_WINDOW_MS);
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
  _openCalibration() {
    this._calibrationOpen = true;
  }
  _openDetectionAreas() {
    this._detectionAreasOpen = true;
  }
  /** The editor is a nested overlay; keep its close event from closing Settings too. */
  _closeDetectionAreas(event) {
    event.stopPropagation();
    this._detectionAreasOpen = false;
  }
  /** Stops the calibration dialog's own `close-requested` here -- both dialogs use the same
   * event name (the one contract every controlled overlay in this repo follows), and without
   * this it would keep bubbling past this panel and close the whole settings dialog too. */
  _closeCalibration(event) {
    event.stopPropagation();
    this._calibrationOpen = false;
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

// src/lib/hopper-glyph.ts
var TANK_VB_H = 46;
var TANK_X = 5;
var TANK_Y = 8;
var TANK_H = 34;
var TANK_R = 7;
var TANK_CAP_Y = 2;
var TANK_CAP_W = 8;
var TANK_CAP_H = 7;
var TANK_CAP_R = 2;
var TANK_W_SINGLE_COMPARTMENT = 24;
var TANK_W_UNDIVIDED = 48;
function hopperTank(view) {
  const clipId = `hopper-clip-${view.index ?? "all"}`;
  const TANK_W = view.index === null ? TANK_W_UNDIVIDED : TANK_W_SINGLE_COMPARTMENT;
  const TANK_VB_W = TANK_W + TANK_X * 2;
  const TANK_CAP_X = TANK_X + (TANK_W - TANK_CAP_W) / 2;
  const lowLineY = (TANK_Y + TANK_H * (1 - HOPPER_LOW_LINE)).toFixed(1);
  const fraction = view.fillFraction;
  return w`
    <svg class="tank" data-tone=${view.tone} data-wide=${view.index === null} viewBox="0 0 ${TANK_VB_W} ${TANK_VB_H}" aria-hidden="true">
      <defs>
        <clipPath id=${clipId}><rect x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} /></clipPath>
      </defs>
      <rect class="tank-cap" x=${TANK_CAP_X} y=${TANK_CAP_Y} width=${TANK_CAP_W} height=${TANK_CAP_H} rx=${TANK_CAP_R} />
      <rect class="tank-body" x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} />
      ${fraction != null && fraction > 0 ? w`<g clip-path="url(#${clipId})"><rect class="tank-fill" x=${TANK_X} y=${(TANK_Y + TANK_H * (1 - fraction)).toFixed(1)} width=${TANK_W} height=${(TANK_H * fraction + 1).toFixed(1)} /></g>` : ""}
      ${view.tone !== "unknown" ? w`<line class="tank-low-line" x1=${TANK_X + 2} y1=${lowLineY} x2=${TANK_X + TANK_W - 2} y2=${lowLineY} />` : w`<text class="tank-unknown" x=${TANK_X + TANK_W / 2} y=${TANK_Y + TANK_H / 2 + 1} text-anchor="middle" dominant-baseline="central">\u2013</text>`}
      <rect class="tank-outline" x=${TANK_X} y=${TANK_Y} width=${TANK_W} height=${TANK_H} rx=${TANK_R} />
    </svg>
  `;
}
var TANK_STYLES = `
  /* The undivided tank keeps the compartment's height and doubles its body width. */
  .tank[data-wide="true"] {
    width: 50px;
  }
  .tank-cap,
  .tank-body {
    fill: var(--silo-mid);
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-outline {
    fill: none;
    stroke: var(--primary-text-color);
    stroke-opacity: 0.16;
    stroke-width: 1;
  }
  .tank-low-line {
    stroke: var(--primary-text-color);
    stroke-opacity: 0.32;
    stroke-width: 1;
    stroke-dasharray: 2 1.4;
  }
  .tank-fill {
    transition: y 400ms cubic-bezier(0.2, 0.8, 0.2, 1), height 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .tank[data-tone="ok"] .tank-fill {
    fill: var(--kibble-feed, #43a96a);
  }
  .tank[data-tone="low"] .tank-fill {
    fill: var(--kibble-amber-dark, #de8a3a);
  }
  .tank[data-tone="empty"] .tank-body,
  .tank[data-tone="empty"] .tank-cap,
  .tank[data-tone="empty"] .tank-outline {
    stroke: var(--error-color, #db4437);
    stroke-opacity: 0.75;
  }
  .tank[data-tone="unknown"] .tank-body,
  .tank[data-tone="unknown"] .tank-cap {
    stroke-dasharray: 2.5 2;
    opacity: 0.55;
  }
  .tank-unknown {
    fill: var(--secondary-text-color);
    font-size: 11px;
    font-weight: 700;
  }
`;

// src/components/kibble-hopper-sheet.ts
var CONFIRM_MS = 1100;
var KibbleHopperSheet = class extends i4 {
  constructor() {
    super();
    this._closeButtonRef = e5();
    this._keydownHandler = (event) => {
      if (event.key === "Escape" && this.open) this._close();
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.hopperLevel1 = null;
    this.hopperLevel2 = null;
    this.hopperRemaining1 = null;
    this.hopperRemaining2 = null;
    this.singleHopper = false;
    this.food1 = null;
    this.food2 = null;
    this._confirmed = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      entities: { attribute: false },
      open: { type: Boolean, reflect: true },
      hopperLevel1: { attribute: false },
      hopperLevel2: { attribute: false },
      hopperRemaining1: { attribute: false },
      hopperRemaining2: { attribute: false },
      singleHopper: { type: Boolean },
      food1: { type: String },
      food2: { type: String },
      _confirmed: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._confirmTimer);
  }
  updated(changed) {
    if (changed.has("open") && this.open) {
      clearTimeout(this._confirmTimer);
      this._confirmed = null;
      this._closeButtonRef.value?.focus();
    }
  }
  _entityFor(target) {
    if (target === "1") return this.entities?.markFullHopper1;
    if (target === "2") return this.entities?.markFullHopper2;
    return this.entities?.markFullBoth;
  }
  _markFull(target) {
    const entityId = this._entityFor(target);
    if (!entityId) return;
    this.hass.callService("button", "press", {}, { entity_id: entityId });
    clearTimeout(this._confirmTimer);
    this._confirmed = target;
    fireHaptic("success");
    this._confirmTimer = window.setTimeout(() => {
      this._confirmed = null;
      this.requestUpdate();
    }, CONFIRM_MS);
  }
  render() {
    if (!this.open) return A;
    const hoppers = hopperViews(this.singleHopper, this.hopperLevel1, this.hopperLevel2, this.hopperRemaining1, this.hopperRemaining2);
    const canMarkAny = Boolean(this.entities?.markFullHopper1 || this.entities?.markFullHopper2 || this.entities?.markFullBoth);
    return b2`
      <div class="backdrop" @click=${this._close} role="dialog" aria-modal="true" aria-label=${this.singleHopper ? "Hopper" : "Hoppers"}>
        <div class="sheet" @click=${(event) => event.stopPropagation()}>
          <header>
            <span>${this.singleHopper ? "Hopper" : "Hoppers"}</span>
            <button type="button" class="icon-button" ${n5(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          <div class="body">
            ${hoppers.map((view) => this._renderRow(view, foodForHopper(view.index, this.food1, this.food2)))}
            ${canMarkAny ? b2`
                  <div class="actions">
                    ${this.singleHopper ? this._renderMarkButton("both", "Mark hopper full", this.entities?.markFullBoth, "primary") : b2`
                          ${this._renderMarkButton("1", "Mark hopper 1 full", this.entities?.markFullHopper1)}
                          ${this._renderMarkButton("2", "Mark hopper 2 full", this.entities?.markFullHopper2)}
                          ${this._renderMarkButton("both", "Mark both full", this.entities?.markFullBoth, "primary")}
                        `}
                  </div>
                  <p class="hint">
                    Tip: press the small button on the side of the feeder twice to mark
                    ${this.singleHopper ? "the hopper" : "both hoppers"} full.
                  </p>
                ` : A}
          </div>
        </div>
      </div>
    `;
  }
  _renderRow(view, food) {
    const name = hopperDisplayName(view, food);
    const label = hopperAriaLabel(view, food);
    return b2`
      <div class="hopper-row" data-tone=${view.tone} aria-label=${label}>
        <span class="hopper-row-glyph">${hopperTank(view)}</span>
        <div class="hopper-row-text">
          <span class="hopper-row-name">${name}</span>
          <span class="hopper-row-word">${view.tone === "unknown" ? "Level unknown" : view.headline}</span>
          ${view.detail ? b2`<span class="hopper-row-detail">${view.detail}</span>` : A}
        </div>
      </div>
    `;
  }
  _renderMarkButton(target, label, entityId, variant) {
    const confirmed = this._confirmed === target;
    return b2`
      <button
        type="button"
        class="mark-button ${variant ?? ""} ${confirmed ? "confirmed" : ""}"
        ?disabled=${!entityId || confirmed}
        @click=${() => this._markFull(target)}
      >
        ${confirmed ? b2`<span class="mark-check">${mdiIcon("check")}</span><span>Marked full</span>` : label}
      </button>
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
      max-width: 400px;
      max-height: 92vh;
      overflow-y: auto;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 480px) {
      .sheet {
        border-radius: 16px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 16px;
      font-weight: 600;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .icon-button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .body {
      padding: 4px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .hopper-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    /* Reuses the hero tile's own material tokens -- the sheet has no bowl of its own to compute
       them from, so it borrows the same theme-derived plastic look via inherited custom
       properties set on :host below. */
    .tank {
      display: block;
      width: 30px;
      height: 40px;
      overflow: visible;
      flex: none;
    }
    ${r(TANK_STYLES)}
    .hopper-row-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }
    .hopper-row-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      /* A food name can run longer than "Hopper N" ever does -- .hopper-row-text above is
         already min-width: 0, the enabler this ellipsis needs inside the flex row. */
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hopper-row-word {
      font-size: 15px;
      font-weight: 700;
    }
    .hopper-row[data-tone="low"] .hopper-row-word {
      color: var(--kibble-amber-dark);
    }
    .hopper-row[data-tone="empty"] .hopper-row-word {
      color: var(--error-color, #db4437);
    }
    .hopper-row-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
    }
    .mark-button {
      position: relative;
      min-height: 46px;
      border-radius: 10px;
      border: 2px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 0.12s ease;
    }
    .mark-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .mark-button.primary {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .mark-button:disabled {
      cursor: default;
    }
    .mark-button:disabled:not(.confirmed) {
      opacity: 0.45;
    }
    .mark-button.confirmed {
      border-color: transparent;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      opacity: 1;
      animation: hopper-mark-pulse 700ms ease-out;
    }
    .mark-check {
      display: inline-flex;
      font-size: 16px;
      animation: hopper-check-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hint {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    @media (prefers-reduced-motion: reduce) {
      .mark-button.confirmed {
        animation: none;
      }
      .mark-check {
        animation: none;
      }
    }
    @keyframes hopper-mark-pulse {
      from {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--kibble-feed, #43a96a) 55%, transparent);
      }
      to {
        box-shadow: 0 0 0 12px color-mix(in srgb, var(--kibble-feed, #43a96a) 0%, transparent);
      }
    }
    @keyframes hopper-check-in {
      from {
        transform: scale(0.3);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  }
};
customElements.define("kibble-hopper-sheet", KibbleHopperSheet);

// src/lib/brand-shapes.ts
function catSilhouette() {
  return w`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `;
}

// src/lib/cat-colors.ts
function fallbackCatColor(name) {
  let hash = 0;
  for (let i6 = 0; i6 < name.length; i6++) {
    hash = hash * 31 + name.charCodeAt(i6) | 0;
  }
  return catColorAt(hash);
}

// src/components/kibble-image.ts
var KibbleImage = class extends i4 {
  constructor() {
    super();
    this._ref = new AssetRef();
    this._visible = false;
    this._observer = null;
    this.alt = "";
    this.rounded = false;
    this.fit = "cover";
  }
  static {
    this.properties = {
      hass: { attribute: false },
      asset: { attribute: false },
      cache: { attribute: false },
      alt: { type: String },
      rounded: { type: Boolean },
      fit: { type: String }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._visible = false;
    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._markVisible();
      },
      { rootMargin: "200px" }
    );
    this._observer.observe(this);
    requestAnimationFrame(() => {
      if (this._visible || !this.isConnected) return;
      const rect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const nearViewport = rect.width > 0 && rect.height > 0 && rect.bottom > -200 && rect.top < viewportHeight + 200;
      if (nearViewport) this._markVisible();
    });
  }
  _markVisible() {
    if (this._visible) return;
    this._visible = true;
    this._sync();
    this.requestUpdate();
    this._observer?.disconnect();
    this._observer = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
    this._ref.dispose();
  }
  willUpdate(changed) {
    if (changed.has("asset") || changed.has("cache") || changed.has("hass")) this._sync();
  }
  _sync() {
    if (!this._visible) return;
    this._ref.sync(this.hass, this.cache, this.asset, () => this.requestUpdate());
  }
  render() {
    const url = this._ref.url;
    return b2`
      <div class="box ${this.rounded ? "rounded" : ""}">
        ${url ? b2`<img src=${url} alt=${this.alt} loading="lazy" style="object-fit:${this.fit}" />` : b2`<div class="placeholder"></div>`}
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .box.rounded {
      border-radius: 50%;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: kibble-image-in 180ms ease-out;
      }
    }
    @keyframes kibble-image-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .placeholder {
      width: 100%;
      height: 100%;
    }
  `;
  }
};
customElements.define("kibble-image", KibbleImage);

// src/components/kibble-avatar.ts
var KibbleAvatar = class extends i4 {
  constructor() {
    super();
    this._ownCache = new ImageUrlCache();
    this.name = null;
    this.colorIndex = null;
    this.asset = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      name: { type: String },
      colorIndex: { type: Number, attribute: "color-index" },
      asset: { attribute: false },
      cache: { attribute: false }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._ownCache.dispose();
  }
  render() {
    if (!this.name) {
      return b2`<div class="avatar neutral">${catSilhouette()}</div>`;
    }
    const color = this.colorIndex != null ? catColorAt(this.colorIndex) : fallbackCatColor(this.name);
    return b2`
      <div class="avatar" style="--kibble-avatar-color: ${color}">
        ${this.asset ? b2`<kibble-image rounded .hass=${this.hass} .asset=${this.asset} .cache=${this.cache ?? this._ownCache} alt=""></kibble-image>` : b2`<span class="monogram">${this.name.trim().charAt(0).toUpperCase()}</span>`}
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      width: var(--kibble-avatar-size, 40px);
      height: var(--kibble-avatar-size, 40px);
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--kibble-avatar-color, var(--primary-color, #03a9f4)) 22%, var(--card-background-color, #fff));
      color: var(--kibble-avatar-color, var(--primary-color, #03a9f4));
      flex: none;
    }
    .avatar.neutral {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .avatar.neutral svg {
      width: 62%;
      height: 62%;
    }
    kibble-image {
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: calc(var(--kibble-avatar-size, 40px) * 0.42);
      font-weight: 700;
      line-height: 1;
      user-select: none;
    }
  `;
  }
};
customElements.define("kibble-avatar", KibbleAvatar);

// src/lib/scrypted-live.ts
var import_client = __toESM(require_src(), 1);
function findScryptedToken(hass) {
  for (const entry of Object.values(hass.entities ?? {})) {
    if (entry.platform === "scrypted" && entry.entity_id.startsWith("sensor.scrypted_token")) {
      const state = hass.states[entry.entity_id]?.state;
      if (state && state !== "unavailable" && state !== "unknown") return state;
    }
  }
  return void 0;
}
var BrowserSignalingSession = class {
  constructor() {
    /** `proxy: true` is what makes the WebRTC plugin's own sink handle this session instead of
     * delegating to the camera's `RTCSignalingChannel` — the sink is the half that negotiates a
     * `sendrecv` audio transceiver for cameras with `Intercom` and returns a session control whose
     * `setPlayback` starts/stops talkback (`plugins/webrtc`). Without it the answer comes back with
     * the audio m-line rejected (port 0) and there is no return path at all. */
    this.options = {
      proxy: true,
      userAgent: navigator.userAgent,
      capabilities: {
        audio: RTCRtpReceiver.getCapabilities?.("audio") ?? { codecs: [], headerExtensions: [] },
        video: RTCRtpReceiver.getCapabilities?.("video") ?? { codecs: [], headerExtensions: [] }
      },
      screen: { devicePixelRatio: window.devicePixelRatio, width: screen.width, height: screen.height }
    };
    // Scrypted's RPC layer reads proxied properties from here.
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
  setState(state) {
    this.state = state;
    if (state !== "error") this.error = void 0;
    this.onChange();
  }
};

// src/lib/video-source.ts
function pickVideoSource(scryptedId, scryptedToken, cameraEntity) {
  if (scryptedId && scryptedToken) return { kind: "scrypted", deviceId: scryptedId, token: scryptedToken };
  if (cameraEntity) return { kind: "ha-camera", entityId: cameraEntity };
  return { kind: "none" };
}

// src/lib/reconnect.ts
var RECONNECT_BASE_MS = 1e3;
var RECONNECT_MAX_MS = 3e4;
function nextReconnectDelay(current) {
  return Math.min(current * 2, RECONNECT_MAX_MS);
}

// src/lib/overlay-idle.ts
var IDLE_MS = 5e3;
var VISIBLE = { visible: true };
var HIDDEN = { visible: false };
function revealOnFirstTap(state) {
  if (state.visible) return { state, consumed: false };
  return { state: VISIBLE, consumed: true };
}
function onIdleTimeout(state, pinned) {
  return pinned ? state : HIDDEN;
}
function shouldArmTimer(state, pinned) {
  return state.visible && !pinned;
}

// src/components/kibble-live-hero.ts
var STALL_MS = 8e3;
var STALL_CHECK_INTERVAL_MS = 2e3;
var HIDDEN_PAUSE_MS = 6e4;
var VISION_POLL_MS2 = 1e3;
var CALL_COOLDOWN_MS = 1e4;
var CALL_CUE_PULSE_MS = 1100;
var MIN_HERO_ASPECT = 1;
var MAX_HERO_ASPECT = 2.4;
var LIVE_HERO_CHROME_SAFE_TOP = 8 + 48 + 8;
var KibbleLiveHero = class extends i4 {
  constructor() {
    super();
    this._starting = false;
    /** Delay the *next* scheduled attempt will use; doubles (capped) after each failure, resets
     * on a clean connect. */
    this._backoffMs = RECONNECT_BASE_MS;
    /** `performance.now()` of the last `timeupdate`, or of starting a fresh attempt -- the stall
     * check measures staleness against this rather than against wall-clock connect time. */
    this._lastProgress = 0;
    /** Set once a long-hidden tab has stopped the stream, so the tab coming visible again knows
     * to restart from scratch (backoff reset) instead of treating it as a stall recovery. */
    this._hiddenPaused = false;
    /** The feeder's own most recent detection frame, polled while the overlay gate is open (see
     * `_syncVisionPolling`) -- a private field, not a reactive property, since `WsQuery` drives
     * its own `requestUpdate` on change, exactly like `kibble-card.ts`'s `_catsQuery`. */
    this._visionQuery = new WsQuery(() => this.requestUpdate());
    /** The `<img>` currently being watched for its `load` event inside `hui-image`'s own shadow
     * root (`_syncStillAspectWatch`) -- `null` once nothing has been found yet, or `hui-image`
     * is not in use (this component's own fallback `<img>` is bound directly in the render
     * template instead and needs no such tracking). */
    this._watchedStillImg = null;
    this._live = new ScryptedLive(() => {
      this._tick = (this._tick ?? 0) + 1;
    });
    this._onScryptedLoadedMetadata = () => {
      this._applyMute();
      const video = this.renderRoot.querySelector("#video");
      if (video) this._reportMediaAspect(video.videoWidth, video.videoHeight);
    };
    this._onStillImgLoad = (e6) => {
      const img = e6.target;
      this._reportMediaAspect(img.naturalWidth, img.naturalHeight);
    };
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
    /** Runs on a fixed interval the whole time the element is connected -- cheaper and simpler
     * than starting/stopping a timer around every play/reconnect transition, and the playing/
     * reconnecting guards make it a no-op the rest of the time. Scrypted-only: `_lastProgress` is
     * only ever advanced by Scrypted's `<video>`'s `timeupdate` (`_onTimeUpdate`), so judging
     * staleness against it while the HA-camera fallback is active would just be judging silence
     * nothing ever promised to break -- `<ha-camera-stream>`'s own players watch themselves. */
    this._checkStall = () => {
      if (this._videoSource().kind !== "scrypted") return;
      if (!this._playing || this._reconnecting || document.hidden) return;
      if (performance.now() - this._lastProgress > STALL_MS) this._beginReconnect();
    };
    this._pollVision = () => {
      const callWS = this.hass?.callWS;
      const entryId = this.entryId;
      if (!callWS || !entryId) return;
      this._visionQuery.refresh(
        () => callWS({ type: "kibble/vision/last", entry_id: entryId }).then((result) => result)
      );
    };
    /** Scrypted-only: `ha-hls-player`/`ha-web-rtc-player` (inside `<ha-camera-stream>`) already
     * listen for this same event and pause/resume themselves, so running this logic against the
     * HA-camera fallback too would either fight them or, worse, tear the element down and rebuild
     * it on every hidden spell for no reason. */
    this._onVisibilityChange = () => {
      if (this._videoSource().kind !== "scrypted") return;
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
    /** A tab hidden past `HIDDEN_PAUSE_MS` stops decoding video nobody can see -- saves CPU and
     * the feeder's own bandwidth. `_onVisibilityChange` restarts it, backoff reset, once visible. */
    this._pauseForHidden = () => {
      this._hiddenTimer = void 0;
      if (this._videoSource().kind !== "scrypted") return;
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
    /** A tap on the picture itself expands (or, while the overlay controls are faded out, only
     * reveals them -- the standard "first tap just reveals" mobile video-player convention,
     * `lib/overlay-idle.ts`'s `revealOnFirstTap`). Taps on the chips are their own buttons and
     * never bubble here as "the picture" while visible (they stop propagation) -- while hidden
     * they cannot be tapped at all (`pointer-events: none` in `.idle-hidden`), so this never has
     * to tell "a chip tap" apart from "a bare video tap" for the reveal-only case. */
    this._onFrameClick = (e6) => {
      if (!this._overlayIdle.visible) {
        this._applyOverlayIdle(revealOnFirstTap(this._overlayIdle).state);
        this._armIdleTimer();
        e6.stopPropagation();
        return;
      }
      this._onOverlayActivity();
      if (e6.target.closest?.(".chip")) {
        e6.stopPropagation();
        return;
      }
      if (!this._expanded) this._expand();
    };
    this._collapse = (e6) => {
      e6?.stopPropagation();
      this._onOverlayActivity();
      document.removeEventListener("keydown", this._onKeyDown);
      if (this._fullscreen) {
        void (document.exitFullscreen?.() ?? Promise.resolve()).catch(() => void 0);
      }
      this._expanded = false;
    };
    this._onKeyDown = (e6) => {
      if (e6.key === "Escape") this._collapse();
    };
    /** Fullscreen goes on the frame so the chips stay usable; iOS Safari refuses everything but
     * the video element, which is why `webkitEnterFullscreen` on the video is the fallback. */
    this._toggleFullscreen = async (e6) => {
      e6.stopPropagation();
      this._onOverlayActivity();
      if (this._fullscreen) {
        await (document.exitFullscreen?.() ?? Promise.resolve()).catch(() => void 0);
        return;
      }
      const frame = this.renderRoot.querySelector("#frame");
      const video = this.renderRoot.querySelector("#video");
      try {
        if (frame?.requestFullscreen) await frame.requestFullscreen();
        else if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch {
      }
    };
    /** `document.fullscreenElement` is retargeted to the outermost shadow host (here the card),
     * so it is checked through this element's own shadow root first, and otherwise by walking
     * the host chain up from here -- either way "our frame is the one in fullscreen". */
    this._onFullscreenChange = () => {
      const root = this.renderRoot;
      const doc = document;
      const inner = root.fullscreenElement ?? root.webkitFullscreenElement ?? null;
      const outer = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      let onHostChain = false;
      for (let n6 = this; n6 && outer; n6 = n6.host ?? n6.parentNode) {
        if (n6 === outer) {
          onHostChain = true;
          break;
        }
      }
      this._fullscreen = inner !== null || onHostChain;
    };
    /** Scrypted's raw `<video>` needs the imperative re-kick in `_applyMute` (see its own
     * comment); `<ha-camera-stream>`'s `.muted` binding in `_renderVideo` is a normal Lit
     * property, so its own next render already carries the new value with no DOM poke needed. */
    this._toggleMute = () => {
      this._onOverlayActivity();
      this._muted = !this._muted;
      if (this._videoSource().kind === "scrypted") this._applyMute();
    };
    /** The `muted` attribute alone is unreliable once the element already has a stream, so the
     * property is set directly and play is re-kicked (unmuting counts as a fresh gesture). */
    this._applyMute = () => {
      const video = this.renderRoot.querySelector("#video");
      if (!video) return;
      video.muted = this._muted;
      void video.play().catch(() => void 0);
    };
    this._toggleTalk = async () => {
      this._onOverlayActivity();
      const next = !this._talking;
      this._talking = next;
      try {
        await this._live.talk(next);
      } catch {
        if (next) this._talking = false;
      }
    };
    /** Fire-and-forget `button.press` on the entity, exactly how any other card presses a button
     * entity -- the agent's own `POST /cue` debounce/cooldown (`speaker::CALL_COOLDOWN`) is the
     * real authority; `_callingCats`/`_pulsingCue` are only this button's own optimistic local
     * reflection of that, so it never looks pressable before a repeat press would actually work.
     * A rejected call (the agent's own cooldown, or a genuine failure) already raises its own
     * translated Home Assistant notification -- nothing further to show here. */
    this._callCats = (e6) => {
      e6.stopPropagation();
      this._onOverlayActivity();
      if (this._callingCats || !this.callCatsEntity) return;
      const entityId = this.callCatsEntity;
      this._callingCats = true;
      this._pulsingCue = true;
      this._cooldownTimer = setTimeout(() => {
        this._callingCats = false;
      }, CALL_COOLDOWN_MS);
      this._pulseTimer = setTimeout(() => {
        this._pulsingCue = false;
      }, CALL_CUE_PULSE_MS);
      void this.hass.callService("button", "press", { entity_id: entityId }).catch(() => void 0);
    };
    // ---- Idle overlay (video-player-style auto-hide, lib/overlay-idle.ts) --------------------
    /** Any interaction that should reveal the controls and restart the idle timer: pointer move/
     * enter or wheel over the frame (bound directly in `render()`), or a real control's own click/
     * focus handler calling this explicitly so it works the same whether or not that handler also
     * stops the click from bubbling to `_onFrameClick`. */
    this._onOverlayActivity = () => {
      this._applyOverlayIdle(VISIBLE);
      this._armIdleTimer();
    };
    /** Keyboard `Tab` landing on a control inside the frame reveals it (same as any other
     * activity) and, if it's a keyboard-style focus (`:focus-visible`, not a mouse-click focus),
     * pins the controls open for as long as that focus lasts -- see `_idlePinned`. */
    this._onFrameFocusIn = (e6) => {
      this._onOverlayActivity();
      const target = e6.target;
      this._controlsFocusVisible = typeof target.matches === "function" && target.matches(":focus-visible");
    };
    /** Clears the focus-visible pin only once focus actually leaves the frame entirely -- moving
     * from one control to another inside it re-pins via that control's own `focusin` instead. */
    this._onFrameFocusOut = (e6) => {
      const next = e6.relatedTarget;
      const frame = this.renderRoot.querySelector("#frame");
      if (!next || !frame?.contains(next)) {
        this._controlsFocusVisible = false;
      }
    };
    this._onIdleTimerFired = () => {
      this._idleTimer = void 0;
      this._applyOverlayIdle(onIdleTimeout(this._overlayIdle, this._idlePinned()));
    };
    this.cats = [];
    this._playing = false;
    this._talking = false;
    this._muted = true;
    this._reconnecting = false;
    this._expanded = false;
    this._fullscreen = false;
    this._tick = 0;
    this._callingCats = false;
    this._pulsingCue = false;
    this._overlayIdle = VISIBLE;
    this._controlsFocusVisible = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      cameraEntity: { attribute: false },
      cats: { attribute: false },
      cache: { attribute: false },
      scryptedId: { attribute: false },
      entryId: { attribute: false },
      overlayEntity: { attribute: false },
      callCatsEntity: { attribute: false },
      externalPin: { attribute: false },
      _playing: { state: true },
      _talking: { state: true },
      _muted: { state: true },
      _reconnecting: { state: true },
      _expanded: { state: true },
      _fullscreen: { state: true },
      _tick: { state: true },
      _callingCats: { state: true },
      _pulsingCue: { state: true },
      _overlayIdle: { state: true },
      _controlsFocusVisible: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    document.addEventListener("fullscreenchange", this._onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", this._onFullscreenChange);
    this._stallCheckInterval = setInterval(this._checkStall, STALL_CHECK_INTERVAL_MS);
    this._armIdleTimer();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    document.removeEventListener("fullscreenchange", this._onFullscreenChange);
    document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
    document.removeEventListener("keydown", this._onKeyDown);
    clearInterval(this._stallCheckInterval);
    this._stallCheckInterval = void 0;
    clearInterval(this._visionTimer);
    this._visionTimer = void 0;
    clearTimeout(this._cooldownTimer);
    this._cooldownTimer = void 0;
    clearTimeout(this._pulseTimer);
    this._pulseTimer = void 0;
    clearTimeout(this._idleTimer);
    this._idleTimer = void 0;
    this._stop();
  }
  /** Which transport (if any) currently has what it needs to show live video -- computed fresh
   * from the current props on every call rather than cached, since it must never drift from
   * `hass`/`scryptedId`/`cameraEntity` for even one render or one reconnect-timer tick. */
  _videoSource() {
    if (!this.hass) return { kind: "none" };
    return pickVideoSource(this.scryptedId, findScryptedToken(this.hass), this.cameraEntity);
  }
  /** The stream starts on its own as soon as the card knows where to get it, whichever transport
   * that is; the still stays underneath until the first frame paints, so the hand-over is
   * seamless either way. Only Scrypted needs an explicit start/stop dance here: a session that
   * turns out to be dead (peer connection disconnected/failed/closed) reroutes through the same
   * reconnect path a stall does, instead of leaving a frozen or blank video up forever.
   * `<ha-camera-stream>` is simply handed to `render()` and manages its own connect/reconnect
   * lifecycle, so this method's only job for that path is to flip `_playing` to match whether
   * there is a camera entity to show -- tearing down a still-live (or still-reconnecting)
   * Scrypted session first if the source just switched away from it, so the two transports can
   * never both be mid-session at once. */
  updated(changedProperties) {
    this._syncVisionPolling();
    this._syncStillAspectWatch();
    if (changedProperties.has("_talking") || changedProperties.has("_pulsingCue") || changedProperties.has("_controlsFocusVisible") || changedProperties.has("externalPin")) {
      this._syncIdlePin();
    }
    const source = this._videoSource();
    if (source.kind !== "scrypted") {
      if (this._starting || this._reconnecting || this._hiddenPaused || this._live.state !== "idle") {
        this._stop();
      }
      this._playing = source.kind === "ha-camera";
      return;
    }
    if (this._live.state === "error" && this._playing) {
      this._beginReconnect();
      return;
    }
    if (this._playing || this._starting || this._reconnecting || this._hiddenPaused) return;
    void this._start();
  }
  render() {
    const source = this._videoSource();
    return b2`
      ${this._expanded ? b2`<div class="backdrop" @click=${this._collapse}></div>` : A}
      <div
        class="frame ${this._expanded ? "expanded" : ""}"
        id="frame"
        @click=${this._onFrameClick}
        @pointermove=${this._onOverlayActivity}
        @pointerenter=${this._onOverlayActivity}
        @wheel=${this._onOverlayActivity}
        @focusin=${this._onFrameFocusIn}
        @focusout=${this._onFrameFocusOut}
      >
        ${this._renderStill()}
        ${this._playing ? this._renderVideo(source) : A}
        ${this._playing ? this._renderDetections() : A}
        ${this._expanded ? b2`<div class="topbar ${this._overlayIdle.visible ? "" : "idle-hidden"}">
              <button class="chip" aria-label=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} title=${this._fullscreen ? "Leave fullscreen" : "Fullscreen"} @click=${this._toggleFullscreen}>
                ${mdiIcon(this._fullscreen ? "fullscreenExit" : "fullscreen")}
              </button>
              <button class="chip" aria-label="Close" title="Close" @click=${this._collapse}>${mdiIcon("close")}</button>
            </div>` : A}
        ${source.kind === "scrypted" && this._reconnecting ? b2`<div class="reconnect" role="status" aria-label="Reconnecting to the feeder's camera">${mdiIcon("refresh")}</div>` : A}
        <div class="controls ${this._overlayIdle.visible ? "" : "idle-hidden"}">
          ${this._playing ? b2`<button
                class="chip"
                aria-pressed=${!this._muted}
                aria-label=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                title=${this._muted ? "Unmute the feeder" : "Mute the feeder"}
                @click=${this._toggleMute}
              >
                ${mdiIcon(this._muted ? "volumeOff" : "volumeHigh")}
              </button>` : A}
          ${this._playing && source.kind === "scrypted" && this._live.hasIntercom ? b2`<button
                class="chip talk"
                aria-pressed=${this._talking}
                aria-label=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                title=${this._talking ? "Stop talking to the feeder" : "Talk to the feeder"}
                @click=${this._toggleTalk}
              >
                ${mdiIcon(this._talking ? "microphone" : "microphoneOff")}
              </button>` : A}
          ${this._callCatsAvailable() ? b2`<button
                class="chip call-cats ${this._pulsingCue ? "pulsing" : ""}"
                aria-label="Call the cats"
                title="Call the cats"
                ?disabled=${this._callingCats}
                @click=${this._callCats}
              >
                ${mdiIcon("cat")}
              </button>` : A}
        </div>
        ${source.kind === "scrypted" && this._live.state === "error" && !this._reconnecting ? b2`<div class="note error">${this._live.error}</div>` : A}
      </div>
    `;
  }
  /** The live layer -- Scrypted's own `<video>` (its `srcObject` is wired up imperatively by
   * `ScryptedLive.open`, not through a template binding) or HA's `<ha-camera-stream>` bound
   * straight to the camera entity's own state object -- whichever `source` says is active.
   * `static styles` positions both by tag name into the exact box `<video>` has always had
   * (`position:absolute;inset:0`), so the detection overlay and the expand/fullscreen chips work
   * unchanged either way. No `id="video"` on the HA element: `_applyMute` and
   * `_toggleFullscreen`'s `#video` lookups assume a real `<video>` (to set `.muted`/call
   * `.play()`/`.webkitEnterFullscreen()`), true only for Scrypted's element -- giving
   * `<ha-camera-stream>` the same id would hand those two a wrong-shaped element instead of the
   * clean miss they already handle. */
  _renderVideo(source) {
    if (source.kind === "scrypted") {
      return b2`<video
        id="video"
        autoplay
        playsinline
        ?muted=${this._muted}
        @loadedmetadata=${this._onScryptedLoadedMetadata}
        @timeupdate=${this._onTimeUpdate}
      ></video>`;
    }
    if (source.kind === "ha-camera" && customElements.get("ha-camera-stream")) {
      return b2`<ha-camera-stream
        .hass=${this.hass}
        .stateObj=${this.hass.states[source.entityId]}
        .fitMode=${"contain"}
        .muted=${this._muted}
      ></ha-camera-stream>`;
    }
    return A;
  }
  _renderStill() {
    if (!this.cameraEntity) return b2`<div class="placeholder">No camera on this device</div>`;
    if (customElements.get("hui-image")) {
      return b2`<hui-image .hass=${this.hass} .cameraImage=${this.cameraEntity} cameraView="auto"></hui-image>`;
    }
    const src = this.hass.states[this.cameraEntity]?.attributes.entity_picture;
    return typeof src === "string" ? b2`<img src=${src} alt="The feeder's camera" @load=${this._onStillImgLoad} />` : b2`<div class="placeholder">Camera unavailable</div>`;
  }
  /** Reports the media's real width/height ratio once known -- Scrypted's `<video>` on
   * `loadedmetadata`, or the snapshot `<img>`'s natural size once it loads (`hui-image`'s own
   * internal `<img>`, reached through its shadow root, or this component's own fallback `<img>`
   * when `hui-image` is not registered) -- so `kibble-card.ts` can size `.hero` to the stream's
   * true aspect instead of a guessed default. Degenerate readings (a `0x0` metadata event, an
   * image that has not actually finished loading) are dropped; everything else is clamped to a
   * sane range so a corrupt frame can never squash the hero to a sliver or blow it up past
   * anything a camera stream plausibly is. Also set directly on this element's own
   * `--kibble-hero-aspect` (its `:host` rule below reads that same variable), so a standalone
   * `<kibble-live-hero>` -- the dev harness, `dev/parts.html` -- sizes itself correctly too, not
   * only `.hero` after the event bubbles up to `kibble-card.ts`. */
  _reportMediaAspect(width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
    const ratio = Math.min(MAX_HERO_ASPECT, Math.max(MIN_HERO_ASPECT, width / height));
    if (this._reportedAspect !== void 0 && Math.abs(this._reportedAspect - ratio) < 1e-3) return;
    this._reportedAspect = ratio;
    this.style.setProperty("--kibble-hero-aspect", String(ratio));
    this.dispatchEvent(new CustomEvent("media-aspect-changed", { detail: { ratio }, bubbles: true, composed: true }));
  }
  /** `hui-image` renders its own `<img>` inside ITS OWN shadow root -- reached only through
   * that boundary, and only best-effort: a future HA version restructuring it, or a closed
   * shadow root, just leaves the default aspect standing, never a thrown error. Re-checked on
   * every `updated()` (cheap: two `querySelector`s) rather than once, since `hui-image` mounts
   * its own `<img>` on its own render cycle, not necessarily by the time this component's
   * first render has committed. */
  _syncStillAspectWatch() {
    const host = this.renderRoot.querySelector("hui-image");
    const img = host?.shadowRoot?.querySelector("img") ?? null;
    if (img === this._watchedStillImg) return;
    if (this._watchedStillImg) this._watchedStillImg.removeEventListener("load", this._onStillImgLoad);
    this._watchedStillImg = img;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) this._reportMediaAspect(img.naturalWidth, img.naturalHeight);
    img.addEventListener("load", this._onStillImgLoad, { once: true });
  }
  /** Render each detector box independently. Rejected clutter stays quiet and opt-in, while
   * named detections use their own roster color and avatar. */
  _renderDetections() {
    const frame = this._visionQuery.state.data?.frame;
    if (!this._overlayOn() || !frame?.detections) return A;
    const showIgnored = frame.overlay_suppressed ?? true;
    const detections = frame.detections.filter((detection) => detection.admitted || showIgnored);
    if (detections.length === 0) return A;
    const boxes = detections.map((detection, index) => {
      const name = detection.cat || null;
      const cat = name ? this.cats?.find((candidate) => candidate.name === name) : void 0;
      const named = detection.admitted && name !== null;
      return {
        key: `vision-${detection.sid ?? "unmatched"}-${index}`,
        box: [detection.x1, detection.y1, detection.x2, detection.y2],
        tone: detection.admitted ? named ? "cat" : "unknown" : "clutter",
        color: named ? cat ? catColorAt(cat.color) : fallbackCatColor(name) : void 0,
        label: named ? name : void 0,
        avatar: cat?.avatar ?? null
      };
    });
    return b2`<kibble-box-overlay class="detections" .boxes=${boxes} .hass=${this.hass} .cache=${this.cache} .labelSafeTop=${LIVE_HERO_CHROME_SAFE_TOP}></kibble-box-overlay>`;
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
  /** The detection-overlay switch's own state -- an unresolved/missing entity (an older
   * integration, or the vendor stack, which has no vision pipeline at all) reads as off, same
   * as the switch itself being off. */
  _overlayOn() {
    const id = this.overlayEntity;
    return id !== void 0 && this.hass?.states[id]?.state === "on";
  }
  /** Starts or stops the vision poll to match its three gates -- actually playing (not just a
   * still), the overlay switch on, and somewhere to ask -- every time the element updates. An
   * idle dashboard (still showing, overlay off, or torn down) never hits the feeder for this at
   * all: this is a battery-powered-adjacent embedded device. */
  _syncVisionPolling() {
    const shouldPoll = this._playing && this._overlayOn() && Boolean(this.entryId) && Boolean(this.hass?.callWS);
    const isPolling = this._visionTimer !== void 0;
    if (shouldPoll === isPolling) return;
    if (!shouldPoll) {
      this._stopVisionPolling();
      return;
    }
    this._pollVision();
    this._visionTimer = setInterval(this._pollVision, VISION_POLL_MS2);
  }
  _stopVisionPolling() {
    clearInterval(this._visionTimer);
    this._visionTimer = void 0;
    this._visionQuery = new WsQuery(() => this.requestUpdate());
  }
  _expand() {
    this._expanded = true;
    document.addEventListener("keydown", this._onKeyDown);
  }
  /** Missing entity (an older integration, no LibreFeed daemon) or unavailable (feeder
   * unreachable, or running the vendor stack -- `KibbleCallCatsButton.available` in the
   * integration) both hide the button outright, same convention `_overlayOn` uses for the
   * detection-overlay switch. Not gated by `_playing`: calling the cats needs no live video. */
  _callCatsAvailable() {
    const id = this.callCatsEntity;
    return id !== void 0 && this.hass?.states[id]?.state !== "unavailable";
  }
  /** Public hook for chrome that overlaps this component's video from *outside* its own shadow
   * DOM (`kibble-card.ts`'s `.gear-button`, absolutely positioned over the hero) -- lets an
   * external click/focus on that chrome count as activity too, exactly like an internal one. */
  notifyActivity() {
    this._onOverlayActivity();
  }
  /** The one place `_overlayIdle` is ever reassigned -- dispatches `overlay-idle-changed`
   * (bubbling, composed) whenever visibility actually transitions, so chrome outside this
   * component's shadow DOM (`kibble-card.ts`'s `.gear-button`) can fade in step without needing
   * to poll this component's own state. */
  _applyOverlayIdle(next) {
    const changed = next.visible !== this._overlayIdle.visible;
    this._overlayIdle = next;
    if (changed) {
      this.dispatchEvent(new CustomEvent("overlay-idle-changed", { detail: { visible: next.visible }, bubbles: true, composed: true }));
    }
  }
  /** Everything that must keep the overlay controls on screen regardless of the idle timer:
   * active talkback, the call-cats cooldown pulse, keyboard focus inside the controls, or (from
   * outside this component entirely) `kibble-card.ts`'s settings popup being open. */
  _idlePinned() {
    return this._talking || this._pulsingCue || this._controlsFocusVisible || Boolean(this.externalPin);
  }
  /** Cancels/re-arms the idle timer to match the current pin state -- called from `updated()`
   * whenever anything `_idlePinned()` reads changes. A pin starting always reveals immediately
   * (it must never race a timeout already in flight); a pin ending is treated like fresh
   * activity, restarting the full `IDLE_MS` window rather than resuming a partially-elapsed one. */
  _syncIdlePin() {
    if (this._idlePinned()) {
      clearTimeout(this._idleTimer);
      this._idleTimer = void 0;
      if (!this._overlayIdle.visible) this._applyOverlayIdle(VISIBLE);
      return;
    }
    if (this._idleTimer === void 0) this._armIdleTimer();
  }
  _armIdleTimer() {
    clearTimeout(this._idleTimer);
    this._idleTimer = void 0;
    if (!shouldArmTimer(this._overlayIdle, this._idlePinned())) return;
    this._idleTimer = setTimeout(this._onIdleTimerFired, IDLE_MS);
  }
  static {
    this.styles = i`
    :host {
      display: block;
      height: 100%;
      /* The frame inside is absolutely positioned, so this element has no intrinsic size and
         takes its height from its parent. In the stacked (phone) layout nothing supplies one,
         and a hero with no loaded frame collapsed to ~60 px -- measured on a 390x844 viewport
         -- then jumped to full height the moment the stream arrived. The ratio reserves the
         space up front, and is always the media's own real ratio once _reportMediaAspect
         learns it (set directly on this host's own --kibble-hero-aspect custom property;
         kibble-card.ts sets the same variable on .hero from the bubbled media-aspect-changed
         event, so the two stay in lockstep even though .hero -- not this element's own
         aspect-ratio -- is what actually sizes the video once this is nested inside the card).
         Where a parent does set a height (the wide layout, where the side column drives the
         row) that height still wins: aspect-ratio only fills in a dimension nothing else has
         decided. */
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      position: relative;
    }
    .frame {
      position: absolute;
      inset: 0;
      background: #101010;
      cursor: zoom-in;
    }
    .frame.expanded {
      position: fixed;
      inset: 0;
      z-index: 1001; /* above HA's app header (z-index 4) and dialogs' scrim */
      cursor: default;
      background: #000;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.85);
    }
    .topbar {
      position: absolute;
      top: max(8px, env(safe-area-inset-top));
      right: max(8px, env(safe-area-inset-right));
      display: flex;
      gap: 6px;
      pointer-events: none;
    }
    .topbar .chip {
      pointer-events: auto;
    }
    video,
    img,
    hui-image,
    ha-camera-stream {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain; /* never cropped, inline or expanded; ha-camera-stream ignores this on its own host -- its .fitMode in _renderVideo carries the same "contain" instead */
    }
    video,
    ha-camera-stream {
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
    .frame.expanded .controls {
      bottom: max(12px, env(safe-area-inset-bottom));
      right: max(12px, env(safe-area-inset-right));
    }
    /* Video-player-style auto-hide (lib/overlay-idle.ts): no transition property outside the
       no-preference query, so a reduced-motion user's browser snaps the final opacity/position
       instantly instead of animating it, matching .reconnect svg's spin and
       .chip.call-cats.pulsing's rings just below. */
    @media (prefers-reduced-motion: no-preference) {
      .controls,
      .topbar {
        transition: opacity 200ms ease, transform 200ms ease;
      }
    }
    .controls.idle-hidden {
      opacity: 0;
      transform: translateY(6px);
    }
    .topbar.idle-hidden {
      opacity: 0;
      transform: translateY(-6px);
    }
    .controls.idle-hidden .chip,
    .topbar.idle-hidden .chip {
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
    .chip.call-cats {
      position: relative;
    }
    .chip.call-cats:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .chip.call-cats.pulsing::before,
    .chip.call-cats.pulsing::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--kibble-amber, #f2a33c);
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .chip.call-cats.pulsing::before {
        animation: kibble-cue-pulse 1.1s ease-out;
      }
      .chip.call-cats.pulsing::after {
        animation: kibble-cue-pulse 1.1s ease-out 0.25s;
      }
    }
    @keyframes kibble-cue-pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      100% {
        transform: scale(1.9);
        opacity: 0;
      }
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
    .detections {
      position: absolute;
      inset: 0;
    }
  `;
  }
};
customElements.define("kibble-live-hero", KibbleLiveHero);

// src/components/kibble-bubble-row.ts
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

// src/editor.ts
var SCHEMA = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "scrypted_id", selector: { text: {} } },
  { name: "settings_hash", selector: { text: {} } },
  { name: "detection_areas_hash", selector: { text: {} } },
  { name: "schedule_hash", selector: { text: {} } }
];
var FIELD_LABELS = {
  device_id: "Kibble device",
  name: "Name (optional)",
  scrypted_id: "Scrypted camera id (optional, adds low-latency video and talk)",
  settings_hash: "Settings pop-up hash (optional)",
  detection_areas_hash: "Detection areas pop-up hash (optional)",
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
          <span>Detection areas pop-up hash (optional)</span>
          <input
            type="text"
            placeholder="#detection-areas"
            .value=${this._config?.detection_areas_hash ?? ""}
            @change=${(event) => this._updateDetectionAreasHash(event.target.value)}
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
  _updateDetectionAreasHash(value) {
    if (!this._config) return;
    this._config = { ...this._config, detection_areas_hash: value || void 0 };
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

// src/lib/live-signal.ts
var LiveSignal = class {
  constructor(_onChanged) {
    this._onChanged = _onChanged;
    this._unsubscribe = null;
    this._subscribing = false;
  }
  /** Call on every `willUpdate`; only (re)subscribes when `entryId` actually changes. */
  sync(hass, entryId) {
    if (entryId === this._entryId) return;
    this._entryId = entryId;
    void this._resubscribe(hass, entryId);
  }
  async _resubscribe(hass, entryId) {
    const previous = this._unsubscribe;
    this._unsubscribe = null;
    if (previous) await previous().catch(() => {
    });
    if (!hass?.connection || !entryId || this._subscribing) return;
    this._subscribing = true;
    try {
      const unsubscribe = await hass.connection.subscribeMessage(
        () => {
          if (this._entryId === entryId) this._onChanged();
        },
        { type: "kibble/timeline/subscribe", entry_id: entryId }
      );
      this._subscribing = false;
      if (this._entryId !== entryId) {
        void unsubscribe().catch(() => {
        });
        return;
      }
      this._unsubscribe = unsubscribe;
    } catch {
      this._subscribing = false;
    }
  }
  dispose() {
    const unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    this._entryId = void 0;
    if (unsubscribe) void unsubscribe().catch(() => {
    });
  }
};

// src/lib/timeline-feed.ts
var TimelineFeed = class {
  constructor(_onChange) {
    this._onChange = _onChange;
    this.state = {
      items: null,
      loading: false,
      loadingMore: false,
      cursor: null,
      hasMore: false,
      error: null
    };
    /** Identifies current filters; a change restarts at the newest page. */
    this._key = null;
    /** Guards against an older request resolving over a newer filter or card instance. */
    this._generation = 0;
    this._lastLimit = 30;
    this._live = new LiveSignal(() => this._onLiveChange());
  }
  /** Loads the newest page when its filter changes, and keeps the live subscription pointed at
   * the current entry. Safe to call on every card update. */
  sync(hass, entryId, limit) {
    this._lastHass = hass;
    this._lastEntryId = entryId;
    this._lastLimit = limit;
    this._live.sync(hass, entryId);
    const key = entryId ? `${entryId}:${limit}` : null;
    if (key === this._key) return;
    this._key = key;
    if (!hass?.callWS || !entryId) return;
    void this._readPage(hass, entryId, limit, null, ++this._generation, true);
  }
  /** Appends one older page. No-op while a request is outstanding or history is exhausted. */
  loadMore(hass, entryId, limit) {
    if (!hass?.callWS || !entryId || this.state.loading || this.state.loadingMore || !this.state.hasMore) return;
    void this._readPage(hass, entryId, limit, this.state.cursor, this._generation, false);
  }
  /** Re-reads the newest page. */
  refresh(hass, entryId, limit) {
    if (!hass?.callWS || !entryId) return;
    void this._readPage(hass, entryId, limit, null, ++this._generation, true);
  }
  /** Splices a freshly labelled event back into the loaded pages in place, by uid -- a no-op
   * if that uid isn't currently loaded (it scrolled past "Show more", or hasn't loaded yet).
   * The caller decides whether a label should instead call `removeItem` (a row labelled
   * `not_a_cat` stops matching what `kibble/timeline` would return). */
  replaceItem(uid, updated) {
    const items = this.state.items;
    if (!items) return;
    const index = items.findIndex((item) => item.uid === uid);
    if (index === -1) return;
    const next = items.slice();
    next[index] = updated;
    this.state = { ...this.state, items: next };
    this._onChange();
  }
  removeItem(uid) {
    const items = this.state.items;
    if (!items) return;
    if (!items.some((item) => item.uid === uid)) return;
    this.state = { ...this.state, items: items.filter((item) => item.uid !== uid) };
    this._onChange();
  }
  /** Restores a prior `items` snapshot wholesale -- the rollback half of an optimistic label:
   * the card snapshots `state.items` before mutating rows for instant feedback, then calls this
   * with that snapshot if the server call fails, undoing any mix of `replaceItem`/`removeItem`
   * calls in one step regardless of how many rows were touched. */
  restoreItems(items) {
    this.state = { ...this.state, items };
    this._onChange();
  }
  _onLiveChange() {
    this.refresh(this._lastHass, this._lastEntryId, this._lastLimit);
  }
  async _readPage(hass, entryId, limit, cursor, generation, replace) {
    this.state = replace ? { ...this.state, loading: true, error: null } : { ...this.state, loadingMore: true, error: null };
    this._onChange();
    try {
      const result = await hass.callWS({
        type: "kibble/timeline",
        entry_id: entryId,
        limit,
        ...cursor ? { cursor } : {}
      });
      if (generation !== this._generation) return;
      const items = replace ? result.items : [...this.state.items ?? [], ...result.items];
      this.state = { items, loading: false, loadingMore: false, cursor: result.cursor, hasMore: result.has_more, error: null };
    } catch (err) {
      if (generation !== this._generation) return;
      this.state = { ...this.state, loading: false, loadingMore: false, error: describeWsError(err) };
    }
    this._onChange();
  }
  /** Invalidates in-flight requests and drops the live subscription. */
  dispose() {
    this._generation += 1;
    this._live.dispose();
  }
};

// src/lib/sample-label.ts
async function labelSample(hass, entryId, request) {
  if (!hass.callWS) throw new Error("Not connected.");
  const result = await hass.callWS({
    type: "kibble/sample/label",
    entry_id: entryId,
    sample_uid: request.sampleUid,
    label: request.label
  });
  return result.sample;
}

// src/lib/timeline.ts
function rowThumbAsset(event) {
  if (event.kind === "feed") return null;
  return event.thumb ?? event.scene ?? null;
}
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${remainder} sec`;
  return remainder === 0 ? `${minutes} min` : `${minutes} min ${remainder} sec`;
}
function eventDuration(event) {
  if (event.kind !== "eat" || event.open || event.end == null || event.end <= event.start) return null;
  return formatDuration(event.end - event.start);
}
function spanDuration(start, end) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return formatDuration(Math.floor(end - start));
}
function catVerb(event) {
  if (event.open) return event.kind === "eat" ? "is eating" : "is here";
  return event.kind === "eat" ? "ate" : "came by";
}
function eventTitle(event) {
  if (event.kind === "feed") return feedTitle(event);
  if (!event.cat) return event.kind === "eat" ? "Someone is eating" : "Someone is here";
  return `${event.cat} ${catVerb(event)}`;
}
function portionWord2(n6) {
  return `${n6} portion${n6 === 1 ? "" : "s"}`;
}
function feedTitle(event) {
  const feed = event.feed;
  if (!feed || feed.portions == null) return "Fed";
  if (feed.single || feed.sides.length === 0) return `Fed ${portionWord2(feed.portions)}`;
  if (feed.sides.length === 1) {
    const [side] = feed.sides;
    const clause = side.food ? `of ${side.food}` : `from hopper ${side.hopper}`;
    return `Fed ${portionWord2(side.portions)} ${clause}`;
  }
  const [first, second] = feed.sides;
  if (first.food && second.food) {
    return `Fed ${first.portions} ${first.food} and ${second.portions} ${second.food}`;
  }
  if (first.portions === second.portions) {
    return `Fed ${portionWord2(first.portions)} from each hopper`;
  }
  return `Fed ${first.portions} from hopper ${first.hopper} and ${second.portions} from hopper ${second.hopper}`;
}
function timeLabel(unixSeconds, locale) {
  return new Date(unixSeconds * 1e3).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}
function compareAssets(event) {
  if (event.kind !== "eat" && event.kind !== "feed") return null;
  if (!event.before || !event.after) return null;
  return { before: event.before, after: event.after };
}
var COLLAPSE_WINDOW_SECONDS = 5 * 60;
function joinedNames(names) {
  if (names.length < 2) return names[0] ?? "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}
function orderTogetherEvents(events) {
  return [...events].sort(
    (left, right) => Number(right.kind === "eat") - Number(left.kind === "eat") || Number(left.cat === null) - Number(right.cat === null)
  );
}
function togetherTitle(events) {
  const lanes = orderTogetherEvents(events);
  const names = lanes.map((lane) => lane.cat ?? "Who?");
  const sameKind = lanes.every((lane) => lane.kind === lanes[0]?.kind);
  const sameState = lanes.every((lane) => lane.open === lanes[0]?.open);
  if (sameKind && sameState && lanes[0]?.kind !== "feed") {
    const kind = lanes[0]?.kind;
    const verb = lanes[0]?.open ? kind === "eat" ? "are eating" : "are here" : kind === "eat" ? "ate" : "came by";
    return joinedNames(names) + " " + verb;
  }
  return lanes.map((lane, index) => names[index] + " " + catVerb(lane)).join(", ");
}
function groupConsecutive(events, now = Date.now() / 1e3) {
  const sessions = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event.session === null || event.session === void 0) continue;
    const lanes = sessions.get(event.session) ?? [];
    lanes.push(event);
    sessions.set(event.session, lanes);
  }
  const togetherByUid = /* @__PURE__ */ new Map();
  for (const lanes of sessions.values()) {
    const ordered = [...lanes].sort((left, right) => left.start - right.start);
    let cluster = [];
    let clusterEnd = Number.NEGATIVE_INFINITY;
    const saveCluster = () => {
      if (cluster.length > 1) {
        const members = new Set(cluster.map((event) => event.uid));
        const rowEvents = events.filter((event) => members.has(event.uid));
        const start = Math.min(...rowEvents.map((event) => event.start));
        const end = Math.max(...rowEvents.map((event) => Math.max(event.start, event.end ?? now)));
        const group = { event: rowEvents[0], events: rowEvents, together: true, start, end };
        for (const event of rowEvents) togetherByUid.set(event.uid, group);
      }
      cluster = [];
      clusterEnd = Number.NEGATIVE_INFINITY;
    };
    for (const event of ordered) {
      const eventEnd = Math.max(event.start, event.end ?? now);
      if (cluster.length > 0 && event.start > clusterEnd) saveCluster();
      cluster.push(event);
      clusterEnd = Math.max(clusterEnd, eventEnd);
    }
    saveCluster();
  }
  const groups = [];
  const emitted = /* @__PURE__ */ new Set();
  for (const event of events) {
    const together = togetherByUid.get(event.uid);
    if (together) {
      if (!emitted.has(together)) {
        emitted.add(together);
        groups.push(together);
      }
      continue;
    }
    const last = groups[groups.length - 1];
    if (last && !last.together && last.event.kind === event.kind && last.event.cat === event.cat && last.event.start - event.start <= COLLAPSE_WINDOW_SECONDS) {
      last.events.push(event);
      continue;
    }
    groups.push({ event, events: [event] });
  }
  return groups.sort((left, right) => (right.start ?? right.event.start) - (left.start ?? left.event.start));
}
function groupCountLabel(kind, count) {
  const noun = kind === "eat" ? "meal" : kind === "feed" ? "feed" : "visit";
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
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
function groupByDay(groups, now) {
  const days = [];
  let currentKey = null;
  for (const group of groups) {
    const date = new Date((group.start ?? group.event.start) * 1e3);
    const key = dayKey(date);
    if (key !== currentKey) {
      currentKey = key;
      days.push({ label: dayLabel(date, now), groups: [] });
    }
    days[days.length - 1].groups.push(group);
  }
  return days;
}
var DEFAULT_RAIL_MAX_HEIGHT = "clamp(360px, calc(100dvh - 200px), 900px)";
function railStyle(maxHeight) {
  const value = (maxHeight ?? "").trim();
  if (value === "none") return "";
  return `max-height:${value || DEFAULT_RAIL_MAX_HEIGHT}`;
}

// src/lib/review-summary.ts
function eventFragment(entry, locale) {
  if (entry.label === "unknown") return null;
  if (entry.label === "not_a_cat") return "Not a cat";
  return `${entry.label} ${catVerb(entry.event)} at ${timeLabel(entry.event.start, locale)}`;
}
function photosFragment(count) {
  if (count <= 0) return null;
  return `${count} photo${count === 1 ? "" : "s"} updated`;
}
function reviewSummaryMessage(input, locale) {
  const latestByUid = /* @__PURE__ */ new Map();
  for (const entry of input.events) latestByUid.set(entry.uid, entry);
  const fragments = [];
  for (const entry of latestByUid.values()) {
    const fragment = eventFragment(entry, locale);
    if (fragment) fragments.push(fragment);
  }
  const photos = photosFragment(input.photosUpdated);
  if (photos) fragments.push(photos);
  if (fragments.length === 0) return null;
  return `Saved: ${fragments.join(", ")}`;
}

// src/lib/session-label.ts
function draftFrom(cats, identity) {
  return { cats: cats.map(({ cat, ate }) => ({ cat, ate })), notACat: identity === "not_a_cat", subjects: {} };
}
function toggleDraftCat(draft, name, isMeal) {
  const present = draft.cats.some((cat) => cat.cat === name);
  return {
    ...draft,
    notACat: false,
    cats: present ? draft.cats.filter((cat) => cat.cat !== name) : [...draft.cats, { cat: name, ate: isMeal }]
  };
}
function toggleDraftNotACat(draft) {
  return draft.notACat ? { ...draft, notACat: false } : { ...draft, notACat: true, cats: [] };
}
function setDraftAte(draft, name, ate) {
  return { ...draft, cats: draft.cats.map((cat) => cat.cat === name ? { ...cat, ate } : cat) };
}
function nameDraftSubject(draft, sid, label, isMeal) {
  const subjects = { ...draft.subjects, [sid]: label };
  if (label === "not_a_cat" || draft.cats.some((cat) => cat.cat === label)) return { ...draft, subjects };
  return { ...draft, subjects, notACat: false, cats: [...draft.cats, { cat: label, ate: isMeal }] };
}
function draftChipState(draft, saved, name) {
  if (!draft.cats.some((cat) => cat.cat === name)) return "neutral";
  const savedCat = saved.find((cat) => cat.cat === name);
  return savedCat && !savedCat.confirmed ? "suggested" : "confirmed";
}
function confirmAction(draft, saved, identity) {
  const subjects = Object.entries(draft.subjects).map(([sid, label]) => ({ sid: Number(sid), label }));
  const extra = subjects.length ? { subjects } : {};
  if (draft.notACat) {
    if (identity === "not_a_cat" && !subjects.length) return { kind: "close", text: "Done" };
    return { kind: "save", text: "Confirm not a cat", request: { verdict: "not_a_cat", ...extra } };
  }
  if (draft.cats.length === 0) return { kind: "blocked", text: "Pick who was here" };
  const unchanged = identity !== "not_a_cat" && saved.length === draft.cats.length && saved.every((cat) => cat.confirmed && draft.cats.some((d3) => d3.cat === cat.cat && d3.ate === cat.ate)) && !subjects.length;
  if (unchanged) return { kind: "close", text: "Done" };
  return { kind: "save", text: "Confirm " + joinNames(draft.cats.map((cat) => cat.cat)), request: { cats: draft.cats.map((cat) => ({ ...cat })), ...extra } };
}
function joinNames(names) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}
function sessionTitle(cats, event) {
  if (event.identity === "not_a_cat") return "Not a cat";
  if (cats.length === 0) return "Who was this?";
  const groups = /* @__PURE__ */ new Map();
  for (const cat of cats) {
    const verb = event.open ? cat.ate ? "is eating" : "is here" : cat.ate ? "ate" : "came by";
    const names = groups.get(verb) ?? [];
    names.push(cat.cat);
    groups.set(verb, names);
  }
  return [...groups].map(([verb, names]) => joinNames(names) + " " + verb).join(", ");
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function placeNamePicker(box, frameWidth, frameHeight, pickerWidth, pickerHeight, gap = 8, inset = 8) {
  if (!(frameWidth > 0) || !(frameHeight > 0)) return { left: 0, top: 0, flipped: false };
  const safeInset = Math.max(0, Math.min(inset, frameWidth / 2, frameHeight / 2));
  const width = Math.min(Math.max(0, pickerWidth), Math.max(0, frameWidth - safeInset * 2));
  const height = Math.min(Math.max(0, pickerHeight), Math.max(0, frameHeight - safeInset * 2));
  const maxLeft = frameWidth - safeInset - width;
  const maxTop = frameHeight - safeInset - height;
  const anchorX = (box[0] + box[2]) / 2 * frameWidth;
  const left = clamp2(anchorX - width / 2, safeInset, maxLeft);
  const below = box[3] * frameHeight + gap;
  const above = box[1] * frameHeight - gap - height;
  const canFitBelow = below <= maxTop;
  const canFitAbove = above >= safeInset;
  const flipped = !canFitBelow && canFitAbove;
  return { left, top: clamp2(flipped ? above : below, safeInset, maxTop), flipped };
}
function groupSessionPhotos(samples, cats) {
  if (cats.length < 2) return [];
  const sections = cats.map((cat) => ({ cat: cat.cat, samples: [] }));
  const byName = new Map(sections.map((section) => [section.cat, section]));
  const unassigned = [];
  for (const sample of samples) {
    const section = sample.cat ? byName.get(sample.cat) : void 0;
    if (section) section.samples.push(sample);
    else unassigned.push(sample);
  }
  if (unassigned.length > 0) {
    const main = sections.reduce((best, section) => section.samples.length > best.samples.length ? section : best);
    main.samples.push(...unassigned);
  }
  return sections;
}
async function labelSession(hass, entryId, request) {
  const callWS = hass.callWS;
  if (!callWS) throw new Error("Not connected.");
  let detail = await callWS({
    type: "kibble/session/label",
    entry_id: entryId,
    uid: request.uid,
    ...request.cats ? { cats: request.cats } : {},
    ...request.verdict ? { verdict: request.verdict } : {}
  });
  for (const subject of request.subjects ?? []) {
    detail = await callWS({ type: "kibble/session/subject", entry_id: entryId, uid: detail.event.uid, sid: subject.sid, label: subject.label });
  }
  return detail;
}

// src/lib/clip-offset.ts
var CLIP_SEEK_LEAD_MS = 3e3;
function clipSeekOffsetSeconds(eventStartSeconds, clipStartMs) {
  const offsetMs = eventStartSeconds * 1e3 - clipStartMs - CLIP_SEEK_LEAD_MS;
  return Math.max(0, offsetMs) / 1e3;
}

// src/components/kibble-box-overlay.ts
var KibbleBoxOverlay = class extends i4 {
  constructor() {
    super();
    this._focusTrigger = null;
    this._pointerDown = (event) => {
      if (this._pickerKey && !event.composedPath().includes(this)) this._closePicker(false);
    };
    this._keyDown = (event) => {
      if (event.key !== "Escape" || !this._pickerKey) return;
      event.preventDefault();
      event.stopPropagation();
      this._closePicker(true);
    };
    this._repositionLabels = () => {
      const bounds = this.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      const labelNodes = [...this.renderRoot.querySelectorAll(".label")];
      const labels = this.boxes.flatMap((box) => {
        const text = box.label ?? (box.tone === "not-cat" ? "Not a cat" : null);
        if (!text) return [];
        const node = labelNodes.find((element) => element.dataset.labelKey === box.key);
        const measured = node?.getBoundingClientRect();
        return [{ key: box.key, box: box.box, width: measured?.width || Math.max(44, text.length * 7 + 34), height: measured?.height || 22 }];
      });
      const next = Object.fromEntries(placeLabels(labels, bounds.width, bounds.height, 4, this.labelSafeTop).map((placement) => [placement.key, placement]));
      const keys = Object.keys(next);
      if (keys.length === Object.keys(this._labelPositions).length && keys.every((key) => {
        const before = this._labelPositions[key];
        const after = next[key];
        return before?.left === after?.left && before?.top === after?.top && before?.flipped === after?.flipped;
      })) return;
      this._labelPositions = next;
    };
    this._repositionPicker = () => {
      if (!this._pickerKey) return;
      const box = this.boxes.find((candidate) => candidate.key === this._pickerKey);
      const picker = this.renderRoot.querySelector(".picker");
      const frame = this.getBoundingClientRect();
      if (!box || !picker || frame.width <= 0 || frame.height <= 0) return;
      const bounds = picker.getBoundingClientRect();
      const placement = placeNamePicker(box.box, frame.width, frame.height, bounds.width, bounds.height);
      const before = this._pickerPlacement;
      if (before?.left === placement.left && before.top === placement.top && before.flipped === placement.flipped) return;
      this._pickerPlacement = placement;
    };
    this.boxes = [];
    this.cats = [];
    this.busy = false;
    this.labelSafeTop = 0;
    this._labelPositions = {};
    this._pickerKey = null;
    this._pickerPlacement = null;
  }
  static {
    this.properties = {
      boxes: { attribute: false },
      hass: { attribute: false },
      cache: { attribute: false },
      cats: { attribute: false },
      busy: { type: Boolean },
      labelSafeTop: { attribute: false },
      _labelPositions: { state: true },
      _pickerKey: { state: true },
      _pickerPlacement: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("pointerdown", this._pointerDown, true);
    window.addEventListener("keydown", this._keyDown, true);
  }
  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => {
      this._repositionLabels();
      this._repositionPicker();
    });
    this._resizeObserver.observe(this);
    this._repositionLabels();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pointerdown", this._pointerDown, true);
    window.removeEventListener("keydown", this._keyDown, true);
    this._resizeObserver?.disconnect();
    this._resizeObserver = void 0;
  }
  updated(changed) {
    if (changed.has("boxes") || changed.has("labelSafeTop")) this._repositionLabels();
    if (changed.has("boxes") && this._pickerKey && !this.boxes.some((box) => box.key === this._pickerKey)) this._closePicker(false);
    if (changed.has("_pickerKey") || changed.has("boxes") || changed.has("cats")) this._repositionPicker();
  }
  _openPicker(box, event) {
    if (this.busy || box.subjectSid == null) return;
    this._focusTrigger = event.currentTarget;
    this._pickerPlacement = null;
    this._pickerKey = box.key;
    void this.updateComplete.then(async () => {
      this._repositionPicker();
      await this.updateComplete;
      this.renderRoot.querySelector(".picker-option:not([disabled])")?.focus();
    });
  }
  _closePicker(restoreFocus) {
    const trigger = this._focusTrigger;
    this._pickerKey = null;
    this._pickerPlacement = null;
    this._focusTrigger = null;
    if (restoreFocus) trigger?.focus();
  }
  _chooseSubject(box, label) {
    if (this.busy || box.subjectSid == null) return;
    this._closePicker(true);
    this.dispatchEvent(new CustomEvent("subject-label-requested", {
      detail: { sid: box.subjectSid, label },
      bubbles: true,
      composed: true
    }));
  }
  render() {
    const selectable = this.boxes.some((box) => box.selectable);
    const pickerBox = this.boxes.find((box) => box.key === this._pickerKey);
    return b2`
      <div class="overlay ${selectable ? "interactive" : "passive"}" ?aria-hidden=${!selectable}>
        ${this.boxes.map((box) => this._renderBox(box))}
        ${pickerBox ? this._renderPicker(pickerBox) : A}
      </div>`;
  }
  _renderPicker(box) {
    const visible = this._pickerPlacement !== null;
    const style = visible ? `left:${this._pickerPlacement.left}px;top:${this._pickerPlacement.top}px;` : "left:8px;top:8px;visibility:hidden;";
    return b2`<div class="picker" role="group" aria-label="Name this animal" style=${style}>
      ${this.cats.map((cat) => b2`<button type="button" class="picker-option" aria-pressed=${box.subjectLabel === cat.name} ?disabled=${this.busy} @click=${() => this._chooseSubject(box, cat.name)}>
        <kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar><span>${cat.name}</span>${box.subjectLabel === cat.name ? b2`<span class="picker-check" aria-hidden="true">✓</span>` : A}
      </button>`)}
      <button type="button" class="picker-option" aria-pressed=${box.subjectLabel === "not_a_cat"} ?disabled=${this.busy} @click=${() => this._chooseSubject(box, "not_a_cat")}>
        <kibble-avatar .name=${null}></kibble-avatar><span>Not a cat</span>${box.subjectLabel === "not_a_cat" ? b2`<span class="picker-check" aria-hidden="true">✓</span>` : A}
      </button>
    </div>`;
  }
  _renderBox(box) {
    const rect = boxRect(box.box);
    const boundsStyle = `left:${rect.left};top:${rect.top};width:${rect.width};height:${rect.height};--box-color:${box.color ?? "rgba(255,255,255,.9)"};`;
    const emphasis = box.emphasis ?? "normal";
    const text = box.label ?? (box.tone === "not-cat" ? "Not a cat" : null);
    const placement = this._labelPositions[box.key];
    const labelStyle = placement ? `left:${placement.left}px;top:${placement.top}px;` : `left:${rect.left};top:${rect.top};`;
    return b2`
      <div class="box-wrap tone-${box.tone} emphasis-${emphasis}" style=${boundsStyle}>
        <span class="stroke"></span>
        ${box.selectable ? b2`<button type="button" class="hit" aria-label=${text ? `Name ${text}` : "Name this animal"} @click=${(event) => this._openPicker(box, event)}></button>` : A}
      </div>
      ${text ? b2`<span class="label tone-${box.tone} emphasis-${emphasis}" data-label-key=${box.key} style=${labelStyle}>
        ${box.tone === "cat" ? b2`<span class="avatar-ring" style=${`--box-color:${box.color ?? "var(--primary-color)"}`}><span class="monogram" aria-hidden="true">${text.trim().charAt(0).toUpperCase()}</span>${box.avatar ? b2`<kibble-image .hass=${this.hass} .asset=${box.avatar} .cache=${this.cache} alt=""></kibble-image>` : A}</span>` : box.tone === "unknown" ? b2`<span class="unknown-avatar">?</span>` : A}
        <span class="label-text">${text}</span>
      </span>` : A}`;
  }
  static {
    this.styles = i`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      overflow: hidden;
      pointer-events: none;
      contain: layout paint;
    }
    .overlay {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .overlay.passive,
    .overlay.interactive {
      pointer-events: none;
    }
    .picker {
      position: absolute;
      z-index: 20;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: min(264px, calc(100% - 16px));
      max-height: calc(100% - 16px);
      overflow: auto;
      padding: 6px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 14px;
      background: rgba(18, 18, 20, 0.94);
      color: #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(12px);
      pointer-events: auto;
      overscroll-behavior: contain;
    }
    .picker-option {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 48px;
      padding: 4px 8px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .picker-option kibble-avatar {
      flex: none;
      --kibble-avatar-size: 30px;
    }
    .picker-option[aria-pressed="true"] {
      background: rgba(255, 255, 255, 0.14);
    }
    .picker-option:focus-visible {
      outline: 2px solid var(--primary-color, #9c7bff);
      outline-offset: -2px;
    }
    .picker-option:disabled {
      opacity: 0.55;
      cursor: default;
    }
    .picker-check {
      margin-left: auto;
      color: var(--kibble-feed, #6fd398);
      font-weight: 700;
    }
    .box-wrap {
      position: absolute;
      box-sizing: border-box;
      pointer-events: none;
    }
    /* A solid box is a 2 px colour line between two thin dark lines, so it reads on bright day
     * scenes and on the dark purple night (IR) image alike. Cat colours are lifted toward white
     * for the line itself: the darker palette slots (plum) vanish on an IR frame otherwise. */
    .stroke {
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .tone-cat .stroke {
      border-color: color-mix(in srgb, var(--box-color) 68%, #fff);
    }
    .tone-unknown .stroke {
      border-color: rgba(255, 255, 255, 0.9);
    }
    .tone-not-cat .stroke {
      border-width: 1.5px;
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.78);
    }
    .tone-clutter .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.45);
      border-radius: 3px;
    }
    .tone-peer .stroke {
      border: 1px dashed rgba(255, 255, 255, 0.6);
      border-radius: 3px;
      box-shadow: none;
    }
    .box-wrap.emphasis-selected .stroke {
      border-width: 3px;
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--box-color) 40%, transparent), 0 0 0 1px rgba(0, 0, 0, 0.45),
        inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
    .box-wrap.emphasis-dim,
    .label.emphasis-dim {
      opacity: 0.45;
    }
    .hit {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      min-width: 48px;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      background: transparent;
      opacity: 0;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .box-wrap:focus-within .stroke {
      box-shadow: 0 0 0 3px var(--primary-text-color), 0 0 0 5px rgba(0, 0, 0, 0.65);
    }
    .label {
      position: absolute;
      z-index: 2;
      height: 22px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: min(240px, calc(100% - 4px));
      padding: 3px 8px 3px 3px;
      border-radius: 999px;
      background: rgba(18, 18, 20, 0.72);
      color: #fff;
      font: 600 12px/1.1 var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      will-change: left, top;
    }
    .avatar-ring,
    .unknown-avatar {
      width: 16px;
      height: 16px;
      flex: none;
      box-sizing: border-box;
      display: inline-grid;
      place-items: center;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-ring {
      position: relative;
      border: 1.5px solid var(--box-color);
      background: color-mix(in srgb, var(--box-color) 20%, #121214);
      color: var(--box-color);
    }
    .avatar-ring .monogram {
      position: absolute;
      inset: 0;
      z-index: 0;
      display: grid;
      place-items: center;
    }
    .avatar-ring kibble-image {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .monogram {
      font-size: 9px;
      line-height: 1;
      font-weight: 700;
    }
    .unknown-avatar {
      background: rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font-size: 11px;
      font-weight: 700;
    }
    .label-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tone-not-cat {
      color: rgba(255, 255, 255, 0.82);
    }
    @media (prefers-reduced-motion: no-preference) {
      .stroke {
        transition: border-color 150ms ease, border-width 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
      }
      .box-wrap {
        transition: left 250ms ease, top 250ms ease, width 250ms ease, height 250ms ease, opacity 150ms ease;
      }
      .label {
        transition: left 250ms ease, top 250ms ease, opacity 150ms ease;
      }
    }
  `;
  }
};
customElements.define("kibble-box-overlay", KibbleBoxOverlay);

// src/components/kibble-photo-viewer.ts
var FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
var AUTO_ADVANCE_MS = 350;
var SAVED_PULSE_MS = 700;
var SWIPE_MIN_PX = 48;
var KibblePhotoViewer = class extends i4 {
  constructor() {
    super();
    this._index = 0;
    /** Which chip choice is mid-save for the CURRENT photo, or `null` -- distinct from `busyUid`
     * (a sample uid) so the spinner lands on the exact tapped option, not just "some chip". */
    this._pendingOption = null;
    this._justSavedUid = null;
    this._closeRef = e5();
    this._touchStartX = 0;
    this._touchStartY = 0;
    this._keydownHandler = (event) => {
      if (!this.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        this._requestClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this._go(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        this._go(1);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...this.renderRoot.querySelectorAll(FOCUSABLE_SELECTOR)];
      if (focusable.length === 0) {
        event.preventDefault();
        this._closeRef.value?.focus();
        return;
      }
      const active = this.renderRoot.querySelector(":focus");
      const currentIndex = active ? focusable.indexOf(active) : -1;
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
      }
    };
    this._requestClose = () => {
      this.dispatchEvent(new CustomEvent("viewer-close-requested", { bubbles: true, composed: true }));
    };
    this._onTouchStart = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      this._touchStartX = touch.clientX;
      this._touchStartY = touch.clientY;
    };
    this._onTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - this._touchStartX;
      const dy = touch.clientY - this._touchStartY;
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      this._go(dx < 0 ? 1 : -1);
    };
    this._requestBoxesVisibility = () => {
      this.dispatchEvent(new CustomEvent("boxes-visibility-requested", { detail: { visible: !this.showBoxes }, bubbles: true, composed: true }));
    };
    this.open = false;
    this.cats = [];
    this.samples = [];
    this.initialIndex = 0;
    this.event = null;
    this.busyUid = null;
    this.error = null;
    this.showBoxes = true;
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      hass: { attribute: false },
      cache: { attribute: false },
      cats: { attribute: false },
      samples: { attribute: false },
      initialIndex: { type: Number },
      event: { attribute: false },
      busyUid: { attribute: false },
      error: { type: String },
      showBoxes: { type: Boolean },
      _index: { state: true },
      _justSavedUid: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    clearTimeout(this._justSavedTimer);
    clearTimeout(this._advanceTimer);
  }
  willUpdate(changed) {
    if (changed.has("open") && this.open) {
      this._index = this.initialIndex;
      this._justSavedUid = null;
      this._pendingOption = null;
    }
    if (changed.has("busyUid")) {
      const previous = changed.get("busyUid");
      this._pendingOption = null;
      if (previous && this.busyUid === null && !this.error && this.samples[this._index]?.uid === previous) {
        this._flashSaved(previous);
      }
    }
  }
  updated(changed) {
    if (changed.has("open") && this.open) this._closeRef.value?.focus();
  }
  _flashSaved(uid) {
    clearTimeout(this._justSavedTimer);
    this._justSavedUid = uid;
    this._justSavedTimer = setTimeout(() => {
      this._justSavedUid = null;
    }, SAVED_PULSE_MS);
    clearTimeout(this._advanceTimer);
    this._advanceTimer = setTimeout(() => {
      if (this._index < this.samples.length - 1) this._go(1);
    }, AUTO_ADVANCE_MS);
  }
  _go(delta) {
    const next = this._index + delta;
    if (next < 0 || next >= this.samples.length) return;
    this._index = next;
    this._justSavedUid = null;
  }
  _catColor(name) {
    const cat = this.cats.find((c5) => c5.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }
  _photoOverlayBoxes(sample) {
    if (!sample.body || !sample.box || !sample.crop) return [];
    const ownBox = boxInCrop(sample.box, sample.crop);
    if (!ownBox) return [];
    const name = sample.label ?? sample.guess;
    const tone = name === "not_a_cat" ? "not-cat" : name && name !== "skip" ? "cat" : "unknown";
    const cat = tone === "cat" ? this.cats.find((candidate) => candidate.name === name) : null;
    return [
      { key: "sample:" + sample.uid, box: ownBox, tone, label: name && name !== "not_a_cat" && name !== "skip" ? name : tone === "not-cat" ? "Not a cat" : "Who?", color: name && name !== "not_a_cat" && name !== "skip" ? this._catColor(name) : void 0, avatar: cat?.avatar ?? null },
      ...sample.peers.flatMap((peer, index) => {
        const box = boxInCrop(peer, sample.crop);
        return box ? [{ key: "peer:" + sample.uid + ":" + index, box, tone: "peer" }] : [];
      })
    ];
  }
  render() {
    if (!this.open) return A;
    const sample = this.samples[this._index];
    if (!sample) return A;
    const total = this.samples.length;
    const image = sample.body ?? sample.face;
    const faceInset = sample.body && sample.face ? sample.face : null;
    const busy = this.busyUid !== null;
    return b2`
      <div class="scrim" role="dialog" aria-modal="true" aria-label=${`Photo ${this._index + 1} of ${total}`} @click=${this._requestClose}>
        <div class="panel" @click=${(e6) => e6.stopPropagation()} @touchstart=${this._onTouchStart} @touchend=${this._onTouchEnd}>
          <div class="panel-top">
            <span class="counter">${this._index + 1} / ${total}</span>
            <button type="button" class="close" ${n5(this._closeRef)} aria-label="Close photo" @click=${this._requestClose}>${mdiIcon("close")}</button>
          </div>
          <div class="stage">
            ${image ? b2`<div class="image-frame"><kibble-image .hass=${this.hass} .asset=${image} .cache=${this.cache} alt="" fit="contain"></kibble-image>${sample.body && this.showBoxes ? b2`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(sample)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : A}</div>` : A}
            ${sample.body && sample.box && sample.crop ? b2`<button type="button" class="box-toggle" aria-pressed=${this.showBoxes} aria-label=${this.showBoxes ? "Hide boxes" : "Show boxes"} @click=${this._requestBoxesVisibility}>${mdiIcon(this.showBoxes ? "eye" : "eyeOff")}</button>` : A}
            ${faceInset ? b2`<span class="face-inset"><kibble-image .hass=${this.hass} .asset=${faceInset} .cache=${this.cache} alt="" rounded></kibble-image></span>` : A}
            <button type="button" class="nav prev" aria-label="Previous photo" ?disabled=${this._index === 0} @click=${() => this._go(-1)}>
              <span class="chevron chevron-left">${mdiIcon("chevronDown")}</span>
            </button>
            <button type="button" class="nav next" aria-label="Next photo" ?disabled=${this._index === total - 1} @click=${() => this._go(1)}>
              <span class="chevron chevron-right">${mdiIcon("chevronDown")}</span>
            </button>
          </div>
          <div class="chip-row" role="group" aria-label="Who is this, in this photo">
            ${this.cats.map((cat) => this._renderChoice(cat.name, cat, sample, busy))}
            ${this._renderChoice("not_a_cat", null, sample, busy)}
            ${this._renderChoice("skip", null, sample, busy)}
          </div>
          ${this.error ? b2`<p class="viewer-error">${this.error}</p>` : A}
        </div>
      </div>
    `;
  }
  _choiceState(option, sample) {
    if (option === "skip") return sample.review === "skip" ? "confirmed" : "neutral";
    if (sample.review !== null) return sample.review === option ? "confirmed" : "neutral";
    if (sample.label === option) return "suggested";
    return "neutral";
  }
  _renderChoice(option, cat, sample, rowBusy) {
    const state = this._choiceState(option, sample);
    const pending = rowBusy && this.busyUid === sample.uid && this._pendingOption === option;
    const justSaved = this._justSavedUid === sample.uid && state === "confirmed";
    const label = cat ? cat.name : option === "skip" ? "Don\u2019t use" : "Not a cat";
    return b2`
      <button
        type="button"
        class="choice choice-${state}"
        aria-pressed=${state === "confirmed"}
        style=${cat ? `--chip-color:${this._catColor(cat.name)}` : ""}
        ?disabled=${rowBusy}
        @click=${() => this._choose(option, sample)}
      >
        <span class="choice-glyph">
          ${option === "skip" ? mdiIcon("eyeOff") : cat ? b2`<kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>` : b2`<kibble-avatar .name=${null}></kibble-avatar>`}
          ${pending ? b2`<span class="choice-spinner">${mdiIcon("refresh")}</span>` : state === "confirmed" ? b2`<span class="choice-check ${justSaved ? "just-saved" : ""}">${mdiIcon("check")}</span>` : A}
        </span>
        <span class="choice-label">${label}</span>
      </button>
    `;
  }
  _choose(option, sample) {
    const follows = this.event?.identity === "reviewed" && this.event.cat === option;
    this._pendingOption = option;
    this.dispatchEvent(
      new CustomEvent("sample-label-requested", { detail: { sampleUid: sample.uid, label: follows ? "follow" : option }, bubbles: true, composed: true })
    );
  }
  static {
    this.styles = i`
    :host {
      display: contents;
    }
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 1100;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: stretch;
      justify-content: center;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .scrim {
        align-items: center;
        padding: 24px;
      }
    }
    .panel {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background: #000;
      overflow: hidden;
    }
    @media (min-width: 600px) {
      .panel {
        width: min(720px, 92vw);
        max-height: min(760px, 92vh);
        border-radius: 16px;
      }
    }
    .panel-top {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: max(12px, env(safe-area-inset-top)) 12px 8px;
    }
    .counter {
      font-size: 13px;
      font-variant-numeric: tabular-nums;
      color: rgba(255, 255, 255, 0.75);
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .stage {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
    }
    .stage kibble-image {
      width: 100%;
      height: 100%;
    }
    .image-frame {
      position: relative;
      flex: 0 1 auto;
      width: min(100%, 62vh);
      max-height: 100%;
      aspect-ratio: 1;
    }
    .image-frame kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 8;
      top: 8px;
      right: 20px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }
    .face-inset {
      position: absolute;
      left: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    .face-inset kibble-image {
      width: 100%;
      height: 100%;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
    }
    .nav:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .nav.prev {
      left: 12px;
    }
    .nav.next {
      right: 12px;
    }
    .chevron-left {
      display: inline-flex;
      transform: rotate(90deg);
    }
    .chevron-right {
      display: inline-flex;
      transform: rotate(-90deg);
    }
    /* The chip row is its own solid HA-theme surface, deliberately distinct from the black
     * photo-viewing chrome above it (image on top, flexing; chips beneath, never overlapping)
     * -- the theme tokens are what keep the labels legible in both light and dark, exactly like
     * every other chip in this card set, rather than a fixed light-on-dark scheme that only
     * worked against a black backdrop. */
    .chip-row {
      flex-shrink: 0;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 12px max(10px, env(safe-area-inset-bottom));
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice {
      flex: 1 1 0;
      min-width: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 2px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 11px;
      cursor: pointer;
      min-height: 44px;
    }
    .choice:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .choice-suggested {
      border-style: dashed;
      border-color: var(--chip-color, var(--secondary-text-color));
      background: none;
    }
    .choice-confirmed {
      border-color: var(--chip-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--chip-color, var(--secondary-text-color)) 18%, transparent);
    }
    .choice-glyph {
      position: relative;
      width: 30px;
      height: 30px;
    }
    .choice-glyph kibble-avatar {
      --kibble-avatar-size: 30px;
    }
    .choice-glyph > svg {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      color: var(--secondary-text-color);
      padding: 6px;
      box-sizing: border-box;
    }
    .choice-check,
    .choice-spinner {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .choice-spinner {
      background: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      color: #fff;
    }
    @media (prefers-reduced-motion: no-preference) {
      .choice-spinner svg {
        animation: kibble-viewer-spin 0.9s linear infinite;
      }
      .choice-check.just-saved {
        animation: kibble-viewer-pop 400ms ease;
      }
    }
    @keyframes kibble-viewer-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-viewer-pop {
      0% {
        transform: scale(0.4);
      }
      60% {
        transform: scale(1.25);
      }
      100% {
        transform: scale(1);
      }
    }
    .choice-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .viewer-error {
      flex-shrink: 0;
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.25);
      color: #ffb4ac;
      font-size: 13px;
    }
    .box-toggle:focus-visible,
    .close:focus-visible,
    .nav:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    .choice:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-photo-viewer", KibblePhotoViewer);

// src/components/kibble-label-sheet.ts
var FOCUSABLE_SELECTOR2 = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
var CLIP_SIGN_EXPIRES_S = 3600;
var MEDIA_ASPECT = 1.6;
var PHOTOS_VISIBLE_CAP = 12;
var PHOTO_SKELETON_COUNT = 6;
var LABEL_SAVED_PULSE_MS = 700;
var BOXES_STORAGE_KEY = "kibble:show-boxes";
var BOXES_CHANGE_EVENT = "kibble-boxes-visibility-changed";
function readBoxesVisible() {
  try {
    return localStorage.getItem(BOXES_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}
var KibbleLabelSheet = class extends i4 {
  constructor() {
    super();
    /** Which chip was tapped, mid-save -- cleared once `busy` resolves either way. */
    this._pendingLabel = null;
    /** Briefly set to a label right after its save lands, so that chip's check badge pops in. */
    this._justSavedLabel = null;
    /** The unsaved answer being built in this sheet; `null` = untouched (derived from the saved
     * session each render). Reset whenever the session detail changes underneath it. */
    this._draft = null;
    /** Whether the photo grid shows every sample or just the first dozen behind a "+N" tile. */
    this._photosExpanded = false;
    /** Which sample index the photo viewer is open on, or `null`. */
    this._viewerIndex = null;
    /** The scene photo shown full screen, or `null`. */
    this._zoom = null;
    /** The event a photos-grid/viewer/zoom UI state was last built for -- resets all of it the
     * moment a *different* event's sheet opens (a fresh open, or the pager), so nothing stale
     * carries over. */
    this._lastEventUid = null;
    this._beforeRef = new AssetRef();
    this._afterRef = new AssetRef();
    this._sceneRef = new AssetRef();
    this._closeButtonRef = e5();
    this._videoRef = e5();
    /** The signed clip URL once the user tapped play, or `null` for the photo/poster state. */
    this._clipSrc = null;
    /** Set when the `<video>` itself errors (a 404: the clip aged out of Scrypted's own quota
     * after it was linked) -- reverts quietly to the photo and hides the play button, per
     * `docs/39-eating-clips.md`, rather than showing a broken player. */
    this._clipError = false;
    /** The event `_clipSrc`/`_clipError` belong to -- resets both the moment the sheet closes or
     * shows a different event, so a later re-open of the SAME event always starts back at the
     * poster, never resumes mid-playback. */
    this._clipEventUid = null;
    this._keydownHandler = (event) => {
      if (!this.open) return;
      if (event.key === "Escape" && event.composedPath().some((target) => target instanceof Element && target.matches(".picker"))) return;
      if (this._viewerIndex !== null) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (this._zoom) this._zoom = null;
        else this._close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...this.renderRoot.querySelectorAll(FOCUSABLE_SELECTOR2)];
      if (focusable.length === 0) {
        event.preventDefault();
        this._closeButtonRef.value?.focus();
        return;
      }
      const active = this.renderRoot.querySelector(":focus");
      const currentIndex = active ? focusable.indexOf(active) : -1;
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
      }
    };
    this._onSharedBoxesChange = (event) => {
      const visible = event.detail?.visible;
      if (typeof visible === "boolean") this._showBoxes = visible;
    };
    this._onStorage = (event) => {
      if (event.key === BOXES_STORAGE_KEY) this._showBoxes = event.newValue !== "false";
    };
    this._toggleBoxes = () => this._setBoxesVisible(!this._showBoxes);
    /** Naming a box on the photo only changes the draft, exactly like ticking a chip. */
    this._onSubjectLabelSelected = (request) => {
      const event = this.summary;
      if (!event) return;
      const draft = this._draft ?? draftFrom(this._sessionCatsFor(event), event.identity);
      this._draft = nameDraftSubject(draft, request.detail.sid, request.detail.label, event.kind === "eat");
    };
    this._onBoxesVisibilityRequested = (request) => {
      const visible = request.detail?.visible;
      if (typeof visible === "boolean") this._setBoxesVisible(visible);
    };
    this._onViewerClose = () => {
      this._viewerIndex = null;
    };
    this._retrySamples = () => {
      this.dispatchEvent(new CustomEvent("samples-retry-requested", { bubbles: true, composed: true }));
    };
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
    };
    this.open = false;
    this.cats = [];
    this.summary = null;
    this.samples = null;
    this.samplesFailed = false;
    this.group = [];
    this.groupTogether = false;
    this.busy = false;
    this.error = null;
    this.sampleBusyUid = null;
    this.sceneSubjects = [];
    this.sessionCats = null;
    this.multipleCats = false;
    this._showBoxes = readBoxesVisible();
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      hass: { attribute: false },
      entryId: { type: String },
      cache: { attribute: false },
      cats: { attribute: false },
      summary: { attribute: false },
      samples: { attribute: false },
      sceneSubjects: { attribute: false },
      sessionCats: { attribute: false },
      multipleCats: { type: Boolean },
      samplesFailed: { type: Boolean },
      group: { attribute: false },
      groupTogether: { type: Boolean },
      busy: { type: Boolean },
      error: { type: String },
      sampleBusyUid: { attribute: false },
      _pendingLabel: { state: true },
      _justSavedLabel: { state: true },
      _photosExpanded: { state: true },
      _viewerIndex: { state: true },
      _zoom: { state: true },
      _clipSrc: { state: true },
      _clipError: { state: true },
      _showBoxes: { state: true },
      _draft: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
    window.addEventListener(BOXES_CHANGE_EVENT, this._onSharedBoxesChange);
    window.addEventListener("storage", this._onStorage);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    window.removeEventListener(BOXES_CHANGE_EVENT, this._onSharedBoxesChange);
    window.removeEventListener("storage", this._onStorage);
    this._beforeRef.dispose();
    this._afterRef.dispose();
    this._sceneRef.dispose();
    this._stopClipPlayback();
    clearTimeout(this._justSavedLabelTimer);
  }
  _setBoxesVisible(visible) {
    this._showBoxes = visible;
    try {
      localStorage.setItem(BOXES_STORAGE_KEY, String(visible));
    } catch {
    }
    window.dispatchEvent(new CustomEvent(BOXES_CHANGE_EVENT, { detail: { visible } }));
  }
  willUpdate(changed) {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    const event = this.summary;
    this._beforeRef.sync(this.hass, this.cache, event?.before, () => this.requestUpdate());
    this._afterRef.sync(this.hass, this.cache, event?.after, () => this.requestUpdate());
    this._sceneRef.sync(this.hass, this.cache, event?.scene ?? null, () => this.requestUpdate());
    const eventUid = event?.uid ?? null;
    if (eventUid !== this._lastEventUid) {
      this._lastEventUid = eventUid;
      this._photosExpanded = false;
      this._viewerIndex = null;
      this._zoom = null;
      this._pendingLabel = null;
      this._draft = null;
    }
    if (changed.has("sessionCats")) {
      this._draft = null;
    }
    if (changed.has("open") && !this.open || eventUid !== this._clipEventUid) {
      this._clipEventUid = eventUid;
      this._releaseClip();
    }
    if (changed.has("busy")) {
      const wasBusy = changed.get("busy");
      if (wasBusy && !this.busy) {
        if (!this.error && this._pendingLabel) this._flashSavedLabel(this._pendingLabel);
        this._pendingLabel = null;
      }
    }
  }
  _flashSavedLabel(label) {
    clearTimeout(this._justSavedLabelTimer);
    this._justSavedLabel = label;
    this._justSavedLabelTimer = setTimeout(() => {
      this._justSavedLabel = null;
    }, LABEL_SAVED_PULSE_MS);
  }
  render() {
    const event = this.summary;
    if (!this.open || !event) return A;
    const sessionCats = this._sessionCatsFor(event);
    const draft = this._draft ?? draftFrom(sessionCats, event.identity);
    const isFeed = event.kind === "feed";
    const locale = this.hass?.locale?.language ?? this.hass?.language;
    const ariaTitle = isFeed ? feedTitle(event) : this._draftTitle(event, draft);
    const stageKind = this._stageKind(event);
    return b2`
      <div class="backdrop" @click=${this._close}>
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${ariaTitle} @click=${(e6) => e6.stopPropagation()}>
          ${this._renderHeader(event, isFeed, locale, draft)}
          <div class="scroll">
            <div class="layout ${stageKind === "none" ? "no-media" : ""}">
              ${stageKind !== "none" ? b2`
                    <div class="media-col">
                      ${stageKind === "media" ? this._renderMediaStage(event) : this._renderCompare()}
                      ${stageKind === "media" && event.before && event.after ? this._renderCompare() : A}
                    </div>
                  ` : A}
              <div class="info-col">${!isFeed ? b2`${this._renderIdentity(event, sessionCats, draft)}${this._renderPhotos(event, sessionCats)}` : A}</div>
            </div>
          </div>
          ${!isFeed ? this._renderFooter(event, sessionCats, draft) : b2`<footer><button type="button" class="primary-btn" @click=${this._close}>Done</button></footer>`}
        </div>
        ${this._zoom ? this._renderZoom() : A}
      </div>
      <kibble-photo-viewer
        ?open=${this._viewerIndex !== null}
        .hass=${this.hass}
        .cache=${this.cache}
        .cats=${this.cats}
        .samples=${this.samples ?? []}
        .showBoxes=${this._showBoxes}
        @boxes-visibility-requested=${this._onBoxesVisibilityRequested}
        .initialIndex=${this._viewerIndex ?? 0}
        .event=${event}
        .busyUid=${this.sampleBusyUid}
        .error=${this.error}
        @viewer-close-requested=${this._onViewerClose}
      ></kibble-photo-viewer>
    `;
  }
  _catColor(name) {
    const cat = this.cats.find((c5) => c5.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }
  _sceneOverlayBoxes() {
    const drafted = this._draft?.subjects ?? {};
    return this.sceneSubjects.map((subject, index) => {
      const labelNow = subject.sid !== null && drafted[subject.sid] !== void 0 ? drafted[subject.sid] : subject.label;
      const name = labelNow && labelNow !== "not_a_cat" ? labelNow : null;
      const cat = name ? this.cats.find((candidate) => candidate.name === name) : null;
      const tone = name ? "cat" : labelNow === "not_a_cat" ? "not-cat" : "unknown";
      return {
        key: "scene:" + index,
        box: subject.box,
        tone,
        label: name ?? (tone === "not-cat" ? "Not a cat" : "Who?"),
        color: name ? this._catColor(name) : void 0,
        avatar: cat?.avatar ?? null,
        selectable: subject.sid !== null,
        subjectSid: subject.sid,
        subjectLabel: labelNow
      };
    });
  }
  _renderBoxesToggle() {
    return b2`<button type="button" class="box-toggle" aria-pressed=${this._showBoxes} aria-label=${this._showBoxes ? "Hide boxes" : "Show boxes"} @click=${(event) => {
      event.stopPropagation();
      this._toggleBoxes();
    }}>${mdiIcon(this._showBoxes ? "eye" : "eyeOff")}</button>`;
  }
  _photoOverlayBoxes(sample) {
    if (!sample.body || !sample.box || !sample.crop) return [];
    const ownBox = boxInCrop(sample.box, sample.crop);
    if (!ownBox) return [];
    const name = sample.label ?? sample.guess;
    const tone = name === "not_a_cat" ? "not-cat" : name && name !== "skip" ? "cat" : "unknown";
    const cat = tone === "cat" ? this.cats.find((candidate) => candidate.name === name) : null;
    return [
      { key: "sample:" + sample.uid, box: ownBox, tone, color: name && name !== "not_a_cat" && name !== "skip" ? this._catColor(name) : void 0, avatar: cat?.avatar ?? null },
      ...sample.peers.flatMap((peer, index) => {
        const box = boxInCrop(peer, sample.crop);
        return box ? [{ key: "peer:" + sample.uid + ":" + index, box, tone: "peer" }] : [];
      })
    ];
  }
  // ---- Header + pager ----
  _draftTitle(event, draft) {
    return sessionTitle(draft.cats, { identity: draft.notACat ? "not_a_cat" : "auto", open: event.open });
  }
  _renderHeader(event, isFeed, locale, draft) {
    const duration = eventDuration(event);
    const liveCat = draft.cats.find((cat) => cat.ate)?.cat ?? draft.cats[0]?.cat ?? event.cat;
    const color = liveCat ? this._catColor(liveCat) : null;
    const title = isFeed ? feedTitle(event) : this._draftTitle(event, draft);
    const index = this.group.findIndex((member) => member.uid === event.uid);
    return b2`
      <header>
        ${this.group.length > 1 && !this.groupTogether ? this._renderPager(index) : A}
        <div class="heading">
          <span class="title">${title}</span>
          <span class="meta">
            ${timeLabel(event.start, locale)}${duration ? b2` \u00b7 ${duration}` : A}
            ${event.open ? this._renderLiveBadge(color) : A}
          </span>
        </div>
        <button type="button" class="close" ${n5(this._closeButtonRef)} @click=${this._close} aria-label="Close">${mdiIcon("close")}</button>
      </header>
    `;
  }
  _renderLiveBadge(color) {
    return b2`
      <span class="live-badge" style="--dot-color:${color ?? "var(--kibble-live, #e5484d)"}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `;
  }
  _renderPager(index) {
    const total = this.group.length;
    return b2`
      <div class="pager">
        <button type="button" class="pager-btn" aria-label="Previous event" ?disabled=${index <= 0} @click=${() => this._goToGroupIndex(index - 1)}>
          <span class="chevron chevron-left">${mdiIcon("chevronDown")}</span>
        </button>
        <span class="pager-count">${index + 1} of ${total}</span>
        <button
          type="button"
          class="pager-btn"
          aria-label="Next event"
          ?disabled=${index === -1 || index >= total - 1}
          @click=${() => this._goToGroupIndex(index + 1)}
        >
          <span class="chevron chevron-right">${mdiIcon("chevronDown")}</span>
        </button>
      </div>
    `;
  }
  _goToGroupIndex(index) {
    const target = this.group[index];
    if (!target) return;
    this.dispatchEvent(new CustomEvent("event-requested", { detail: { uid: target.uid }, bubbles: true, composed: true }));
  }
  // ---- Media stage ----
  /** A clip needs its poster (the scene photo) to be playable in this UI at all -- the two are
   * always captured together in practice; this just keeps that assumption in one place. */
  _hasClip(event) {
    return event.kind === "eat" && Boolean(event.clip) && Boolean(event.scene) && !this._clipError;
  }
  _stageKind(event) {
    if (event.scene || this._hasClip(event)) return "media";
    if (event.before && event.after) return "compare";
    return "none";
  }
  _renderMediaStage(event) {
    if (this._clipSrc) {
      return b2`
        <div class="stage">
          <video
            ${n5(this._videoRef)}
            class="stage-video"
            controls
            playsinline
            autoplay
            preload="metadata"
            poster=${this._sceneRef.url ?? ""}
            src=${this._clipSrc}
            @loadedmetadata=${() => this._seekClip(event)}
            @error=${() => this._onClipError()}
          ></video>
        </div>
      `;
    }
    const asset = event.scene;
    const hasClip = this._hasClip(event);
    return b2`
      <div class="stage">
        ${asset ? b2`
              <button type="button" class="stage-zoom" aria-label="View photo full screen" @click=${() => {
      this._zoom = asset;
    }}>
                <kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt="" fit="contain"></kibble-image>
              </button>
              ${hasClip ? b2`
                    <button type="button" class="clip-play" aria-label="Play video" @click=${(e6) => {
      e6.stopPropagation();
      void this._playClip(event);
    }}>
                      ${mdiIcon("play")}
                    </button>
                  ` : A}
            ` : A}
        ${this._showBoxes && this.sceneSubjects.length ? b2`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>` : A}
        ${this.sceneSubjects.length ? this._renderBoxesToggle() : A}
      </div>
    `;
  }
  /** Signs `/api/kibble/<entry>/clip/<uid>` via HA's own `auth/sign_path` (the same mechanism
   * every other `requires_auth` view relies on) and swaps the poster/photo for a `<video>` at
   * that URL -- `docs/39-eating-clips.md`: the browser then streams and seeks it directly, no
   * headers required. Bails quietly (leaves the photo showing) if signing fails, or if the
   * sheet moved on to a different event while the WS round trip was still in flight. */
  async _playClip(event) {
    const hass = this.hass;
    const entryId = this.entryId;
    if (!hass?.callWS || !entryId || !event.clip) return;
    const path = `/api/kibble/${entryId}/clip/${event.uid}`;
    try {
      const result = await hass.callWS({ type: "auth/sign_path", path, expires: CLIP_SIGN_EXPIRES_S });
      if (this.summary?.uid !== event.uid) return;
      this._clipError = false;
      this._clipSrc = result.path;
    } catch {
      this._clipError = true;
    }
  }
  /** Seeks a just-loaded `<video>` to this session's own offset into the shared clip
   * (`lib/clip-offset.ts`) -- fired on `loadedmetadata`, once the browser actually knows the
   * clip's duration/seekable range. */
  _seekClip(event) {
    const video = this._videoRef.value;
    if (!video || !event.clip) return;
    video.currentTime = clipSeekOffsetSeconds(event.start, event.clip.start_ms);
  }
  /** The `<video>` errored (a 404: the clip aged out of Scrypted's own quota after it was
   * linked) -- reverts quietly to the photo and hides the play button. */
  _onClipError() {
    this._stopClipPlayback();
    this._clipError = true;
  }
  /** Releases the `<video>` element's connection (pause, drop `src`, `load()`) without
   * touching `_clipError` -- the shared mechanic both a quiet revert-on-error and a full
   * close/event-change reset (`_releaseClip`) build on. */
  _stopClipPlayback() {
    const video = this._videoRef.value;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    this._clipSrc = null;
  }
  /** Full reset back to the photo/poster state, error flag included -- sheet close or a switch
   * to a different event (`willUpdate`), so a later re-open always starts fresh. */
  _releaseClip() {
    this._stopClipPlayback();
    this._clipError = false;
  }
  _renderCompare() {
    return b2`<kibble-before-after class="compare" .beforeSrc=${this._beforeRef.url} .afterSrc=${this._afterRef.url} .aspect=${MEDIA_ASPECT}></kibble-before-after>`;
  }
  _renderZoom() {
    const event = this.summary;
    return b2`
      <div class="zoom" @click=${(e6) => {
      e6.stopPropagation();
      this._zoom = null;
    }}>
        <div class="zoom-scene" @click=${(e6) => e6.stopPropagation()}>
          <kibble-image .hass=${this.hass} .asset=${this._zoom} .cache=${this.cache} alt="" fit="contain"></kibble-image>
          ${event && this._showBoxes && this.sceneSubjects.length ? b2`<kibble-box-overlay .boxes=${this._sceneOverlayBoxes()} .hass=${this.hass} .cache=${this.cache} .cats=${this.cats} .busy=${this.busy} @subject-label-requested=${this._onSubjectLabelSelected}></kibble-box-overlay>` : A}
        </div>
        ${this.sceneSubjects.length ? this._renderBoxesToggle() : A}
        <button type="button" class="zoom-close" aria-label="Close photo" @click=${(e6) => {
      e6.stopPropagation();
      this._zoom = null;
    }}>${mdiIcon("close")}</button>
      </div>
    `;
  }
  // ---- Identity ----
  _sessionCatsFor(event) {
    if (this.sessionCats) return this.sessionCats;
    if (!event.cat) return [];
    return [{ cat: event.cat, ate: event.kind === "eat", confirmed: event.identity === "reviewed", confidence: event.confidence ?? null, photos: event.sample_count ?? 0 }];
  }
  _requestSessionLabel(request, pendingLabel, closeOnSuccess = false) {
    this._pendingLabel = pendingLabel;
    this.dispatchEvent(new CustomEvent("session-label-requested", {
      detail: { ...request, pendingLabel, closeOnSuccess },
      bubbles: true,
      composed: true
    }));
  }
  _setDraft(event, update) {
    if (this.busy) return;
    this._draft = update(this._draft ?? draftFrom(this._sessionCatsFor(event), event.identity));
  }
  _renderIdentity(event, saved, draft) {
    const isMeal = event.kind === "eat";
    return b2`
      <div class="identity">
        <div class="identity-heading">
          <span class="identity-title">Who was here?</span>
          <span class="identity-hint ${this.multipleCats && draft.cats.length < 2 && !draft.notACat ? "identity-hint-multiple" : ""}">${this.multipleCats && draft.cats.length < 2 && !draft.notACat ? "Looks like more than one cat. Tap everyone who was here" : "Tap everyone who was here"}</span>
        </div>
        <div class="chip-grid" role="group" aria-label="Who was here?">
          ${this.cats.map((cat) => this._renderIdentityChip(cat, event, saved, draft))}
          ${this._renderNotACatChip(event, draft)}
        </div>
        ${isMeal && draft.cats.length >= 2 ? b2`<div class="meal-roles" role="group" aria-label="Who ate?">${draft.cats.map((cat) => b2`
          <div class="meal-role"><span class="meal-cat">${cat.cat}</span><div class="meal-role-options" role="group" aria-label=${cat.cat}>
            <button type="button" aria-pressed=${cat.ate} ?disabled=${this.busy} @click=${() => this._setDraft(event, (d3) => setDraftAte(d3, cat.cat, true))}>Ate</button>
            <button type="button" aria-pressed=${!cat.ate} ?disabled=${this.busy} @click=${() => this._setDraft(event, (d3) => setDraftAte(d3, cat.cat, false))}>Came by</button>
          </div></div>`)}</div>` : A}
        <button type="button" class="not-sure" aria-pressed=${event.identity === "unknown"} ?disabled=${this.busy || event.identity === "unknown"} @click=${() => this._requestSessionLabel({ uid: event.uid, verdict: "unknown" }, "unknown", true)}>Not sure</button>
        ${this.error ? b2`<p class="identity-error">${this.error}</p>` : A}
      </div>
    `;
  }
  _renderIdentityChip(cat, event, saved, draft) {
    const state = draftChipState(draft, saved, cat.name);
    const ticked = state !== "neutral";
    return b2`
      <button type="button" class="chip chip-${state}" aria-pressed=${ticked} style=${`--chip-color:${this._catColor(cat.name)}`} ?disabled=${this.busy} @click=${() => this._setDraft(event, (d3) => toggleDraftCat(d3, cat.name, event.kind === "eat"))}>
        <span class="chip-avatar">
          <kibble-avatar .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this.cache}></kibble-avatar>
          ${ticked ? b2`<span class="chip-check">${mdiIcon("check")}</span>` : A}
        </span>
        <span class="chip-label">${cat.name}</span>
      </button>`;
  }
  _renderNotACatChip(event, draft) {
    const state = draft.notACat ? "confirmed" : "neutral";
    return b2`
      <button type="button" class="chip chip-${state}" aria-pressed=${draft.notACat} ?disabled=${this.busy} @click=${() => this._setDraft(event, toggleDraftNotACat)}>
        <span class="chip-avatar">
          <kibble-avatar .name=${null}></kibble-avatar>
          ${draft.notACat ? b2`<span class="chip-check">${mdiIcon("check")}</span>` : A}
        </span>
        <span class="chip-label">Not a cat</span>
      </button>`;
  }
  // ---- Photos ----
  _renderPhotos(_event, cats) {
    if (this.samplesFailed) return b2`<div class="photos"><div class="photos-heading">Photos</div><p class="photos-error"><span>Couldn't load photos.</span> <button type="button" @click=${this._retrySamples}>Retry</button></p></div>`;
    if (this.samples === null) return b2`<div class="photos"><div class="photos-heading">Photos</div><div class="photos-grid">${Array.from({ length: PHOTO_SKELETON_COUNT }, () => b2`<div class="photo-skeleton"></div>`)}</div></div>`;
    if (this.samples.length === 0) return A;
    const sections = groupSessionPhotos(this.samples, cats);
    if (sections.length === 0) return b2`<div class="photos"><div class="photos-heading"><span>Photos</span><span class="photos-count">${this.samples.length}</span></div>${this._renderPhotoGrid(this.samples)}</div>`;
    return b2`<div class="photos">${sections.map((section) => b2`
      <section class="photo-section" aria-label=${section.cat + " photos"}>
        <div class="photos-heading"><span><span class="photo-section-dot" style=${"--section-color:" + (this._catColor(section.cat) ?? "var(--secondary-text-color)")}></span>${section.cat}</span><span class="photos-count">${section.samples.length}</span></div>
        ${this._renderPhotoGrid(section.samples)}
      </section>`)}</div>`;
  }
  _renderPhotoGrid(photos) {
    const expanded = this._photosExpanded || photos.length <= PHOTOS_VISIBLE_CAP;
    const visible = expanded ? photos : photos.slice(0, PHOTOS_VISIBLE_CAP);
    const remaining = photos.length - PHOTOS_VISIBLE_CAP;
    return b2`<div class="photos-grid">
      ${visible.map((sample) => this._renderPhotoTile(sample, this.samples.findIndex((item) => item.uid === sample.uid)))}
      ${!expanded ? b2`<button type="button" class="photo-tile photo-more" @click=${() => {
      this._photosExpanded = true;
    }}>+${remaining}</button>` : A}
    </div>`;
  }
  _sampleBadge(sample) {
    if (sample.review === null) return null;
    if (sample.review === "skip") return { kind: "skip" };
    if (sample.review === "not_a_cat") return { kind: "not_a_cat" };
    if (sample.review !== sample.cat) return { kind: "cat", name: sample.review, cat: this.cats.find((cat) => cat.name === sample.review) ?? null };
    return null;
  }
  _renderPhotoTile(sample, index) {
    const asset = sample.body ?? sample.face;
    const badge = this._sampleBadge(sample);
    const dimmed = badge !== null && badge.kind !== "cat";
    return b2`
      <button type="button" class="photo-tile ${dimmed ? "dim" : ""}" aria-label=${`Photo ${index + 1} of ${this.samples.length}`} @click=${() => {
      this._viewerIndex = index;
    }}>
        ${asset ? b2`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt=""></kibble-image>` : b2`<span class="photo-neutral">${catSilhouette()}</span>`}
        ${badge ? this._renderPhotoBadge(badge) : A}
        ${this._showBoxes && sample.body && sample.box && sample.crop ? b2`<kibble-box-overlay .boxes=${this._photoOverlayBoxes(sample)} .hass=${this.hass} .cache=${this.cache}></kibble-box-overlay>` : A}
      </button>`;
  }
  _renderPhotoBadge(badge) {
    if (badge.kind === "cat") return b2`<span class="photo-badge photo-badge-avatar"><kibble-avatar .hass=${this.hass} .name=${badge.name} .colorIndex=${badge.cat?.color ?? null} .asset=${badge.cat?.avatar ?? null} .cache=${this.cache}></kibble-avatar></span>`;
    return b2`<span class="photo-badge photo-badge-icon">${mdiIcon(badge.kind === "skip" ? "eyeOff" : "close")}</span>`;
  }
  // ---- Footer ----
  _renderFooter(event, saved, draft) {
    const action = confirmAction(draft, saved, event.identity);
    const onClick = action.kind === "save" ? () => this._requestSessionLabel({ uid: event.uid, ...action.request }, "confirm", true) : this._close;
    return b2`<footer><button type="button" class="primary-btn" ?disabled=${this.busy || action.kind === "blocked"} @click=${onClick}>${this.busy && action.kind === "save" ? "Saving" : action.text}</button></footer>`;
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
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .backdrop {
        align-items: center;
        padding: 24px;
      }
    }
    .sheet {
      width: 100%;
      max-width: 600px;
      max-height: 92vh;
      max-height: 94dvh;
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 16px 16px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 600px) {
      .sheet {
        border-radius: 16px;
      }
    }
    @media (min-width: 900px) {
      .sheet {
        max-width: 1040px;
      }
    }
    header {
      position: relative;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 16px 0;
    }
    header .close {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    .heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding-right: 52px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .live-badge {
      position: relative;
      width: 12px;
      height: 12px;
      flex: none;
    }
    .live-core {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--dot-color);
    }
    .live-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid var(--dot-color);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .live-pulse {
        animation: kibble-sheet-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-sheet-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .close {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .pager {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
    }
    .pager-btn {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }
    .pager-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .chevron {
      display: inline-flex;
    }
    .chevron-left {
      transform: rotate(90deg);
    }
    .chevron-right {
      transform: rotate(-90deg);
    }
    .pager-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .close:focus-visible,
    .pager-btn:focus-visible,
    .chip:focus-visible,
    .not-sure:focus-visible,
    .photo-tile:focus-visible,
    .primary-btn:focus-visible,
    .stage-zoom:focus-visible,
    .box-toggle:focus-visible,
    .zoom-close:focus-visible,
    .clip-play:focus-visible,
    .photos-error button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-areas: "media" "info";
      gap: 16px;
      padding: 14px 16px 16px;
    }
    .layout.no-media {
      grid-template-areas: "info";
    }
    @media (min-width: 900px) {
      .layout {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
        grid-template-areas: "media info";
        align-items: start;
      }
      .layout.no-media {
        grid-template-columns: 1fr;
        grid-template-areas: "info";
        max-width: 560px;
        margin: 0 auto;
        width: 100%;
      }
    }
    .media-col {
      grid-area: media;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 0;
    }
    .media-col > * {
      flex-shrink: 0;
    }
    .info-col {
      grid-area: info;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .info-col > * {
      flex-shrink: 0;
    }
    /* A plain flex sibling of .scroll, never position: sticky -- it sits at the true bottom
     * of the sheet's own flex column, outside the scrolling region entirely, so it can never
     * produce a sticky-positioning compositing seam against the rounded/scrolling content
     * above it. Stays visible whether the sheet's content is short (its natural position) or
     * tall enough that .scroll takes up the remaining space (still the last thing in flow). */
    footer {
      flex-shrink: 0;
      padding: 10px 16px 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .primary-btn {
      width: 100%;
      min-height: 48px;
      border: none;
      border-radius: 12px;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }
    .primary-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .stage {
      position: relative;
      width: 100%;
      aspect-ratio: 1.6;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .box-toggle {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      font: inherit;
      cursor: pointer;
      backdrop-filter: blur(8px);
    }
    .box-toggle svg {
      width: 22px;
      height: 22px;
    }

    .stage-zoom {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      cursor: zoom-in;
    }
    .stage-zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .stage-video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }
    .clip-play {
      all: unset;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      box-sizing: border-box;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
    @media (hover: hover) {
      .clip-play:hover {
        background: rgba(0, 0, 0, 0.7);
      }
    }
    .compare {
      width: 100%;
    }
    .zoom {
      all: unset;
      position: fixed;
      inset: 0;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.92);
      cursor: zoom-out;
    }
    .zoom kibble-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .zoom {
      cursor: zoom-out;
    }
    .zoom-scene {
      position: relative;
      width: min(calc(100vw - 24px), calc((100dvh - 24px) * 1.6));
      aspect-ratio: 1.6;
      cursor: default;
    }
    .zoom-close {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      z-index: 12;
      top: max(12px, env(safe-area-inset-top));
      left: 12px;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      cursor: pointer;
    }


    .identity {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .identity-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .identity-title {
      font-size: var(--kibble-text-body, 14px);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .identity-hint {
      font-size: var(--kibble-text-caption, 12px);
      color: var(--secondary-text-color);
    }
    .identity-hint-multiple {
      color: var(--warning-color, #f4a452);
      font-weight: 500;
    }
    .chip-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip {
      flex: 1 1 72px;
      min-width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 4px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      min-height: 48px;
    }
    .chip:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .chip-suggested {
      border-style: dashed;
      border-color: var(--chip-color, var(--secondary-text-color));
      background: none;
    }
    .chip-confirmed {
      border-color: var(--chip-color, var(--secondary-text-color));
      background: color-mix(in srgb, var(--chip-color, var(--secondary-text-color)) 18%, transparent);
    }
    .chip-avatar {
      position: relative;
    }
    .chip-avatar kibble-avatar {
      --kibble-avatar-size: 34px;
    }
    .chip-check,
    .chip-spinner {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .chip-spinner {
      background: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      color: #fff;
    }
    @media (prefers-reduced-motion: no-preference) {
      .chip-spinner svg {
        animation: kibble-sheet-spin 0.9s linear infinite;
      }
      .chip-check.just-saved {
        animation: kibble-sheet-check-pop 400ms ease;
      }
    }
    @keyframes kibble-sheet-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes kibble-sheet-check-pop {
      0% {
        transform: scale(0.4);
      }
      60% {
        transform: scale(1.25);
      }
      100% {
        transform: scale(1);
      }
    }
    .chip-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .not-sure {
      align-self: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;
      min-height: 48px;
      padding: 0 8px;
    }
    .not-sure:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .meal-roles {
      display: grid;
      gap: 6px;
      padding-top: 4px;
    }
    .meal-role {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
    }
    .meal-cat {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
    }
    .meal-role-options {
      display: flex;
      gap: 4px;
    }
    .meal-role-options button {
      min-width: 72px;
      min-height: 48px;
      padding: 0 8px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .meal-role-options button[aria-pressed="true"] {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    }
    .meal-role-options button:disabled {
      cursor: default;
    }
    .identity-error {
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photo-section-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--section-color);
    }
    .photos {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .photos-heading {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .photos-count {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 8px;
    }
    .photo-tile {
      position: relative;
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .photo-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .photo-tile.dim kibble-image {
      filter: grayscale(1);
      opacity: 0.55;
    }
    .photo-neutral {
      display: block;
      width: 56%;
      height: 56%;
      margin: 22% auto;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .photo-more {
      display: flex;
      align-items: center;
      justify-content: center;
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .photo-badge {
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      pointer-events: none;
    }
    .photo-badge-avatar {
      width: 22px;
      height: 22px;
    }
    .photo-badge-avatar kibble-avatar {
      --kibble-avatar-size: 22px;
    }
    .photo-badge-icon {
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .photo-skeleton {
      aspect-ratio: 1;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    @media (prefers-reduced-motion: no-preference) {
      .photo-skeleton {
        animation: kibble-sheet-skeleton-pulse 1.2s ease-in-out infinite;
      }
    }
    @keyframes kibble-sheet-skeleton-pulse {
      0%,
      100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
    .photos-error {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .photos-error button {
      flex: none;
      border: 1px solid currentColor;
      background: none;
      color: inherit;
      border-radius: 8px;
      padding: 4px 10px;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      min-height: 32px;
    }
  `;
  }
};
customElements.define("kibble-label-sheet", KibbleLabelSheet);

// src/timeline-editor.ts
var SCHEMA2 = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } },
  { name: "limit", selector: { number: { min: 1, mode: "box" } } }
];
var FIELD_LABELS2 = {
  device_id: "Kibble device",
  name: "Name (optional)",
  limit: "Rows before \u201CShow more\u201D (optional, default 30)"
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
customElements.define("kibble-timeline-card-editor", KibbleTimelineCardEditor);

// src/kibble-timeline-card.ts
var EMPTY_ENTITIES = { deviceId: "", catPresence: [] };
var DEFAULT_LIMIT = 30;
var KibbleTimelineCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES;
    this._timelineFeed = new TimelineFeed(() => this.requestUpdate());
    this._imageCache = new ImageUrlCache();
    this._catsQuery = new WsQuery(() => this.requestUpdate());
    this._detailGeneration = 0;
    this._sheetTrigger = null;
    this._sentinelRef = e5();
    this._railRef = e5();
    this._sentinelObserver = null;
    this._observedSentinel = null;
    this._observedSentinelCapped = null;
    /** The newest uid already rendered once; only new live rows get the entrance animation. */
    this._newestKnownUid = null;
    this._animateUids = /* @__PURE__ */ new Set();
    /** Session answers saved while the sheet is open, reduced to one toast on close. */
    this._sheetReviewedEvents = /* @__PURE__ */ new Map();
    this._sheetPhotoUids = /* @__PURE__ */ new Set();
    this._onRailScroll = () => {
      this._updateEdges();
    };
    this._onEventRequested = (event) => {
      this._loadEventDetail(event.detail.uid);
    };
    this._onSamplesRetryRequested = () => {
      const uid = this._sheetSummary?.uid;
      if (uid) this._loadEventDetail(uid);
    };
    this._closeSheet = () => {
      const message = reviewSummaryMessage({ events: [...this._sheetReviewedEvents.values()], photosUpdated: this._sheetPhotoUids.size }, this._locale());
      this._sheetSummary = null;
      this._sheetSamples = null;
      this._sheetSceneSubjects = [];
      this._sheetSessionCats = null;
      this._sheetMultipleCats = false;
      this._sheetSamplesFailed = false;
      this._sheetSampleBusyUid = null;
      this._sheetGroup = [];
      this._sheetTogether = false;
      this._sheetError = null;
      this._sheetReviewedEvents = /* @__PURE__ */ new Map();
      this._sheetPhotoUids = /* @__PURE__ */ new Set();
      this._sheetTrigger?.focus();
      this._sheetTrigger = null;
      if (message) this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
    };
    /** Saves a whole-session answer and refreshes the row, cats, and sheet from the returned detail. */
    this._onSessionLabelRequested = (event) => {
      const entryId = this._entryId;
      const hass = this.hass;
      if (!entryId || !hass?.callWS) return;
      const { uid, cats, verdict, subjects, closeOnSuccess } = event.detail;
      const request = { uid, ...cats ? { cats } : {}, ...verdict ? { verdict } : {}, ...subjects?.length ? { subjects } : {} };
      this._sheetBusy = true;
      this._sheetError = null;
      labelSession(hass, entryId, request).then((detail) => {
        this._sheetBusy = false;
        this._applySheetDetail(detail);
        this._timelineFeed.refresh(hass, entryId, this._config?.limit ?? DEFAULT_LIMIT);
        this._refreshCats();
        for (const key of this._sheetReviewedEvents.keys()) {
          if (key === detail.event.uid || key.startsWith(detail.event.uid + ":")) this._sheetReviewedEvents.delete(key);
        }
        if (request.verdict) {
          this._sheetReviewedEvents.set(detail.event.uid, { uid: detail.event.uid, event: detail.event, label: request.verdict });
        } else {
          for (const cat of request.cats ?? []) {
            const uid2 = detail.event.uid + ":" + cat.cat;
            this._sheetReviewedEvents.set(uid2, { uid: uid2, event: { kind: cat.ate ? "eat" : "visit", open: detail.event.open, start: detail.event.start }, label: cat.cat });
          }
        }
        if (closeOnSuccess) this._closeSheet();
        else this.requestUpdate();
      }).catch((err) => {
        this._sheetBusy = false;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
    };
    this._onSampleLabelRequested = (event) => {
      const entryId = this._entryId;
      const hass = this.hass;
      if (!entryId || !hass?.callWS) return;
      const { sampleUid, label } = event.detail;
      this._sheetSampleBusyUid = sampleUid;
      this._sheetError = null;
      labelSample(hass, entryId, { sampleUid, label }).then((sample) => {
        this._sheetSampleBusyUid = null;
        if (this._sheetSamples) this._sheetSamples = this._sheetSamples.map((item) => item.uid === sample.uid ? sample : item);
        this._sheetPhotoUids.add(sampleUid);
        const uid = this._sheetSummary?.uid;
        if (uid) this._loadEventDetail(uid, true);
        this.requestUpdate();
      }).catch((err) => {
        this._sheetSampleBusyUid = null;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
    };
    this._loadOlder = () => {
      this._timelineFeed.loadMore(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
    };
    this._retryTimeline = () => {
      this._timelineFeed.refresh(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
    };
    this._sheetSummary = null;
    this._sheetSamples = null;
    this._sheetSceneSubjects = [];
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._sheetSamplesFailed = false;
    this._sheetSampleBusyUid = null;
    this._sheetGroup = [];
    this._sheetTogether = false;
    this._sheetBusy = false;
    this._sheetError = null;
    this._edgeTop = false;
    this._edgeBottom = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _sheetSummary: { state: true },
      _sheetSamples: { state: true },
      _sheetSceneSubjects: { state: true },
      _sheetSessionCats: { state: true },
      _sheetMultipleCats: { state: true },
      _sheetSamplesFailed: { state: true },
      _sheetSampleBusyUid: { state: true },
      _sheetGroup: { state: true },
      _sheetTogether: { state: true },
      _sheetBusy: { state: true },
      _sheetError: { state: true },
      _edgeTop: { state: true },
      _edgeBottom: { state: true }
    };
  }
  setConfig(config) {
    if (!config.device_id) {
      throw new Error("Kibble Timeline card: a device is required. Choose it in the card editor.");
    }
    this._config = config;
  }
  getCardSize() {
    return 6;
  }
  static getStubConfig(hass) {
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-timeline-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-timeline-card-editor");
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._imageCache.dispose();
    this._timelineFeed.dispose();
    this._sentinelObserver?.disconnect();
    this._detailGeneration += 1;
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
    this._timelineFeed.sync(this.hass, this._entryId, this._config?.limit ?? DEFAULT_LIMIT);
    const callWS = this.hass?.callWS;
    if (this.hass && this._entryId && callWS && this._entryId !== this._catsEntryId) {
      this._catsEntryId = this._entryId;
      const entryId = this._entryId;
      this._catsQuery.sync(entryId, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
    }
    this._syncAnimation();
  }
  /** Identifies rows to animate: everything newer than the newest uid we knew about last time,
   * but only once we've actually seen a first list (never animates the initial load). */
  _syncAnimation() {
    const items = this._timelineFeed.state.items;
    if (!items || items.length === 0) return;
    const newest = items[0].uid;
    if (newest === this._newestKnownUid) {
      this._animateUids = /* @__PURE__ */ new Set();
      return;
    }
    const animate = /* @__PURE__ */ new Set();
    if (this._newestKnownUid !== null) {
      for (const item of items) {
        if (item.uid === this._newestKnownUid) break;
        animate.add(item.uid);
      }
    }
    this._animateUids = animate;
    this._newestKnownUid = newest;
  }
  updated() {
    this._syncSentinel();
    this._updateEdges();
  }
  /** The load-more sentinel must be observed relative to the rail itself whenever the rail is
   * the one actually scrolling (the default, bounded layout) -- otherwise the 200px preload
   * margin is measured against the viewport, which for a rail that scrolls internally is the
   * wrong box entirely. When `max_height: none` opts back into page scroll, the viewport is
   * once again the right (and only) root. Recreated whenever the sentinel element or which
   * mode applies changes, not just the element. */
  _syncSentinel() {
    const element = this._sentinelRef.value ?? null;
    const capped = railStyle(this._config?.max_height) !== "";
    if (element === this._observedSentinel && capped === this._observedSentinelCapped) return;
    this._sentinelObserver?.disconnect();
    this._observedSentinel = element;
    this._observedSentinelCapped = capped;
    if (!element) {
      this._sentinelObserver = null;
      return;
    }
    this._sentinelObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._loadOlder();
      },
      { root: capped ? this._railRef.value : null, rootMargin: "200px" }
    );
    this._sentinelObserver.observe(element);
  }
  /** Recomputes whether the rail is scrolled away from its top/bottom edge, re-run after every
   * update (paging in older rows, a live push, or a config change all resize the scrollable
   * content) and on every scroll of the rail itself. */
  _updateEdges() {
    const el = this._railRef.value;
    if (!el) {
      if (this._edgeTop || this._edgeBottom) {
        this._edgeTop = false;
        this._edgeBottom = false;
      }
      return;
    }
    const top = el.scrollTop > 2;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight > 2;
    if (top !== this._edgeTop) this._edgeTop = top;
    if (bottom !== this._edgeBottom) this._edgeBottom = bottom;
  }
  _locale() {
    return this.hass?.locale?.language ?? this.hass?.language;
  }
  _catColor(name) {
    if (!name) return null;
    const cat = this._catsQuery.state.data?.cats.find((c5) => c5.name === name);
    return cat ? catColorAt(cat.color) : fallbackCatColor(name);
  }
  render() {
    if (!this._config || !this.hass) return A;
    const timelineState = this._timelineFeed.state;
    const groups = groupConsecutive(timelineState.items ?? [], Date.now() / 1e3);
    const days = groupByDay(groups, /* @__PURE__ */ new Date());
    const hasMore = timelineState.hasMore;
    const showEmpty = !timelineState.error && !timelineState.loading && timelineState.items !== null && days.length === 0;
    return b2`
      <ha-card>
        <div class="container">
          ${this._config.name ? b2`<div class="label">${this._config.name}</div>` : A}
          <div class="rail-wrap">
            <div class="rail" style=${railStyle(this._config.max_height)} @scroll=${this._onRailScroll} ${n5(this._railRef)}>
              ${timelineState.error ? this._renderError(timelineState.error) : A}
              ${showEmpty ? this._renderEmpty() : A}
              ${days.map((day) => this._renderDay(day))}
              ${hasMore ? b2`<div class="sentinel" ${n5(this._sentinelRef)}></div>` : A}
              ${timelineState.loadingMore ? b2`<p class="loading-more">Loading older events…</p>` : A}
            </div>
            <div class="edge-fade edge-fade-top ${this._edgeTop ? "visible" : ""}"></div>
            <div class="edge-fade edge-fade-bottom ${this._edgeBottom ? "visible" : ""}"></div>
          </div>
        </div>
      </ha-card>
      <kibble-label-sheet
        ?open=${this._sheetSummary !== null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cats=${this._catsQuery.state.data?.cats ?? []}
        .summary=${this._sheetSummary}
        .samples=${this._sheetSamples}
        .sceneSubjects=${this._sheetSceneSubjects}
        .sessionCats=${this._sheetSessionCats}
        .multipleCats=${this._sheetMultipleCats}
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .groupTogether=${this._sheetTogether}
        .busy=${this._sheetBusy}
        .error=${this._sheetError}
        .sampleBusyUid=${this._sheetSampleBusyUid}
        @close-requested=${this._closeSheet}
        @session-label-requested=${this._onSessionLabelRequested}
        @sample-label-requested=${this._onSampleLabelRequested}
        @event-requested=${this._onEventRequested}
        @samples-retry-requested=${this._onSamplesRetryRequested}
      ></kibble-label-sheet>
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
        <div class="day-items">${day.groups.map((group) => this._renderRow(group))}</div>
      </div>
    `;
  }
  _renderRow(group) {
    const event = group.event;
    const together = group.together === true;
    const time = timeLabel(group.start ?? event.start, this._locale());
    const color = together ? "var(--secondary-text-color)" : this._catColor(event.cat) ?? "var(--secondary-text-color)";
    const animate = group.events.some((member) => this._animateUids.has(member.uid));
    return b2`
      <div class="row ${animate ? "row-enter" : ""}">
        <time class="time">${time}</time>
        <span class="dot-col"><span class="dot" style="--dot-color:${together ? this._togetherDotStyle(group.events) : color}"></span></span>
        <div class="content">${together ? this._renderTogether(group) : this._renderKnown(group, color)}</div>
      </div>`;
  }
  _renderTogether(group) {
    const title = togetherTitle(group.events);
    const duration = group.start != null && group.end != null ? spanDuration(group.start, group.end) : null;
    return b2`
      <div class="together-heading">
        <button type="button" class="together-open" aria-label=${title} @click=${(event) => this._openSheet(group, event.currentTarget)}>
          <span class="title together-title">${this._renderTogetherTitle(group.events)}</span>
        </button>
      </div>
      ${duration ? b2`<span class="meta">for ${duration}</span>` : A}
      ${this._renderTogetherMedia(group)}`;
  }
  _renderTogetherTitle(events) {
    const lanes = orderTogetherEvents(events);
    const names = lanes.map((lane) => lane.cat ? b2`<span class="cat-name" style="color:${this._catColor(lane.cat) ?? "var(--secondary-text-color)"}">${lane.cat}</span>` : b2`<span class="together-unknown-name">Who?</span>`);
    const joinedNames2 = b2`${names.map((name, index) => b2`${index === 0 ? A : index === names.length - 1 ? names.length === 2 ? " and " : ", and " : ", "}${name}`)}`;
    const first = lanes[0];
    if (first && first.kind !== "feed" && lanes.every((lane) => lane.kind === first.kind && lane.open === first.open)) {
      const verb = first.open ? first.kind === "eat" ? "are eating" : "are here" : catVerb(first);
      return b2`${joinedNames2} ${verb}`;
    }
    return b2`${lanes.map((lane, index) => b2`${index ? ", " : A}${names[index]} ${catVerb(lane)}`)}`;
  }
  _togetherDotStyle(events) {
    const lanes = orderTogetherEvents(events);
    if (lanes.length === 0) return "var(--secondary-text-color)";
    const segment = 100 / lanes.length;
    const stops = lanes.map((lane, index) => {
      const color = lane.cat ? this._catColor(lane.cat) ?? "var(--secondary-text-color)" : "var(--secondary-text-color)";
      return `${color} ${index * segment}% ${(index + 1) * segment}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }
  _renderTogetherMedia(group) {
    const events = group.events;
    const compareEvent = events.find((event) => event.kind === "eat" && compareAssets(event) !== null);
    const mediaEvent = events.find((event) => event.kind === "eat" && Boolean(event.clip) && Boolean(event.scene)) ?? events.find((event) => Boolean(event.scene)) ?? events.find((event) => event.kind === "eat" && Boolean(event.clip)) ?? events.find((event) => event.kind === "eat" && Boolean(event.thumb)) ?? events.find((event) => Boolean(event.thumb)) ?? group.event;
    const poster = events.find((event) => event.scene)?.scene ?? events.find((event) => event.thumb)?.thumb ?? null;
    const mediaGroup = { ...group, event: mediaEvent };
    if (compareEvent) {
      const compare = compareAssets(compareEvent);
      if (compare) {
        const compareGroup = { ...group, event: compareEvent };
        if (!poster) return b2`<div class="media media-eat">${this._renderComparePair(compareGroup, compare, "full")}</div>`;
        return b2`
          <div class="media media-eat">
            ${this._renderPhotoButton(mediaGroup, poster, "photo-tile photo-third")}
            ${this._renderComparePair(compareGroup, compare, "third")}
          </div>
        `;
      }
    }
    return b2`<div class="media">${this._renderPhotoButton(mediaGroup, poster, "photo-tile photo-visit")}</div>`;
  }
  _renderKnown(group, color) {
    const event = group.event;
    return b2`
      ${this._renderTitle(group, color)}
      ${this._renderMeta(event)}
      ${this._renderMedia(group, event)}`;
  }
  _renderTitle(group, color) {
    const event = group.event;
    const titleBody = event.kind === "feed" ? b2`${feedTitle(event)}` : event.cat ? b2`<span class="cat-name" style="color:${color}">${event.cat}</span> ${catVerb(event)}` : b2`${event.open ? event.kind === "eat" ? "Someone is eating" : "Someone is here" : "Who was here?"}`;
    const label = `Review ${eventTitle(event)}, ${timeLabel(event.start, this._locale())}`;
    return b2`<button type="button" class="title-open" aria-label=${label} @click=${(click) => this._openSheet(group, click.currentTarget)}>
      <span class="title-line">
        <span class="title">${titleBody}</span>
        ${event.open ? this._renderLiveRing(color) : A}
        ${group.events.length > 1 ? b2`<span class="count-badge">${groupCountLabel(event.kind, group.events.length)}</span>` : A}
      </span></button>`;
  }
  _renderLiveRing(color) {
    return b2`
      <span class="live-badge" style="--dot-color:${color}" aria-label="Happening now">
        <span class="live-core"></span>
        <span class="live-pulse"></span>
      </span>
    `;
  }
  _renderMeta(event) {
    if (event.kind === "feed") return A;
    const duration = eventDuration(event);
    return duration ? b2`<span class="meta">for ${duration}</span>` : A;
  }
  _renderMedia(group, event) {
    const compare = compareAssets(event);
    if (event.kind === "feed") {
      return compare ? this._renderComparePair(group, compare, "full") : A;
    }
    const thumbAsset = rowThumbAsset(event);
    if (event.kind === "eat" && compare) {
      if (!thumbAsset) {
        return b2`<div class="media media-eat">${this._renderComparePair(group, compare, "full")}</div>`;
      }
      return b2`
        <div class="media media-eat">
          ${this._renderPhotoButton(group, thumbAsset, "photo-tile photo-third")}
          ${this._renderComparePair(group, compare, "third")}
        </div>
      `;
    }
    return b2`<div class="media">${this._renderPhotoButton(group, thumbAsset, "photo-tile photo-visit")}</div>`;
  }
  _renderPhotoButton(group, asset, extraClass) {
    const event = group.event;
    const hasClip = event.kind === "eat" && Boolean(event.clip);
    const label = `View and correct: ${eventTitle(event)}, ${timeLabel(event.start, this._locale())}${hasClip ? ". Has video." : ""}`;
    return b2`
      <button type="button" class="${extraClass}" aria-label=${label} @click=${(e6) => this._openSheet(group, e6.currentTarget)}>
        ${asset ? b2`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this._imageCache} alt=""></kibble-image>` : b2`<span class="neutral-icon">${catSilhouette()}</span>`}
        ${hasClip ? b2`<span class="clip-badge">${mdiIcon("play")}</span>` : A}
      </button>
    `;
  }
  _renderComparePair(group, compare, size) {
    const label = `View and correct: ${eventTitle(group.event)}, ${timeLabel(group.event.start, this._locale())}`;
    return b2`
      <div class="compare-pair ${size === "full" ? "compare-full" : "compare-third"}">
        <button type="button" class="compare-tile" aria-label=${`${label}. Before.`} @click=${(e6) => this._openSheet(group, e6.currentTarget)}>
          ${compare.before ? b2`<kibble-image .hass=${this.hass} .asset=${compare.before} .cache=${this._imageCache} alt=""></kibble-image>` : A}
          <span class="compare-label">Before</span>
        </button>
        <button type="button" class="compare-tile" aria-label=${`${label}. After.`} @click=${(e6) => this._openSheet(group, e6.currentTarget)}>
          ${compare.after ? b2`<kibble-image .hass=${this.hass} .asset=${compare.after} .cache=${this._imageCache} alt=""></kibble-image>` : A}
          <span class="compare-label">After</span>
        </button>
      </div>
    `;
  }
  _refreshCats() {
    const hass = this.hass;
    const entryId = this._entryId;
    const callWS = hass?.callWS;
    if (!callWS || !entryId) return;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
  }
  _applySheetDetail(detail) {
    this._sheetSummary = detail.event;
    this._sheetSamples = detail.samples;
    this._sheetSceneSubjects = detail.scene_subjects;
    this._sheetSessionCats = detail.cats;
    this._sheetMultipleCats = detail.multiple_cats;
    this._sheetSamplesFailed = false;
    this.requestUpdate();
  }
  /** Resolves any timeline row uid to its complete feeder session for the shared sheet. */
  _loadEventDetail(uid, keepData = false) {
    const member = this._sheetGroup.find((candidate) => candidate.uid === uid);
    if (member) this._sheetSummary = member;
    if (!keepData) {
      this._sheetSamples = null;
      this._sheetSceneSubjects = [];
      this._sheetSessionCats = null;
      this._sheetMultipleCats = false;
      this._sheetSamplesFailed = false;
    }
    this._sheetError = null;
    const generation = ++this._detailGeneration;
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) {
      this._sheetSamplesFailed = !keepData;
      return;
    }
    callWS({ type: "kibble/event", entry_id: entryId, uid }).then((result) => {
      if (generation !== this._detailGeneration) return;
      this._applySheetDetail(result);
    }).catch(() => {
      if (generation !== this._detailGeneration) return;
      if (!keepData) this._sheetSamplesFailed = true;
      this.requestUpdate();
    });
  }
  _openSheet(group, trigger) {
    this._sheetTrigger = trigger;
    this._sheetGroup = group.events;
    this._sheetTogether = group.together === true;
    this._sheetReviewedEvents = /* @__PURE__ */ new Map();
    this._sheetPhotoUids = /* @__PURE__ */ new Set();
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._loadEventDetail(group.event.uid);
  }
  static {
    this.styles = i`
    :host {
      display: block;
      --kibble-text-caption: 13px;
      --kibble-text-body: 15px;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .container {
      container-type: inline-size;
      background: var(--ha-card-background, var(--card-background-color, #fff));
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
    /* The rail scrolls inside itself by default -- railStyle's own inline max-height (a real
       bounded cap unless a caller opts out with max_height: none) is what actually turns this
       into a scroll container; overflow/scrollbar rules here just style that container once it
       is one. */
    .rail-wrap {
      position: relative;
    }
    .rail {
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color) transparent;
    }
    .rail::-webkit-scrollbar {
      width: 6px;
    }
    .rail::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 3px;
    }
    /* A soft hint that there is more above/below than the current scroll position shows --
       never blocks a tap (pointer-events: none), never fights the sticky day heading for
       attention (same background colour, so the seam between them is invisible). */
    .edge-fade {
      position: absolute;
      left: 0;
      right: 0;
      height: 28px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .edge-fade-top {
      top: 0;
      background: linear-gradient(to bottom, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade-bottom {
      bottom: 0;
      background: linear-gradient(to top, var(--ha-card-background, var(--card-background-color, #fff)), transparent);
    }
    .edge-fade.visible {
      opacity: 1;
    }
    .day-label {
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      padding: 18px 16px 8px 96px;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .day-items {
      position: relative;
      margin-left: 96px;
      border-left: 2px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 2px 0;
    }
    .row {
      position: relative;
      padding: 0 16px 0 22px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .row-enter {
        animation: kibble-row-enter 420ms cubic-bezier(0.2, 0.7, 0.3, 1);
      }
    }
    @keyframes kibble-row-enter {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .time {
      position: absolute;
      left: -96px;
      width: 80px;
      padding-top: 2px;
      text-align: right;
      font-size: var(--kibble-text-caption);
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .dot-col {
      position: absolute;
      left: -7px;
      top: 6px;
    }
    .dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--dot-color);
      box-shadow: 0 0 0 3px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    /* The title and Review chip keep 48 px touch targets, but the negative block margin lets the
     * visible text sit exactly where a normal row's title does (top-aligned with its time). */
    .together-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      margin-block: -14px;
    }
    .together-open {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      gap: 8px;
      min-width: 0;
      min-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .title-open {
      display: block;
      width: 100%;
      border: 0;
      margin: 0;
      padding: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      min-height: 48px;
    }
    .title-open:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .title-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: var(--kibble-text-body);
      font-weight: 600;
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .cat-name {
      font-weight: 700;
    }
    .count-badge {
      font-size: var(--kibble-text-caption);
      font-weight: 500;
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 999px;
      padding: 2px 10px;
    }
    .meta {
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .live-badge {
      position: relative;
      width: 12px;
      height: 12px;
      flex: none;
    }
    .live-core {
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: var(--dot-color);
    }
    .live-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid var(--dot-color);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .live-pulse {
        animation: kibble-pulse-ring 1.8s ease-out infinite;
      }
    }
    @keyframes kibble-pulse-ring {
      0% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .media {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      padding-bottom: 14px;
    }
    .media-eat {
      align-items: stretch;
    }
    .photo-tile {
      position: relative;
      flex: none;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clip-badge {
      position: absolute;
      left: 4px;
      bottom: 4px;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 14px;
      pointer-events: none;
    }
    span.photo-tile {
      cursor: default;
    }
    .photo-visit {
      width: 78px;
      height: 78px;
    }
    .photo-third {
      width: 30%;
      max-width: 120px;
      aspect-ratio: 1;
    }
    .photo-unknown {
      width: 100px;
      height: 100px;
    }
    .neutral-icon {
      width: 60%;
      height: 60%;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .compare-pair {
      display: flex;
      gap: 8px;
      min-width: 0;
    }
    .compare-third {
      flex: 1 1 auto;
    }
    .compare-full {
      flex: 1 1 auto;
      width: 100%;
    }
    .compare-tile {
      position: relative;
      flex: 1 1 0;
      height: 130px;
      padding: 0;
      border: none;
      border-radius: 16px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      cursor: pointer;
    }
    .compare-full .compare-tile {
      height: 150px;
    }
    .compare-tile kibble-image {
      width: 100%;
      height: 100%;
    }
    .compare-label {
      position: absolute;
      left: 8px;
      bottom: 8px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    }
    .photo-tile:focus-visible,
    .compare-tile:focus-visible,
    .chip:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      padding-bottom: 14px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border: none;
      border-radius: 999px;
      background: color-mix(in srgb, var(--dot-color, var(--primary-color)) 16%, transparent);
      color: var(--dot-color, var(--primary-color, #03a9f4));
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      padding: 7px 16px 7px 10px;
      min-height: 38px;
      cursor: pointer;
    }
    .chip-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--dot-color);
      flex: none;
    }
    .chip.chip-muted {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      color: var(--secondary-text-color);
      font-weight: 500;
      padding: 7px 16px;
    }
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .row-error {
      display: block;
      padding-bottom: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--error-color, #db4437);
    }
    .sentinel {
      height: 1px;
      width: 100%;
    }
    .loading-more {
      margin: 0;
      padding: 10px 16px 2px;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    @container (max-width: 380px) {
      .day-label {
        padding-left: 74px;
      }
      .day-items {
        margin-left: 74px;
      }
      .row {
        padding-left: 18px;
      }
      .time {
        left: -74px;
        width: 60px;
      }
      .photo-third {
        max-width: 92px;
      }
      .compare-tile {
        height: 108px;
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
  description: "Today's feeds and who's been by, one calm list, newest first, with real photos.",
  preview: true
});

// src/lib/paged-feed.ts
var INITIAL_STATE2 = {
  items: null,
  total: 0,
  pageIndex: 0,
  hasNext: false,
  hasPrevious: false,
  loading: false,
  error: null
};
var PagedFeed = class {
  constructor(_type, _onChange) {
    this._type = _type;
    this._onChange = _onChange;
    this.state = INITIAL_STATE2;
    this._cursors = [null];
    /** Identifies the current filters (entry + every param besides paging); a change restarts at
     * page 0 and resets the cursor history built for the old filters. */
    this._key = null;
    this._generation = 0;
  }
  /** Resets to page 0 when `key` changes (e.g. the entry, or which cat a training grid shows).
   * Safe to call on every card update. */
  sync(hass, key, params, limit) {
    if (key === this._key) return;
    this._key = key;
    this._cursors = [null];
    if (!hass?.callWS || !key) {
      this.state = INITIAL_STATE2;
      return;
    }
    void this._load(hass, params, limit, 0, ++this._generation);
  }
  /** Re-reads the current page in place (e.g. after a label changes what it contains). */
  refresh(hass, params, limit) {
    if (!hass?.callWS || !this._key) return;
    void this._load(hass, params, limit, this.state.pageIndex, ++this._generation);
  }
  next(hass, params, limit) {
    if (!hass?.callWS || this.state.loading || !this.state.hasNext) return;
    void this._load(hass, params, limit, this.state.pageIndex + 1, this._generation);
  }
  previous(hass, params, limit) {
    if (!hass?.callWS || this.state.loading || this.state.pageIndex === 0) return;
    void this._load(hass, params, limit, this.state.pageIndex - 1, this._generation);
  }
  /** Drops every item matching `predicate` from the current page, decrementing `total` to
   * match -- used after a review-queue item is labelled and so stops belonging to the queue,
   * without waiting on a full page refetch. */
  removeItem(predicate) {
    const items = this.state.items;
    if (!items) return;
    const kept = items.filter((item) => !predicate(item));
    if (kept.length === items.length) return;
    this.state = { ...this.state, items: kept, total: Math.max(0, this.state.total - (items.length - kept.length)) };
    this._onChange();
  }
  async _load(hass, params, limit, pageIndex, generation) {
    this.state = { ...this.state, loading: true, error: null };
    this._onChange();
    try {
      const cursor = this._cursors[pageIndex] ?? null;
      const message = { type: this._type, limit, ...params, ...cursor ? { cursor } : {} };
      const result = await hass.callWS(message);
      if (generation !== this._generation) return;
      this._cursors[pageIndex + 1] = result.cursor;
      this.state = {
        items: result.items,
        total: result.total,
        pageIndex,
        hasNext: result.has_more,
        hasPrevious: pageIndex > 0,
        loading: false,
        error: null
      };
    } catch (err) {
      if (generation !== this._generation) return;
      this.state = { ...this.state, loading: false, error: describeWsError(err) };
    }
    this._onChange();
  }
  dispose() {
    this._generation += 1;
  }
};

// src/lib/label-event.ts
async function labelEvents(hass, entryId, request) {
  if (!hass.callWS) throw new Error("Not connected.");
  const result = await hass.callWS({
    type: "kibble/label",
    entry_id: entryId,
    uids: request.uids,
    label: request.label
  });
  return result.events;
}

// src/lib/storage-summary.ts
function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb < 1e3) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  const gb = mb / 1024;
  return `${gb < 10 ? gb.toFixed(1) : Math.round(gb)} GB`;
}
function storageSummary(storage) {
  const days = storage.retention_days === 1 ? "1 day" : `${storage.retention_days} days`;
  return `Using ${formatBytes(storage.used_bytes)}, keeping ${days}`;
}
function spoolSummary(spool) {
  if (!spool) return null;
  return `Feeder buffer ${formatBytes(spool.used_bytes)} of ${formatBytes(spool.cap_bytes)}`;
}

// src/lib/cat-recognition.ts
var RECOGNITION_TRANSLATION_KEY = "cat_recognition";
var VALID_LEARNING_STATES = { learning: "learning", paused: "paused", learned: "learned" };
function slugifyCatName(name) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function findCatRecognitionEntityId(entities, deviceId, catName) {
  const suffix = `cat_recognition_${slugifyCatName(catName)}`;
  for (const entry of Object.values(entities)) {
    if (entry.device_id !== deviceId || entry.disabled_by) continue;
    if (!entry.entity_id.startsWith("sensor.")) continue;
    if (entry.translation_key !== RECOGNITION_TRANSLATION_KEY) continue;
    if (entry.unique_id ? entry.unique_id.endsWith(suffix) : entry.entity_id.endsWith(`_${suffix}`)) return entry.entity_id;
  }
  return void 0;
}
function readCatRecognition(hass, entityId) {
  if (!entityId) return null;
  const state = hass.states[entityId];
  if (!state || state.state === "unknown" || state.state === "unavailable") return null;
  const percent2 = Number(state.state);
  if (!Number.isFinite(percent2)) return null;
  const learningState = VALID_LEARNING_STATES[String(state.attributes.learning_state)] ?? "learning";
  return { percent: Math.max(0, Math.min(100, percent2)), state: learningState };
}

// src/lib/photo-crop.ts
var OPPOSITE_CORNER = { nw: "se", ne: "sw", se: "nw", sw: "ne" };
var CORNER_SIGN = {
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
  ne: { x: 1, y: -1 },
  nw: { x: -1, y: -1 }
};
var MIN_CROP_FRACTION = MIN_AREA_SIZE;
function isValidSize(size) {
  return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width > 0 && size.height > 0;
}
function defaultSquareCrop(size) {
  if (!isValidSize(size)) return [0, 0, 1, 1];
  const { width, height } = size;
  if (width === height) return [0, 0, 1, 1];
  if (width > height) {
    const half2 = height / width / 2;
    return [0.5 - half2, 0, 0.5 + half2, 1];
  }
  const half = width / height / 2;
  return [0, 0.5 - half, 1, 0.5 + half];
}
function moveSquareCrop(crop, dxFraction, dyFraction) {
  return moveArea(crop, dxFraction, dyFraction);
}
function resizeSquareCrop(crop, corner, point, size, minFraction = MIN_CROP_FRACTION) {
  if (!isValidSize(size)) return crop;
  const { width, height } = size;
  const anchor = handlePoint(crop, OPPOSITE_CORNER[corner]);
  const sign = CORNER_SIGN[corner];
  const rawWidthPx = Math.abs(point.x - anchor.x) * width;
  const rawHeightPx = Math.abs(point.y - anchor.y) * height;
  const roomXPx = (sign.x > 0 ? 1 - anchor.x : anchor.x) * width;
  const roomYPx = (sign.y > 0 ? 1 - anchor.y : anchor.y) * height;
  const minPx = minFraction * Math.min(width, height);
  const sidePx = Math.min(Math.max(rawWidthPx, rawHeightPx, minPx), roomXPx, roomYPx);
  const cornerX = clampUnit(anchor.x + sign.x * (sidePx / width));
  const cornerY = clampUnit(anchor.y + sign.y * (sidePx / height));
  return normalizedAreaFromPoints(anchor, { x: cornerX, y: cornerY });
}
function scaleSquareCrop(crop, factor, size, minFraction = MIN_CROP_FRACTION) {
  if (!isValidSize(size) || !Number.isFinite(factor) || factor <= 0) return crop;
  const { width, height } = size;
  const centerX = (crop[0] + crop[2]) / 2;
  const centerY = (crop[1] + crop[3]) / 2;
  const minPx = minFraction * Math.min(width, height);
  const maxPx = Math.min(width, height);
  const targetPx = Math.min(maxPx, Math.max(minPx, areaWidth(crop) * width * factor));
  const halfFracX = targetPx / width / 2;
  const halfFracY = targetPx / height / 2;
  const clampedCenterX = Math.min(1 - halfFracX, Math.max(halfFracX, centerX));
  const clampedCenterY = Math.min(1 - halfFracY, Math.max(halfFracY, centerY));
  return [clampedCenterX - halfFracX, clampedCenterY - halfFracY, clampedCenterX + halfFracX, clampedCenterY + halfFracY];
}
function pinchDistance(a3, b3) {
  return Math.hypot(a3.x - b3.x, a3.y - b3.y);
}

// src/lib/image-prep.ts
var MAX_EDGE = 1600;
var JPEG_QUALITY = 0.85;
var FULL_FRAME = [0, 0, 1, 1];
function targetDimensions(width, height, maxEdge = MAX_EDGE) {
  const edge = Math.max(width, height);
  if (edge <= 0 || edge <= maxEdge) return { width, height };
  const scale = maxEdge / edge;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}
async function decodeViaBitmap(file) {
  if (typeof createImageBitmap !== "function") return null;
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
}
async function decodeViaImageElement(file) {
  if (typeof Image === "undefined" || typeof URL === "undefined") return null;
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode failed"));
      img.src = url;
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function imageNaturalSize(file) {
  const source = await decodeViaBitmap(file) ?? await decodeViaImageElement(file);
  if (!source) return null;
  try {
    const { width, height } = "naturalWidth" in source ? { width: source.naturalWidth, height: source.naturalHeight } : { width: source.width, height: source.height };
    return width > 0 && height > 0 ? { width, height } : null;
  } finally {
    if ("close" in source) source.close();
  }
}
async function prepareUpload(file, crop = FULL_FRAME, maxEdge = MAX_EDGE) {
  const source = await decodeViaBitmap(file) ?? await decodeViaImageElement(file);
  if (!source) return file;
  try {
    const { width, height } = "naturalWidth" in source ? { width: source.naturalWidth, height: source.naturalHeight } : { width: source.width, height: source.height };
    if (width <= 0 || height <= 0) return file;
    const [x1, y1, x2, y22] = crop;
    const sx = Math.min(width - 1, Math.max(0, Math.round(x1 * width)));
    const sy = Math.min(height - 1, Math.max(0, Math.round(y1 * height)));
    const sw = Math.max(1, Math.round((x2 - x1) * width));
    const sh = Math.max(1, Math.round((y22 - y1) * height));
    const { width: outWidth, height: outHeight } = targetDimensions(sw, sh, maxEdge);
    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, outWidth, outHeight);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    return blob ?? file;
  } catch {
    return file;
  } finally {
    if ("close" in source) source.close();
  }
}
function uploadFilename(original, prepared) {
  if (prepared === original) return original.name;
  const base = original.name.replace(/\.[^./\\]+$/, "");
  return `${base || "photo"}.jpg`;
}

// src/lib/upload-queue.ts
var DEFAULT_CONCURRENCY = 2;
var ACTIVE_STATUSES = {
  queued: true,
  compressing: true,
  uploading: true,
  added: false,
  duplicate: false,
  no_cat: false,
  error: false,
  canceled: false
};
var SETTLED_STATUSES = {
  queued: false,
  compressing: false,
  uploading: false,
  added: true,
  duplicate: true,
  no_cat: true,
  error: true,
  canceled: true
};
var UploadQueue = class {
  constructor(_handlers, _onChange, _concurrency = DEFAULT_CONCURRENCY) {
    this._handlers = _handlers;
    this._onChange = _onChange;
    this._concurrency = _concurrency;
    this._items = /* @__PURE__ */ new Map();
    this._order = [];
    this._controllers = /* @__PURE__ */ new Map();
    this._active = 0;
    this._disposed = false;
  }
  get items() {
    return this._order.map((id) => this._items.get(id));
  }
  get(id) {
    return this._items.get(id);
  }
  /** Adds `ids` in `queued` state. Does not itself start uploading -- call `start()` once the
   * user commits to the batch ("Add N photos"), so choosing photos never begins a network
   * request. Safe to call more than once; an id already known is left exactly as it is. */
  enqueue(ids) {
    let changed = false;
    for (const id of ids) {
      if (this._items.has(id)) continue;
      this._items.set(id, { id, status: "queued", message: null });
      this._order.push(id);
      changed = true;
    }
    if (changed) this._onChange();
  }
  /** Starts pulling `queued` items into the pool, up to the configured concurrency. Idempotent:
   * calling it again while already running just tops the pool back up, a no-op if it's full. */
  start() {
    this._pump();
  }
  /** Moves a settled `error` item back to `queued` and resumes the pool. A no-op for any other
   * status (already running, or already a terminal non-error outcome). */
  retry(id) {
    const item = this._items.get(id);
    if (!item || item.status !== "error") return;
    this._items.set(id, { id, status: "queued", message: null });
    this._onChange();
    this._pump();
  }
  /** Stops the batch: a still-`queued` item never starts (marked `canceled` directly); a
   * `compressing`/`uploading` item's `AbortSignal` fires, and it settles `canceled` itself once
   * `_run`'s rejection handler observes the abort. Items already settled are untouched. */
  cancelPending() {
    let changed = false;
    for (const id of this._order) {
      const item = this._items.get(id);
      if (!ACTIVE_STATUSES[item.status]) continue;
      if (item.status === "queued") {
        this._items.set(id, { id, status: "canceled", message: null });
        changed = true;
      } else {
        this._controllers.get(id)?.abort();
      }
    }
    if (changed) this._onChange();
  }
  get allSettled() {
    return this._order.length > 0 && this._order.every((id) => SETTLED_STATUSES[this._items.get(id).status]);
  }
  tally() {
    const out = { added: 0, duplicate: 0, no_cat: 0, error: 0, canceled: 0 };
    for (const item of this._items.values()) {
      if (item.status in out) out[item.status] += 1;
    }
    return out;
  }
  /** Aborts every in-flight item and stops the pool from starting new work -- call once the
   * owning component is done with this queue (closing the sheet). */
  dispose() {
    this._disposed = true;
    for (const controller of this._controllers.values()) controller.abort();
  }
  _pump() {
    if (this._disposed) return;
    while (this._active < this._concurrency) {
      const next = this._order.find((id) => this._items.get(id)?.status === "queued");
      if (!next) return;
      this._run(next);
    }
  }
  _run(id) {
    const controller = new AbortController();
    this._controllers.set(id, controller);
    this._active++;
    this._set(id, "compressing", null);
    this._handlers.compress(id, controller.signal).then((blob) => {
      this._set(id, "uploading", null);
      return this._handlers.upload(id, blob, controller.signal);
    }).then((outcome) => {
      this._set(id, outcome.status, outcome.message ?? null);
    }).catch((err) => {
      const aborted = controller.signal.aborted || err instanceof DOMException && err.name === "AbortError";
      this._set(id, aborted ? "canceled" : "error", aborted ? null : err instanceof Error ? err.message : "Couldn't upload this photo.");
    }).finally(() => {
      this._controllers.delete(id);
      this._active--;
      this._pump();
    });
  }
  _set(id, status, message) {
    if (!this._items.has(id)) return;
    this._items.set(id, { id, status, message });
    this._onChange();
  }
};

// src/lib/upload-client.ts
async function authedFetch(hass, path, body, signal) {
  if (hass.fetchWithAuth) return hass.fetchWithAuth(path, { method: "POST", body, signal });
  const token = hass.auth?.data.access_token;
  if (!token || !hass.hassUrl) throw new Error("Not authenticated.");
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  return fetch(new URL(path, hass.hassUrl), { method: "POST", body, headers, signal });
}
async function uploadTrainingPhoto(hass, entryId, cat, blob, filename, signal) {
  const body = new FormData();
  body.append("file", blob, filename);
  const response = await authedFetch(hass, `/api/kibble/${entryId}/upload/training/${encodeURIComponent(cat)}`, body, signal);
  try {
    return await response.json();
  } catch {
    throw new Error(`Upload failed (${response.status}).`);
  }
}
async function uploadAvatarPhoto(hass, entryId, cat, blob, filename, signal) {
  const body = new FormData();
  body.append("file", blob, filename);
  const response = await authedFetch(hass, `/api/kibble/${entryId}/upload/avatar/${encodeURIComponent(cat)}`, body, signal);
  try {
    return await response.json();
  } catch {
    throw new Error(`Upload failed (${response.status}).`);
  }
}

// src/components/kibble-crop-editor.ts
var CORNERS = ["nw", "ne", "se", "sw"];
var KibbleCropEditor = class extends i4 {
  constructor() {
    super();
    this._stageRef = e5();
    this._pointers = /* @__PURE__ */ new Map();
    this._dragCorner = null;
    this._dragMoveStart = null;
    this._pinchStart = null;
    this._resizeObserver = null;
    this.imageUrl = "";
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.crop = [0, 0, 1, 1];
    this.circleGuide = false;
    this.interactive = true;
    this.fitParent = false;
  }
  static {
    this.properties = {
      imageUrl: { type: String },
      naturalWidth: { type: Number },
      naturalHeight: { type: Number },
      crop: { attribute: false },
      circleGuide: { type: Boolean },
      interactive: { type: Boolean },
      fitParent: { type: Boolean }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.fitParent && this.parentElement && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => this._applyParentFit());
      this._resizeObserver.observe(this.parentElement);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }
  updated(changed) {
    if (this.fitParent && (changed.has("naturalWidth") || changed.has("naturalHeight"))) this._applyParentFit();
  }
  /** Sets this element's own inline pixel size to the largest box that fits within the parent's
   * current content box while preserving the photo's aspect ratio -- plain containment
   * arithmetic, computed here instead of leaned on CSS because the parent's resolved size (not
   * just its CSS declaration) is the only thing that can never be ambiguous. */
  _applyParentFit() {
    const parent = this.parentElement;
    if (!parent || this.naturalWidth <= 0 || this.naturalHeight <= 0) return;
    const boxWidth = parent.clientWidth;
    const boxHeight = parent.clientHeight;
    if (boxWidth <= 0 || boxHeight <= 0) return;
    const scale = Math.min(boxWidth / this.naturalWidth, boxHeight / this.naturalHeight);
    this.style.width = `${Math.max(1, this.naturalWidth * scale)}px`;
    this.style.height = `${Math.max(1, this.naturalHeight * scale)}px`;
  }
  _pointToNormalized(clientX, clientY) {
    const rect = this._stageRef.value?.getBoundingClientRect();
    return rect ? clientPointToNormalized(clientX, clientY, rect) : null;
  }
  _emitChange(next) {
    this.crop = next;
    this.dispatchEvent(new CustomEvent("crop-changed", { detail: { crop: next }, bubbles: true, composed: true }));
  }
  _beginPinch() {
    this._dragCorner = null;
    this._dragMoveStart = null;
    const points = [...this._pointers.values()];
    if (points.length < 2) return;
    this._pinchStart = { distance: pinchDistance(points[0], points[1]), crop: this.crop };
  }
  _capture(event) {
    this._stageRef.value?.setPointerCapture(event.pointerId);
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (point) this._pointers.set(event.pointerId, point);
  }
  _onHandlePointerDown(corner, event) {
    event.preventDefault();
    event.stopPropagation();
    this._capture(event);
    if (this._pointers.size >= 2) this._beginPinch();
    else this._dragCorner = corner;
  }
  _onBodyPointerDown(event) {
    if (!this.interactive) return;
    event.preventDefault();
    this._capture(event);
    if (this._pointers.size >= 2) {
      this._beginPinch();
      return;
    }
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (point) this._dragMoveStart = { point, crop: this.crop };
  }
  _onPointerMove(event) {
    if (!this._pointers.has(event.pointerId)) return;
    const point = this._pointToNormalized(event.clientX, event.clientY);
    if (!point) return;
    this._pointers.set(event.pointerId, point);
    const size = { width: this.naturalWidth, height: this.naturalHeight };
    if (this._pinchStart && this._pointers.size >= 2) {
      const points = [...this._pointers.values()];
      const distance = pinchDistance(points[0], points[1]);
      if (this._pinchStart.distance > 0) this._emitChange(scaleSquareCrop(this._pinchStart.crop, distance / this._pinchStart.distance, size));
      return;
    }
    if (this._dragCorner) {
      this._emitChange(resizeSquareCrop(this.crop, this._dragCorner, point, size));
      return;
    }
    if (this._dragMoveStart) {
      this._emitChange(moveSquareCrop(this._dragMoveStart.crop, point.x - this._dragMoveStart.point.x, point.y - this._dragMoveStart.point.y));
    }
  }
  _onPointerUp(event) {
    this._pointers.delete(event.pointerId);
    if (this._pointers.size < 2) this._pinchStart = null;
    if (this._pointers.size === 0) {
      this._dragCorner = null;
      this._dragMoveStart = null;
    }
  }
  render() {
    const [x1, y1, x2, y22] = this.crop;
    const frameStyle = `left:${x1 * 100}%;top:${y1 * 100}%;width:${(x2 - x1) * 100}%;height:${(y22 - y1) * 100}%;`;
    const aspect = this.naturalWidth > 0 && this.naturalHeight > 0 ? `${this.naturalWidth} / ${this.naturalHeight}` : "1 / 1";
    return b2`
      <div
        class="stage"
        style="aspect-ratio:${aspect};cursor:${this.interactive ? "move" : "default"}"
        ${n5(this._stageRef)}
        @pointerdown=${(e6) => this._onBodyPointerDown(e6)}
        @pointermove=${(e6) => this._onPointerMove(e6)}
        @pointerup=${(e6) => this._onPointerUp(e6)}
        @pointercancel=${(e6) => this._onPointerUp(e6)}
      >
        ${this.imageUrl ? b2`<img src=${this.imageUrl} alt="" draggable="false" />` : A}
        <div class="frame" style=${frameStyle}>
          ${this.circleGuide ? b2`<div class="circle-guide"></div>` : A}
          ${this.interactive ? CORNERS.map((corner) => b2`<button type="button" class="handle handle-${corner}" aria-label="Resize crop" @pointerdown=${(e6) => this._onHandlePointerDown(corner, e6)}></button>`) : A}
        </div>
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
    .stage {
      position: relative;
      width: 100%;
      overflow: hidden;
      touch-action: none;
      background: #000;
      border-radius: 8px;
    }
    .stage img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
      user-select: none;
    }
    .frame {
      position: absolute;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      border: 2px solid #fff;
      box-sizing: border-box;
    }
    .circle-guide {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px dashed rgba(255, 255, 255, 0.85);
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 28px;
      height: 28px;
      margin: -14px;
      padding: 0;
      border: none;
      background: none;
      touch-action: none;
      cursor: pointer;
    }
    .handle::after {
      content: "";
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .handle-nw {
      left: 0;
      top: 0;
      cursor: nwse-resize;
    }
    .handle-ne {
      right: 0;
      top: 0;
      left: auto;
      cursor: nesw-resize;
    }
    .handle-se {
      right: 0;
      bottom: 0;
      left: auto;
      cursor: nwse-resize;
    }
    .handle-sw {
      left: 0;
      bottom: 0;
      cursor: nesw-resize;
    }
  `;
  }
};
customElements.define("kibble-crop-editor", KibbleCropEditor);

// src/components/kibble-add-photos-sheet.ts
var FOCUSABLE_SELECTOR3 = ["button:not([disabled])", '[tabindex]:not([tabindex="-1"])'].join(",");
var KibbleAddPhotosSheet = class extends i4 {
  constructor() {
    super();
    this._queue = null;
    this._tileGeneration = 0;
    this._loadedFiles = null;
    this._closeButtonRef = e5();
    this._keydownHandler = (event) => {
      if (!this.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (this._adjustingId) this._adjustingId = null;
        else this._requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...this.renderRoot.querySelectorAll(FOCUSABLE_SELECTOR3)];
      if (focusable.length === 0) return;
      const active = this.renderRoot.querySelector(":focus");
      const currentIndex = active ? focusable.indexOf(active) : -1;
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
      }
    };
    this.open = false;
    this.files = [];
    this._tiles = [];
    this._adjustingId = null;
    this._queueTick = 0;
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      hass: { attribute: false },
      entryId: { type: String },
      cat: { type: String },
      files: { attribute: false },
      _tiles: { state: true },
      _adjustingId: { state: true },
      _queueTick: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    this._disposeTiles();
    this._queue?.dispose();
  }
  willUpdate(changed) {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    if (this.open && this.files !== this._loadedFiles) {
      this._loadedFiles = this.files;
      this._resetForFiles(this.files);
    }
  }
  _disposeTiles() {
    for (const tile of this._tiles) URL.revokeObjectURL(tile.objectUrl);
  }
  _resetForFiles(files) {
    this._queue?.dispose();
    this._queue = null;
    this._disposeTiles();
    this._adjustingId = null;
    const generation = ++this._tileGeneration;
    this._tiles = files.map((file, index) => ({ id: `f${index}`, file, objectUrl: URL.createObjectURL(file), naturalSize: null, crop: [0, 0, 1, 1] }));
    for (const tile of this._tiles) {
      void imageNaturalSize(tile.file).then((size) => {
        if (generation !== this._tileGeneration || !size) return;
        tile.naturalSize = size;
        tile.crop = defaultSquareCrop(size);
        this.requestUpdate();
      });
    }
  }
  _removeTile(id) {
    const tile = this._tiles.find((t5) => t5.id === id);
    if (tile) URL.revokeObjectURL(tile.objectUrl);
    this._tiles = this._tiles.filter((t5) => t5.id !== id);
  }
  _onCropChanged(id, crop) {
    const tile = this._tiles.find((t5) => t5.id === id);
    if (tile) tile.crop = crop;
    this.requestUpdate();
  }
  _startUpload() {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass || !entryId || !cat || this._tiles.length === 0 || this._queue) return;
    const tiles = this._tiles;
    const queue = new UploadQueue(
      {
        compress: (id) => prepareUpload(tiles.find((t5) => t5.id === id).file, tiles.find((t5) => t5.id === id).crop),
        upload: async (id, blob, signal) => {
          const tile = tiles.find((t5) => t5.id === id);
          const result = await uploadTrainingPhoto(hass, entryId, cat, blob, uploadFilename(tile.file, blob), signal);
          return { status: result.status, message: result.message };
        }
      },
      () => {
        this._queueTick++;
      },
      2
    );
    queue.enqueue(tiles.map((tile) => tile.id));
    queue.start();
    this._queue = queue;
    this._queueTick++;
  }
  _requestClose() {
    this._queue?.cancelPending();
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }
  render() {
    if (!this.open) return A;
    const adjusting = this._adjustingId ? this._tiles.find((t5) => t5.id === this._adjustingId) : void 0;
    return b2`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
        <div class="sheet">
          <header>
            <span class="title">Add photos${this.cat ? b2` of ${this.cat}` : A}</span>
            <button type="button" class="close" ${n5(this._closeButtonRef)} @click=${() => this._requestClose()} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          ${this._tiles.length === 0 ? b2`<p class="empty">No photos chosen.</p>` : b2`<div class="grid">${this._tiles.map((tile) => this._renderTile(tile))}</div>`}
          ${this._renderFooter()}
        </div>
        ${adjusting ? this._renderAdjust(adjusting) : A}
      </div>
    `;
  }
  _renderTile(tile) {
    const status = this._queue?.get(tile.id)?.status;
    const message = this._queue?.get(tile.id)?.message ?? null;
    return b2`
      <div class="tile">
        <button type="button" class="tile-photo" aria-label="Adjust crop" ?disabled=${Boolean(this._queue)} @click=${() => {
      this._adjustingId = tile.id;
    }}>
          <kibble-crop-editor .imageUrl=${tile.objectUrl} .naturalWidth=${tile.naturalSize?.width ?? 0} .naturalHeight=${tile.naturalSize?.height ?? 0} .crop=${tile.crop} .interactive=${false}></kibble-crop-editor>
        </button>
        ${!this._queue ? b2`<button type="button" class="remove" aria-label="Remove this photo" @click=${() => this._removeTile(tile.id)}>${"\xD7"}</button>` : A}
        ${status ? this._renderTileStatus(tile.id, status, message) : A}
      </div>
    `;
  }
  _renderTileStatus(id, status, message) {
    if (status === "queued") return A;
    if (status === "compressing" || status === "uploading") return b2`<span class="tile-badge busy" aria-label="Uploading">${mdiIcon("refresh")}</span>`;
    if (status === "added") return b2`<span class="tile-badge added" aria-label="Added">${mdiIcon("check")}</span>`;
    if (status === "duplicate") return b2`<span class="tile-badge muted">Duplicate</span>`;
    if (status === "no_cat") return b2`<span class="tile-badge muted">Not a cat</span>`;
    if (status === "canceled") return b2`<span class="tile-badge muted">Canceled</span>`;
    return b2`
      <span class="tile-badge error" title=${message ?? "Couldn't upload this photo."}>
        Failed
        <button type="button" @click=${() => this._queue?.retry(id)}>Retry</button>
      </span>
    `;
  }
  _renderFooter() {
    const queue = this._queue;
    if (queue && queue.allSettled) {
      return b2`
        <div class="footer">
          <p class="tally">${this._tallyPhrase(queue.tally())}</p>
          <button type="button" class="primary" @click=${() => this._requestClose()}>Done</button>
        </div>
      `;
    }
    if (queue) {
      const settled = this._tiles.filter((tile) => queue.get(tile.id)?.status !== "queued" && queue.get(tile.id)?.status !== "compressing" && queue.get(tile.id)?.status !== "uploading").length;
      return b2`<div class="footer"><p class="progress">Adding ${settled} of ${this._tiles.length}\u2026</p></div>`;
    }
    return b2`
      <div class="footer">
        <button type="button" class="primary" ?disabled=${this._tiles.length === 0} @click=${() => this._startUpload()}>Add ${this._tiles.length} photo${this._tiles.length === 1 ? "" : "s"}</button>
      </div>
    `;
  }
  _tallyPhrase(tally) {
    const parts = [];
    if (tally.added) parts.push(`${tally.added} added`);
    if (tally.duplicate) parts.push(`${tally.duplicate} duplicate${tally.duplicate === 1 ? "" : "s"}`);
    if (tally.no_cat) parts.push(`${tally.no_cat} not a cat`);
    if (tally.error) parts.push(`${tally.error} failed`);
    if (tally.canceled) parts.push(`${tally.canceled} canceled`);
    return parts.length > 0 ? parts.join(" \xB7 ") : "Nothing added.";
  }
  _renderAdjust(tile) {
    return b2`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${tile.objectUrl}
            .naturalWidth=${tile.naturalSize?.width ?? 0}
            .naturalHeight=${tile.naturalSize?.height ?? 0}
            .crop=${tile.crop}
            .fitParent=${true}
            @crop-changed=${(e6) => this._onCropChanged(tile.id, e6.detail.crop)}
          ></kibble-crop-editor>
        </div>
        <button type="button" class="adjust-done" @click=${() => {
      this._adjustingId = null;
    }}>Done</button>
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    .sheet {
      width: 100%;
      max-width: 560px;
      max-height: min(88vh, 780px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      border-radius: 16px 16px 0 0;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: var(--kibble-text-title);
      font-weight: 600;
    }
    .close {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 10px;
    }
    .tile {
      position: relative;
    }
    .tile-photo {
      display: block;
      width: 100%;
      padding: 0;
      border: none;
      background: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile-photo:disabled {
      cursor: default;
    }
    .remove {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: none;
      background: #222;
      color: #fff;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;
    }
    .tile-badge {
      position: absolute;
      left: 6px;
      bottom: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }
    .tile-badge.added {
      background: var(--kibble-feed, #43a96a);
    }
    .tile-badge.error {
      background: var(--error-color, #db4437);
      gap: 6px;
    }
    .tile-badge.error button {
      border: none;
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      border-radius: 999px;
      padding: 1px 8px;
      font: inherit;
      font-size: 10px;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: no-preference) {
      .tile-badge.busy svg {
        animation: kibble-add-photos-spin 0.9s linear infinite;
      }
    }
    @keyframes kibble-add-photos-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .primary {
      min-height: 44px;
      border-radius: 10px;
      border: none;
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .progress,
    .tally {
      margin: 0;
      text-align: center;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .adjust {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.94);
    }
    .adjust-stage {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .adjust-stage kibble-crop-editor {
      max-width: 100%;
      max-height: 100%;
    }
    .adjust-done {
      align-self: center;
      min-height: 44px;
      padding: 0 28px;
      border-radius: 999px;
      border: none;
      background: #fff;
      color: #111;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .close:focus-visible,
    .tile-photo:focus-visible,
    .remove:focus-visible,
    .primary:focus-visible,
    .adjust-done:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-add-photos-sheet", KibbleAddPhotosSheet);

// src/components/kibble-avatar-picker.ts
var TRAINING_LIMIT = 24;
var FOCUSABLE_SELECTOR4 = ["button:not([disabled])", '[tabindex]:not([tabindex="-1"])'].join(",");
var KibbleAvatarPicker = class extends i4 {
  constructor() {
    super();
    this._trainingFeed = new PagedFeed("kibble/training", () => this.requestUpdate());
    this._uploadObjectUrl = "";
    this._uploadGeneration = 0;
    this._closeButtonRef = e5();
    this._fileInputRef = e5();
    this._keydownHandler = (event) => {
      if (!this.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (this._uploadFile) this._cancelUpload();
        else this._requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...this.renderRoot.querySelectorAll(FOCUSABLE_SELECTOR4)];
      if (focusable.length === 0) return;
      const active = this.renderRoot.querySelector(":focus");
      const currentIndex = active ? focusable.indexOf(active) : -1;
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= focusable.length) {
        event.preventDefault();
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
      }
    };
    this.open = false;
    this.cat = null;
    this._uploadFile = null;
    this._uploadNaturalSize = null;
    this._uploadCrop = [0, 0, 1, 1];
    this._busy = false;
    this._error = null;
  }
  static {
    this.properties = {
      open: { type: Boolean, reflect: true },
      hass: { attribute: false },
      entryId: { type: String },
      cache: { attribute: false },
      cat: { attribute: false },
      _uploadFile: { state: true },
      _uploadNaturalSize: { state: true },
      _uploadCrop: { attribute: false },
      _busy: { state: true },
      _error: { state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._keydownHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._keydownHandler);
    this._trainingFeed.dispose();
    this._cancelUpload();
  }
  willUpdate(changed) {
    if (changed.has("open") && this.open) this._closeButtonRef.value?.focus();
    if (changed.has("open") && !this.open) {
      this._cancelUpload();
      this._error = null;
    }
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (this.open && hass?.callWS && entryId && cat) {
      this._trainingFeed.sync(hass, `${entryId}:${cat.name}`, this._feedParams(), TRAINING_LIMIT);
    }
  }
  _feedParams() {
    return { entry_id: this.entryId, cat: this.cat?.name };
  }
  _requestClose() {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }
  _emitChanged(avatar, avatarCustom) {
    const cat = this.cat;
    if (!cat) return;
    this.dispatchEvent(new CustomEvent("avatar-changed", { detail: { cat: cat.name, avatar, avatarCustom }, bubbles: true, composed: true }));
  }
  async _chooseExisting(asset) {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass?.callWS || !entryId || !cat || !asset || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const result = await hass.callWS({ type: "kibble/cats/avatar/set", entry_id: entryId, cat: cat.name, asset_id: asset.id });
      this._emitChanged(result.avatar, true);
      this._requestClose();
    } catch (err) {
      this._error = describeWsError(err);
    } finally {
      this._busy = false;
    }
  }
  async _onReset() {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    if (!hass?.callWS || !entryId || !cat || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const result = await hass.callWS({ type: "kibble/cats/avatar/clear", entry_id: entryId, cat: cat.name });
      this._emitChanged(result.avatar, false);
      this._requestClose();
    } catch (err) {
      this._error = describeWsError(err);
    } finally {
      this._busy = false;
    }
  }
  _onFileChosen(event) {
    const input = event.target;
    const file = input.files?.[0] ?? null;
    input.value = "";
    if (!file) return;
    this._uploadFile = file;
    this._uploadObjectUrl = URL.createObjectURL(file);
    this._uploadNaturalSize = null;
    this._uploadCrop = [0, 0, 1, 1];
    const generation = ++this._uploadGeneration;
    void imageNaturalSize(file).then((size) => {
      if (generation !== this._uploadGeneration || !size) return;
      this._uploadNaturalSize = size;
      this._uploadCrop = defaultSquareCrop(size);
    });
  }
  _cancelUpload() {
    if (this._uploadObjectUrl) URL.revokeObjectURL(this._uploadObjectUrl);
    this._uploadObjectUrl = "";
    this._uploadFile = null;
    this._uploadNaturalSize = null;
  }
  async _confirmUpload() {
    const hass = this.hass;
    const entryId = this.entryId;
    const cat = this.cat;
    const file = this._uploadFile;
    if (!hass || !entryId || !cat || !file || this._busy) return;
    this._busy = true;
    this._error = null;
    try {
      const blob = await prepareUpload(file, this._uploadCrop);
      const result = await uploadAvatarPhoto(hass, entryId, cat.name, blob, uploadFilename(file, blob), new AbortController().signal);
      if (result.error || !result.avatar) {
        this._error = result.error ?? "Couldn't save that photo.";
        return;
      }
      this._emitChanged(result.avatar, true);
      this._requestClose();
    } catch (err) {
      this._error = err instanceof Error ? err.message : "Couldn't save that photo.";
    } finally {
      this._busy = false;
    }
  }
  render() {
    const cat = this.cat;
    if (!this.open || !cat) return A;
    return b2`
      <div class="backdrop" role="dialog" aria-modal="true" aria-label=${`Change ${cat.name}'s picture`}>
        <div class="sheet">
          <header>
            <span class="title">Change picture</span>
            <button type="button" class="close" ${n5(this._closeButtonRef)} @click=${() => this._requestClose()} aria-label="Close">${mdiIcon("close")}</button>
          </header>
          ${this._uploadFile ? this._renderUploadAdjust() : this._renderGrid(cat)}
          ${this._error ? b2`<p class="error">${this._error}</p>` : A}
        </div>
      </div>
    `;
  }
  _renderGrid(cat) {
    const state = this._trainingFeed.state;
    return b2`
      <input type="file" accept="image/*" hidden ${n5(this._fileInputRef)} @change=${(e6) => this._onFileChosen(e6)} />
      <div class="grid">
        <button type="button" class="tile upload-tile" ?disabled=${this._busy} @click=${() => this._fileInputRef.value?.click()}>Upload</button>
        ${(state.items ?? []).map((sample) => this._renderSampleTile(cat, sample))}
      </div>
      ${state.error ? b2`<p class="error">${state.error}</p>` : A}
      ${state.items && state.items.length === 0 ? b2`<p class="empty">No training photos yet -- upload one instead.</p>` : A}
      ${this._renderPager(state)}
      ${cat.avatar_custom ? b2`<button type="button" class="reset" ?disabled=${this._busy} @click=${() => this._onReset()}>Reset to automatic</button>` : A}
    `;
  }
  _renderSampleTile(cat, sample) {
    const asset = sample.body ?? sample.face;
    const isCurrent = Boolean(asset && cat.avatar?.id === asset.id);
    return b2`
      <button type="button" class="tile photo-tile ${isCurrent ? "current" : ""}" ?disabled=${this._busy || !asset} aria-label="Use this photo" @click=${() => this._chooseExisting(asset)}>
        ${asset ? b2`<kibble-image .hass=${this.hass} .asset=${asset} .cache=${this.cache} alt=""></kibble-image>` : A}
      </button>
    `;
  }
  _renderPager(state) {
    if (state.items === null || !state.hasNext && !state.hasPrevious) return A;
    return b2`
      <div class="pager">
        <button type="button" ?disabled=${!state.hasPrevious || state.loading} @click=${() => this._trainingFeed.previous(this.hass, this._feedParams(), TRAINING_LIMIT)}>Previous</button>
        <button type="button" ?disabled=${!state.hasNext || state.loading} @click=${() => this._trainingFeed.next(this.hass, this._feedParams(), TRAINING_LIMIT)}>Next</button>
      </div>
    `;
  }
  _renderUploadAdjust() {
    const size = this._uploadNaturalSize;
    return b2`
      <div class="adjust">
        <div class="adjust-stage">
          <kibble-crop-editor
            .imageUrl=${this._uploadObjectUrl}
            .naturalWidth=${size?.width ?? 0}
            .naturalHeight=${size?.height ?? 0}
            .crop=${this._uploadCrop}
            .circleGuide=${true}
            .fitParent=${true}
            @crop-changed=${(e6) => {
      this._uploadCrop = e6.detail.crop;
    }}
          ></kibble-crop-editor>
        </div>
        <div class="adjust-actions">
          <button type="button" class="secondary" ?disabled=${this._busy} @click=${() => this._cancelUpload()}>Back</button>
          <button type="button" class="primary" ?disabled=${this._busy} @click=${() => this._confirmUpload()}>Use this photo</button>
        </div>
      </div>
    `;
  }
  static {
    this.styles = i`
    :host {
      display: block;
      --kibble-text-caption: 12px;
      --kibble-text-body: 14px;
      --kibble-text-title: 16px;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    .sheet {
      width: 100%;
      max-width: 560px;
      max-height: min(88vh, 780px);
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      padding-bottom: max(16px, env(safe-area-inset-bottom));
      box-sizing: border-box;
      border-radius: 16px 16px 0 0;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      overflow-y: auto;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: var(--kibble-text-title);
      font-weight: 600;
    }
    .close {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .tile {
      aspect-ratio: 1;
      padding: 0;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }
    .tile:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .photo-tile {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      box-sizing: border-box;
      border: 2px solid transparent;
    }
    .photo-tile.current {
      border-color: var(--kibble-feed, #43a96a);
    }
    .upload-tile {
      border: 2px dashed var(--divider-color);
      background: none;
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
    }
    .empty {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: var(--kibble-text-body);
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .reset {
      align-self: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: var(--kibble-text-caption);
      text-decoration: underline;
      cursor: pointer;
      min-height: 32px;
    }
    .reset:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .error {
      margin: 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--error-color, #db4437);
      font-size: var(--kibble-text-caption);
    }
    .adjust {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: min(70vh, 420px);
    }
    .adjust-stage {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .adjust-stage kibble-crop-editor {
      max-width: 320px;
      max-height: 100%;
    }
    .adjust-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .primary,
    .secondary {
      min-height: 44px;
      padding: 0 22px;
      border-radius: 10px;
      border: none;
      font: inherit;
      font-weight: 700;
      font-size: var(--kibble-text-body);
      cursor: pointer;
    }
    .primary {
      background: var(--kibble-feed, #43a96a);
      color: var(--kibble-ink-on-feed, #10301d);
    }
    .secondary {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
    }
    .primary:disabled,
    .secondary:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .close:focus-visible,
    .tile:focus-visible,
    .reset:focus-visible,
    .pager button:focus-visible,
    .primary:focus-visible,
    .secondary:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `;
  }
};
customElements.define("kibble-avatar-picker", KibbleAvatarPicker);

// src/cats-editor.ts
var SCHEMA3 = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } }
];
var FIELD_LABELS3 = {
  device_id: "Kibble device",
  name: "Name (optional)"
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

// src/kibble-cats-card.ts
var EMPTY_ENTITIES2 = { deviceId: "", catPresence: [] };
var REVIEW_LIMIT = 24;
var TRAINING_LIMIT2 = 24;
var DELETE_CONFIRM_WINDOW_MS = 3e3;
var LEARNING_LABEL = { learning: "Learning", paused: "Paused", learned: "Learned" };
var KibbleCatsCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES2;
    this._catsQuery = new WsQuery(() => this.requestUpdate());
    this._reviewFeed = new PagedFeed("kibble/review", () => this.requestUpdate());
    this._trainingFeeds = /* @__PURE__ */ new Map();
    this._imageCache = new ImageUrlCache();
    this._detailGeneration = 0;
    this._sheetTrigger = null;
    /** Every event label saved during the sheet's current open session, keyed by uid -- see
     * `kibble-timeline-card.ts`'s identical field for the full contract; the cats card's own
     * tiles always open a one-element `group`, but the toast logic is shared. */
    this._sheetReviewedEvents = /* @__PURE__ */ new Map();
    this._sheetPhotoUids = /* @__PURE__ */ new Set();
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
    /** Patches the just-changed cat's `avatar`/`avatar_custom` into the cached roster immediately
     * -- `_closeAvatarPicker`'s own `_refreshCats()` still follows right behind for full
     * consistency, but the tile updates the instant the picker reports success rather than
     * waiting on that round trip. */
    this._onAvatarChanged = (event) => {
      const { cat, avatar, avatarCustom } = event.detail;
      this._catsQuery.patch((data) => ({ ...data, cats: data.cats.map((c5) => c5.name === cat ? { ...c5, avatar, avatar_custom: avatarCustom } : c5) }));
    };
    this._toggleSelectMode = () => {
      this._reviewSelectMode = !this._reviewSelectMode;
      this._reviewSelected = /* @__PURE__ */ new Set();
    };
    this._onEventRequested = (event) => {
      this._loadEventDetail(event.detail.uid);
    };
    this._onSamplesRetryRequested = () => {
      const uid = this._sheetSummary?.uid;
      if (uid) this._loadEventDetail(uid);
    };
    this._closeSheet = () => {
      const locale = this.hass?.locale?.language ?? this.hass?.language;
      const message = reviewSummaryMessage({ events: [...this._sheetReviewedEvents.values()], photosUpdated: this._sheetPhotoUids.size }, locale);
      this._sheetSummary = null;
      this._sheetGroup = [];
      this._sheetSamples = null;
      this._sheetSceneSubjects = [];
      this._sheetSessionCats = null;
      this._sheetMultipleCats = false;
      this._sheetSamplesFailed = false;
      this._sheetSampleBusyUid = null;
      this._sheetError = null;
      this._sheetReviewedEvents = /* @__PURE__ */ new Map();
      this._sheetPhotoUids = /* @__PURE__ */ new Set();
      this._sheetTrigger?.focus();
      this._sheetTrigger = null;
      if (message) this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
    };
    /** Saves the person's complete answer for the feeder session. */
    this._onSessionLabelRequested = (event) => {
      const entryId = this._entryId;
      const hass = this.hass;
      if (!entryId || !hass?.callWS) return;
      const { uid, cats, verdict, subjects, closeOnSuccess } = event.detail;
      const request = { uid, ...cats ? { cats } : {}, ...verdict ? { verdict } : {}, ...subjects?.length ? { subjects } : {} };
      this._sheetBusy = true;
      this._sheetError = null;
      labelSession(hass, entryId, request).then((detail) => {
        this._sheetBusy = false;
        this._sheetSummary = detail.event;
        this._sheetSamples = detail.samples;
        this._sheetSceneSubjects = detail.scene_subjects;
        this._sheetSessionCats = detail.cats;
        this._sheetMultipleCats = detail.multiple_cats;
        this._sheetSamplesFailed = false;
        this._reviewFeed.removeItem((item) => item.uid === request.uid || item.uid === detail.event.uid);
        for (const key of this._sheetReviewedEvents.keys()) {
          if (key === detail.event.uid || key.startsWith(detail.event.uid + ":")) this._sheetReviewedEvents.delete(key);
        }
        if (request.verdict) {
          this._sheetReviewedEvents.set(detail.event.uid, { uid: detail.event.uid, event: detail.event, label: request.verdict });
        } else {
          for (const cat of request.cats ?? []) {
            const uid2 = detail.event.uid + ":" + cat.cat;
            this._sheetReviewedEvents.set(uid2, { uid: uid2, event: { kind: cat.ate ? "eat" : "visit", open: detail.event.open, start: detail.event.start }, label: cat.cat });
          }
        }
        this._refreshCats();
        if (closeOnSuccess) this._closeSheet();
        else this.requestUpdate();
      }).catch((err) => {
        this._sheetBusy = false;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
    };
    this._onSampleLabelRequested = (event) => {
      const entryId = this._entryId;
      const hass = this.hass;
      if (!entryId || !hass?.callWS) return;
      const { sampleUid, label } = event.detail;
      this._sheetSampleBusyUid = sampleUid;
      this._sheetError = null;
      labelSample(hass, entryId, { sampleUid, label }).then((sample) => {
        this._sheetSampleBusyUid = null;
        if (this._sheetSamples) this._sheetSamples = this._sheetSamples.map((item) => item.uid === sample.uid ? sample : item);
        this._sheetPhotoUids.add(sampleUid);
        const uid = this._sheetSummary?.uid;
        if (uid) this._loadEventDetail(uid, true);
        this.requestUpdate();
      }).catch((err) => {
        this._sheetSampleBusyUid = null;
        this._sheetError = err instanceof Error ? err.message : "Couldn't save this label.";
        this.requestUpdate();
      });
    };
    this._addName = "";
    this._addBusy = false;
    this._addError = null;
    this._actionError = null;
    this._openMenuFor = null;
    this._deleteConfirmFor = null;
    this._expandedTraining = null;
    this._reviewSelectMode = false;
    this._reviewSelected = /* @__PURE__ */ new Set();
    this._bulkBusy = false;
    this._sheetSummary = null;
    this._sheetGroup = [];
    this._sheetSamples = null;
    this._sheetSamplesFailed = false;
    this._sheetSampleBusyUid = null;
    this._sheetSceneSubjects = [];
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._sheetBusy = false;
    this._sheetError = null;
    this._addPhotosOpen = false;
    this._addPhotosCat = null;
    this._addPhotosFiles = [];
    this._avatarPickerCat = null;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _addName: { state: true },
      _addBusy: { state: true },
      _addError: { state: true },
      _actionError: { state: true },
      _openMenuFor: { state: true },
      _deleteConfirmFor: { state: true },
      _expandedTraining: { state: true },
      _reviewSelectMode: { state: true },
      _reviewSelected: { state: true },
      _bulkBusy: { state: true },
      _sheetSummary: { state: true },
      _sheetGroup: { state: true },
      _sheetSamples: { state: true },
      _sheetSamplesFailed: { state: true },
      _sheetSampleBusyUid: { state: true },
      _sheetBusy: { state: true },
      _sheetError: { state: true },
      _sheetSceneSubjects: { state: true },
      _sheetSessionCats: { state: true },
      _sheetMultipleCats: { state: true },
      _addPhotosOpen: { state: true },
      _addPhotosCat: { state: true },
      _addPhotosFiles: { state: true },
      _avatarPickerCat: { state: true }
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
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-cats-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-cats-card-editor");
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._imageCache.dispose();
    this._reviewFeed.dispose();
    for (const feed of this._trainingFeeds.values()) feed.dispose();
    clearTimeout(this._deleteConfirmTimer);
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
    const entryId = this._entryId;
    if (this.hass && entryId && callWS) {
      this._catsQuery.sync(entryId, () => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
      this._reviewFeed.sync(this.hass, entryId, { entry_id: entryId }, REVIEW_LIMIT);
      if (this._expandedTraining) {
        const cat = this._expandedTraining;
        this._trainingFeed(cat).sync(this.hass, `${entryId}:${cat}`, { entry_id: entryId, cat }, TRAINING_LIMIT2);
      }
    }
  }
  _trainingFeed(catName) {
    let feed = this._trainingFeeds.get(catName);
    if (!feed) {
      feed = new PagedFeed("kibble/training", () => this.requestUpdate());
      this._trainingFeeds.set(catName, feed);
    }
    return feed;
  }
  render() {
    if (!this._config || !this.hass) return A;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const storage = this._catsQuery.state.data?.storage ?? null;
    const spoolLine = storage ? spoolSummary(storage.device_spool) : null;
    return b2`
      <ha-card>
        <div class="container">
          ${this._config.name ? b2`<div class="label">${this._config.name}</div>` : A}
          ${this._actionError ? this._renderActionError() : A}
          <section class="roster">
            ${cats.length === 0 ? b2`<p class="empty">No cats yet. Add one to start training.</p>` : b2`<div class="cat-list">${cats.map((cat) => this._renderCatTile(cat))}</div>`}
            ${this._renderAddCat()}
          </section>
          ${this._expandedTraining ? this._renderTrainingPanel(this._expandedTraining) : A}
          ${this._renderReview()}
          ${storage ? b2`
                <p class="storage-line">
                  <span>${storageSummary(storage)}</span>
                  ${spoolLine ? b2`<span class="quiet">${spoolLine}</span>` : A}
                </p>
              ` : A}
        </div>
      </ha-card>
      <kibble-label-sheet
        ?open=${this._sheetSummary !== null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cats=${cats}
        .summary=${this._sheetSummary}
        .samples=${this._sheetSamples}
        .sceneSubjects=${this._sheetSceneSubjects}
        .sessionCats=${this._sheetSessionCats}
        .multipleCats=${this._sheetMultipleCats}
        .samplesFailed=${this._sheetSamplesFailed}
        .group=${this._sheetGroup}
        .busy=${this._sheetBusy}
        .error=${this._sheetError}
        .sampleBusyUid=${this._sheetSampleBusyUid}
        @close-requested=${this._closeSheet}
        @session-label-requested=${this._onSessionLabelRequested}
        @sample-label-requested=${this._onSampleLabelRequested}
        @event-requested=${this._onEventRequested}
        @samples-retry-requested=${this._onSamplesRetryRequested}
      ></kibble-label-sheet>
      <input type="file" class="add-photos-file-input" multiple accept="image/*" hidden @change=${(e6) => this._onAddPhotosChosen(e6)} />
      <kibble-add-photos-sheet
        ?open=${this._addPhotosOpen}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cat=${this._addPhotosCat ?? void 0}
        .files=${this._addPhotosFiles}
        @close-requested=${() => this._closeAddPhotos()}
      ></kibble-add-photos-sheet>
      <kibble-avatar-picker
        ?open=${this._avatarPickerCat !== null}
        .hass=${this.hass}
        .entryId=${this._entryId}
        .cache=${this._imageCache}
        .cat=${cats.find((c5) => c5.name === this._avatarPickerCat) ?? null}
        @close-requested=${() => this._closeAvatarPicker()}
        @avatar-changed=${this._onAvatarChanged}
      ></kibble-avatar-picker>
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
  _renderCatTile(cat) {
    const now = /* @__PURE__ */ new Date();
    const seen = cat.last_seen != null ? `Seen ${relativeTimeSentence(new Date(cat.last_seen * 1e3), now)}` : "Not seen yet";
    const meals = `${cat.meals_today} ${cat.meals_today === 1 ? "meal" : "meals"} today`;
    const trained = cat.training.total === 0 ? "Not trained yet" : `${cat.training.total} ${cat.training.total === 1 ? "photo" : "photos"} trained`;
    const deviceId = this._config?.device_id;
    const recognitionEntityId = this.hass && deviceId ? findCatRecognitionEntityId(this.hass.entities ?? {}, deviceId, cat.name) : void 0;
    const recognition = this.hass ? readCatRecognition(this.hass, recognitionEntityId) : null;
    return b2`
      <div class="cat-tile">
        <kibble-avatar class=${cat.present ? "present" : ""} .hass=${this.hass} .name=${cat.name} .colorIndex=${cat.color} .asset=${cat.avatar} .cache=${this._imageCache}></kibble-avatar>
        <div class="cat-text">
          <span class="cat-name">${cat.name}</span>
          <span class="cat-meta">${seen}, ${meals}</span>
          <span class="cat-meta quiet">${trained}</span>
          ${recognition ? b2`
                <div class="learning-row" aria-label=${`${recognition.percent}% recognized, ${LEARNING_LABEL[recognition.state]}`}>
                  <span class="learning-track"><span class="learning-fill" style="width:${recognition.percent}%"></span></span>
                  <span class="learning-percent">${recognition.percent}%</span>
                </div>
                <span class="learning-state">${LEARNING_LABEL[recognition.state]}</span>
              ` : A}
        </div>
        <div class="cat-menu" @focusout=${this._onCatMenuFocusOut} @keydown=${this._onCatMenuKeydown}>
          <button
            type="button"
            class="cat-menu-trigger"
            aria-haspopup="menu"
            aria-label=${`Options for ${cat.name}`}
            @click=${() => this._toggleCatMenu(cat.name)}
          >
            ${mdiIcon("dotsVertical")}
          </button>
          ${this._openMenuFor === cat.name ? this._renderCatMenu(cat) : A}
        </div>
      </div>
    `;
  }
  _renderCatMenu(cat) {
    const confirming = this._deleteConfirmFor === cat.name;
    const expanded = this._expandedTraining === cat.name;
    return b2`
      <div class="menu" role="menu">
        <button type="button" role="menuitem" @click=${() => this._openAvatarPicker(cat.name)}>Change picture</button>
        <button type="button" role="menuitem" @click=${() => this._toggleTraining(cat.name)}>${expanded ? "Hide training photos" : `View training (${cat.training.total})`}</button>
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
  _toggleTraining(name) {
    this._openMenuFor = null;
    this._expandedTraining = this._expandedTraining === name ? null : name;
  }
  _openAvatarPicker(name) {
    this._openMenuFor = null;
    this._avatarPickerCat = name;
  }
  _closeAvatarPicker() {
    this._avatarPickerCat = null;
    this._refreshCats();
  }
  /** Tap-twice confirm, the same window/pattern `kibble-settings-dialog`'s cloud toggle uses --
   * deleting a cat is destructive (drops every labelled sample and the classifier model) so it
   * needs a second, deliberate tap rather than a single accidental one. */
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
      this._trainingFeeds.delete(name);
      if (this._expandedTraining === name) this._expandedTraining = null;
      this._refreshCats();
    }).catch((err) => {
      this._actionError = { message: `Couldn't delete ${name}. ${describeWsError(err)}`, retry: () => this._deleteCat(name) };
    });
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
    const request = name ? this._callWS("kibble/cats/add", { name }) : null;
    if (!request) return;
    this._addBusy = true;
    this._addError = null;
    try {
      await request;
      this._addName = "";
      this._refreshCats();
    } catch (err) {
      this._addError = describeWsError(err);
    } finally {
      this._addBusy = false;
    }
  }
  _renderTrainingPanel(catName) {
    const feed = this._trainingFeed(catName);
    const state = feed.state;
    return b2`
      <section class="training">
        <div class="training-heading">
          <span>${catName}\u2019s training photos${state.items !== null ? ` (${state.total})` : ""}</span>
          <button type="button" class="icon-button" aria-label="Close training photos" @click=${() => this._toggleTraining(catName)}>${mdiIcon("close")}</button>
        </div>
        <div class="training-actions">
          <button type="button" class="add-photos-button" @click=${() => this._openAddPhotos(catName)}>Add photos</button>
        </div>
        ${state.error ? this._renderPagedError(state.error, () => feed.refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT2)) : A}
        ${state.items && state.items.length === 0 ? b2`<p class="empty">No training photos yet.</p>` : A}
        <div class="training-grid">${(state.items ?? []).map((sample) => this._renderTrainingTile(catName, sample))}</div>
        ${this._renderPager(state, TRAINING_LIMIT2, () => feed.previous(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT2), () => feed.next(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT2))}
      </section>
    `;
  }
  _renderTrainingTile(catName, sample) {
    const captured = new Date(sample.created * 1e3).toLocaleDateString();
    return b2`
      <div class="training-tile">
        <span class="training-crops">
          ${sample.body ? b2`<kibble-image .hass=${this.hass} .asset=${sample.body} .cache=${this._imageCache} alt=""></kibble-image>` : A}
          ${sample.face ? b2`<kibble-image .hass=${this.hass} .asset=${sample.face} .cache=${this._imageCache} alt=""></kibble-image>` : A}
        </span>
        <button type="button" class="remove" aria-label=${`Remove this training photo of ${catName}, added ${captured}`} @click=${() => this._removeTraining(catName, sample.uid)}>
          ${"\xD7"}
        </button>
      </div>
    `;
  }
  _removeTraining(catName, uid) {
    const request = this._callWS("kibble/training/remove", { uids: [uid] });
    if (!request) return;
    request.then(() => {
      this._trainingFeed(catName).refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT2);
      this._refreshCats();
    }).catch((err) => {
      this._actionError = { message: `Couldn't remove this photo. ${describeWsError(err)}`, retry: () => this._removeTraining(catName, uid) };
    });
  }
  _openAddPhotos(catName) {
    this._addPhotosCat = catName;
    this.renderRoot.querySelector(".add-photos-file-input")?.click();
  }
  _onAddPhotosChosen(event) {
    const input = event.target;
    const files = input.files ? [...input.files] : [];
    input.value = "";
    if (files.length === 0) return;
    this._addPhotosFiles = files;
    this._addPhotosOpen = true;
  }
  _closeAddPhotos() {
    this._addPhotosOpen = false;
    const catName = this._addPhotosCat;
    this._refreshCats();
    if (catName && this._expandedTraining === catName) {
      this._trainingFeed(catName).refresh(this.hass, { entry_id: this._entryId, cat: catName }, TRAINING_LIMIT2);
    }
  }
  _renderReview() {
    const state = this._reviewFeed.state;
    const cats = this._catsQuery.state.data?.cats ?? [];
    const count = state.items !== null ? state.total : null;
    return b2`
      <section class="review">
        <div class="review-heading">
          <span>${count === null ? "To review" : count === 0 ? "Nothing to review" : count === 1 ? "1 to review" : `${count} to review`}</span>
          ${state.items && state.items.length > 0 ? b2`<button type="button" class="select-toggle" @click=${this._toggleSelectMode}>${this._reviewSelectMode ? "Cancel" : "Select"}</button>` : A}
        </div>
        ${this._reviewSelectMode && this._reviewSelected.size > 0 ? this._renderBulkBar(cats) : A}
        ${state.error ? this._renderPagedError(state.error, () => this._reviewFeed.refresh(this.hass, { entry_id: this._entryId }, REVIEW_LIMIT)) : A}
        ${state.items && state.items.length === 0 && !state.error ? b2`<p class="empty">Nothing to review. New crops arrive when the feeder sees a cat it can't yet name.</p>` : b2`<div class="review-grid" @keydown=${this._onReviewGridKeydown}>${(state.items ?? []).map((event) => this._renderReviewTile(event))}</div>`}
        ${this._renderPager(state, REVIEW_LIMIT, () => this._reviewFeed.previous(this.hass, { entry_id: this._entryId }, REVIEW_LIMIT), () => this._reviewFeed.next(this.hass, { entry_id: this._entryId }, REVIEW_LIMIT))}
      </section>
    `;
  }
  _renderReviewTile(event) {
    const thumbAsset = rowThumbAsset(event);
    const selected = this._reviewSelected.has(event.uid);
    const when = timeLabel(event.start);
    const label = this._reviewSelectMode ? `${selected ? "Deselect" : "Select"}, captured ${when}` : `Review this one, captured ${when}`;
    return b2`
      <div class="review-tile">
        <button type="button" class="review-thumb" aria-pressed=${this._reviewSelectMode ? selected : A} aria-label=${label} @click=${(e6) => this._onReviewTileClick(event, e6.currentTarget)}>
          ${thumbAsset ? b2`<kibble-image .hass=${this.hass} .asset=${thumbAsset} .cache=${this._imageCache} alt=""></kibble-image>` : b2`<span class="neutral-icon">${catSilhouette()}</span>`}
          ${this._reviewSelectMode && selected ? b2`<span class="review-check">${mdiIcon("check")}</span>` : A}
        </button>
        <span class="review-caption">${when}</span>
      </div>
    `;
  }
  _onReviewGridKeydown(event) {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const grid = event.currentTarget;
    const buttons = [...grid.querySelectorAll(".review-thumb")];
    const focused = this.renderRoot.querySelector(":focus");
    const currentIndex = focused ? buttons.indexOf(focused) : -1;
    if (currentIndex === -1) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    buttons[(currentIndex + delta + buttons.length) % buttons.length]?.focus();
  }
  _onReviewTileClick(event, trigger) {
    if (this._reviewSelectMode) {
      const next = new Set(this._reviewSelected);
      if (next.has(event.uid)) next.delete(event.uid);
      else next.add(event.uid);
      this._reviewSelected = next;
      return;
    }
    this._openSheet(event, trigger);
  }
  _renderBulkBar(cats) {
    return b2`
      <div class="bulk-bar">
        <span>${this._reviewSelected.size} selected</span>
        <div class="bulk-actions">
          ${cats.map((cat) => b2`<button type="button" class="chip" ?disabled=${this._bulkBusy} @click=${() => this._bulkLabel(cat.name)}>${cat.name}</button>`)}
          <button type="button" class="chip chip-muted" ?disabled=${this._bulkBusy} @click=${() => this._bulkLabel("not_a_cat")}>Not a cat</button>
        </div>
      </div>
    `;
  }
  _bulkLabel(label) {
    const hass = this.hass;
    const entryId = this._entryId;
    if (!hass?.callWS || !entryId || this._reviewSelected.size === 0) return;
    const uids = [...this._reviewSelected];
    this._bulkBusy = true;
    labelEvents(hass, entryId, { uids, label }).then(() => {
      this._bulkBusy = false;
      const uidSet = new Set(uids);
      this._reviewFeed.removeItem((item) => uidSet.has(item.uid));
      this._reviewSelected = /* @__PURE__ */ new Set();
      this._reviewSelectMode = false;
      this._refreshCats();
    }).catch((err) => {
      this._bulkBusy = false;
      this._actionError = { message: `Couldn't label those. ${describeWsError(err)}`, retry: () => this._bulkLabel(label) };
      this.requestUpdate();
    });
  }
  _renderPager(state, limit, onPrevious, onNext) {
    if (state.items === null || !state.hasNext && !state.hasPrevious) return A;
    const start = state.pageIndex * limit + 1;
    const end = state.pageIndex * limit + state.items.length;
    return b2`
      <div class="pager">
        <button type="button" ?disabled=${!state.hasPrevious || state.loading} @click=${onPrevious}>Previous</button>
        <span>${start}\u2013${end} of ${state.total}</span>
        <button type="button" ?disabled=${!state.hasNext || state.loading} @click=${onNext}>Next</button>
      </div>
    `;
  }
  _renderPagedError(message, retry) {
    return b2`
      <div class="error">
        <span>${message}</span>
        <button type="button" @click=${retry}>Try again</button>
      </div>
    `;
  }
  /** Resolves any event row uid to its complete feeder session for the shared sheet. */
  _loadEventDetail(uid, keepData = false) {
    const member = this._sheetGroup.find((candidate) => candidate.uid === uid);
    if (member) this._sheetSummary = member;
    if (!keepData) {
      this._sheetSamples = null;
      this._sheetSceneSubjects = [];
      this._sheetSessionCats = null;
      this._sheetMultipleCats = false;
      this._sheetSamplesFailed = false;
    }
    this._sheetError = null;
    const generation = ++this._detailGeneration;
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) {
      this._sheetSamplesFailed = !keepData;
      return;
    }
    callWS({ type: "kibble/event", entry_id: entryId, uid }).then((result) => {
      if (generation !== this._detailGeneration) return;
      const detail = result;
      this._sheetSummary = detail.event;
      this._sheetSamples = detail.samples;
      this._sheetSceneSubjects = detail.scene_subjects;
      this._sheetSessionCats = detail.cats;
      this._sheetMultipleCats = detail.multiple_cats;
      this._sheetSamplesFailed = false;
      this.requestUpdate();
    }).catch(() => {
      if (generation !== this._detailGeneration) return;
      if (!keepData) this._sheetSamplesFailed = true;
      this.requestUpdate();
    });
  }
  _openSheet(event, trigger) {
    this._sheetTrigger = trigger;
    this._sheetGroup = [event];
    this._sheetReviewedEvents = /* @__PURE__ */ new Map();
    this._sheetPhotoUids = /* @__PURE__ */ new Set();
    this._sheetSessionCats = null;
    this._sheetMultipleCats = false;
    this._loadEventDetail(event.uid);
  }
  _refreshCats() {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return;
    this._catsQuery.refresh(() => callWS({ type: "kibble/cats", entry_id: entryId }).then((r6) => r6));
  }
  /** Shared `entry_id`-injecting wrapper for the WS commands this card calls directly (delete
   * cat, add cat, remove a training sample) -- `null` when the connection or entry isn't
   * resolved yet, the same guard every WS call site here already repeats individually. */
  _callWS(type, payload) {
    const callWS = this.hass?.callWS;
    const entryId = this._entryId;
    if (!callWS || !entryId) return null;
    return callWS({ type, entry_id: entryId, ...payload }).then((r6) => r6);
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
    .roster {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cat-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .cat-tile {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    kibble-avatar {
      --kibble-avatar-size: 44px;
    }
    kibble-avatar.present {
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color, #03a9f4);
    }
    .cat-text {
      display: flex;
      flex-direction: column;
      line-height: 1.35;
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
    .cat-meta.quiet {
      opacity: 0.85;
    }
    .learning-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
    }
    .learning-track {
      flex: 1 1 auto;
      max-width: 96px;
      height: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      overflow: hidden;
    }
    .learning-fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--kibble-feed, #43a96a);
    }
    .learning-percent {
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .learning-state {
      font-size: 11px;
      font-weight: 600;
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
      min-width: 180px;
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
    .menu button:focus-visible,
    .icon-button:focus-visible,
    .select-toggle:focus-visible,
    .review-thumb:focus-visible,
    .chip:focus-visible,
    .pager button:focus-visible,
    .remove:focus-visible,
    .add-photos-button:focus-visible,
    .add-cat button:focus-visible,
    .add-cat input:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
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
    .training {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color);
    }
    .training-heading,
    .review-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--kibble-text-title);
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .training-actions {
      display: flex;
    }
    .add-photos-button {
      min-height: 40px;
      padding: 0 16px;
      border-radius: 8px;
      border: none;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .icon-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .training-grid,
    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
      gap: 10px;
    }
    .training-tile {
      position: relative;
    }
    .training-crops {
      display: flex;
      gap: 2px;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
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
    .review {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .select-toggle {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 0 14px;
      min-height: 32px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .bulk-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      padding: 8px 10px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      font-size: var(--kibble-text-caption);
      color: var(--primary-text-color);
    }
    .bulk-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      border: none;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      padding: 0 14px;
      min-height: 32px;
      cursor: pointer;
    }
    .chip.chip-muted {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .review-tile {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .review-thumb {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border: none;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      padding: 0;
      cursor: pointer;
      overflow: hidden;
    }
    .neutral-icon {
      display: block;
      width: 62%;
      height: 62%;
      margin: 19% auto;
      color: color-mix(in srgb, var(--primary-text-color) 40%, transparent);
    }
    .review-check {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--kibble-feed, #43a96a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .review-caption {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
    }
    .pager button {
      border: none;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 0 14px;
      min-height: 36px;
      font: inherit;
      font-size: var(--kibble-text-caption);
      font-weight: 600;
      cursor: pointer;
    }
    .pager button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .storage-line {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: var(--kibble-text-caption);
      color: var(--secondary-text-color);
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .storage-line .quiet {
      opacity: 0.75;
    }
    @container (max-width: 360px) {
      .training-grid,
      .review-grid {
        grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
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
  description: "Enrolled cats, presence, and the review queue for whatever the feeder couldn't name.",
  preview: true
});

// src/kibble-card.ts
var EMPTY_ENTITIES3 = { deviceId: "", catPresence: [] };
var PORTION_OPTIONS = [1, 2, 3, 4, 5];
var PORTION_SEGMENT_OPTIONS = PORTION_OPTIONS.map((n6) => ({ value: String(n6), label: String(n6) }));
var FEED_ROW_STYLES = `
  .bubble-button-card-container { background: var(--kibble-feed, #43a96a) !important; height: 56px !important; }
  .bubble-name { font-size: 17px; font-weight: 600; }
  .bubble-name, .bubble-icon { color: var(--kibble-ink-on-amber, #241a07) !important; }
  .bubble-icon-container { background: color-mix(in srgb, var(--kibble-ink-on-amber, #241a07) 12%, transparent) !important; }
`;
function portionStyles(selected, disabled) {
  return `
  .bubble-button-card-container { height: var(--kibble-touch-target, 48px) !important; ${selected ? "background: var(--kibble-feed, #43a96a) !important;" : ""} ${disabled ? "opacity: 0.5;" : ""} }
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
    /** The last `feeding` boolean `willUpdate` reacted to, so a transition (not just "still on"
     * or "still off") drives `_feedRequest`/`_pourSource`/the timeline refetch exactly once each,
     * regardless of how many unrelated `hass` ticks land in between. */
    this._wasFeedingForRequest = false;
    /** Bumped on every `feeding` transition so `kibble/timeline`'s own watch key changes even
     * when the entity cycles back to a state string it already had (off -> on -> off would
     * otherwise look "unchanged" to `WsQuery`) -- same trick `_calibrationGeneration` uses below. */
    this._timelineGeneration = 0;
    // The bowl's mixed-food share reads `kibble/timeline`'s newest few rows for the most recent
    // feed that recorded a per-hopper split (`lib/bowl-mix.ts`); refetched on every feed-state
    // transition, never on a timer.
    this._timelineQuery = new WsQuery(() => this.requestUpdate());
    // Shared by the hero status avatar and live detection labels for this card's lifetime.
    this._imageCache = new ImageUrlCache();
    // The status overlay's avatar needs the named cat's color/photo from the roster; a private
    // field (not a reactive property) since `WsQuery` drives its own `requestUpdate` on change.
    this._catsQuery = new WsQuery(() => this.requestUpdate());
    // No entity's state changing correlates with a calibration change the way `lastSeenPet`
    // does for the cat roster above -- the wizard is the only thing that ever mutates this, so
    // it bumps this generation counter itself (`_onCalibrationChanged`) instead of a watch key.
    this._calibrationQuery = new WsQuery(() => this.requestUpdate());
    this._calibrationGeneration = 0;
    /** The calibration wizard, opened from the card itself rather than from the settings panel.
     *
     * It lives here as well as inside `kibble-settings-dialog` because a dashboard that sets
     * `settings_hash` never opens that panel at all: the gear navigates to the operator's own
     * Bubble Card pop-up instead, and the wizard inside the card's panel is then unreachable --
     * which is exactly what happened on the real dashboard (2026-09-19). A pop-up row can now
     * fire `kibble: "calibrate"` the same way its feed rows already fire `kibble: "feed"`. */
    this._calibrationOpen = false;
    this._detectionAreasOpen = false;
    this._hopperSheetOpen = false;
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
      } else if (action.kibble === "calibrate") {
        this._calibrationOpen = true;
      }
    };
    this._onHopper1PortionSelected = (event) => {
      this._setHopperPortion(this._entities.feedAmountHopper1, event);
    };
    this._onHopper2PortionSelected = (event) => {
      this._setHopperPortion(this._entities.feedAmountHopper2, event);
    };
    this._onFeedActivate = async () => {
      if (!this._entities.deviceId || this._feedRequest.phase === "requesting") return;
      const single = this._singleHopper();
      const plan = single ? { hopper: "both", amount: this._numberState(this._entities.feedAmount) ?? 1 } : dualFeedPlan(this._numberState(this._entities.feedAmountHopper1) ?? 0, this._numberState(this._entities.feedAmountHopper2) ?? 0);
      if (!plan) return;
      this._clearFeedRequestTimeoutTimer();
      this._clearFeedErrorTimer();
      this._feedError = null;
      this._feedRequest = feedRequestSubmitted();
      this._armFeedRequestTimeout();
      this._pourSource = plan.hopper;
      try {
        await this.hass.callService("kibble", "feed", {
          device_id: this._entities.deviceId,
          hopper: plan.hopper,
          amount: plan.amount,
          ...plan.amount2 !== void 0 ? { amount2: plan.amount2 } : {}
        });
      } catch {
        this._clearFeedRequestTimeoutTimer();
        this._feedRequest = feedRequestReset();
        this._pourSource = null;
        this._feedError = "Try hold again";
        this._resetFeedErrorAfter(5e3);
      }
    };
    this._onCancelActivate = () => {
      if (!this._entities.deviceId) return;
      this.hass.callService("kibble", "cancel_feed", { device_id: this._entities.deviceId });
    };
    // Unset `settings_hash` (the HACS default -- the card stands alone with no pop-up dashboard):
    // open the in-card dialog, exactly as before. Set (a dashboard that defines a `#settings`
    // Bubble Card pop-up): navigate there instead, so the whole dashboard shares one settings
    // surface rather than this card keeping a second, inconsistent one alive underneath it.
    // Assigning `location.hash` is not enough: HA's router rewrites a bare hash to `#/…` and
    // Bubble Card only listens for the frontend's own `location-changed` event.
    this._openSettings = () => {
      this._notifyHeroActivity();
      const hash = this._config?.settings_hash;
      if (hash) {
        history.pushState(null, "", hash);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
        return;
      }
      this._settingsOpen = true;
    };
    /** Forwards a click/focus on `.gear-button` -- chrome that overlaps the hero's video from
     * *outside* its shadow DOM -- into the hero's own idle timer, exactly as if the activity had
     * happened inside it. */
    this._notifyHeroActivity = () => {
      this.renderRoot.querySelector("kibble-live-hero")?.notifyActivity();
    };
    /** Mirrors `<kibble-live-hero>`'s own fade onto `.gear-button`, which has no other way to
     * learn its controls just faded (it lives outside the hero's shadow DOM entirely). */
    this._onHeroOverlayIdleChanged = (e6) => {
      this._heroControlsVisible = e6.detail.visible;
    };
    /** `kibble-live-hero` sets its own `--kibble-hero-aspect` on itself once it learns the
     * stream's real ratio (`_reportMediaAspect`), but that only sizes that one element -- `.hero`,
     * its ANCESTOR in this card's own shadow tree, needs its own copy of the same custom property
     * for its own `aspect-ratio` rule (custom properties inherit downward only, never up from a
     * child to its parent). Set imperatively, not through a reactive property: nothing else in
     * this card's own template depends on the value, so there is no reason to trigger a full
     * re-render on every `loadedmetadata`/`load` tick just to patch one CSS custom property
     * lit-html was never asked to track in the first place. */
    this._onMediaAspectChanged = (e6) => {
      const ratio = e6.detail?.ratio;
      if (!Number.isFinite(ratio) || ratio <= 0) return;
      this.renderRoot.querySelector(".hero")?.style.setProperty("--kibble-hero-aspect", String(ratio));
    };
    this._closeSettings = () => {
      this._settingsOpen = false;
    };
    /** Opens the wizard when the dashboard navigates to `calibrate_hash` (default
     * `#calibrate`).
     *
     * A hash, not a `fire-dom-event` row, because the operator's settings pop-up is a Bubble
     * Card that lives OUTSIDE this element: its rows cannot reach the `hass-action` listener on
     * the card's own controls, so the existing `kibble:` action mechanism is unavailable to
     * them. A hash crosses that boundary, and it is the same mechanism `settings_hash` already
     * uses to send the gear the other way. */
    this._onHashChange = () => {
      const popup = popupForHash(window.location.hash, this._config);
      if (popup === "calibrate") this._calibrationOpen = true;
      if (popup === "detection-areas") this._detectionAreasOpen = true;
    };
    this._closeCalibration = (event) => {
      event.stopPropagation();
      this._calibrationOpen = false;
      this._clearPopupHash();
    };
    this._closeDetectionAreas = (event) => {
      event.stopPropagation();
      this._detectionAreasOpen = false;
      this._clearPopupHash();
    };
    this._openHopperSheet = () => {
      this._hopperSheetOpen = true;
    };
    this._closeHopperSheet = (event) => {
      event.stopPropagation();
      this._hopperSheetOpen = false;
    };
    /** The wizard just changed a hopper's curve (or discarded/cleared one) -- bump the sync key
     * `willUpdate` compares so the bowl's calibrated-percentage display refetches, the same way
     * an entity's own state change would if calibration had one to watch. */
    this._onCalibrationChanged = () => {
      this._calibrationGeneration += 1;
      this.requestUpdate();
    };
    this._settingsOpen = false;
    this._bubble = false;
    this._feedRequest = FEED_REQUEST_IDLE;
    this._feedError = null;
    this._pourSource = null;
    this._heroControlsVisible = true;
    void bubbleCardAvailable().then((ok) => {
      this._bubble = ok;
    });
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _settingsOpen: { state: true },
      _calibrationOpen: { state: true },
      _detectionAreasOpen: { state: true },
      _hopperSheetOpen: { state: true },
      _bubble: { state: true },
      _feedRequest: { state: true },
      _feedError: { state: true },
      _pourSource: { state: true },
      _heroControlsVisible: { state: true }
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
    const kibbleEntity = Object.values(hass.entities ?? {}).find((entry) => entry.platform === "kibble");
    return { type: "custom:kibble-card", device_id: kibbleEntity?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-card-editor");
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("hashchange", this._onHashChange);
    window.addEventListener("location-changed", this._onHashChange);
    this._onHashChange();
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
    window.removeEventListener("hashchange", this._onHashChange);
    window.removeEventListener("location-changed", this._onHashChange);
    this._clearFeedRequestTimeoutTimer();
    this._clearFeedErrorTimer();
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._imageCache.dispose();
  }
  willUpdate() {
    const deviceId = this._config?.device_id;
    this.classList.toggle("dual-hopper", this.hass ? !this._singleHopper() : false);
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
    if (this.hass && this._entryId && callWS && this._entities.bowlFill) {
      const entryId = this._entryId;
      this._calibrationQuery.sync(
        `${entryId}:${this._calibrationGeneration}`,
        () => callWS({ type: "kibble/calibration", entry_id: entryId }).then((result) => result)
      );
    }
    if (this.hass && this._entities.feeding) {
      const feedingNow = this.hass.states[this._entities.feeding]?.state === "on";
      if (feedingNow !== this._wasFeedingForRequest) {
        this._wasFeedingForRequest = feedingNow;
        this._feedRequest = feedRequestFeedingChanged(this._feedRequest, feedingNow);
        if (feedingNow) {
          this._clearFeedRequestTimeoutTimer();
          this._feedError = null;
        } else {
          this._pourSource = null;
        }
        this._timelineGeneration += 1;
      }
    }
    if (this.hass && this._entryId && callWS) {
      const entryId = this._entryId;
      this._timelineQuery.sync(
        `${entryId}:${this._timelineGeneration}`,
        () => callWS({ type: "kibble/timeline", entry_id: entryId, limit: 5 }).then((result) => result)
      );
    }
  }
  render() {
    if (!this._config || !this.hass) return A;
    const e6 = this._entities;
    const feedingState = e6.feeding ? this.hass.states[e6.feeding]?.state : void 0;
    const coreIds = [e6.feeding, e6.bowlFill, e6.schedule].filter((id) => Boolean(id));
    const coreStates = coreIds.map((id) => this.hass.states[id]?.state);
    const status = deriveFeederStatus(coreStates, feedingState);
    const feeding = feedingState === "on";
    const bowlFill = this._numberState(e6.bowlFill);
    const fillSource = e6.bowlFill ? this.hass.states[e6.bowlFill]?.attributes?.source ?? null : null;
    const calibrationHopper = displayCalibrationHopper(this._calibrationQuery.state.data);
    const hopperLevel1 = parseHopperLevel(e6.hopperLevel1 && this.hass.states[e6.hopperLevel1]?.state);
    const hopperLevel2 = parseHopperLevel(e6.hopperLevel2 && this.hass.states[e6.hopperLevel2]?.state);
    const hopperRemaining1 = e6.hopperRemaining1 ? parseHopperRemaining(this.hass.states[e6.hopperRemaining1]) : null;
    const hopperRemaining2 = e6.hopperRemaining2 ? parseHopperRemaining(this.hass.states[e6.hopperRemaining2]) : null;
    const singleHopper = this._singleHopper();
    const food1 = e6.hopperFood1 ? hopperFoodName(this.hass.states[e6.hopperFood1]) : null;
    const food2 = e6.hopperFood2 ? hopperFoodName(this.hass.states[e6.hopperFood2]) : null;
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e6.feedAmount) ?? 1;
    const hopperAmount1 = this._numberState(e6.feedAmountHopper1) ?? 0;
    const hopperAmount2 = this._numberState(e6.feedAmountHopper2) ?? 0;
    const totalPortions = singleHopper ? feedAmount : hopperAmount1 + hopperAmount2;
    const overlay = this._heroOverlay(status);
    const feedRequestLabel = this._feedError ?? (this._feedRequest.phase === "requesting" ? "Requesting\u2026" : "Hold to feed");
    const feedControlLabel = feeding ? "Feeding" : feedRequestLabel;
    const dualFeedIsEmpty = !singleHopper && hopperAmount1 === 0 && hopperAmount2 === 0;
    const feedControlDisabled = status === "unreachable" || !feeding && this._feedRequest.phase === "requesting" || dualFeedIsEmpty;
    const feedControlPending = !feeding && this._feedRequest.phase === "requesting";
    const darkMode = this.hass.themes?.darkMode === true;
    const bowlMix = deriveBowlMix(this._timelineQuery.state.data?.items ?? [], singleHopper);
    return b2`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">
                <kibble-live-hero
                  .hass=${this.hass}
                  .cats=${this._catsQuery.state.data?.cats ?? []}
                  .cache=${this._imageCache}
                  .cameraEntity=${e6.camera}
                  .scryptedId=${this._config.scrypted_id}
                  .entryId=${this._entryId}
                  .overlayEntity=${e6.detectionOverlaySwitch}
                  .callCatsEntity=${e6.callCatsButton}
                  .externalPin=${this._settingsOpen}
                  @overlay-idle-changed=${this._onHeroOverlayIdleChanged}
                  @media-aspect-changed=${this._onMediaAspectChanged}
                ></kibble-live-hero>
              </div>
              <div class="hero-status">
                <span class="live-dot" ?hidden=${!overlay.live}></span>
                ${overlay.catName ? b2`<kibble-avatar
                      .hass=${this.hass}
                      .name=${overlay.catName}
                      .colorIndex=${overlay.colorIndex}
                      .asset=${overlay.avatarAsset}
                      .cache=${this._imageCache}
                    ></kibble-avatar>` : A}
                <span class="hero-status-text" data-tone=${overlay.tone}>${overlay.text}</span>
              </div>
              <button
                class="gear-button ${this._heroControlsVisible ? "" : "idle-hidden"}"
                aria-label="Settings"
                @click=${this._openSettings}
                @focus=${this._notifyHeroActivity}
              >
                ${mdiIcon("cog")}
              </button>
              ${this._config.name ? b2`<div class="name-chip">${this._config.name}</div>` : A}
            </div>
            <div class="side">
            <div class="panel">
            <kibble-bowl
              class="bowl-art"
              .fill=${bowlFill}
              .fillSource=${fillSource}
              .calibration=${calibrationHopper}
              .hopperLevel1=${hopperLevel1}
              .hopperLevel2=${hopperLevel2}
              .hopperRemaining1=${hopperRemaining1}
              .hopperRemaining2=${hopperRemaining2}
              .singleHopper=${singleHopper}
              .food1=${food1}
              .food2=${food2}
              .feeding=${feeding}
              .portions=${totalPortions}
              .darkMode=${darkMode}
              .bowlMix=${bowlMix}
              .pourSource=${this._pourSource}
              @hopper-detail-requested=${this._openHopperSheet}
            ></kibble-bowl>
            <div class="controls" @hass-action=${this._onBubbleAction}>
              <!-- Always this card's own controls, never a Bubble Card row.
                   Delegating the feed action to Bubble looked native on a Bubble dashboard
                   and behaved badly everywhere it mattered: no hold animation (Bubble has
                   none to drive), and on Android a long press raised the OS text-selection
                   magnifier because that row suppresses neither selection nor the callout.
                   A press-and-hold control has to own its own pointer handling. -->
              ${singleHopper ? b2`
                    <kibble-segmented-picker
                      class="picker-full"
                      .value=${String(feedAmount)}
                      .options=${PORTION_SEGMENT_OPTIONS}
                      group-label="Feed amount, portions"
                      ?disabled=${status === "unreachable" || feeding}
                      @option-selected=${this._onPortionSelected}
                    ></kibble-segmented-picker>
                    <kibble-stepper
                      class="picker-compact"
                      .value=${feedAmount}
                      ?disabled=${status === "unreachable" || feeding}
                      @value-selected=${this._onPortionSelected}
                    ></kibble-stepper>
                  ` : b2`
                    <div class="hopper-row">
                      <span class="hopper-row-label">${food1 ?? "Hopper 1"}</span>
                      <kibble-stepper
                        .value=${hopperAmount1}
                        .min=${0}
                        .max=${5}
                        aria-label="${food1 ?? "Hopper 1"} portions"
                        ?disabled=${status === "unreachable" || feeding}
                        @value-selected=${this._onHopper1PortionSelected}
                      ></kibble-stepper>
                    </div>
                    <div class="hopper-row">
                      <span class="hopper-row-label">${food2 ?? "Hopper 2"}</span>
                      <kibble-stepper
                        .value=${hopperAmount2}
                        .min=${0}
                        .max=${5}
                        aria-label="${food2 ?? "Hopper 2"} portions"
                        ?disabled=${status === "unreachable" || feeding}
                        @value-selected=${this._onHopper2PortionSelected}
                      ></kibble-stepper>
                    </div>
                  `}
              <kibble-hold-button
                .label=${feedControlLabel}
                .variant=${feeding ? "cancel" : "feed"}
                ?disabled=${feedControlDisabled}
                ?pending=${feedControlPending}
                @activate=${feeding ? this._onCancelActivate : this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            </div>
            ${this._config.schedule_hash ? A : b2`<kibble-schedule-summary
                  class="schedule-row"
                  .hass=${this.hass}
                  .entries=${scheduleEntries}
                  .scheduleCardStateEntity=${e6.scheduleCardState}
                  .singleHopper=${singleHopper}
                  .deviceId=${e6.deviceId}
                  .food1=${food1}
                  .food2=${food2}
                ></kibble-schedule-summary>`}
            </div>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog
        .hass=${this.hass}
        .entities=${e6}
        .entryId=${this._entryId}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        ?open=${this._settingsOpen}
        @close-requested=${this._closeSettings}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-settings-dialog>
      <kibble-hopper-sheet
        .hass=${this.hass}
        .entities=${e6}
        ?open=${this._hopperSheetOpen}
        .hopperLevel1=${hopperLevel1}
        .hopperLevel2=${hopperLevel2}
        .hopperRemaining1=${hopperRemaining1}
        .hopperRemaining2=${hopperRemaining2}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        @close-requested=${this._closeHopperSheet}
      ></kibble-hopper-sheet>
      <kibble-calibration-dialog
        .hass=${this.hass}
        .entryId=${this._entryId}
        .singleHopper=${singleHopper}
        .food1=${food1}
        .food2=${food2}
        ?open=${this._calibrationOpen}
        @close-requested=${this._closeCalibration}
        @calibration-changed=${this._onCalibrationChanged}
      ></kibble-calibration-dialog>
      <kibble-detection-areas-dialog
        .hass=${this.hass}
        .cameraEntity=${e6.camera}
        .entryId=${this._entryId}
        ?open=${this._detectionAreasOpen}
        @close-requested=${this._closeDetectionAreas}
      ></kibble-detection-areas-dialog>
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
      return { text: statusText(status, null), tone: "error", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    if (status === "dispensing") {
      return { text: statusText(status, null), tone: "amber", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    const seen = this._catSeen();
    const eatingId = this._entities.eating;
    const eating = eatingId !== void 0 && this.hass.states[eatingId]?.state === "on";
    if (!seen) {
      return { text: eating ? "Eating now" : "Ready to feed", tone: "normal", live, catName: null, colorIndex: null, avatarAsset: null };
    }
    const roster = this._catsQuery.state.data?.cats.find((cat) => cat.name === seen.name) ?? null;
    return {
      text: eating ? `${seen.name} is eating` : `${seen.name} seen ${seen.relative}`,
      tone: "normal",
      live,
      catName: seen.name,
      colorIndex: roster?.color ?? null,
      avatarAsset: roster?.avatar ?? null
    };
  }
  /** Who was last seen and how long ago. The time comes from the sensor's own
   * `last_identified` attribute -- the moment the feeder actually identified that cat -- never
   * from HA's `last_changed`, which is merely when the state STRING last changed. Those differ
   * badly in exactly the cases that matter: reloading the integration rewrote `last_changed`
   * and the hero cheerfully announced "Kitty seen 13 min ago" while the roster beside it, which
   * reads the real timestamp, said two hours (2026-09-19). `last_changed` remains the fallback
   * for a feeder too old to send the attribute. `null` covers both "no such entity" and the
   * sensor's own unknown/unavailable idle value. */
  _catSeen() {
    const id = this._entities.lastSeenPet;
    const entityState = id ? this.hass.states[id] : void 0;
    if (!entityState || entityState.state === "unavailable" || entityState.state.toLowerCase() === "unknown") {
      return null;
    }
    const identified = entityState.attributes?.last_identified;
    const when = typeof identified === "string" ? new Date(identified) : new Date(entityState.last_changed);
    const at = Number.isNaN(when.getTime()) ? new Date(entityState.last_changed) : when;
    return { name: entityState.state, relative: relativeTimeSentence(at, /* @__PURE__ */ new Date()) };
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
  /** Shared by the single-mode portion segmented-picker's `option-selected` (string values) and
   * the compact stepper's `value-selected` (numeric) -- both just want `feedAmount` set. */
  _onPortionSelected(event) {
    this._setHopperPortion(this._entities.feedAmount, event);
  }
  /** Writes one number entity from a picker's `option-selected`/stepper's `value-selected` --
   * shared by the single-mode shared control and each of dual mode's two per-hopper rows, none
   * of which need anything beyond "set this entity to this value". */
  _setHopperPortion(entityId, event) {
    if (!entityId) return;
    const value = Number(event.detail.value);
    if (!Number.isFinite(value)) return;
    this.hass.callService("number", "set_value", { value }, { entity_id: entityId });
  }
  /** The hopper divider switch reads off: the feeder is running as one undivided hopper. */
  _singleHopper() {
    const entityId = this._entities.hopperDivider;
    return entityId != null && this.hass.states[entityId]?.state === "off";
  }
  /** Gives the feeder `DEFAULT_FEED_REQUEST_CONFIG.timeoutMs` to confirm dispensing has started
   * before the pill gives up honestly rather than reading "Requesting…" forever. A single timer
   * for the whole wait (rather than a repeating tick) is enough: `feedRequestTick` settles to
   * the same clamped `timeout` phase whether it is fed one big step or many small ones. */
  _armFeedRequestTimeout() {
    this._clearFeedRequestTimeoutTimer();
    this._feedRequestTimeoutTimer = setTimeout(() => {
      this._feedRequestTimeoutTimer = void 0;
      if (this._feedRequest.phase !== "requesting") return;
      this._feedRequest = feedRequestTick(this._feedRequest, DEFAULT_FEED_REQUEST_CONFIG.timeoutMs, DEFAULT_FEED_REQUEST_CONFIG);
      this._pourSource = null;
      this._feedError = "No response from the feeder";
      this._resetFeedErrorAfter(5e3);
    }, DEFAULT_FEED_REQUEST_CONFIG.timeoutMs);
  }
  _clearFeedRequestTimeoutTimer() {
    if (this._feedRequestTimeoutTimer !== void 0) clearTimeout(this._feedRequestTimeoutTimer);
    this._feedRequestTimeoutTimer = void 0;
  }
  /** Clears a shown error/timeout message after its own display window, returning the machine
   * to rest so a fresh hold starts clean. Shared by both failure modes -- the wording differs,
   * the reset behaviour does not. */
  _resetFeedErrorAfter(delay) {
    this._clearFeedErrorTimer();
    this._feedErrorTimer = setTimeout(() => {
      this._feedErrorTimer = void 0;
      this._feedError = null;
      this._feedRequest = feedRequestReset();
    }, delay);
  }
  _clearFeedErrorTimer() {
    if (this._feedErrorTimer !== void 0) clearTimeout(this._feedErrorTimer);
    this._feedErrorTimer = void 0;
  }
  /** Clears the popup hash the dialog was opened from, so the next `location-changed`
   * (any navigation anywhere on the dashboard re-fires it) cannot silently reopen a dialog
   * the operator just dismissed. */
  _clearPopupHash() {
    if (popupForHash(window.location.hash, this._config) === null) return;
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  static {
    this.styles = i`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${r(KIBBLE_AMBER)};
      --kibble-amber-dark: ${r(KIBBLE_AMBER_DARK)};
      /* The feed action, deliberately not the food's amber -- see the token's own doc. */
      --kibble-feed: ${r(KIBBLE_FEED)};
      --kibble-feed-dark: ${r(KIBBLE_FEED_DARK)};
      --kibble-ink-on-feed: ${r(KIBBLE_INK_ON_FEED)};
      --kibble-ink-on-amber: ${r(KIBBLE_INK_ON_AMBER)};
      --kibble-live: ${r(KIBBLE_LIVE)};
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 34px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 22px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
      /* The one vertical rhythm every gap and every section's own top padding is built from --
       * the art, the chips, the choice row, the stepper, and the pill all breathe by the same
       * amount, so nothing in the hero reads as an accident of whichever element happened to
       * need a number. */
      --kibble-rhythm: 14px;
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
    /* One column: the card is exactly as tall as its content, never a scroll box inside the
     * dashboard's own scroll. The two-column layout below boxes itself to the video instead.
     * Zero row gap on purpose: the video and the panel below it are one continuous card
     * surface, not two stacked tiles -- the hero's own square bottom corners (below) are what
     * make that continuity read as intentional rather than a seam. Every panel/schedule gets
     * its own top padding instead, off the same --kibble-rhythm scale. */
    .root {
      display: grid;
      gap: 0;
      grid-template-columns: 1fr;
      grid-template-areas: "hero" "panel" "schedule";
    }
    /* .side only exists as a grid area at >= 960px container width -- display: contents
     * unwraps it entirely below that so .panel/.schedule-row place directly into .root's own
     * "panel"/"schedule" areas, exactly as if .side were never in the markup at all. The
     * @container (min-width: 960px) block below turns it back into a real grid container once
     * there is a second column for it to own. */
    .side {
      display: contents;
    }
    /* Always the stream's true aspect ratio -- --kibble-hero-aspect starts at the sane 16/9
     * default every real feeder stream actually is (main 1920x1080, sub 1280x720) and is
     * overwritten by _onMediaAspectChanged the moment kibble-live-hero reports the real
     * media size, so the box never guesses a ratio the video itself does not have. */
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      aspect-ratio: var(--kibble-hero-aspect, 16 / 9);
      background: #1c1c1c;
      /* Square where the panel continues directly below -- rounded only at the top, so the
       * video and the card's own surface read as one shape, not two abutted rectangles. */
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    }
    .hero-media {
      position: absolute;
      inset: 0;
    }
    /* Fills .hero exactly; kibble-live-hero never crops beyond this box on its own (it
     * object-fit: contains the actual video/image internally), so there is no object-fit to
     * set here -- it would do nothing anyway, since this child is a custom element, never a
     * replaced one. */
    .hero-media > * {
      display: block;
      width: 100%;
      height: 100%;
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
    /* Mirrors <kibble-live-hero>'s own controls/topbar fade (overlay-idle-changed, forwarded by
       _onHeroOverlayIdleChanged) since this button overlaps the hero's video from outside its
       shadow DOM and shares none of its CSS. No transition property outside the no-preference
       query, so a reduced-motion user's browser snaps the opacity instantly. */
    @media (prefers-reduced-motion: no-preference) {
      .gear-button {
        transition: opacity 200ms ease;
      }
    }
    .gear-button.idle-hidden {
      opacity: 0;
      pointer-events: none;
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
    /* The one calm panel: the art, the chips (drawn inside kibble-bowl itself), the hopper
     * choice, the portion stepper, and the pill -- one shared content width and one left edge,
     * so the art's own centre lines up with the pill's. Never touched by the container queries
     * below: the same rule places it under the video on a narrow card and beside it on a wide
     * one, capped and centred either way so it never grows into a giant balloon on a big
     * screen. kibble-bowl is the one child allowed to shrink (flex: 1 1 auto) when the wide
     * layout's own height budget is tight; the controls beneath it never do. */
    .panel {
      grid-area: panel;
      display: flex;
      flex-direction: column;
      min-height: 0;
      gap: var(--kibble-rhythm);
      width: 100%;
      max-width: 340px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: var(--kibble-rhythm) 16px calc(var(--kibble-rhythm) + 2px);
    }
    .bowl-art {
      flex: 1 1 auto;
      min-height: 0;
    }
    .controls {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: var(--kibble-rhythm);
      width: 100%;
      container-type: inline-size;
      container-name: feed-controls;
    }
    .controls .picker-full {
      display: none;
    }
    .controls .picker-compact {
      display: block;
    }
    @container feed-controls (min-width: 280px) {
      .controls .picker-full {
        display: block;
      }
      .controls .picker-compact {
        display: none;
      }
    }
    /* One dual-hopper row: the hopper's label left, its stepper right. Both rows share one
     * column edge, so the steppers line up whatever the food names' lengths, and each row is
     * one control tall, so two rows plus the Hold button never grow the hero. */
    .hopper-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 12px;
    }
    .hopper-row-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--kibble-segment-size);
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .schedule-row {
      grid-area: schedule;
      padding: var(--kibble-rhythm) 16px 6px;
    }
    :host(.compact) {
      --kibble-rhythm: 8px;
    }
    :host(.compact) .hero {
      aspect-ratio: auto;
      height: 80px;
    }
    :host(.compact) .hero-status-text {
      font-size: 12px;
    }

    /* 560-959px (dual-hopper: 560-1279px, see the two @container blocks below -- two stepper
     * rows plus the hold button need more height at the same video width, so dual mode keeps
     * this layout until there is room): the video is full width above ONE row -- the bowl art
     * and the feed controls side by side, vertically centred. .root itself stays the
     * single-column stacked grid (only .panel's own internal direction changes) since the
     * video still spans the whole card width in this tier, exactly like the narrower stacked
     * layout above it. Unconditional -- both hopper modes want a row here, only where they
     * leave it differs. */
    @container (min-width: 560px) {
      .panel {
        flex-direction: row;
        align-items: center;
        max-width: 640px;
      }
      .bowl-art {
        flex: 0 1 220px;
        max-width: 220px;
      }
      .controls {
        flex: 1 1 0%;
        width: auto;
        min-width: 0;
      }
    }
    /* >=1100px, single-hopper only (:host(.dual-hopper) gets the same rules at a higher
     * threshold, below): two real columns, video left, panel/schedule stacked right -- .panel
     * reverts to the vertical layout the narrower tiers use (undoing the 560px row above),
     * since it now has its own dedicated column instead of sitting below a full-width video.
     * The video column is ~63% of the card width at its own true ratio (.hero's aspect-ratio,
     * set above): that fixed width plus the aspect ratio gives it a definite, intrinsic
     * height, which is what actually sets the row's height -- align-self: start (rather than
     * the default stretch) keeps the box at exactly that height instead of being stretched to
     * match .side if the panel ever needs more room than the video does. .side keeps the
     * default stretch and matches whatever height that turns out to be; .bowl-art's own
     * flex: 1 1 auto; min-height: 0 (unchanged from the base rule below) is what actually
     * absorbs the difference, since it is the one flexible child in that column -- and
     * kibble-bowl.ts's own .art{min-height:0} is what lets it genuinely shrink that far
     * without kibble-bowl's non-shrinking .calibrated/.chips ever losing their own space.
     * 1100px, not 960px: below it the shrunk art drops under ~70px (measured ~22px at 960,
     * ~45px at 1024) -- legible chips are not enough on their own if the illustration above
     * them has shrunk to a speck, so single mode stays in the 560px row tier (where bowl-art
     * is sized from its own width, never height-squeezed) until there is room for both.
     * .panel's overflow-y: auto and .bowl-art's overflow: hidden are a last-resort safety net
     * for a combination this tight and single mode alone should essentially never reach. */
    @container (min-width: 1100px) {
      :host(:not(.dual-hopper)) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(:not(.dual-hopper)) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(:not(.dual-hopper)) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(:not(.dual-hopper)) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(:not(.dual-hopper)) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(:not(.dual-hopper)) .controls {
        flex: none;
        width: 100%;
      }
      :host(:not(.dual-hopper)) .panel,
      :host(:not(.dual-hopper)) .schedule-row {
        grid-area: unset;
      }
      :host(:not(.dual-hopper)) .schedule-row {
        align-self: start;
      }
    }
    /* >=1440px, dual-hopper only: identical layout to the single-hopper >=1100px tier above,
     * just a later threshold, for the same ~70px-minimum-art reason. Measured, not guessed: at
     * a true 16:9 video and 63% width, two stepper rows plus the hold button plus kibble-bowl's
     * own non-shrinking hopper-status chips (and, once calibration exists, its
     * calibrated-percent line) leave art around 183px at 960-1200px (comfortable) but the
     * SAME numbers only apply while dual stays in the row tier below -- once forced into this
     * column tier, dual needs noticeably more width than single before art clears ~70px again
     * (measured ~78px right at 1440, well under 70 at 1280) since it is negotiating for space
     * against a taller controls block (two stepper rows, not one). Below this threshold dual
     * mode stays in the 560px row tier above instead, where bowl-art is sized from its own
     * width and never height-squeezed at all. */
    @container (min-width: 1440px) {
      :host(.dual-hopper) .root {
        grid-template-columns: 63% 1fr;
        grid-template-rows: calc(100cqw * 0.63 / var(--kibble-hero-aspect, 1.7778));
        grid-template-areas: "hero side";
        height: auto;
        overflow: visible;
      }
      :host(.dual-hopper) .hero {
        grid-area: hero;
        align-self: start;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
      }
      :host(.dual-hopper) .side {
        grid-area: side;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
      }
      :host(.dual-hopper) .panel {
        flex-direction: column;
        max-width: 340px;
        overflow-y: auto;
      }
      :host(.dual-hopper) .bowl-art {
        flex: 1 1 auto;
        max-width: none;
        overflow: hidden;
      }
      :host(.dual-hopper) .controls {
        flex: none;
        width: 100%;
      }
      :host(.dual-hopper) .panel,
      :host(.dual-hopper) .schedule-row {
        grid-area: unset;
      }
      :host(.dual-hopper) .schedule-row {
        align-self: start;
      }
    }
  `;
  }
};
console.info(`%c KIBBLE-CARD %c ${version} `, "background:#43A96A;color:#10301D;font-weight:700", "background:#10301D;color:#fff");
customElements.define("kibble-card", KibbleCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "kibble-card",
  name: "Kibble",
  description: "The full daily control surface for a Kibble Petkit feeder: live camera, who's been by, feed, and schedule.",
  preview: true
});
export {
  KibbleCard
};
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
//# sourceMappingURL=kibble-card.js.map
