// dist/kibble-card.js
var U = globalThis;
var F = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var re = Symbol();
var Re = /* @__PURE__ */ new WeakMap();
var V = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = true, i !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o, e = this.t;
    if (F && t === void 0) {
      let i = e !== void 0 && e.length === 1;
      i && (t = Re.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Re.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
var T = (s3) => new V(typeof s3 == "string" ? s3 : s3 + "", void 0, re);
var f = (s3, ...t) => {
  let e = s3.length === 1 ? s3[0] : t.reduce((i, n, r) => i + ((o) => {
    if (o._$cssResult$ === true) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s3[r + 1], s3[0]);
  return new V(e, s3, re);
};
var Ve = (s3, t) => {
  if (F) s3.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (let e of t) {
    let i = document.createElement("style"), n = U.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s3.appendChild(i);
  }
};
var oe = F ? (s3) => s3 : (s3) => s3 instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (let i of t.cssRules) e += i.cssText;
  return T(e);
})(s3) : s3;
var { is: gt, defineProperty: _t, getOwnPropertyDescriptor: vt, getOwnPropertyNames: $t, getOwnPropertySymbols: xt, getPrototypeOf: yt } = Object;
var j = globalThis;
var Pe = j.trustedTypes;
var Ct = Pe ? Pe.emptyScript : "";
var kt = j.reactiveElementPolyfillSupport;
var P = (s3, t) => s3;
var ae = { toAttribute(s3, t) {
  switch (t) {
    case Boolean:
      s3 = s3 ? Ct : null;
      break;
    case Object:
    case Array:
      s3 = s3 == null ? s3 : JSON.stringify(s3);
  }
  return s3;
}, fromAttribute(s3, t) {
  let e = s3;
  switch (t) {
    case Boolean:
      e = s3 !== null;
      break;
    case Number:
      e = s3 === null ? null : Number(s3);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s3);
      } catch {
        e = null;
      }
  }
  return e;
} };
var Be = (s3, t) => !gt(s3, t);
var Oe = { attribute: true, type: String, converter: ae, reflect: false, useDefault: false, hasChanged: Be };
Symbol.metadata ??= Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Oe) {
    if (e.state && (e.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = true), this.elementProperties.set(t, e), !e.noAccessor) {
      let i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && _t(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    let { get: n, set: r } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      let d = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, d, i);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    let t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      let e = this.properties, i = [...$t(e), ...xt(e)];
      for (let n of i) this.createProperty(n, e[n]);
    }
    let t = this[Symbol.metadata];
    if (t !== null) {
      let e = litPropertyMetadata.get(t);
      if (e !== void 0) for (let [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (let [e, i] of this.elementProperties) {
      let n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    let e = [];
    if (Array.isArray(t)) {
      let i = new Set(t.flat(1 / 0).reverse());
      for (let n of i) e.unshift(oe(n));
    } else t !== void 0 && e.push(oe(t));
    return e;
  }
  static _$Eu(t, e) {
    let i = e.attribute;
    return i === false ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    let t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (let i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    let t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ve(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    let i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === true) {
      let r = (i.converter?.toAttribute !== void 0 ? i.converter : ae).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    let i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      let r = i.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : ae;
      this._$Em = n;
      let d = o.fromAttribute(e, r.type);
      this[n] = d ?? this._$Ej?.get(n) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = false, r) {
    if (t !== void 0) {
      let o = this.constructor;
      if (n === false && (r = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? Be)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === false && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== true || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === true && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    let t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (let [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      let i = this.constructor.elementProperties;
      if (i.size > 0) for (let [n, r] of i) {
        let { wrapped: o } = r, d = this[n];
        o !== true || this._$AL.has(n) || d === void 0 || this.C(n, void 0, r, d);
      }
    }
    let t = false, e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = false, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return true;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[P("elementProperties")] = /* @__PURE__ */ new Map(), x[P("finalized")] = /* @__PURE__ */ new Map(), kt?.({ ReactiveElement: x }), (j.reactiveElementVersions ??= []).push("2.1.2");
var de = globalThis;
var Ie = (s3) => s3;
var q = de.trustedTypes;
var De = q ? q.createPolicy("lit-html", { createHTML: (s3) => s3 }) : void 0;
var ce = "$lit$";
var y = `lit$${Math.random().toFixed(9).slice(2)}$`;
var ue = "?" + y;
var At = `<${ue}>`;
var A = document;
var B = () => A.createComment("");
var I = (s3) => s3 === null || typeof s3 != "object" && typeof s3 != "function";
var he = Array.isArray;
var qe = (s3) => he(s3) || typeof s3?.[Symbol.iterator] == "function";
var le = `[ 	
\f\r]`;
var O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var ze = /-->/g;
var Ke = />/g;
var C = RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var Ue = /'/g;
var Fe = /"/g;
var We = /^(?:script|style|textarea|title)$/i;
var pe = (s3) => (t, ...e) => ({ _$litType$: s3, strings: t, values: e });
var l = pe(1);
var v = pe(2);
var ni = pe(3);
var S = Symbol.for("lit-noChange");
var a = Symbol.for("lit-nothing");
var je = /* @__PURE__ */ new WeakMap();
var k = A.createTreeWalker(A, 129);
function Ge(s3, t) {
  if (!he(s3) || !s3.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return De !== void 0 ? De.createHTML(t) : t;
}
var Ze = (s3, t) => {
  let e = s3.length - 1, i = [], n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
  for (let d = 0; d < e; d++) {
    let c = s3[d], b, m, u = -1, g = 0;
    for (; g < c.length && (o.lastIndex = g, m = o.exec(c), m !== null); ) g = o.lastIndex, o === O ? m[1] === "!--" ? o = ze : m[1] !== void 0 ? o = Ke : m[2] !== void 0 ? (We.test(m[2]) && (n = RegExp("</" + m[2], "g")), o = C) : m[3] !== void 0 && (o = C) : o === C ? m[0] === ">" ? (o = n ?? O, u = -1) : m[1] === void 0 ? u = -2 : (u = o.lastIndex - m[2].length, b = m[1], o = m[3] === void 0 ? C : m[3] === '"' ? Fe : Ue) : o === Fe || o === Ue ? o = C : o === ze || o === Ke ? o = O : (o = C, n = void 0);
    let _ = o === C && s3[d + 1].startsWith("/>") ? " " : "";
    r += o === O ? c + At : u >= 0 ? (i.push(b), c.slice(0, u) + ce + c.slice(u) + y + _) : c + y + (u === -2 ? d : _);
  }
  return [Ge(s3, r + (s3[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
var D = class s {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, o = 0, d = t.length - 1, c = this.parts, [b, m] = Ze(t, e);
    if (this.el = s.createElement(b, i), k.currentNode = this.el.content, e === 2 || e === 3) {
      let u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = k.nextNode()) !== null && c.length < d; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (let u of n.getAttributeNames()) if (u.endsWith(ce)) {
          let g = m[o++], _ = n.getAttribute(u).split(y), H = /([.?@])?(.*)/.exec(g);
          c.push({ type: 1, index: r, name: H[2], strings: _, ctor: H[1] === "." ? G : H[1] === "?" ? Z : H[1] === "@" ? Y : E }), n.removeAttribute(u);
        } else u.startsWith(y) && (c.push({ type: 6, index: r }), n.removeAttribute(u));
        if (We.test(n.tagName)) {
          let u = n.textContent.split(y), g = u.length - 1;
          if (g > 0) {
            n.textContent = q ? q.emptyScript : "";
            for (let _ = 0; _ < g; _++) n.append(u[_], B()), k.nextNode(), c.push({ type: 2, index: ++r });
            n.append(u[g], B());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ue) c.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(y, u + 1)) !== -1; ) c.push({ type: 7, index: r }), u += y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    let i = A.createElement("template");
    return i.innerHTML = t, i;
  }
};
function w(s3, t, e = s3, i) {
  if (t === S) return t;
  let n = i !== void 0 ? e._$Co?.[i] : e._$Cl, r = I(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(false), r === void 0 ? n = void 0 : (n = new r(s3), n._$AT(s3, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = n : e._$Cl = n), n !== void 0 && (t = w(s3, n._$AS(s3, t.values), n, i)), t;
}
var W = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    let { el: { content: e }, parts: i } = this._$AD, n = (t?.creationScope ?? A).importNode(e, true);
    k.currentNode = n;
    let r = k.nextNode(), o = 0, d = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let b;
        c.type === 2 ? b = new N(r, r.nextSibling, this, t) : c.type === 1 ? b = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (b = new Q(r, this, t)), this._$AV.push(b), c = i[++d];
      }
      o !== c?.index && (r = k.nextNode(), o++);
    }
    return k.currentNode = A, n;
  }
  p(t) {
    let e = 0;
    for (let i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
};
var N = class s2 {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = a, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? true;
  }
  get parentNode() {
    let t = this._$AA.parentNode, e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), I(t) ? t === a || t == null || t === "" ? (this._$AH !== a && this._$AR(), this._$AH = a) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== a && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    let { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = D.createElement(Ge(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      let r = new W(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = je.get(t.strings);
    return e === void 0 && je.set(t.strings, e = new D(t)), e;
  }
  k(t) {
    he(this._$AH) || (this._$AH = [], this._$AR());
    let e = this._$AH, i, n = 0;
    for (let r of t) n === e.length ? e.push(i = new s2(this.O(B()), this.O(B()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(false, true, e); t !== this._$AB; ) {
      let i = Ie(t).nextSibling;
      Ie(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
};
var E = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = a, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = a;
  }
  _$AI(t, e = this, i, n) {
    let r = this.strings, o = false;
    if (r === void 0) t = w(this, t, e, 0), o = !I(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      let d = t, c, b;
      for (t = r[0], c = 0; c < r.length - 1; c++) b = w(this, d[i + c], e, c), b === S && (b = this._$AH[c]), o ||= !I(b) || b !== this._$AH[c], b === a ? t = a : t !== a && (t += (b ?? "") + r[c + 1]), this._$AH[c] = b;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === a ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
var G = class extends E {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === a ? void 0 : t;
  }
};
var Z = class extends E {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== a);
  }
};
var Y = class extends E {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? a) === S) return;
    let i = this._$AH, n = t === a && i !== a || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== a && (i === a || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
var Q = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
};
var Ye = { M: ce, P: y, A: ue, C: 1, L: Ze, R: W, D: qe, V: w, I: N, H: E, N: Z, U: Y, B: G, F: Q };
var St = de.litHtmlPolyfillSupport;
St?.(D, N), (de.litHtmlVersions ??= []).push("3.3.3");
var Qe = (s3, t, e) => {
  let i = e?.renderBefore ?? t, n = i._$litPart$;
  if (n === void 0) {
    let r = e?.renderBefore ?? null;
    i._$litPart$ = n = new N(t.insertBefore(B(), r), r, void 0, e ?? {});
  }
  return n._$AI(s3), n;
};
var be = globalThis;
var h = class extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    let t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    let e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Qe(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return S;
  }
};
h._$litElement$ = true, h.finalized = true, be.litElementHydrateSupport?.({ LitElement: h });
var wt = be.litElementPolyfillSupport;
wt?.({ LitElement: h });
(be.litElementVersions ??= []).push("4.2.2");
var Et = { feeding: { domain: "binary_sensor", translationKeys: ["feeding"], idSuffixes: ["_feeding"] }, bowlFill1: { domain: "sensor", translationKeys: ["bowl_fill_1"], idSuffixes: ["_bowl_fill_1", "_bowl_fill_hopper_1"] }, bowlFill2: { domain: "sensor", translationKeys: ["bowl_fill_2"], idSuffixes: ["_bowl_fill_2", "_bowl_fill_hopper_2"] }, desiccantDays: { domain: "sensor", translationKeys: ["desiccant_days", "desiccant_left"], idSuffixes: ["_desiccant_days", "_desiccant_left"] }, schedule: { domain: "sensor", translationKeys: ["schedule"], idSuffixes: ["_schedule"] }, scheduleCardState: { domain: "sensor", translationKeys: ["schedule_card_state"], idSuffixes: ["_schedule_card_state"] }, feedButton: { domain: "button", translationKeys: ["feed"], idSuffixes: ["_feed"] }, feedButtonHopper1: { domain: "button", translationKeys: ["feed_hopper_1"], idSuffixes: ["_feed_hopper_1"] }, feedButtonHopper2: { domain: "button", translationKeys: ["feed_hopper_2"], idSuffixes: ["_feed_hopper_2"] }, cancelFeedButton: { domain: "button", translationKeys: ["cancel_feed"], idSuffixes: ["_cancel_feed"] }, feedAmount: { domain: "number", translationKeys: ["feed_amount"], idSuffixes: ["_feed_amount"] }, feedAmountHopper1: { domain: "number", translationKeys: ["feed_amount_hopper_1"], idSuffixes: ["_feed_amount_hopper_1"] }, feedAmountHopper2: { domain: "number", translationKeys: ["feed_amount_hopper_2"], idSuffixes: ["_feed_amount_hopper_2"] }, cloudSwitch: { domain: "switch", translationKeys: ["cloud", "petkit_cloud"], idSuffixes: ["_cloud", "_petkit_cloud"] }, cloudConnection: { domain: "sensor", translationKeys: ["cloud_connection"], idSuffixes: ["_cloud_connection"] }, nightVisionSwitch: { domain: "switch", translationKeys: ["night", "night_vision"], idSuffixes: ["_night", "_night_vision"] }, statusLedSwitch: { domain: "switch", translationKeys: ["light", "status_led"], idSuffixes: ["_light", "_status_led"] }, microphoneSwitch: { domain: "switch", translationKeys: ["microphone"], idSuffixes: ["_microphone"] }, volume: { domain: "number", translationKeys: ["volume"], idSuffixes: ["_volume"] }, lastSeenPet: { domain: "sensor", translationKeys: ["last_seen_pet"], idSuffixes: ["_last_seen_pet"] }, dishBefore: { domain: "image", translationKeys: ["dish_before"], idSuffixes: ["_dish_before"] }, dishAfter: { domain: "image", translationKeys: ["dish_after"], idSuffixes: ["_dish_after"] }, wifiNetwork: { domain: "sensor", translationKeys: ["wifi_network", "wifi", "rssi"], idSuffixes: ["_wifi_network", "_wifi", "_rssi"] } };
function X(s3) {
  return s3.slice(0, s3.indexOf("."));
}
function me(s3) {
  return s3.slice(s3.indexOf(".") + 1);
}
function Mt(s3, t) {
  if (X(s3.entity_id) !== t.domain) return false;
  if (s3.translation_key && t.translationKeys.includes(s3.translation_key)) return true;
  let e = me(s3.entity_id);
  return t.idSuffixes.some((i) => e.endsWith(i));
}
function Lt(s3) {
  let t = s3.name ?? s3.original_name;
  if (t) return t.replace(/\s+present$/i, "").trim() || t;
  let n = me(s3.entity_id).replace(/_present$/, "").split("_").filter(Boolean).pop();
  return n ? n[0].toUpperCase() + n.slice(1) : "Cat";
}
function Ht(s3) {
  return X(s3.entity_id) !== "binary_sensor" ? false : s3.translation_key === "present" || s3.translation_key?.endsWith("_present") ? true : me(s3.entity_id).endsWith("_present");
}
function Xe(s3, t) {
  let e = { deviceId: t, catPresence: [] }, i = Object.values(s3).filter((n) => n.device_id === t && !n.disabled_by);
  for (let n of i) {
    if (X(n.entity_id) === "camera" && !e.camera) {
      e.camera = n.entity_id;
      continue;
    }
    if (X(n.entity_id) === "media_player" && !e.speaker) {
      e.speaker = n.entity_id;
      continue;
    }
    if (Ht(n)) {
      e.catPresence.push({ entityId: n.entity_id, name: Lt(n) });
      continue;
    }
    for (let r of Object.entries(Et)) {
      let [o, d] = r;
      if (!e[o] && Mt(n, d)) {
        e[o] = n.entity_id;
        break;
      }
    }
  }
  return e.catPresence.sort((n, r) => n.name.localeCompare(r.name)), e;
}
function Je(s3, t) {
  let e = (i) => i === void 0 || i === "unavailable" || i === "unknown";
  return s3.length === 0 || s3.every(e) ? "unreachable" : t === "on" ? "dispensing" : "idle";
}
function et(s3, t) {
  let e = Math.floor(Math.max(0, t.getTime() - s3.getTime()) / 6e4);
  if (e < 1) return "just now";
  if (e < 60) return `${e}m ago`;
  let i = Math.floor(e / 60);
  return i < 24 ? `${i}h ago` : `${Math.floor(i / 24)}d ago`;
}
function fe(s3, t) {
  return s3 === "unreachable" ? "Feeder unreachable \u2014 check that kibbled is running" : s3 === "dispensing" ? "Dispensing\u2026" : t ? `Fed ${t}` : "Ready to feed";
}
var Tt = { cog: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z", cloudCheck: "M13 19C13 19.34 13.04 19.67 13.09 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C20.15 11.13 21.1 11.63 21.86 12.5C22.37 13.07 22.7 13.71 22.86 14.42C21.82 13.54 20.5 13 19 13C18.89 13 18.79 13 18.68 13C18.62 13 18.56 13 18.5 13H17V11C17 9.62 16.5 8.44 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18H13.09C13.04 18.33 13 18.66 13 19M17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84L17.75 19.43Z", cloudLock: "M6.5 18H13V20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.08 7.16 18.73 8.5 18.93 10C18.23 10 17.56 10.19 16.95 10.46C16.84 9.31 16.38 8.31 15.54 7.46C14.56 6.5 13.38 6 12 6S9.44 6.5 8.46 7.46C7.5 8.44 7 9.62 7 11H6.5C5.53 11 4.71 11.34 4.03 12.03C3.34 12.71 3 13.53 3 14.5S3.34 16.29 4.03 17C4.71 17.66 5.53 18 6.5 18M23 17.3V20.8C23 21.4 22.4 22 21.7 22H16.2C15.6 22 15 21.4 15 20.7V17.2C15 16.6 15.6 16 16.2 16V14.5C16.2 13.1 17.6 12 19 12S21.8 13.1 21.8 14.5V16C22.4 16 23 16.6 23 17.3M20.5 14.5C20.5 13.7 19.8 13.2 19 13.2S17.5 13.7 17.5 14.5V16H20.5V14.5Z", cloudAlert: "M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M11 7H13V13H11V7Z", cloudQuestion: "M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M20.27 17.27C19.79 17.76 19.2 18 18.5 18H6.5C5.53 18 4.71 17.66 4.03 17C3.34 16.29 3 15.47 3 14.5S3.34 12.71 4.03 12.03C4.71 11.34 5.53 11 6.5 11H7C7 9.62 7.5 8.44 8.46 7.46C9.44 6.5 10.62 6 12 6S14.56 6.5 15.54 7.46C16.5 8.44 17 9.62 17 11V13H18.5C19.2 13 19.79 13.24 20.27 13.73S21 14.8 21 15.5 20.76 16.79 20.27 17.27M11 15H13V17H11V15M14.43 8.68C14.97 9.13 15.24 9.75 15.24 10.5C15.24 11 15.09 11.41 14.8 11.82C14.5 12.21 14.13 12.5 13.67 12.75C13.41 12.91 13.24 13.07 13.15 13.26C13.06 13.45 13 13.69 13 14H11C11 13.45 11.11 13.08 11.3 12.82C11.5 12.56 11.85 12.25 12.37 11.91C12.63 11.75 12.84 11.56 13 11.32C13.15 11.09 13.23 10.81 13.23 10.5C13.23 10.18 13.14 9.94 12.96 9.76C12.78 9.56 12.5 9.47 12.2 9.47C11.93 9.47 11.71 9.55 11.5 9.7C11.35 9.85 11.25 10.08 11.25 10.39H9.28C9.23 9.64 9.5 9 10.06 8.59C10.6 8.2 11.31 8 12.2 8C13.14 8 13.89 8.23 14.43 8.68Z", airFilter: "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z", wifi: "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z", chevronDown: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", weatherNight: "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", ledOn: "M11,0V4H13V0H11M18.3,2.29L15.24,5.29L16.64,6.71L19.7,3.71L18.3,2.29M5.71,2.29L4.29,3.71L7.29,6.71L8.71,5.29L5.71,2.29M12,6A4,4 0 0,0 8,10V16H6V18H9V23H11V18H13V23H15V18H18V16H16V10A4,4 0 0,0 12,6M2,9V11H6V9H2M18,9V11H22V9H18Z", microphone: "M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z", volumeHigh: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z", openInNew: "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z", speaker: "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z" };
function $(s3) {
  return v`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d=${Tt[s3]}></path></svg>`;
}
var tt = "#F4A452";
var it = "#DE8A3A";
var st = "#3A2C28";
function nt() {
  return typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
function rt(s3, t) {
  return s3 === null && t === null ? { split: false, hopper1: null, hopper2: null, combined: null } : s3 === null || t === null ? { split: false, hopper1: s3, hopper2: t, combined: s3 ?? t } : Math.abs(s3 - t) < 5 ? { split: false, hopper1: s3, hopper2: t, combined: Math.round((s3 + t) / 2) } : { split: true, hopper1: s3, hopper2: t, combined: null };
}
function ot() {
  return v`
    <svg viewBox="0 0 256 256" fill="currentColor">
      <circle cx="128" cy="128" r="88" />
      <path d="M 45.31 97.9 L 11.26 43.1 Q 10.8 29.65 24.12 27.78 L 84 51.79 Z" />
      <path d="M 172 51.79 L 231.88 27.78 Q 245.2 29.65 244.74 43.1 L 210.69 97.9 Z" />
    </svg>
  `;
}
var Rt = 260;
var Vt = 200;
var p = 130;
var R = 60;
var M = 116;
var at = 40;
var z = 178;
var ge = 46;
var Pt = 10;
var L = 78;
var _e = 86;
var Ot = 46;
var Bt = `M ${p + M} ${R} C ${p + M} ${R + 50}, ${p + 70} ${z - 13}, ${p + ge} ${z} A ${ge} ${Pt} 0 0 1 ${p - ge} ${z} C ${p - 70} ${z - 13}, ${p - M} ${R + 50}, ${p - M} ${R} A ${M} ${at} 0 0 0 ${p + M} ${R} Z`;
var $e = [-0.6, -0.32, -0.06, 0.2, 0.46, 0.66, -0.46, 0.08, 0.34, -0.2];
function It(s3, t, e) {
  let i = (s3 + t) / 2;
  return `M ${s3} ${L} Q ${i} ${L - 2 * e} ${t} ${L} Z`;
}
function Dt(s3, t, e, i) {
  let n = L - 2 * i;
  return (1 - s3) * (1 - s3) * L + 2 * (1 - s3) * s3 * n + s3 * s3 * L;
}
function lt(s3, t, e, i) {
  let n = [0, 120, 240].map((r) => {
    let o = (r + i) * Math.PI / 180;
    return v`<circle cx=${(s3 + Math.cos(o) * e * 0.55).toFixed(1)} cy=${(t + Math.sin(o) * e * 0.55).toFixed(1)} r=${(e * 0.62).toFixed(1)} />`;
  });
  return v`<g>${n}</g>`;
}
function ve(s3, t, e, i) {
  if (e <= 0.02) return a;
  let n = Ot * e, r = Math.round(6 + 4 * e), o = [];
  for (let d = 0; d < r; d++) {
    let c = (d + 0.5) / r, b = s3 + (t - s3) * c, m = Dt(c, s3, t, n), u = $e[(d + i) % $e.length] * 6, g = 5.5 + (d + i) % 3 * 1.4, _ = d === 0 || d === r - 1 ? d === 0 ? -3 : 3 : 0;
    o.push(lt(b + _, m + u - 2, g, d * 47 + i * 13));
  }
  return v`
    <path d=${It(s3, t, n)} class="fill" />
    <g class="texture">${o}</g>
  `;
}
var xe = class extends h {
  constructor() {
    super();
    this._wasFeeding = false;
    this._dropping = false;
    this._dropTimer = void 0;
    this.hopper1 = null, this.hopper2 = null, this.catName = null, this.feeding = false, this.statusText = "";
  }
  static {
    this.properties = { hopper1: { type: Number }, hopper2: { type: Number }, catName: { type: String }, feeding: { type: Boolean }, statusText: { type: String } };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this._dropTimer);
  }
  willUpdate(e) {
    e.has("feeding") && this.feeding && !this._wasFeeding && !nt() && (this._dropping = true, clearTimeout(this._dropTimer), this._dropTimer = setTimeout(() => {
      this._dropping = false, this.requestUpdate();
    }, 900)), this._wasFeeding = this.feeding;
  }
  render() {
    let e = rt(this.hopper1, this.hopper2);
    return l`
      <div class="wrap">
        <svg class="art" viewBox="0 0 ${Rt} ${Vt}" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
          <ellipse cx=${p} cy=${z + 14} rx="66" ry="9" class="shadow" />
          ${this.catName ? l`<g class="cat" transform="translate(96 -6) scale(0.27)">${ot()}</g>` : a}
          <path class="body" d=${Bt} />
          ${e.split ? this._renderSplitBasin(e.hopper1, e.hopper2) : this._renderSingleBasin(e.combined ?? 0)}
          <ellipse cx=${p} cy=${R} rx=${M} ry=${at} class="rim" />
          ${this._dropping ? this._renderFallingKibble() : a}
        </svg>
        <div class="numbers">
          ${e.split ? l`
                <span class="fill-number split">${Math.round(e.hopper1)}<small>%</small></span>
                <span class="fill-number split">${Math.round(e.hopper2)}<small>%</small></span>
              ` : l`<span class="fill-number">${e.combined == null ? "\u2014" : l`${Math.round(e.combined)}<small>%</small>`}</span>`}
        </div>
        ${this.catName ? l`<div class="cat-name">${this.catName}</div>` : a}
        <div class="status" data-feeding=${this.feeding}>${this.statusText}</div>
      </div>
    `;
  }
  _renderSingleBasin(e) {
    let i = e / 100;
    return v`
      <g>
        <ellipse cx=${p} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${p} cy="68" rx="90" ry="25" class="basin-near" />
        ${ve(p - _e * (0.32 + 0.68 * Math.sqrt(i)), p + _e * (0.32 + 0.68 * Math.sqrt(i)), i, 0)}
      </g>
    `;
  }
  _renderSplitBasin(e, i) {
    let n = p - 44, r = p + 44, o = 40, d = e / 100, c = i / 100;
    return v`
      <g>
        <ellipse cx=${p} cy="62" rx="100" ry="32" class="basin-far" />
        <ellipse cx=${p} cy="68" rx="90" ry="25" class="basin-near" />
        ${ve(n - o * (0.35 + 0.65 * Math.sqrt(d)), n + o * (0.35 + 0.65 * Math.sqrt(d)), d, 1)}
        ${ve(r - o * (0.35 + 0.65 * Math.sqrt(c)), r + o * (0.35 + 0.65 * Math.sqrt(c)), c, 4)}
        <g class="divider">
          <line x1=${p - 3} y1="46" x2=${p - 3} y2="90" />
          <line x1=${p + 3} y1="46" x2=${p + 3} y2="90" />
        </g>
      </g>
    `;
  }
  _renderFallingKibble() {
    let e = $e.slice(0, 7).map((i, n) => {
      let r = p + i * (_e - 6), c = `--fall-delay:${n * 70}ms;--fall-duration:320ms;--fall-rotate:${(i * 180).toFixed(0)}deg;--fall-to:${L - 30}px;`;
      return v`<g class="drop" style=${c}>${lt(r, 0, 7, i * 60)}</g>`;
    });
    return v`<g class="drops">${e}</g>`;
  }
  static {
    this.styles = f`
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
      max-width: var(--kibble-bowl-max-width, 280px);
      height: auto;
      overflow: visible;
    }
    .shadow {
      fill: rgba(0, 0, 0, 0.16);
    }
    .body {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
      stroke: var(--primary-text-color);
      stroke-width: 2.6;
      stroke-linejoin: round;
    }
    .rim {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.6;
    }
    .basin-far {
      fill: var(--divider-color);
    }
    .basin-near {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.16));
    }
    .divider line {
      stroke: var(--primary-text-color);
      stroke-width: 1.4;
    }
    .fill {
      fill: var(--kibble-amber);
    }
    .texture circle {
      fill: var(--kibble-amber-dark);
    }
    .cat {
      fill: var(--secondary-text-color);
    }
    .drops circle {
      fill: var(--kibble-amber-dark);
      animation: kibble-drop var(--fall-duration) cubic-bezier(0.4, 0, 1, 1) var(--fall-delay) both;
    }
    @keyframes kibble-drop {
      from {
        transform: translateY(-40px) rotate(0deg);
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
customElements.define("kibble-bowl", xe);
var zt = [1, 2, 3, 4, 5];
var ye = class extends h {
  static {
    this.properties = { value: { type: Number }, disabled: { type: Boolean } };
  }
  constructor() {
    super(), this.value = 1, this.disabled = false;
  }
  render() {
    return l`
      <div class="segments" role="radiogroup" aria-label="Feed amount, portions">
        ${zt.map((t) => l`
            <button
              type="button"
              role="radio"
              aria-checked=${t === this.value}
              class="segment ${t === this.value ? "selected" : ""}"
              ?disabled=${this.disabled}
              @click=${() => this._select(t)}
            >
              ${t}
            </button>
          `)}
      </div>
    `;
  }
  _select(t) {
    this.dispatchEvent(new CustomEvent("portion-selected", { detail: { value: t }, bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-segmented-picker", ye);
var Ce = class extends h {
  static {
    this.properties = { value: { type: Number }, min: { type: Number }, max: { type: Number }, step: { type: Number }, disabled: { type: Boolean } };
  }
  constructor() {
    super(), this.value = 1, this.min = 1, this.max = 20, this.step = 1, this.disabled = false;
  }
  render() {
    return l`
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
  _emit(t) {
    this.dispatchEvent(new CustomEvent("value-selected", { detail: { value: t }, bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-stepper", Ce);
var ke = class extends h {
  constructor() {
    super();
    this._holding = false;
    this._holdTimer = void 0;
    this._startHold = (e) => {
      this.disabled || (e.preventDefault(), this._holding = true, this.requestUpdate(), clearTimeout(this._holdTimer), this._holdTimer = setTimeout(() => {
        this._holding = false, this.requestUpdate(), this._activate();
      }, this.holdMs));
    };
    this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holding && (this._holding = false, this.requestUpdate());
    };
    this.label = "Hold to feed", this.variant = "feed", this.disabled = false, this.holdMs = 600;
  }
  static {
    this.properties = { label: { type: String }, variant: { type: String }, disabled: { type: Boolean }, holdMs: { type: Number, attribute: "hold-ms" } };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this._holdTimer);
  }
  render() {
    return l`
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
        ${this.variant === "feed" ? l`<span class="fill"></span>` : ""}
        <span class="label">${this.label}</span>
      </button>
    `;
  }
  _tapActivate() {
    this.disabled || this._activate();
  }
  _activate() {
    this.dispatchEvent(new CustomEvent("activate", { bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-hold-button", ke);
var dt = { connected: "cloudCheck", blocked: "cloudLock", unreachable: "cloudAlert", unknown: "cloudQuestion" };
var Ut = { connected: "Cloud connected", blocked: "Cloud blocked", unreachable: "Cloud unreachable", unknown: "Cloud status unknown" };
var Ae = class extends h {
  static {
    this.properties = { cloudState: { type: String }, desiccantDays: { type: Number }, wifiLabel: { type: String } };
  }
  constructor() {
    super(), this.cloudState = null, this.desiccantDays = null, this.wifiLabel = null;
  }
  render() {
    let t = this.cloudState && this.cloudState in dt ? this.cloudState : "unknown";
    return l`
      <div class="footer">
        <button type="button" class="glance ${t === "blocked" ? "warn" : ""}" title=${Ut[t]} @click=${this._openSettings}>
          ${$(dt[t])}
        </button>
        ${this.desiccantDays == null ? a : l`
              <button type="button" class="glance" title="Desiccant left" @click=${this._openSettings}>
                ${$("airFilter")}<span>${this.desiccantDays}d</span>
              </button>
            `}
        ${this.wifiLabel ? l`
              <button type="button" class="glance" title="Wi-Fi" @click=${this._openSettings}>
                ${$("wifi")}<span>${this.wifiLabel}</span>
              </button>
            ` : a}
      </div>
    `;
  }
  _openSettings() {
    this.dispatchEvent(new CustomEvent("open-settings", { bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-footer", Ae);
var { I: zi } = Ye;
var ct = (s3) => s3.strings === void 0;
var ut = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var Se = (s3) => (...t) => ({ _$litDirective$: s3, values: t });
var J = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
var K = (s3, t) => {
  let e = s3._$AN;
  if (e === void 0) return false;
  for (let i of e) i._$AO?.(t, false), K(i, t);
  return true;
};
var ee = (s3) => {
  let t, e;
  do {
    if ((t = s3._$AM) === void 0) break;
    e = t._$AN, e.delete(s3), s3 = t;
  } while (e?.size === 0);
};
var ht = (s3) => {
  for (let t; t = s3._$AM; s3 = t) {
    let e = t._$AN;
    if (e === void 0) t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(s3)) break;
    e.add(s3), qt(t);
  }
};
function Ft(s3) {
  this._$AN !== void 0 ? (ee(this), this._$AM = s3, ht(this)) : this._$AM = s3;
}
function jt(s3, t = false, e = 0) {
  let i = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (t) if (Array.isArray(i)) for (let r = e; r < i.length; r++) K(i[r], false), ee(i[r]);
  else i != null && (K(i, false), ee(i));
  else K(this, s3);
}
var qt = (s3) => {
  s3.type == ut.CHILD && (s3._$AP ??= jt, s3._$AQ ??= Ft);
};
var te = class extends J {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, i) {
    super._$AT(t, e, i), ht(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = true) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (K(this, t), ee(this));
  }
  setValue(t) {
    if (ct(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      let e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};
var pt = () => new Ee();
var Ee = class {
};
var we = /* @__PURE__ */ new WeakMap();
var bt = Se(class extends te {
  render(s3) {
    return a;
  }
  update(s3, [t]) {
    let e = t !== this.G;
    return e && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = t, this.ht = s3.options?.host, this.rt(this.ct = s3.element)), a;
  }
  rt(s3) {
    if (this.G !== void 0) if (this.isConnected || (s3 = void 0), typeof this.G == "function") {
      let t = this.ht ?? globalThis, e = we.get(t);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), we.set(t, e)), e.get(this.G) !== void 0 && this.G.call(this.ht, void 0), e.set(this.G, s3), s3 !== void 0 && this.G.call(this.ht, s3);
    } else this.G.value = s3;
  }
  get lt() {
    return typeof this.G == "function" ? we.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
function Wt(s3) {
  let t = /^(\d{1,2}):(\d{2})$/.exec(s3.trim());
  if (!t) throw new Error(`Invalid schedule time "${s3}"`);
  let e = Number(t[1]), i = Number(t[2]);
  if (e > 23 || i > 59) throw new Error(`Invalid schedule time "${s3}"`);
  return e * 60 + i;
}
function Gt(s3, t) {
  let e = t.getHours() * 60 + t.getMinutes(), i = null;
  for (let n of s3) {
    if (!n.enabled) continue;
    let o = ((Wt(n.time) - e) % 1440 + 1440) % 1440;
    (i === null || o < i.minutesUntil) && (i = { entry: n, minutesUntil: o });
  }
  return i;
}
function mt(s3, t) {
  if (s3.length === 0) return "No schedule set";
  let e = s3.length === 1 ? "1 scheduled" : `${s3.length} scheduled`, i = Gt(s3, t);
  return i ? `${e} \xB7 next ${i.entry.time}` : `${e} \xB7 all paused`;
}
var Me = "dispenser-schedule-card";
var Le = class extends h {
  constructor() {
    super();
    this._expanded = false;
    this._embedRef = pt();
    this._configureEmbed = (e) => {
      if (!e || !this.scheduleCardStateEntity) return;
      let i = e.querySelector(Me);
      if (i) {
        i.hass = this.hass;
        return;
      }
      let n = document.createElement(Me);
      n.setConfig({ type: "custom:dispenser-schedule-card", device: { type: "custom", entity: this.scheduleCardStateEntity, max_entries: 24, min_amount: 1, max_amount: 20, step_amount: 1, status_map: ["0 -> dispensed", "1 -> failed", "2 -> pending", "3 -> dispensing"], status_pattern: "(?<id>[^,]+),(?<hour>[0-9]{1,2}),(?<minute>[0-9]{1,2}),(?<amount>[0-9]{1,2}),(?<status>[0-9]);?", actions: { add: "kibble.schedule_card_add", edit: "kibble.schedule_card_edit", remove: "kibble.schedule_card_remove", toggle: "kibble.schedule_card_toggle" } }, unit_of_measurement: { one: "portion", other: "portions" } }), n.hass = this.hass, e.appendChild(n);
    };
    this.entries = [], this.deviceName = "Kibble";
  }
  static {
    this.properties = { hass: { attribute: false }, entries: { attribute: false }, scheduleCardStateEntity: { type: String }, deviceName: { type: String } };
  }
  updated() {
    this._embedRef.value && this.hass && (this._embedRef.value.hass = this.hass);
  }
  render() {
    let e = /* @__PURE__ */ new Date(), i = mt(this.entries, e);
    return l`
      <button type="button" class="row" @click=${this._toggle} aria-expanded=${this._expanded}>
        <span>${i}</span>
        <span class="chevron ${this._expanded ? "open" : ""}">${$("chevronDown")}</span>
      </button>
      ${this._expanded ? l`<div class="expanded">${this._renderExpanded()}</div>` : a}
    `;
  }
  _renderExpanded() {
    if (this._canEmbed()) return l`<div ${bt(this._configureEmbed)}></div>`;
    if (this.entries.length === 0) return l`<p class="empty">No schedule set</p>`;
    let e = [...this.entries].sort((i, n) => i.time.localeCompare(n.time));
    return l`
      <ul class="entries">
        ${e.map((i) => l`
            <li class=${i.enabled ? "" : "disabled"}>
              <span class="time">${i.time}</span>
              <span class="amounts">${i.amount_l}g + ${i.amount_r}g</span>
              <span class="state">${i.enabled ? "On" : "Paused"}</span>
            </li>
          `)}
      </ul>
    `;
  }
  _canEmbed() {
    if (!customElements.get(Me) || !this.scheduleCardStateEntity) return false;
    let e = this.hass?.states[this.scheduleCardStateEntity];
    return e !== void 0 && e.state !== "unavailable";
  }
  _toggle() {
    this._expanded = !this._expanded, this.requestUpdate();
  }
  static {
    this.styles = f`
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
customElements.define("kibble-schedule-summary", Le);
var Zt = 3e3;
function ie(s3, t) {
  if (!t) return null;
  let e = s3.states[t];
  if (!e) return null;
  let i = Number(e.state);
  return Number.isNaN(i) ? null : { value: i, min: Number(e.attributes.min ?? 1), max: Number(e.attributes.max ?? 20), step: Number(e.attributes.step ?? 1) };
}
var He = class extends h {
  constructor() {
    super();
    this._cloudConfirmArmed = false;
    this._cloudConfirmTimer = void 0;
    this.open = false;
  }
  static {
    this.properties = { hass: { attribute: false }, entities: { attribute: false }, open: { type: Boolean, reflect: true } };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this._cloudConfirmTimer);
  }
  render() {
    if (!this.open) return a;
    let e = this.entities;
    return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Kibble settings" @keydown=${this._onKeydown}>
        <header>
          <h2>Settings</h2>
          <button type="button" class="icon-button" @click=${this._close} aria-label="Close">${$("close")}</button>
        </header>
        <div class="body">
          ${e.feedButtonHopper1 || e.feedButtonHopper2 ? this._renderHopperSection() : a}
          ${e.feedAmount ? this._renderMoreAmountSection() : a}
          ${this._renderToggles()}
          ${e.volume ? this._renderVolume() : a}
          ${e.cloudSwitch ? this._renderCloud() : a}
          ${e.wifiNetwork ? this._renderWifi() : a}
          ${e.dishBefore || e.dishAfter ? this._renderDishPhotos() : a}
          ${e.speaker ? this._renderSpeaker() : a}
          <button type="button" class="device-link" @click=${this._openDevicePage}>
            Open device page ${$("openInNew")}
          </button>
        </div>
      </div>
    `;
  }
  _renderMoreAmountSection() {
    let e = ie(this.hass, this.entities.feedAmount);
    return e ? l`
      <section>
        <h3>Feed amount</h3>
        ${this._renderStepper(this.entities.feedAmount, e)}
      </section>
    ` : a;
  }
  _renderHopperSection() {
    let { feedAmountHopper1: e, feedAmountHopper2: i, feedButtonHopper1: n, feedButtonHopper2: r } = this.entities;
    return l`
      <section>
        <h3>Per-hopper feed</h3>
        <p class="hint">Runs one auger at a time — useful for wear-leveling or working around a jam.</p>
        <div class="hoppers">
          ${e ? l`
                <div class="hopper">
                  <span class="hopper-label">Hopper 1</span>
                  ${this._renderStepper(e, ie(this.hass, e))}
                  ${n ? l`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(n)}></kibble-hold-button>` : a}
                </div>
              ` : a}
          ${i ? l`
                <div class="hopper">
                  <span class="hopper-label">Hopper 2</span>
                  ${this._renderStepper(i, ie(this.hass, i))}
                  ${r ? l`<kibble-hold-button label="Hold to feed" @activate=${() => this._pressButton(r)}></kibble-hold-button>` : a}
                </div>
              ` : a}
        </div>
      </section>
    `;
  }
  _renderStepper(e, i) {
    return i ? l`
      <div class="stepper">
        <button type="button" class="step-btn" ?disabled=${i.value <= i.min} @click=${() => this._setNumber(e, Math.max(i.min, i.value - i.step))}>
          &minus;
        </button>
        <span class="step-value">${i.value}</span>
        <button type="button" class="step-btn" ?disabled=${i.value >= i.max} @click=${() => this._setNumber(e, Math.min(i.max, i.value + i.step))}>
          &plus;
        </button>
      </div>
    ` : a;
  }
  _renderToggles() {
    let i = [{ id: this.entities.nightVisionSwitch, icon: "weatherNight", label: "Night vision" }, { id: this.entities.statusLedSwitch, icon: "ledOn", label: "Status LED" }, { id: this.entities.microphoneSwitch, icon: "microphone", label: "Microphone" }].filter((n) => n.id !== void 0);
    return i.length === 0 ? a : l`
      <section>
        <h3>Device</h3>
        ${i.map((n) => this._renderToggleRow(n.id, n.icon, n.label))}
      </section>
    `;
  }
  _renderToggleRow(e, i, n) {
    let r = this.hass.states[e], o = r?.state === "on", d = !r || r.state === "unavailable";
    return l`
      <button type="button" class="toggle-row" ?disabled=${d} @click=${() => this._toggleSwitch(e)}>
        <span class="toggle-icon">${$(i)}</span>
        <span class="toggle-label">${n}</span>
        <span class="toggle-pill ${o ? "on" : ""}"><span class="toggle-knob"></span></span>
      </button>
    `;
  }
  _renderVolume() {
    let e = ie(this.hass, this.entities.volume);
    return e ? l`
      <section>
        <h3>Volume</h3>
        <input
          type="range"
          min=${e.min}
          max=${e.max}
          step=${e.step}
          .value=${String(e.value)}
          @change=${(i) => this._setNumber(this.entities.volume, Number(i.target.value))}
        />
      </section>
    ` : a;
  }
  _renderCloud() {
    let i = this.hass.states[this.entities.cloudSwitch]?.state === "on", n = this.entities.cloudConnection ? this.hass.states[this.entities.cloudConnection]?.state : void 0;
    return l`
      <section>
        <h3>Petkit cloud</h3>
        <p class="hint">${n ? `Connection: ${n}` : "Turns the feeder's cloud link on or off."}</p>
        <button type="button" class="cloud-toggle ${this._cloudConfirmArmed ? "confirming" : ""}" @click=${this._onCloudToggleClick}>
          ${this._cloudConfirmArmed ? `Tap again to turn ${i ? "off" : "on"}` : i ? "On \u2014 tap to turn off" : "Off \u2014 tap to turn on"}
        </button>
      </section>
    `;
  }
  _renderWifi() {
    let e = this.hass.states[this.entities.wifiNetwork];
    return l`
      <section>
        <h3>Wi-Fi</h3>
        <p class="hint">${e ? e.state : "Unavailable"}</p>
      </section>
    `;
  }
  _renderDishPhotos() {
    let e = this.entities.dishBefore ? this.hass.states[this.entities.dishBefore] : void 0, i = this.entities.dishAfter ? this.hass.states[this.entities.dishAfter] : void 0;
    return (!e || e.state === "unavailable") && (!i || i.state === "unavailable") ? a : l`
      <section>
        <h3>Last feed</h3>
        <div class="dish-photos">
          ${e && e.state !== "unavailable" ? l`<img src=${String(e.attributes.entity_picture ?? "")} alt="Before" />` : a}
          ${i && i.state !== "unavailable" ? l`<img src=${String(i.attributes.entity_picture ?? "")} alt="After" />` : a}
        </div>
      </section>
    `;
  }
  _renderSpeaker() {
    let e = this.hass.states[this.entities.speaker];
    if (!e) return a;
    let i = typeof e.attributes.volume_level == "number" ? e.attributes.volume_level : 0.5;
    return l`
      <section>
        <h3>Speaker</h3>
        <p class="hint">${e.state}</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          .value=${String(i)}
          @change=${(n) => this.hass.callService("media_player", "volume_set", { volume_level: Number(n.target.value) }, { entity_id: this.entities.speaker })}
        />
      </section>
    `;
  }
  _pressButton(e) {
    this.hass.callService("button", "press", {}, { entity_id: e });
  }
  _toggleSwitch(e) {
    this.hass.callService("switch", "toggle", {}, { entity_id: e });
  }
  _setNumber(e, i) {
    this.hass.callService("number", "set_value", { value: i }, { entity_id: e });
  }
  _onCloudToggleClick() {
    if (this._cloudConfirmArmed) {
      clearTimeout(this._cloudConfirmTimer), this._cloudConfirmArmed = false, this._toggleSwitch(this.entities.cloudSwitch), this.requestUpdate();
      return;
    }
    this._cloudConfirmArmed = true, this.requestUpdate(), this._cloudConfirmTimer = setTimeout(() => {
      this._cloudConfirmArmed = false, this.requestUpdate();
    }, Zt);
  }
  _openDevicePage() {
    let e = this.entities.deviceId;
    history.pushState(null, "", `/config/devices/device/${e}`), window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true })), this._close();
  }
  _onKeydown(e) {
    e.key === "Escape" && this._close();
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close-requested", { bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-settings-dialog", He);
var Yt = [{ name: "device_id", required: true, selector: { device: { filter: { integration: "kibble" } } } }, { name: "name", selector: { text: {} } }];
var Qt = { device_id: "Kibble device", name: "Name (optional)" };
var Te = class extends h {
  constructor() {
    super(...arguments);
    this._computeLabel = (e) => Qt[e.name] ?? e.name;
  }
  static {
    this.properties = { hass: { attribute: false }, _config: { state: true } };
  }
  setConfig(e) {
    this._config = e;
  }
  render() {
    return this._config ? customElements.get("ha-form") ? l`
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${Yt}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formValueChanged}
        ></ha-form>
      ` : this._renderFallback() : a;
  }
  _renderFallback() {
    let e = Object.values(this.hass?.entities ?? {}), i = Object.values(this.hass?.devices ?? {}).filter((n) => e.some((r) => r.device_id === n.id && r.platform === "kibble"));
    return l`
      <div class="fallback">
        <label>
          <span>Kibble device</span>
          <select @change=${(n) => this._updateDeviceId(n.target.value)}>
            <option value="" ?selected=${!this._config?.device_id}>Choose a device\u2026</option>
            ${i.map((n) => l`<option value=${n.id} ?selected=${n.id === this._config?.device_id}>${n.name_by_user ?? n.name}</option>`)}
          </select>
        </label>
        <label>
          <span>Name (optional)</span>
          <input
            type="text"
            .value=${this._config?.name ?? ""}
            @change=${(n) => this._updateName(n.target.value)}
          />
        </label>
      </div>
    `;
  }
  _formValueChanged(e) {
    this._config = e.detail.value, this._fireConfigChanged();
  }
  _updateDeviceId(e) {
    this._config && (this._config = { ...this._config, device_id: e }, this._fireConfigChanged());
  }
  _updateName(e) {
    this._config && (this._config = { ...this._config, name: e || void 0 }, this._fireConfigChanged());
  }
  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
  static {
    this.styles = f`
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
customElements.define("kibble-card-editor", Te);
var Jt = { deviceId: "", catPresence: [] };
var Ne = class extends h {
  constructor() {
    super();
    this._entities = Jt;
    this._onFeedActivate = () => {
      if (!this._entities.deviceId) return;
      let e = this._numberState(this._entities.feedAmount) ?? 1;
      this.hass.callService("kibble", "feed", { device_id: this._entities.deviceId, hopper: "both", amount: e });
    };
    this._onCancelActivate = () => {
      this._entities.deviceId && this.hass.callService("kibble", "cancel_feed", { device_id: this._entities.deviceId });
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
    this.properties = { hass: { attribute: false }, _config: { state: true }, _settingsOpen: { state: true } };
  }
  setConfig(e) {
    if (!e.device_id) throw new Error("Kibble card: a device is required. Choose it in the card editor.");
    this._config = e;
  }
  getCardSize() {
    return 6;
  }
  static getStubConfig(e) {
    return { type: "custom:kibble-card", device_id: Object.values(e.entities ?? {}).find((n) => n.platform === "kibble")?.device_id ?? "" };
  }
  static getConfigElement() {
    return document.createElement("kibble-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), this._resizeObserver = new ResizeObserver((e) => {
      let i = e[0]?.contentRect, n = i?.height ?? this.getBoundingClientRect().height, r = i?.width ?? this.getBoundingClientRect().width;
      this.classList.toggle("kiosk", n >= 440), this.classList.toggle("compact", r < 640 && n > 0 && n <= 520);
    }), this._resizeObserver.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resizeObserver?.disconnect();
  }
  willUpdate(e) {
    (e.has("hass") || e.has("_config")) && this._config?.device_id && this.hass && (this._entities = Xe(this.hass.entities ?? {}, this._config.device_id));
  }
  render() {
    if (!this._config || !this.hass) return a;
    let e = this._entities, i = e.feeding ? this.hass.states[e.feeding]?.state : void 0, r = [e.feeding, e.bowlFill1, e.bowlFill2, e.schedule].filter((ne) => !!ne).map((ne) => this.hass.states[ne]?.state), o = Je(r, i), d = i === "on", c = this._numberState(e.bowlFill1), b = this._numberState(e.bowlFill2), m = this._catName(), u = o === "idle" ? fe(o, this._lastFedRelative(i)) : fe(o, null), g = this._scheduleEntries(), _ = this._numberState(e.feedAmount) ?? 1, H = this._numberState(e.desiccantDays), se = e.wifiNetwork ? this.hass.states[e.wifiNetwork] : void 0, ft = e.cloudConnection ? this.hass.states[e.cloudConnection]?.state : void 0;
    return l`
      <ha-card>
        <div class="container">
          <div class="root">
            <div class="hero">
              <div class="hero-media">${this._renderCamera(e.camera)}</div>
              <div class="hero-progress" data-active=${o === "dispensing"}></div>
              <button class="gear-button" aria-label="Settings" @click=${this._openSettings}>${$("cog")}</button>
              ${this._config.name ? l`<div class="name-chip">${this._config.name}</div>` : a}
            </div>
            <kibble-bowl
              class="bowl-block"
              .hopper1=${c}
              .hopper2=${b}
              .catName=${m}
              .feeding=${d}
              .statusText=${u}
            ></kibble-bowl>
            <div class="feed-controls">
              <kibble-segmented-picker
                class="picker-full"
                .value=${_}
                ?disabled=${o === "unreachable" || d}
                @portion-selected=${this._onPortionSelected}
              ></kibble-segmented-picker>
              <kibble-stepper
                class="picker-compact"
                .value=${_}
                ?disabled=${o === "unreachable" || d}
                @value-selected=${this._onPortionSelected}
              ></kibble-stepper>
              <kibble-hold-button
                .label=${d ? "Cancel" : "Hold to feed"}
                .variant=${d ? "cancel" : "feed"}
                ?disabled=${o === "unreachable"}
                @activate=${d ? this._onCancelActivate : this._onFeedActivate}
              ></kibble-hold-button>
            </div>
            <kibble-schedule-summary
              class="schedule-row"
              .hass=${this.hass}
              .entries=${g}
              .scheduleCardStateEntity=${e.scheduleCardState}
            ></kibble-schedule-summary>
            <kibble-footer
              class="footer"
              .cloudState=${ft}
              .desiccantDays=${H}
              .wifiLabel=${se && se.state !== "unavailable" ? se.state : null}
              @open-settings=${this._openSettings}
            ></kibble-footer>
          </div>
        </div>
      </ha-card>
      <kibble-settings-dialog .hass=${this.hass} .entities=${e} ?open=${this._settingsOpen} @close-requested=${this._closeSettings}></kibble-settings-dialog>
    `;
  }
  _renderCamera(e) {
    if (!e) return l`<div class="hero-placeholder">No camera on this device</div>`;
    if (customElements.get("hui-image")) return l`<hui-image .hass=${this.hass} .cameraImage=${e} cameraView="live"></hui-image>`;
    let i = this.hass.states[e], n = i?.attributes.entity_picture;
    return !i || i.state === "unavailable" || !n ? l`<div class="hero-placeholder">Camera unavailable</div>` : l`<img src=${n} alt="Live view of the feeder" />`;
  }
  _numberState(e) {
    if (!e) return null;
    let i = Number(this.hass.states[e]?.state);
    return Number.isFinite(i) ? i : null;
  }
  _catName() {
    let e = this._entities.lastSeenPet;
    if (!e) return null;
    let i = this.hass.states[e]?.state;
    return !i || i === "unavailable" || i.toLowerCase() === "unknown" ? null : i;
  }
  _lastFedRelative(e) {
    let i = this._entities.feeding;
    if (!i || e !== "off") return null;
    let n = this.hass.states[i];
    return n ? et(new Date(n.last_changed), /* @__PURE__ */ new Date()) : null;
  }
  _scheduleEntries() {
    let e = this._entities.schedule;
    if (!e) return [];
    let n = this.hass.states[e]?.attributes?.entries;
    return Array.isArray(n) ? n : [];
  }
  _onPortionSelected(e) {
    this._entities.feedAmount && this.hass.callService("number", "set_value", { value: e.detail.value }, { entity_id: this._entities.feedAmount });
  }
  static {
    this.styles = f`
    :host {
      display: block;
      height: 100%;
      --kibble-amber: ${T(tt)};
      --kibble-amber-dark: ${T(it)};
      --kibble-ink-on-amber: ${T(st)};
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
customElements.define("kibble-card", Ne);
window.customCards = window.customCards || [];
window.customCards.push({ type: "kibble-card", name: "Kibble", description: "The full daily control surface for a Kibble Petkit feeder: live camera, bowl status, feed, and schedule.", preview: true });

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
  const enabledCount = SCHEDULE_ENTRIES.filter((e) => e.enabled).length;
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
    [ENTITY_IDS.lastSeenPet]: state(ENTITY_IDS.lastSeenPet, "Kitty", { score: 0.94 }, minutesAgo(126))
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
