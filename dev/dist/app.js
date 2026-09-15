// dist/kibble-card.js
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
  wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] }
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
function deriveFeederStatus(coreStates, feedingState) {
  const isDown = (state2) => state2 === void 0 || state2 === "unavailable" || state2 === "unknown";
  if (coreStates.length === 0 || coreStates.every(isDown)) {
    return "unreachable";
  }
  return feedingState === "on" ? "dispensing" : "idle";
}
function relativeTime(from, now) {
  const diffMinutes = Math.floor(Math.max(0, now.getTime() - from.getTime()) / 6e4);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
function statusText(status, lastFedRelative) {
  if (status === "unreachable") return "Feeder unreachable \u2014 check that kibbled is running";
  if (status === "dispensing") return "Dispensing\u2026";
  return lastFedRelative ? `Fed ${lastFedRelative}` : "Ready to feed";
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
  volumeHigh: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  openInNew: "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",
  speaker: "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"
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
function catSilhouette() {
  return w`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `;
}
function kibblePiece(x2, y3, size, rotationDeg) {
  const r6 = size / 4;
  const cx = x2 + size / 2;
  const cy = y3 + size / 2;
  return w`<rect x=${x2} y=${y3} width=${size} height=${size} rx=${r6} transform="rotate(${rotationDeg} ${cx} ${cy})" />`;
}
var VIEW_W = 260;
var VIEW_H = 200;
var CX = 130;
var RIM_CY = 66;
var RIM_RX = 116;
var RIM_RY = 44;
var BASE_CY = 168;
var BASE_RX = 76;
var BASIN_RX = 96;
var BASIN_RY = 34;
var SCATTER = [-0.62, -0.31, -0.04, 0.22, 0.48, 0.68, -0.5, 0.08, 0.35, -0.18];
var BODY_PATH = `M ${CX + RIM_RX} ${RIM_CY} A ${RIM_RX} ${RIM_RY} 0 0 1 ${CX - RIM_RX} ${RIM_CY} C ${CX - RIM_RX + 8} ${RIM_CY + 58}, ${CX - BASE_RX + 6} ${BASE_CY - 26}, ${CX - BASE_RX} ${BASE_CY} L ${CX + BASE_RX} ${BASE_CY} C ${CX + BASE_RX - 6} ${BASE_CY - 26}, ${CX + RIM_RX - 8} ${RIM_CY + 58}, ${CX + RIM_RX} ${RIM_CY} Z`;
function fillShape(cx, rx, ry, fraction) {
  const scale = Math.sqrt(Math.max(0, Math.min(1, fraction)));
  if (scale <= 0) return A;
  return w`<ellipse cx=${cx} cy=${RIM_CY + 6} rx=${rx * scale} ry=${ry * scale} class="fill" />`;
}
function textureKibble(cx, rx, fraction, seedOffset) {
  if (fraction < 0.15) return A;
  const count = fraction > 0.6 ? 5 : 3;
  const pieces = [];
  for (let i6 = 0; i6 < count; i6++) {
    const t5 = SCATTER[(i6 + seedOffset) % SCATTER.length];
    const x2 = cx + t5 * rx * 0.72 - 5;
    const y3 = RIM_CY + 2 + (i6 % 2 === 0 ? -4 : 5);
    pieces.push(kibblePiece(x2, y3, 10, t5 * 50));
  }
  return w`<g class="texture">${pieces}</g>`;
}
var KibbleBowl = class extends i4 {
  constructor() {
    super();
    this._wasFeeding = false;
    this._dropping = false;
    this._dropTimer = void 0;
    this.hopper1 = null;
    this.hopper2 = null;
    this.catName = null;
    this.feeding = false;
    this.statusText = "";
  }
  static {
    this.properties = {
      hopper1: { type: Number },
      hopper2: { type: Number },
      catName: { type: String },
      feeding: { type: Boolean },
      statusText: { type: String }
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._dropTimer);
  }
  willUpdate(changed) {
    if (changed.has("feeding") && this.feeding && !this._wasFeeding && !prefersReducedMotion()) {
      this._dropping = true;
      clearTimeout(this._dropTimer);
      this._dropTimer = setTimeout(() => {
        this._dropping = false;
        this.requestUpdate();
      }, KIBBLE_FALL_DURATION_MS);
    }
    this._wasFeeding = this.feeding;
  }
  render() {
    const display = combineBowlFill(this.hopper1, this.hopper2);
    return b2`
      <div class="wrap">
        <svg class="art" viewBox="0 0 ${VIEW_W} ${VIEW_H}" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          ${this.catName ? b2`<g class="cat" transform="translate(96 -6) scale(0.27)">${catSilhouette()}</g>` : A}
          <path class="body" d=${BODY_PATH} />
          ${display.split ? this._renderSplitBasin(display.hopper1, display.hopper2) : this._renderSingleBasin(display.combined ?? 0)}
          <ellipse cx=${CX} cy=${RIM_CY} rx=${RIM_RX} ry=${RIM_RY} class="rim" />
          ${this._dropping ? this._renderFallingKibble() : A}
        </svg>
        <div class="numbers">
          ${display.split ? b2`
                <span class="fill-number split">${Math.round(display.hopper1)}<small>%</small></span>
                <span class="fill-number split">${Math.round(display.hopper2)}<small>%</small></span>
              ` : b2`<span class="fill-number">${display.combined == null ? "\u2014" : b2`${Math.round(display.combined)}<small>%</small>`}</span>`}
        </div>
        ${this.catName ? b2`<div class="cat-name">${this.catName}</div>` : A}
        <div class="status" data-feeding=${this.feeding}>${this.statusText}</div>
      </div>
    `;
  }
  _renderSingleBasin(fraction0to100) {
    const fraction = fraction0to100 / 100;
    return w`
      <g>
        <ellipse cx=${CX} cy=${RIM_CY} rx=${BASIN_RX} ry=${BASIN_RY} class="basin" />
        ${fillShape(CX, BASIN_RX - 6, BASIN_RY - 6, fraction)}
        ${textureKibble(CX, BASIN_RX, fraction, 0)}
      </g>
    `;
  }
  _renderSplitBasin(hopper1, hopper2) {
    const leftCx = CX - BASIN_RX / 2 - 4;
    const rightCx = CX + BASIN_RX / 2 + 4;
    const halfRx = BASIN_RX / 2 - 6;
    return w`
      <g>
        <ellipse cx=${CX} cy=${RIM_CY} rx=${BASIN_RX} ry=${BASIN_RY} class="basin" />
        ${fillShape(leftCx, halfRx - 4, BASIN_RY - 8, hopper1 / 100)}
        ${fillShape(rightCx, halfRx - 4, BASIN_RY - 8, hopper2 / 100)}
        ${textureKibble(leftCx, halfRx, hopper1 / 100, 1)}
        ${textureKibble(rightCx, halfRx, hopper2 / 100, 4)}
        <path d="M ${CX} ${RIM_CY - BASIN_RY + 4} L ${CX} ${RIM_CY + BASIN_RY - 4}" class="divider" />
      </g>
    `;
  }
  _renderFallingKibble() {
    const pieces = SCATTER.slice(0, 7).map((t5, i6) => {
      const x2 = CX + t5 * (BASIN_RX - 10) - 6;
      const delayMs = i6 * 70;
      const durationMs = 320;
      const style = `--fall-delay:${delayMs}ms;--fall-duration:${durationMs}ms;--fall-rotate:${(t5 * 180).toFixed(0)}deg;--fall-to:${RIM_CY - 10}px;`;
      return w`<g class="drop" style=${style}>${kibblePiece(x2, -20, 12, t5 * 30)}</g>`;
    });
    return w`<g class="drops">${pieces}</g>`;
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .art {
      width: 100%;
      max-width: var(--kibble-bowl-max-width, 320px);
      height: auto;
      overflow: visible;
    }
    .body {
      fill: var(--ha-card-background, var(--card-background-color));
      stroke: var(--primary-text-color);
      stroke-width: 3;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 3;
    }
    .basin {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.16));
      stroke: var(--divider-color);
      stroke-width: 1.5;
    }
    .divider {
      stroke: var(--primary-text-color);
      stroke-width: 4;
      stroke-linecap: round;
    }
    .fill {
      fill: var(--kibble-amber);
    }
    .texture rect {
      fill: var(--kibble-amber-dark);
      opacity: 0.85;
    }
    .cat {
      fill: var(--secondary-text-color);
    }
    .drops rect {
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
        opacity: 1;
      }
    }
    .numbers {
      display: flex;
      gap: 22px;
      margin-top: -6px;
    }
    .fill-number {
      font-size: var(--kibble-number-size, 32px);
      font-weight: 700;
      line-height: 1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .fill-number small {
      font-size: 0.5em;
      font-weight: 600;
      margin-left: 1px;
    }
    .fill-number.split {
      font-size: calc(var(--kibble-number-size, 32px) * 0.72);
    }
    .cat-name {
      font-size: var(--kibble-catname-size, 13px);
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .status {
      font-size: var(--kibble-status-size, 15px);
      color: var(--secondary-text-color);
      text-align: center;
    }
    .status[data-feeding="true"] {
      color: var(--kibble-amber-dark);
      font-weight: 600;
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
      border-radius: calc(var(--ha-card-border-radius, 12px) * 0.6);
      border: 2px solid var(--divider-color);
      background: var(--ha-card-background, var(--card-background-color));
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
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }
    .segment.selected {
      background: var(--kibble-amber);
      border-color: var(--kibble-amber);
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
      border-radius: calc(var(--ha-card-border-radius, 12px) * 0.8);
      background: var(--kibble-amber);
      color: var(--kibble-ink-on-amber);
      font-size: var(--kibble-feed-label-size, 18px);
      font-weight: 700;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .button.cancel {
      background: transparent;
      border: 2px solid var(--kibble-amber-dark);
      color: var(--kibble-amber-dark);
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
var CLOUD_ICON = {
  connected: "cloudCheck",
  blocked: "cloudLock",
  unreachable: "cloudAlert",
  unknown: "cloudQuestion"
};
var CLOUD_LABEL = {
  connected: "Cloud connected",
  blocked: "Cloud blocked",
  unreachable: "Cloud unreachable",
  unknown: "Cloud status unknown"
};
var KibbleFooter = class extends i4 {
  static {
    this.properties = {
      cloudState: { type: String },
      desiccantDays: { type: Number },
      wifiLabel: { type: String }
    };
  }
  constructor() {
    super();
    this.cloudState = null;
    this.desiccantDays = null;
    this.wifiLabel = null;
  }
  render() {
    const cloud = this.cloudState && this.cloudState in CLOUD_ICON ? this.cloudState : "unknown";
    return b2`
      <div class="footer">
        <button type="button" class="glance ${cloud === "blocked" ? "warn" : ""}" title=${CLOUD_LABEL[cloud]} @click=${this._openSettings}>
          ${mdiIcon(CLOUD_ICON[cloud])}
        </button>
        ${this.desiccantDays == null ? A : b2`
              <button type="button" class="glance" title="Desiccant left" @click=${this._openSettings}>
                ${mdiIcon("airFilter")}<span>${this.desiccantDays}d</span>
              </button>
            `}
        ${this.wifiLabel ? b2`
              <button type="button" class="glance" title="Wi-Fi" @click=${this._openSettings}>
                ${mdiIcon("wifi")}<span>${this.wifiLabel}</span>
              </button>
            ` : A}
      </div>
    `;
  }
  _openSettings() {
    this.dispatchEvent(new CustomEvent("open-settings", { bubbles: true, composed: true }));
  }
  static {
    this.styles = i`
    :host {
      display: block;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 6px 4px;
      color: var(--secondary-text-color);
      font-size: var(--kibble-footer-size, 12px);
    }
    .glance {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 6px;
      min-height: var(--kibble-touch-target, 48px);
      border-radius: 8px;
    }
    .glance svg {
      font-size: 1.4em;
    }
    .glance.warn {
      color: var(--kibble-amber-dark);
    }
    .glance:hover {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .spacer {
      flex: 1;
    }
    .settings svg {
      font-size: 1.5em;
    }
  `;
  }
};
customElements.define("kibble-footer", KibbleFooter);
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
function scheduleSummary(entries, now) {
  if (entries.length === 0) {
    return "No schedule set";
  }
  const countLabel = entries.length === 1 ? "1 scheduled" : `${entries.length} scheduled`;
  const next = nextScheduled(entries, now);
  if (!next) {
    return `${countLabel} \xB7 all paused`;
  }
  return `${countLabel} \xB7 next ${next.entry.time}`;
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
              <span class="time">${entry2.time}</span>
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
        <p class="hint">Runs one auger at a time — useful for wear-leveling or working around a jam.</p>
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
var SCHEMA = [
  { name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } },
  { name: "name", selector: { text: {} } }
];
var FIELD_LABELS = {
  device_id: "Kibble device",
  name: "Name (optional)"
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
customElements.define("kibble-card-editor", KibbleCardEditor);
var EMPTY_ENTITIES = { deviceId: "", catPresence: [] };
var KibbleCard = class extends i4 {
  constructor() {
    super();
    this._entities = EMPTY_ENTITIES;
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
      this._settingsOpen = true;
    };
    this._closeSettings = () => {
      this._settingsOpen = false;
    };
    this._settingsOpen = false;
  }
  static {
    this.properties = {
      hass: { attribute: false },
      _config: { state: true },
      _settingsOpen: { state: true }
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
  willUpdate(changed) {
    if ((changed.has("hass") || changed.has("_config")) && this._config?.device_id && this.hass) {
      this._entities = resolveKibbleEntities(this.hass.entities ?? {}, this._config.device_id);
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
    const catName = this._catName();
    const text = status === "idle" ? statusText(status, this._lastFedRelative(feedingState)) : statusText(status, null);
    const scheduleEntries = this._scheduleEntries();
    const feedAmount = this._numberState(e6.feedAmount) ?? 1;
    const desiccantDays = this._numberState(e6.desiccantDays);
    const wifiState = e6.wifiNetwork ? this.hass.states[e6.wifiNetwork] : void 0;
    const cloudState = e6.cloudConnection ? this.hass.states[e6.cloudConnection]?.state : void 0;
    return b2`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">${this._renderCamera(e6.camera)}</div>
              <div class="hero-progress" data-active=${status === "dispensing"}></div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${mdiIcon("cog")}</button>
              ${this._config.name ? b2`<div class="name-chip">${this._config.name}</div>` : A}
            </div>
            <kibble-bowl
              class="bowl-block"
              .hopper1=${hopper1}
              .hopper2=${hopper2}
              .catName=${catName}
              .feeding=${feeding}
              .statusText=${text}
            ></kibble-bowl>
            <div class="feed-controls">
              <kibble-segmented-picker
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
              ></kibble-hold-button>
            </div>
            <kibble-schedule-summary
              class="schedule-row"
              .hass=${this.hass}
              .entries=${scheduleEntries}
              .scheduleCardStateEntity=${e6.scheduleCardState}
            ></kibble-schedule-summary>
            <kibble-footer
              class="footer"
              .cloudState=${cloudState}
              .desiccantDays=${desiccantDays}
              .wifiLabel=${wifiState && wifiState.state !== "unavailable" ? wifiState.state : null}
              @open-settings=${this._openSettings}
            ></kibble-footer>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e6} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `;
  }
  _renderCamera(cameraId) {
    if (!cameraId) {
      return b2`<div class="hero-placeholder">No camera on this device</div>`;
    }
    if (customElements.get("hui-image")) {
      return b2`<hui-image .hass=${this.hass} .cameraImage=${cameraId} cameraView="live"></hui-image>`;
    }
    const state2 = this.hass.states[cameraId];
    const src = state2?.attributes.entity_picture;
    if (!state2 || state2.state === "unavailable" || !src) {
      return b2`<div class="hero-placeholder">Camera unavailable</div>`;
    }
    return b2`<img src=${src} alt="Live view of the feeder" />`;
  }
  _numberState(entityId) {
    if (!entityId) return null;
    const value = Number(this.hass.states[entityId]?.state);
    return Number.isFinite(value) ? value : null;
  }
  _catName() {
    const id = this._entities.lastSeenPet;
    if (!id) return null;
    const state2 = this.hass.states[id]?.state;
    if (!state2 || state2 === "unavailable" || state2.toLowerCase() === "unknown") return null;
    return state2;
  }
  _lastFedRelative(feedingState) {
    const id = this._entities.feeding;
    if (!id || feedingState !== "off") return null;
    const state2 = this.hass.states[id];
    if (!state2) return null;
    return relativeTime(new Date(state2.last_changed), /* @__PURE__ */ new Date());
  }
  _scheduleEntries() {
    const id = this._entities.schedule;
    if (!id) return [];
    const attrs = this.hass.states[id]?.attributes;
    const entries = attrs?.entries;
    return Array.isArray(entries) ? entries : [];
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
      --kibble-touch-target: 48px;
      --kibble-feed-button-height: 56px;
      --kibble-number-size: 32px;
      --kibble-feed-label-size: 18px;
      --kibble-status-size: 15px;
      --kibble-catname-size: 13px;
      --kibble-segment-size: 16px;
      --kibble-schedule-size: 14px;
      --kibble-footer-size: 12px;
    }
    :host(.kiosk) {
      --kibble-touch-target: 60px;
      --kibble-feed-button-height: 72px;
      --kibble-number-size: 40px;
      --kibble-feed-label-size: 22px;
      --kibble-status-size: 19px;
      --kibble-catname-size: 16px;
      --kibble-segment-size: 20px;
      --kibble-schedule-size: 17px;
      --kibble-footer-size: 15px;
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
      grid-template-areas: "hero" "bowl" "feed" "schedule" "footer";
    }
    .hero {
      grid-area: hero;
      position: relative;
      overflow: hidden;
      height: 0;
      padding-bottom: 42%;
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
    .hero-progress {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: transparent;
    }
    .hero-progress[data-active="true"] {
      background: linear-gradient(90deg, transparent, var(--kibble-amber), transparent);
      background-size: 200% 100%;
      animation: kibble-sweep 1.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-progress[data-active="true"] {
        animation: none;
        background: var(--kibble-amber);
      }
    }
    @keyframes kibble-sweep {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
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
      --kibble-bowl-max-width: 170px;
    }
    .feed-controls {
      grid-area: feed;
      padding: 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      padding: 0 10px;
    }
    .footer {
      grid-area: footer;
      padding: 0 10px;
    }
    :host(.compact) .root {
      gap: 6px;
    }
    :host(.compact) .hero {
      height: 80px;
      padding-bottom: 0;
    }
    :host(.compact) .bowl-block {
      padding-top: 2px;
      --kibble-bowl-max-width: 190px;
    }

    /* >=640px: two columns, camera left full height, bowl/feed/schedule stacked on the right. */
    @container (min-width: 640px) {
      .root {
        grid-template-columns: 60% 1fr;
        grid-template-rows: auto auto 1fr auto;
        grid-template-areas: "hero bowl" "hero feed" "hero schedule" "footer footer";
        gap: 4px;
        padding-bottom: 0;
      }
      .hero {
        grid-area: hero;
        padding-bottom: 0;
        height: 100%;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
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
        grid-area: bowl;
        padding: 4px 16px 0;
        --kibble-bowl-max-width: 210px;
        --kibble-catname-size: unset;
        --kibble-status-size: unset;
      }
      .feed-controls {
        grid-area: feed;
        padding: 6px 16px 0;
        --kibble-touch-target: 48px;
        --kibble-segment-size: 16px;
      }
      .schedule-row {
        grid-area: schedule;
        padding: 2px 16px;
        align-self: start;
      }
      .footer {
        grid-area: footer;
        padding: 0 16px 2px;
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
  description: "The full daily control surface for a Kibble Petkit feeder: live camera, bowl status, feed, and schedule.",
  preview: true
});

// dev/fixtures.ts
var DEVICE_ID = "kibble-device-1";
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
  manufacturer: "Petkit"
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
  wifiNetwork: "sensor.plant_room_cat_feeder_wifi_network"
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
    [ENTITY_IDS.lastSeenPet]: entry(ENTITY_IDS.lastSeenPet, "last_seen_pet")
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
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Rashy", { score: 0.94 }, minutesAgo(126))
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
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Rashy", { score: 0.88 }, minutesAgo(1)),
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
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "unavailable", {})
  };
  return { device: DEVICE, entities: registryFor(false), states };
}
function buildFixture(scenario) {
  if (scenario === "idle") return buildIdle();
  if (scenario === "dispensing") return buildDispensing();
  return buildUnreachable();
}

// dev/mock-hass.ts
function createMockHass(scenario) {
  const fixture = buildFixture(scenario);
  const states = { ...fixture.states };
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
        hass.states = { ...states };
      }
      if (domain === "switch" && service === "toggle" && entityId && states[entityId]) {
        const next = states[entityId].state === "on" ? "off" : "on";
        states[entityId] = { ...states[entityId], state: next };
        hass.states = { ...states };
      }
      return void 0;
    }
  };
  return hass;
}

// dev/app.ts
async function main() {
  const params = new URLSearchParams(location.search);
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
  await customElements.whenDefined("kibble-card");
  const card = document.createElement("kibble-card");
  const config = { type: "custom:kibble-card", device_id: DEVICE_ID };
  if (name) config.name = name;
  card.setConfig(config);
  card.hass = createMockHass(scenario);
  container.appendChild(card);
  await card.updateComplete;
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
