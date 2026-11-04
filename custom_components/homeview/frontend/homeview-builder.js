const R = globalThis, F = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = /* @__PURE__ */ Symbol(), et = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (s) => new mt(typeof s == "string" ? s : s + "", void 0, G), Y = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new mt(e, s, G);
}, Rt = (s, t) => {
  if (F) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = R.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, rt = F ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return Dt(e);
})(s) : s;
const { is: Ht, defineProperty: Mt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Bt, getOwnPropertySymbols: Lt, getPrototypeOf: jt } = Object, U = globalThis, st = U.trustedTypes, It = st ? st.emptyScript : "", Wt = U.reactiveElementPolyfillSupport, C = (s, t) => s, I = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? It : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, bt = (s, t) => !Ht(s, t), it = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), U.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && Mt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: o } = Ut(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const c = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, r = [...Bt(e), ...Lt(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(rt(i));
    } else t !== void 0 && e.push(rt(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Rt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : I).toAttribute(e, r.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : I;
      this._$Em = i;
      const c = n.fromAttribute(e, o.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), r ??= n.getPropertyOptions(t), !((r.hasChanged ?? bt)(o, e) || r.useDefault && r.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: o }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, o] of r) {
        const { wrapped: n } = o, c = this[i];
        n !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, o, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[C("elementProperties")] = /* @__PURE__ */ new Map(), x[C("finalized")] = /* @__PURE__ */ new Map(), Wt?.({ ReactiveElement: x }), (U.reactiveElementVersions ??= []).push("2.1.2");
const J = globalThis, ot = (s) => s, H = J.trustedTypes, nt = H ? H.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, gt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + m, Vt = `<${vt}>`, $ = document, k = () => $.createComment(""), T = (s) => s === null || typeof s != "object" && typeof s != "function", K = Array.isArray, qt = (s) => K(s) || typeof s?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, at = /-->/g, lt = />/g, g = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, yt = /^(?:script|style|textarea|title)$/i, Ft = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), h = Ft(1), w = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), v = $.createTreeWalker($, 129);
function $t(s, t) {
  if (!K(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Gt = (s, t) => {
  const e = s.length - 1, r = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let u, p, d = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === S ? p[1] === "!--" ? n = at : p[1] !== void 0 ? n = lt : p[2] !== void 0 ? (yt.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = g) : p[3] !== void 0 && (n = g) : n === g ? p[0] === ">" ? (n = i ?? S, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? g : p[3] === '"' ? dt : ct) : n === dt || n === ct ? n = g : n === at || n === lt ? n = S : (n = g, i = void 0);
    const _ = n === g && s[c + 1].startsWith("/>") ? " " : "";
    o += n === S ? a + Vt : d >= 0 ? (r.push(u), a.slice(0, d) + gt + a.slice(d) + m + _) : a + m + (d === -2 ? c : _);
  }
  return [$t(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class P {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [u, p] = Gt(t, e);
    if (this.el = P.createElement(u, r), v.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = v.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(gt)) {
          const f = p[n++], _ = i.getAttribute(d).split(m), b = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: b[2], strings: _, ctor: b[1] === "." ? Jt : b[1] === "?" ? Kt : b[1] === "@" ? Xt : B }), i.removeAttribute(d);
        } else d.startsWith(m) && (a.push({ type: 6, index: o }), i.removeAttribute(d));
        if (yt.test(i.tagName)) {
          const d = i.textContent.split(m), f = d.length - 1;
          if (f > 0) {
            i.textContent = H ? H.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(d[_], k()), v.nextNode(), a.push({ type: 2, index: ++o });
            i.append(d[f], k());
          }
        }
      } else if (i.nodeType === 8) if (i.data === vt) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(m, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += m.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const r = $.createElement("template");
    return r.innerHTML = t, r;
  }
}
function A(s, t, e = s, r) {
  if (t === w) return t;
  let i = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const o = T(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, e, r)), r !== void 0 ? (e._$Co ??= [])[r] = i : e._$Cl = i), i !== void 0 && (t = A(s, i._$AS(s, t.values), i, r)), t;
}
class Yt {
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
    const { el: { content: e }, parts: r } = this._$AD, i = (t?.creationScope ?? $).importNode(e, !0);
    v.currentNode = i;
    let o = v.nextNode(), n = 0, c = 0, a = r[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new O(o, o.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (u = new Zt(o, this, t)), this._$AV.push(u), a = r[++c];
      }
      n !== a?.index && (o = v.nextNode(), n++);
    }
    return v.currentNode = $, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = A(this, t, e), T(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = P.createElement($t(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const o = new Yt(i, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ht.get(t.strings);
    return e === void 0 && ht.set(t.strings, e = new P(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const o of t) i === e.length ? e.push(r = new O(this.O(k()), this.O(k()), this, this.options)) : r = e[i], r._$AI(o), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = ot(t).nextSibling;
      ot(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = l;
  }
  _$AI(t, e = this, r, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = A(this, t, e, 0), n = !T(t) || t !== this._$AH && t !== w, n && (this._$AH = t);
    else {
      const c = t;
      let a, u;
      for (t = o[0], a = 0; a < o.length - 1; a++) u = A(this, c[r + a], e, a), u === w && (u = this._$AH[a]), n ||= !T(u) || u !== this._$AH[a], u === l ? t = l : t !== l && (t += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Kt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Xt extends B {
  constructor(t, e, r, i, o) {
    super(t, e, r, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? l) === w) return;
    const r = this._$AH, i = t === l && r !== l || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== l && (r === l || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Qt = J.litHtmlPolyfillSupport;
Qt?.(P, O), (J.litHtmlVersions ??= []).push("3.3.3");
const te = (s, t, e) => {
  const r = e?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = e?.renderBefore ?? null;
    r._$litPart$ = i = new O(t.insertBefore(k(), o), o, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
const X = globalThis;
class y extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = te(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
y._$litElement$ = !0, y.finalized = !0, X.litElementHydrateSupport?.({ LitElement: y });
const ee = X.litElementPolyfillSupport;
ee?.({ LitElement: y });
(X.litElementVersions ??= []).push("4.2.2");
const Z = 12, re = 1;
function xt(s) {
  return typeof structuredClone == "function" ? structuredClone(s) : JSON.parse(JSON.stringify(s));
}
function wt(s, t, e) {
  return Math.min(e, Math.max(t, Math.round(s)));
}
function N(s) {
  return s && Array.isArray(s.views) ? s.views : [];
}
function E(s) {
  return s && Array.isArray(s.sections) ? s.sections : [];
}
function L(s) {
  return s && Array.isArray(s.cards) ? s.cards : [];
}
function se(s) {
  return N(s).findIndex(
    (t) => t.type === "sections" && Array.isArray(t.sections)
  );
}
function ie(s) {
  return s ? s.strategy && typeof s.strategy == "object" ? !0 : N(s).some(
    (t) => t.strategy && typeof t.strategy == "object"
  ) : !1;
}
function At(s) {
  const t = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return t.includes("-") ? t : `${t || "view"}-view`;
}
function ut(s, t = "Homeview") {
  const e = s && typeof s == "object" ? xt(s) : {}, r = se(e);
  if (r >= 0)
    return { config: e, viewIndex: r, createdView: !1 };
  const i = {
    type: "sections",
    title: t,
    path: At(t),
    sections: [{ type: "grid", cards: [] }]
  }, o = N(e);
  return {
    config: { ...e, views: [...o, i] },
    viewIndex: o.length,
    createdView: !0
  };
}
function W(s) {
  return N(s.config)[s.viewIndex];
}
function Q(s, t) {
  const e = N(s.config).map(
    (r, i) => i === s.viewIndex ? t(r) : r
  );
  return { ...s, config: { ...s.config, views: e } };
}
function tt(s, t, e) {
  return Q(s, (r) => {
    const i = E(r), o = i[t];
    if (!o) return r;
    const n = e(L(o));
    return {
      ...r,
      sections: i.map(
        (c, a) => a === t ? { ...c, cards: n } : c
      )
    };
  });
}
function Et(s, t) {
  return L(E(W(s))[t.section])[t.index];
}
function V(s, t, e) {
  return tt(s, t.section, (r) => {
    const i = wt(t.index, 0, r.length);
    return [...r.slice(0, i), e, ...r.slice(i)];
  });
}
function St(s, t) {
  return tt(
    s,
    t.section,
    (e) => e.filter((r, i) => i !== t.index)
  );
}
function oe(s, t, e) {
  const r = Et(s, t);
  if (!r) return s;
  const i = t.section === e.section;
  if (i && t.index === e.index) return s;
  const o = St(s, t), n = i && e.index > t.index ? e.index - 1 : e.index;
  return V(o, { section: e.section, index: n }, r);
}
function Ct(s, t, e) {
  return tt(
    s,
    t.section,
    (r) => r.map((i, o) => o === t.index ? e(i) : i)
  );
}
function ne(s) {
  if (s === "full") return "full";
  const t = typeof s == "number" ? s : Number(s);
  if (Number.isFinite(t))
    return wt(t, re, Z);
}
function ae(s) {
  if (s === "auto") return "auto";
  const t = typeof s == "number" ? s : Number(s);
  if (!(!Number.isFinite(t) || t < 1))
    return Math.round(t);
}
function le(s, t, e) {
  const r = e.columns === void 0 ? void 0 : ne(e.columns), i = e.rows === void 0 ? void 0 : ae(e.rows);
  return Ct(s, t, (o) => {
    const n = { ...o.grid_options ?? {} };
    return r !== void 0 && (n.columns = r), i !== void 0 && (n.rows = i), { ...o, grid_options: n };
  });
}
function kt(s) {
  return s.grid_options?.columns ?? Z;
}
function Tt(s) {
  return s.grid_options?.rows ?? "auto";
}
function ce(s) {
  return Q(s, (t) => ({
    ...t,
    sections: [...E(t), { type: "grid", cards: [] }]
  }));
}
function de(s, t) {
  return Q(s, (e) => {
    const r = E(e);
    return r.length <= 1 ? e : {
      ...e,
      sections: r.filter((i, o) => o !== t)
    };
  });
}
function he(s) {
  return xt(s.config);
}
function ue(s) {
  for (const t of ["name", "heading", "title", "entity", "content"]) {
    const e = s[t];
    if (typeof e == "string" && e.trim() !== "") return e.trim();
  }
  return s.type.replace(/^custom:/, "");
}
const Pt = "application/x-homeview";
let z = null;
function zt(s, t) {
  z = t, s.dataTransfer?.setData(Pt, JSON.stringify(t)), s.dataTransfer?.setData("text/plain", t.kind), s.dataTransfer && (s.dataTransfer.effectAllowed = "move");
}
function pe() {
  return z;
}
function q() {
  z = null;
}
function fe(s) {
  const t = s.dataTransfer?.getData(Pt);
  if (!t) return z;
  try {
    return JSON.parse(t);
  } catch {
    return z;
  }
}
function pt(s, t, e) {
  for (let r = 0; r < s.length; r += 1) {
    const i = s[r];
    if (e < i.top) return r;
    if (!(e > i.bottom) && t < i.left + (i.right - i.left) / 2)
      return r;
  }
  return s.length;
}
class _e extends y {
  static properties = {
    hass: { attribute: !1 },
    view: { attribute: !1 },
    selected: { attribute: !1 },
    _drop: { state: !0 }
  };
  constructor() {
    super(), this._drop = null;
  }
  static styles = Y`
    :host {
      display: block;
      height: 100%;
      overflow: auto;
      padding: 16px;
      box-sizing: border-box;
    }
    .section {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border-radius: 12px;
      padding: 6px 12px 12px;
      margin-bottom: 12px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      padding: 4px 2px 8px;
    }
    .section-header button {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .section-header button:hover {
      background: var(--divider-color);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-auto-rows: 56px;
      gap: 8px;
      min-height: 64px;
    }
    .card {
      display: flex;
      align-items: center;
      gap: 10px;
      box-sizing: border-box;
      padding: 10px 14px;
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      cursor: grab;
      overflow: hidden;
    }
    .card:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .card:active {
      cursor: grabbing;
    }
    .card.selected {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* Insertion marker as a box-shadow: it shifts no layout, so the rects used
       for hit-testing stay stable while dragging. */
    .card.drop-before {
      box-shadow: inset 4px 0 0 0 var(--primary-color);
    }
    .card.drop-after {
      box-shadow: inset -4px 0 0 0 var(--primary-color);
    }
    ha-icon {
      --mdc-icon-size: 24px;
      color: var(--state-icon-color, var(--primary-color));
      flex: none;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .empty {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .empty.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  `;
  render() {
    const t = E(this.view);
    return this.view ? h`
      <div class="canvas">
        ${t.map((e, r) => {
      const i = L(e);
      return h`
            <section class="section">
              <div class="section-header">
                <span>Section ${r + 1} · ${i.length} carte${i.length === 1 ? "" : "s"}</span>
                ${t.length > 1 ? h`<button
                      title="Supprimer la section"
                      @click=${() => this.dispatchEvent(
        new CustomEvent("homeview-section-remove", {
          detail: { section: r },
          bubbles: !0,
          composed: !0
        })
      )}
                    >×</button>` : l}
              </div>
              <div
                class="grid"
                @dragover=${(o) => this._onDragOver(o, r)}
                @dragleave=${(o) => this._onDragLeave(o)}
                @drop=${(o) => this._onDrop(o, r)}
              >
                ${i.map(
        (o, n) => this._renderCard(o, r, n, i.length)
      )}
                ${i.length === 0 ? h`<p class="empty ${this._drop?.section === r ? "active" : ""}">
                      Glissez une carte depuis la palette, ou cliquez-en une
                    </p>` : l}
              </div>
            </section>
          `;
    })}
      </div>
    ` : l;
  }
  _renderCard(t, e, r, i) {
    const o = ["card"];
    this.selected?.section === e && this.selected.index === r && o.push("selected"), this._drop?.section === e && (this._drop.index === r && o.push("drop-before"), this._drop.index >= i && r === i - 1 && o.push("drop-after"));
    const n = kt(t), c = Tt(t), a = [
      `grid-column: span ${n === "full" ? Z : n};`,
      c === "auto" ? "" : `grid-row: span ${c};`
    ].join(" "), u = typeof t.entity == "string" ? t.entity : void 0, p = u ? this.hass?.states[u] : void 0, d = typeof t.icon == "string" ? t.icon : p?.attributes.icon, f = typeof t.card_type == "string" ? `${t.type} · ${t.card_type}` : t.type, _ = ue(t), b = p ? `${f} — ${p.state}` : _ === f ? "" : f;
    return h`
      <div
        class=${o.join(" ")}
        style=${a}
        draggable="true"
        @dragstart=${(Nt) => zt(Nt, { kind: "card", from: { section: e, index: r } })}
        @dragend=${q}
        @click=${() => this.dispatchEvent(
      new CustomEvent("homeview-select", {
        detail: { section: e, index: r },
        bubbles: !0,
        composed: !0
      })
    )}
      >
        <ha-icon .icon=${d ?? "mdi:card-outline"}></ha-icon>
        <span class="text">
          <span class="name">${_}</span>
          ${b ? h`<span class="meta">${b}</span>` : l}
        </span>
      </div>
    `;
  }
  _rects(t) {
    return Array.from(t.querySelectorAll(":scope > .card")).map(
      (e) => e.getBoundingClientRect()
    );
  }
  _onDragOver(t, e) {
    if (!pe()) return;
    t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "move");
    const r = pt(
      this._rects(t.currentTarget),
      t.clientX,
      t.clientY
    );
    this._drop?.section === e && this._drop.index === r || (this._drop = { section: e, index: r });
  }
  _onDragLeave(t) {
    const e = t.currentTarget, r = t.relatedTarget;
    r && e.contains(r) || (this._drop = null);
  }
  _onDrop(t, e) {
    t.preventDefault();
    const r = fe(t), i = {
      section: e,
      index: pt(
        this._rects(t.currentTarget),
        t.clientX,
        t.clientY
      )
    };
    this._drop = null, q(), r && this.dispatchEvent(
      new CustomEvent("homeview-drop", {
        detail: { payload: r, to: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
customElements.define("homeview-canvas", _e);
const me = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "full"], be = ["auto", 1, 2, 3, 4, 5, 6], ge = {
  tile: !0,
  button: !0,
  "custom:bubble-card": !0,
  "history-graph": !0,
  entities: !0,
  statistic: !0
}, ve = {
  tile: !0,
  button: !0,
  "custom:bubble-card": !0
};
class ye extends y {
  static properties = {
    hass: { attribute: !1 },
    card: { attribute: !1 },
    position: { attribute: !1 }
  };
  static styles = Y`
    :host {
      display: block;
      padding: 12px;
      box-sizing: border-box;
    }
    h3 {
      margin: 0 0 4px;
      font-size: 14px;
      color: var(--primary-text-color);
      word-break: break-all;
    }
    .type {
      margin: 0 0 12px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-family: var(--code-font-family, monospace);
    }
    label {
      display: block;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 12px 0 4px;
    }
    input,
    textarea,
    select,
    ha-entity-picker {
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
    }
    textarea {
      min-height: 72px;
      resize: vertical;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    button.danger {
      margin-top: 16px;
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--error-color);
      background: none;
      color: var(--error-color);
      cursor: pointer;
      font-size: 13px;
    }
    button.danger:hover {
      background: var(--error-color);
      color: var(--text-primary-color, #fff);
    }
  `;
  render() {
    const t = this.card;
    if (!t) return l;
    const e = t.type, r = kt(t), i = Tt(t);
    return h`
      <h3>${e}</h3>
      <p class="type">${typeof t.card_type == "string" ? t.card_type : ""}</p>

      ${ge[e] ? h`
            <label for="entity">Entité</label>
            <ha-entity-picker
              id="entity"
              .hass=${this.hass}
              .value=${typeof t.entity == "string" ? t.entity : ""}
              .allowCustomEntity=${!0}
              @value-changed=${(o) => this._patch({ entity: o.detail.value })}
            ></ha-entity-picker>
          ` : l}

      ${ve[e] ? h`
            <label for="name">Nom affiché</label>
            <input
              id="name"
              .value=${typeof t.name == "string" ? t.name : ""}
              @change=${(o) => this._patch({ name: o.target.value })}
            />
          ` : l}

      ${e === "heading" ? h`
            <label for="heading">Titre</label>
            <input
              id="heading"
              .value=${typeof t.heading == "string" ? t.heading : ""}
              @change=${(o) => this._patch({ heading: o.target.value })}
            />
          ` : l}

      ${e === "markdown" ? h`
            <label for="content">Contenu (Jinja autorisé)</label>
            <textarea
              id="content"
              .value=${typeof t.content == "string" ? t.content : ""}
              @change=${(o) => this._patch({ content: o.target.value })}
            ></textarea>
          ` : l}

      <div class="row">
        <div>
          <label for="columns">Colonnes</label>
          <select
            id="columns"
            @change=${(o) => this._grid({
      columns: o.target.value
    })}
          >
            ${me.map(
      (o) => h`<option value=${String(o)} ?selected=${o === r}>
                  ${o === "full" ? "pleine largeur" : `${o} / 12`}
                </option>`
    )}
          </select>
        </div>
        <div>
          <label for="rows">Hauteur</label>
          <select
            id="rows"
            @change=${(o) => this._grid({ rows: o.target.value })}
          >
            ${be.map(
      (o) => h`<option value=${String(o)} ?selected=${o === i}>
                  ${o === "auto" ? "auto" : `${o} × 56 px`}
                </option>`
    )}
          </select>
        </div>
      </div>

      <button class="danger" @click=${() => this._emit("homeview-card-remove")}>
        Supprimer la carte
      </button>
    `;
  }
  _patch(t) {
    this.dispatchEvent(
      new CustomEvent("homeview-card-change", {
        detail: { position: this.position, patch: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _grid(t) {
    this.dispatchEvent(
      new CustomEvent("homeview-grid-change", {
        detail: { position: this.position, grid: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent(t, {
        detail: { position: this.position },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
customElements.define("homeview-inspector", ye);
const M = {
  id: "lovelace",
  url_path: "lovelace",
  title: "Overview",
  icon: "mdi:home",
  mode: "storage",
  show_in_sidebar: !0
};
async function ft(s) {
  const e = (await s.callWS({
    type: "lovelace/dashboards/list"
  })).filter(
    (r) => r.mode === "storage" && r.url_path !== M.url_path
  );
  return [M, ...e];
}
async function $e(s) {
  const t = await s.callWS({ type: "lovelace/resources", url_path: M.url_path });
  if (Array.isArray(t)) return t;
  const e = t?.resources;
  return Array.isArray(e) ? e : [];
}
async function xe(s, t) {
  return await s.callWS({
    type: "lovelace/config",
    url_path: t
  }) ?? {};
}
async function we(s, t, e) {
  await s.callWS({ type: "lovelace/config/save", url_path: t, config: e });
}
async function Ae(s, t) {
  await s.callWS({
    type: "lovelace/dashboards/create",
    url_path: t.urlPath,
    title: t.title,
    icon: t.icon ?? "mdi:view-dashboard-edit-outline",
    mode: "storage",
    show_in_sidebar: !0,
    require_admin: !0
  });
}
function D(s) {
  return s instanceof Error ? s.message : typeof s == "string" ? s : "Erreur inconnue";
}
const Ee = [
  { cardType: "button", label: "Bubble · bouton", columns: 6, rows: 1 },
  { cardType: "pop-up", label: "Bubble · pop-up", columns: 12, rows: 2 },
  { cardType: "media-player", label: "Bubble · média", columns: 12, rows: 2 },
  { cardType: "climate", label: "Bubble · climat", columns: 6, rows: 2 },
  { cardType: "cover", label: "Bubble · volet", columns: 6, rows: 2 },
  { cardType: "select", label: "Bubble · sélecteur", columns: 6, rows: 1 },
  { cardType: "calendar", label: "Bubble · calendrier", columns: 12, rows: 3 },
  { cardType: "separator", label: "Bubble · séparateur", columns: 12, rows: 1 },
  { cardType: "sub-buttons", label: "Bubble · sous-boutons", columns: 12, rows: 1 },
  {
    cardType: "horizontal-buttons-stack",
    label: "Bubble · pile de boutons",
    columns: 12,
    rows: 1
  },
  { cardType: "empty-column", label: "Bubble · colonne vide", columns: 1, rows: 1 }
], Se = [
  { type: "tile", label: "Tuile", columns: 6, rows: 1 },
  { type: "heading", label: "Titre de section", columns: 12, rows: 1 },
  { type: "button", label: "Bouton", columns: 3, rows: 1 },
  { type: "markdown", label: "Markdown", columns: 12, rows: 2 },
  { type: "history-graph", label: "Graphique d'historique", columns: 12, rows: 3 }
];
function Ot(s) {
  return s.startsWith("custom:") ? s : `custom:${s}`;
}
function Ce(s) {
  return s.some((t) => Ot(t.type) === "custom:bubble-card");
}
function ke(s) {
  const t = [];
  if (Ce(s))
    for (const e of Ee)
      t.push({
        key: `bubble:${e.cardType}`,
        category: "bubble",
        label: e.label,
        create: () => ({
          type: "custom:bubble-card",
          card_type: e.cardType,
          grid_options: { columns: e.columns, rows: e.rows }
        })
      });
  for (const e of Se)
    t.push({
      key: `native:${e.type}`,
      category: "native",
      label: e.label,
      create: () => ({
        type: e.type,
        grid_options: { columns: e.columns, rows: e.rows }
      })
    });
  for (const e of s) {
    const r = Ot(e.type);
    r !== "custom:bubble-card" && t.push({
      key: `community:${r}`,
      category: "community",
      label: e.name ?? r,
      create: () => ({ type: r })
    });
  }
  return t;
}
const Te = {
  bubble: "Bubble Card",
  native: "Natif Home Assistant",
  community: "Autres cartes"
}, _t = "__new__";
class Pe extends y {
  static properties = {
    hass: { attribute: !1 },
    _dashboards: { state: !0 },
    _urlPath: { state: !0 },
    _mode: { state: !0 },
    _newTitle: { state: !0 },
    _doc: { state: !0 },
    _selected: { state: !0 },
    _palette: { state: !0 },
    _bubbleResource: { state: !0 },
    _filter: { state: !0 },
    _dirty: { state: !0 },
    _busy: { state: !0 },
    _status: { state: !0 },
    _error: { state: !0 }
  };
  _booted = !1;
  _paletteTimer;
  /** Resource URLs already imported, so reloads do not re-evaluate them. */
  _imported = /* @__PURE__ */ new Set();
  _importErrors = [];
  constructor() {
    super(), this._dashboards = [], this._urlPath = "", this._mode = "existing", this._newTitle = "", this._doc = void 0, this._selected = void 0, this._palette = [], this._bubbleResource = null, this._filter = "", this._dirty = !1, this._busy = !1, this._status = "", this._error = "";
  }
  static styles = Y`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      margin-right: 8px;
    }
    .brand ha-icon {
      color: var(--primary-color);
    }
    header select,
    header input {
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
    }
    header button {
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      font-family: inherit;
    }
    header button.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    header button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .status {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-left: auto;
    }
    .status.dirty {
      color: var(--warning-color, #ff9800);
    }
    .banner {
      padding: 8px 16px;
      font-size: 13px;
      border-bottom: 1px solid var(--divider-color);
    }
    .banner.error {
      background: var(--error-color);
      color: var(--text-primary-color, #fff);
    }
    .banner.warn {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .banner button.inline {
      margin-left: 8px;
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    main {
      display: grid;
      grid-template-columns: 232px minmax(0, 1fr) 280px;
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 1100px) {
      main {
        grid-template-columns: 180px minmax(0, 1fr) 240px;
      }
    }
    .palette,
    .inspector {
      overflow: auto;
      border-right: 1px solid var(--divider-color);
      padding-bottom: 24px;
    }
    .inspector {
      border-right: none;
      border-left: 1px solid var(--divider-color);
    }
    .palette input {
      width: calc(100% - 24px);
      margin: 12px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
    }
    h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
      margin: 12px 12px 6px;
    }
    .chip {
      margin: 4px 12px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      font-size: 13px;
      cursor: grab;
      user-select: none;
    }
    .chip:hover {
      border-color: var(--primary-color);
    }
    .chip:active {
      cursor: grabbing;
    }
    .stage {
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }
    .empty-state,
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      padding: 24px;
      text-align: center;
    }
  `;
  updated(t) {
    t.has("hass") && this.hass && !this._booted && this._boot();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._paletteTimer !== void 0 && window.clearTimeout(this._paletteTimer);
  }
  render() {
    const t = this._doc ? W(this._doc) : void 0, e = this._doc && this._selected ? Et(this._doc, this._selected) : void 0, r = !this._palette.some((i) => i.category === "bubble");
    return h`
      <div class="shell">
        <header>
          <span class="brand">
            <ha-icon icon="mdi:view-dashboard-edit-outline"></ha-icon>
            Homeview
          </span>

          <select @change=${this._onDashboardChange}>
            ${this._mode === "existing" && this._urlPath === "" ? h`<option value="" ?selected=${!0}>— choisir un dashboard —</option>` : l}
            ${this._dashboards.map(
      (i) => h`<option
                  value=${i.url_path}
                  ?selected=${this._mode === "existing" && i.url_path === this._urlPath}
                >
                  ${i.title ?? i.url_path} · ${i.url_path}
                </option>`
    )}
            <option value=${_t} ?selected=${this._mode === "new"}>
              ＋ Nouveau dashboard…
            </option>
          </select>

          ${this._mode === "new" ? h`<input
                placeholder="Titre du dashboard"
                .value=${this._newTitle}
                @input=${(i) => this._newTitle = i.target.value}
              />` : l}

          <button @click=${this._addSection} ?disabled=${!this._doc}>
            ＋ Section
          </button>
          <button ?disabled=${this._busy} @click=${this._reload}>Recharger</button>
          <button class="primary" ?disabled=${this._busy || !this._doc} @click=${this._save}>
            ${this._busy ? "…" : "Enregistrer"}
          </button>

          <span class="status ${this._dirty ? "dirty" : ""}">
            ${this._dirty ? "modifications non enregistrées" : this._status}
          </span>
        </header>

        ${this._error ? h`<div class="banner error">${this._error}</div>` : l}
        ${r ? h`<div class="banner warn">
              ${this._bubbleHint}
              <button class="inline" @click=${this._reloadPalette}>↻ palette</button>
            </div>` : l}

        <main>
          <aside class="palette">
            <input
              placeholder="Filtrer…"
              .value=${this._filter}
              @input=${(i) => this._filter = i.target.value}
            />
            ${this._groupedPalette.map(
      ([i, o]) => h`
                <h3>${Te[i]}</h3>
                ${o.map(
        (n) => h`<div
                    class="chip"
                    draggable="true"
                    title="Glisser dans le canvas, ou cliquer pour ajouter"
                    @dragstart=${(c) => zt(c, { kind: "palette", key: n.key })}
                    @dragend=${q}
                    @click=${() => this._insertFromPalette(n)}
                  >
                    ${n.label}
                  </div>`
      )}
              `
    )}
          </aside>

          <div class="stage">
            ${this._doc ? h`<homeview-canvas
                  .hass=${this.hass}
                  .view=${t}
                  .selected=${this._selected}
                  @homeview-drop=${this._onDrop}
                  @homeview-select=${this._onSelect}
                  @homeview-section-remove=${this._onSectionRemove}
                ></homeview-canvas>` : h`<p class="empty-state">
                  Choisissez un dashboard dans la liste, ou créez-en un.
                </p>`}
          </div>

          <aside class="inspector">
            ${e ? h`<homeview-inspector
                  .hass=${this.hass}
                  .card=${e}
                  .position=${this._selected}
                  @homeview-card-change=${this._onCardChange}
                  @homeview-grid-change=${this._onGridChange}
                  @homeview-card-remove=${this._onCardRemove}
                ></homeview-inspector>` : h`<p class="hint">Sélectionnez une carte pour l'éditer.</p>`}
          </aside>
        </main>
      </div>
    `;
  }
  get _groupedPalette() {
    const t = this._filter.trim().toLowerCase(), e = t ? this._palette.filter((i) => i.label.toLowerCase().includes(t)) : this._palette;
    return ["bubble", "native", "community"].map(
      (i) => [i, e.filter((o) => o.category === i)]
    ).filter(([, i]) => i.length > 0);
  }
  async _boot() {
    this._booted = !0, this._loadModules(), await this._refreshDashboards(), this._status = "Choisissez un dashboard, ou créez-en un.";
  }
  /**
   * Lovelace resources are loaded lazily, per dashboard. A panel is not a
   * dashboard, so `window.customCards` is empty until something imports those
   * modules: the builder must import them itself to know which cards exist.
   * Each module registers its own entry as it evaluates.
   */
  async _loadModules() {
    const t = this.hass;
    if (!t) return;
    let e;
    try {
      e = await $e(t);
    } catch {
      e = void 0;
    }
    e && (this._bubbleResource = e.some(
      (i) => i.type === "module" && /bubble/i.test(i.url)
    ));
    const r = (e ?? []).filter(
      (i) => i.type === "module" && i.url
    );
    for (const i of r)
      if (!this._imported.has(i.url)) {
        this._imported.add(i.url);
        try {
          await import(
            /* @vite-ignore */
            i.url
          );
        } catch (o) {
          this._importErrors.push(`${i.url} — ${D(o)}`);
        }
        this._loadPalette(0);
      }
    this._loadPalette(0);
  }
  _reloadPalette() {
    this._importErrors = [], this._loadModules();
  }
  get _bubbleHint() {
    return this._bubbleResource === !1 ? "Bubble Card n'est pas enregistré comme ressource Lovelace. Installez-le via HACS/Marketplace en catégorie « Tableau de bord », puis cliquez sur ↻ palette." : this._bubbleResource === !0 ? `La ressource Bubble Card est enregistrée mais son module ne s'est pas chargé${this._importErrors.length ? ` (${this._importErrors[0]})` : ""}. Rechargez la page, ou vérifiez la console du navigateur.` : "Bubble Card n'est pas détecté. Les cartes natives restent disponibles.";
  }
  /**
   * `window.customCards` is filled by each card's module as it loads, and there is
   * no event for it: poll briefly so a slow module still lands in the palette.
   */
  _loadPalette(t) {
    this._palette = ke(window.customCards ?? []), !this._palette.some((e) => e.category === "bubble") && (t >= 6 || (this._paletteTimer = window.setTimeout(() => this._loadPalette(t + 1), 500)));
  }
  async _refreshDashboards() {
    if (this.hass)
      try {
        this._dashboards = await ft(this.hass);
      } catch (t) {
        this._error = `Liste des dashboards indisponible : ${D(t)}`;
      }
  }
  async _loadDashboard(t) {
    const e = this.hass;
    if (e) {
      this._busy = !0, this._urlPath = t, this._mode = "existing", this._error = "", this._status = "";
      try {
        const r = await xe(e, t);
        if (ie(r)) {
          this._doc = void 0, this._selected = void 0, this._error = `« ${t} » est généré par une stratégie. Prenez le contrôle depuis le dashboard (menu ⋮ → Take control) avant de l'éditer ici.`;
          return;
        }
        this._doc = ut(r, "Homeview"), this._selected = void 0, this._dirty = !1, this._status = this._doc.createdView ? "Aucune vue « sections » : une vue sera ajoutée à l'enregistrement." : "Chargé";
      } catch (r) {
        this._doc = void 0, this._error = t === M.url_path ? "Le dashboard par défaut n'est pas en mode storage (YAML ou stratégie) : il n'est pas modifiable ici. Choisissez un autre dashboard, ou créez-en un." : `Chargement impossible : ${D(r)}`;
      } finally {
        this._busy = !1;
      }
    }
  }
  _addSection() {
    this._doc && (this._doc = ce(this._doc), this._dirty = !0);
  }
  _onDashboardChange(t) {
    const e = t.target.value;
    if (e !== "") {
      if (e === _t) {
        this._mode = "new", this._doc = ut({}, "Homeview"), this._selected = void 0, this._dirty = !0, this._error = "", this._status = "Nouveau dashboard : il sera créé à l'enregistrement.";
        return;
      }
      this._loadDashboard(e);
    }
  }
  _reload() {
    this._mode !== "new" && this._loadDashboard(this._urlPath);
  }
  async _save() {
    const t = this.hass;
    if (!(!t || !this._doc)) {
      this._busy = !0, this._error = "";
      try {
        let e = this._urlPath;
        if (this._mode === "new") {
          const r = this._newTitle.trim() || "Homeview";
          e = At(r), await Ae(t, { title: r, urlPath: e }), this._urlPath = e, this._mode = "existing", this._dashboards = await ft(t);
        }
        await we(t, e, he(this._doc)), this._dirty = !1, this._status = `Enregistré dans « ${e} »`;
      } catch (e) {
        this._error = `Échec de l'enregistrement : ${D(e)}`;
      } finally {
        this._busy = !1;
      }
    }
  }
  _insertFromPalette(t) {
    if (!this._doc) return;
    const e = E(W(this._doc)), r = Math.max(0, e.length - 1), i = L(e[r]).length;
    this._doc = V(this._doc, { section: r, index: i }, t.create()), this._selected = { section: r, index: i }, this._dirty = !0;
  }
  _onDrop(t) {
    const { payload: e, to: r } = t.detail;
    if (this._doc) {
      if (e.kind === "palette") {
        const i = this._palette.find((o) => o.key === e.key);
        if (!i) return;
        this._doc = V(this._doc, r, i.create());
      } else
        this._doc = oe(this._doc, e.from, r);
      this._selected = { section: r.section, index: r.index }, this._dirty = !0;
    }
  }
  _onSelect(t) {
    this._selected = t.detail;
  }
  _onSectionRemove(t) {
    const { section: e } = t.detail;
    this._doc && (this._doc = de(this._doc, e), this._selected = void 0, this._dirty = !0);
  }
  _onCardChange(t) {
    const { position: e, patch: r } = t.detail;
    !this._doc || !e || (this._doc = Ct(this._doc, e, (i) => ({ ...i, ...r })), this._dirty = !0);
  }
  _onGridChange(t) {
    const { position: e, grid: r } = t.detail;
    !this._doc || !e || (this._doc = le(this._doc, e, r), this._dirty = !0);
  }
  _onCardRemove(t) {
    const { position: e } = t.detail;
    !this._doc || !e || (this._doc = St(this._doc, e), this._selected = void 0, this._dirty = !0);
  }
}
customElements.define("homeview-builder", Pe);
