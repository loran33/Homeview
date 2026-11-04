const D = globalThis, F = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = /* @__PURE__ */ Symbol(), et = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (r) => new mt(typeof r == "string" ? r : r + "", void 0, G), Y = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new mt(e, r, G);
}, Ht = (r, t) => {
  if (F) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, st = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Dt(e);
})(r) : r;
const { is: Mt, defineProperty: Rt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Bt, getOwnPropertySymbols: Lt, getPrototypeOf: jt } = Object, M = globalThis, rt = M.trustedTypes, It = rt ? rt.emptyScript : "", Wt = M.reactiveElementPolyfillSupport, C = (r, t) => r, j = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? It : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, bt = (r, t) => !Mt(r, t), it = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), M.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Rt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = Ut(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
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
      const e = this.properties, s = [...Bt(e), ...Lt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(st(i));
    } else t !== void 0 && e.push(st(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ht(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : j).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = s.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : j;
      this._$Em = i;
      const l = n.fromAttribute(e, o.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? bt)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: n } = o, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[C("elementProperties")] = /* @__PURE__ */ new Map(), x[C("finalized")] = /* @__PURE__ */ new Map(), Wt?.({ ReactiveElement: x }), (M.reactiveElementVersions ??= []).push("2.1.2");
const J = globalThis, ot = (r) => r, H = J.trustedTypes, nt = H ? H.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, gt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + m, Vt = `<${vt}>`, y = document, T = () => y.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", K = Array.isArray, qt = (r) => K(r) || typeof r?.[Symbol.iterator] == "function", B = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, at = /-->/g, ct = />/g, g = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, dt = /"/g, $t = /^(?:script|style|textarea|title)$/i, Ft = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), h = Ft(1), w = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), v = y.createTreeWalker(y, 129);
function yt(r, t) {
  if (!K(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Gt = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let u, p, d = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === S ? p[1] === "!--" ? n = at : p[1] !== void 0 ? n = ct : p[2] !== void 0 ? ($t.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = g) : p[3] !== void 0 && (n = g) : n === g ? p[0] === ">" ? (n = i ?? S, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? g : p[3] === '"' ? dt : lt) : n === dt || n === lt ? n = g : n === at || n === ct ? n = S : (n = g, i = void 0);
    const _ = n === g && r[l + 1].startsWith("/>") ? " " : "";
    o += n === S ? a + Vt : d >= 0 ? (s.push(u), a.slice(0, d) + gt + a.slice(d) + m + _) : a + m + (d === -2 ? l : _);
  }
  return [yt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class P {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [u, p] = Gt(t, e);
    if (this.el = P.createElement(u, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = v.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(gt)) {
          const f = p[n++], _ = i.getAttribute(d).split(m), b = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: b[2], strings: _, ctor: b[1] === "." ? Jt : b[1] === "?" ? Kt : b[1] === "@" ? Xt : R }), i.removeAttribute(d);
        } else d.startsWith(m) && (a.push({ type: 6, index: o }), i.removeAttribute(d));
        if ($t.test(i.tagName)) {
          const d = i.textContent.split(m), f = d.length - 1;
          if (f > 0) {
            i.textContent = H ? H.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(d[_], T()), v.nextNode(), a.push({ type: 2, index: ++o });
            i.append(d[f], T());
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
    const s = y.createElement("template");
    return s.innerHTML = t, s;
  }
}
function A(r, t, e = r, s) {
  if (t === w) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = k(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = A(r, i._$AS(r, t.values), i, s)), t;
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? y).importNode(e, !0);
    v.currentNode = i;
    let o = v.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new N(o, o.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (u = new Zt(o, this, t)), this._$AV.push(u), a = s[++l];
      }
      n !== a?.index && (o = v.nextNode(), n++);
    }
    return v.currentNode = y, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = A(this, t, e), k(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = P.createElement(yt(s.h, s.h[0]), this.options)), s);
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
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new N(this.O(T()), this.O(T()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = ot(t).nextSibling;
      ot(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = A(this, t, e, 0), n = !k(t) || t !== this._$AH && t !== w, n && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = o[0], a = 0; a < o.length - 1; a++) u = A(this, l[s + a], e, a), u === w && (u = this._$AH[a]), n ||= !k(u) || u !== this._$AH[a], u === c ? t = c : t !== c && (t += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Kt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Xt extends R {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? c) === w) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Qt = J.litHtmlPolyfillSupport;
Qt?.(P, N), (J.litHtmlVersions ??= []).push("3.3.3");
const te = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = i = new N(t.insertBefore(T(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
const X = globalThis;
class $ extends x {
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
$._$litElement$ = !0, $.finalized = !0, X.litElementHydrateSupport?.({ LitElement: $ });
const ee = X.litElementPolyfillSupport;
ee?.({ LitElement: $ });
(X.litElementVersions ??= []).push("4.2.2");
const Z = 12, se = 1;
function xt(r) {
  return typeof structuredClone == "function" ? structuredClone(r) : JSON.parse(JSON.stringify(r));
}
function wt(r, t, e) {
  return Math.min(e, Math.max(t, Math.round(r)));
}
function z(r) {
  return r && Array.isArray(r.views) ? r.views : [];
}
function E(r) {
  return r && Array.isArray(r.sections) ? r.sections : [];
}
function U(r) {
  return r && Array.isArray(r.cards) ? r.cards : [];
}
function re(r) {
  return z(r).findIndex(
    (t) => t.type === "sections" && Array.isArray(t.sections)
  );
}
function ie(r) {
  return r ? r.strategy && typeof r.strategy == "object" ? !0 : z(r).some(
    (t) => t.strategy && typeof t.strategy == "object"
  ) : !1;
}
function At(r) {
  const t = r.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return t.includes("-") ? t : `${t || "view"}-view`;
}
function ut(r, t = "Homeview") {
  const e = r && typeof r == "object" ? xt(r) : {}, s = re(e);
  if (s >= 0)
    return { config: e, viewIndex: s, createdView: !1 };
  const i = {
    type: "sections",
    title: t,
    path: At(t),
    sections: [{ type: "grid", cards: [] }]
  }, o = z(e);
  return {
    config: { ...e, views: [...o, i] },
    viewIndex: o.length,
    createdView: !0
  };
}
function I(r) {
  return z(r.config)[r.viewIndex];
}
function Q(r, t) {
  const e = z(r.config).map(
    (s, i) => i === r.viewIndex ? t(s) : s
  );
  return { ...r, config: { ...r.config, views: e } };
}
function tt(r, t, e) {
  return Q(r, (s) => {
    const i = E(s), o = i[t];
    if (!o) return s;
    const n = e(U(o));
    return {
      ...s,
      sections: i.map(
        (l, a) => a === t ? { ...l, cards: n } : l
      )
    };
  });
}
function Et(r, t) {
  return U(E(I(r))[t.section])[t.index];
}
function W(r, t, e) {
  return tt(r, t.section, (s) => {
    const i = wt(t.index, 0, s.length);
    return [...s.slice(0, i), e, ...s.slice(i)];
  });
}
function St(r, t) {
  return tt(
    r,
    t.section,
    (e) => e.filter((s, i) => i !== t.index)
  );
}
function oe(r, t, e) {
  const s = Et(r, t);
  if (!s) return r;
  const i = t.section === e.section;
  if (i && t.index === e.index) return r;
  const o = St(r, t), n = i && e.index > t.index ? e.index - 1 : e.index;
  return W(o, { section: e.section, index: n }, s);
}
function Ct(r, t, e) {
  return tt(
    r,
    t.section,
    (s) => s.map((i, o) => o === t.index ? e(i) : i)
  );
}
function ne(r) {
  if (r === "full") return "full";
  const t = typeof r == "number" ? r : Number(r);
  if (Number.isFinite(t))
    return wt(t, se, Z);
}
function ae(r) {
  if (r === "auto") return "auto";
  const t = typeof r == "number" ? r : Number(r);
  if (!(!Number.isFinite(t) || t < 1))
    return Math.round(t);
}
function ce(r, t, e) {
  const s = e.columns === void 0 ? void 0 : ne(e.columns), i = e.rows === void 0 ? void 0 : ae(e.rows);
  return Ct(r, t, (o) => {
    const n = { ...o.grid_options ?? {} };
    return s !== void 0 && (n.columns = s), i !== void 0 && (n.rows = i), { ...o, grid_options: n };
  });
}
function Tt(r) {
  return r.grid_options?.columns ?? Z;
}
function kt(r) {
  return r.grid_options?.rows ?? "auto";
}
function le(r) {
  return Q(r, (t) => ({
    ...t,
    sections: [...E(t), { type: "grid", cards: [] }]
  }));
}
function de(r, t) {
  return Q(r, (e) => {
    const s = E(e);
    return s.length <= 1 ? e : {
      ...e,
      sections: s.filter((i, o) => o !== t)
    };
  });
}
function he(r) {
  return xt(r.config);
}
function ue(r) {
  for (const t of ["name", "heading", "title", "entity", "content"]) {
    const e = r[t];
    if (typeof e == "string" && e.trim() !== "") return e.trim();
  }
  return r.type.replace(/^custom:/, "");
}
const Pt = "application/x-homeview";
let O = null;
function Ot(r, t) {
  O = t, r.dataTransfer?.setData(Pt, JSON.stringify(t)), r.dataTransfer?.setData("text/plain", t.kind), r.dataTransfer && (r.dataTransfer.effectAllowed = "move");
}
function pe() {
  return O;
}
function V() {
  O = null;
}
function fe(r) {
  const t = r.dataTransfer?.getData(Pt);
  if (!t) return O;
  try {
    return JSON.parse(t);
  } catch {
    return O;
  }
}
function pt(r, t, e) {
  for (let s = 0; s < r.length; s += 1) {
    const i = r[s];
    if (e < i.top) return s;
    if (!(e > i.bottom) && t < i.left + (i.right - i.left) / 2)
      return s;
  }
  return r.length;
}
class _e extends $ {
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
        ${t.map((e, s) => {
      const i = U(e);
      return h`
            <section class="section">
              <div class="section-header">
                <span>Section ${s + 1} · ${i.length} carte${i.length === 1 ? "" : "s"}</span>
                ${t.length > 1 ? h`<button
                      title="Supprimer la section"
                      @click=${() => this.dispatchEvent(
        new CustomEvent("homeview-section-remove", {
          detail: { section: s },
          bubbles: !0,
          composed: !0
        })
      )}
                    >×</button>` : c}
              </div>
              <div
                class="grid"
                @dragover=${(o) => this._onDragOver(o, s)}
                @dragleave=${(o) => this._onDragLeave(o)}
                @drop=${(o) => this._onDrop(o, s)}
              >
                ${i.map(
        (o, n) => this._renderCard(o, s, n, i.length)
      )}
                ${i.length === 0 ? h`<p class="empty ${this._drop?.section === s ? "active" : ""}">
                      Glissez une carte depuis la palette, ou cliquez-en une
                    </p>` : c}
              </div>
            </section>
          `;
    })}
      </div>
    ` : c;
  }
  _renderCard(t, e, s, i) {
    const o = ["card"];
    this.selected?.section === e && this.selected.index === s && o.push("selected"), this._drop?.section === e && (this._drop.index === s && o.push("drop-before"), this._drop.index >= i && s === i - 1 && o.push("drop-after"));
    const n = Tt(t), l = kt(t), a = [
      `grid-column: span ${n === "full" ? Z : n};`,
      l === "auto" ? "" : `grid-row: span ${l};`
    ].join(" "), u = typeof t.entity == "string" ? t.entity : void 0, p = u ? this.hass?.states[u] : void 0, d = typeof t.icon == "string" ? t.icon : p?.attributes.icon, f = typeof t.card_type == "string" ? `${t.type} · ${t.card_type}` : t.type, _ = ue(t), b = p ? `${f} — ${p.state}` : _ === f ? "" : f;
    return h`
      <div
        class=${o.join(" ")}
        style=${a}
        draggable="true"
        @dragstart=${(zt) => Ot(zt, { kind: "card", from: { section: e, index: s } })}
        @dragend=${V}
        @click=${() => this.dispatchEvent(
      new CustomEvent("homeview-select", {
        detail: { section: e, index: s },
        bubbles: !0,
        composed: !0
      })
    )}
      >
        <ha-icon .icon=${d ?? "mdi:card-outline"}></ha-icon>
        <span class="text">
          <span class="name">${_}</span>
          ${b ? h`<span class="meta">${b}</span>` : c}
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
    const s = pt(
      this._rects(t.currentTarget),
      t.clientX,
      t.clientY
    );
    this._drop?.section === e && this._drop.index === s || (this._drop = { section: e, index: s });
  }
  _onDragLeave(t) {
    const e = t.currentTarget, s = t.relatedTarget;
    s && e.contains(s) || (this._drop = null);
  }
  _onDrop(t, e) {
    t.preventDefault();
    const s = fe(t), i = {
      section: e,
      index: pt(
        this._rects(t.currentTarget),
        t.clientX,
        t.clientY
      )
    };
    this._drop = null, V(), s && this.dispatchEvent(
      new CustomEvent("homeview-drop", {
        detail: { payload: s, to: i },
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
class $e extends $ {
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
    if (!t) return c;
    const e = t.type, s = Tt(t), i = kt(t);
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
          ` : c}

      ${ve[e] ? h`
            <label for="name">Nom affiché</label>
            <input
              id="name"
              .value=${typeof t.name == "string" ? t.name : ""}
              @change=${(o) => this._patch({ name: o.target.value })}
            />
          ` : c}

      ${e === "heading" ? h`
            <label for="heading">Titre</label>
            <input
              id="heading"
              .value=${typeof t.heading == "string" ? t.heading : ""}
              @change=${(o) => this._patch({ heading: o.target.value })}
            />
          ` : c}

      ${e === "markdown" ? h`
            <label for="content">Contenu (Jinja autorisé)</label>
            <textarea
              id="content"
              .value=${typeof t.content == "string" ? t.content : ""}
              @change=${(o) => this._patch({ content: o.target.value })}
            ></textarea>
          ` : c}

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
      (o) => h`<option value=${String(o)} ?selected=${o === s}>
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
customElements.define("homeview-inspector", $e);
const q = {
  id: "lovelace",
  url_path: "lovelace",
  title: "Overview",
  icon: "mdi:home",
  mode: "storage",
  show_in_sidebar: !0
};
async function ft(r) {
  const e = (await r.callWS({
    type: "lovelace/dashboards/list"
  })).filter(
    (s) => s.mode === "storage" && s.url_path !== q.url_path
  );
  return [q, ...e];
}
async function ye(r, t) {
  return await r.callWS({
    type: "lovelace/config",
    url_path: t
  }) ?? {};
}
async function xe(r, t, e) {
  await r.callWS({ type: "lovelace/config/save", url_path: t, config: e });
}
async function we(r, t) {
  await r.callWS({
    type: "lovelace/dashboards/create",
    url_path: t.urlPath,
    title: t.title,
    icon: t.icon ?? "mdi:view-dashboard-edit-outline",
    mode: "storage",
    show_in_sidebar: !0,
    require_admin: !0
  });
}
function L(r) {
  return r instanceof Error ? r.message : typeof r == "string" ? r : "Erreur inconnue";
}
const Ae = [
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
], Ee = [
  { type: "tile", label: "Tuile", columns: 6, rows: 1 },
  { type: "heading", label: "Titre de section", columns: 12, rows: 1 },
  { type: "button", label: "Bouton", columns: 3, rows: 1 },
  { type: "markdown", label: "Markdown", columns: 12, rows: 2 },
  { type: "history-graph", label: "Graphique d'historique", columns: 12, rows: 3 }
];
function Nt(r) {
  return r.startsWith("custom:") ? r : `custom:${r}`;
}
function Se(r) {
  return r.some((t) => Nt(t.type) === "custom:bubble-card");
}
function Ce(r) {
  const t = [];
  if (Se(r))
    for (const e of Ae)
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
  for (const e of Ee)
    t.push({
      key: `native:${e.type}`,
      category: "native",
      label: e.label,
      create: () => ({
        type: e.type,
        grid_options: { columns: e.columns, rows: e.rows }
      })
    });
  for (const e of r) {
    const s = Nt(e.type);
    s !== "custom:bubble-card" && t.push({
      key: `community:${s}`,
      category: "community",
      label: e.name ?? s,
      create: () => ({ type: s })
    });
  }
  return t;
}
const Te = {
  bubble: "Bubble Card",
  native: "Natif Home Assistant",
  community: "Autres cartes"
}, _t = "__new__";
class ke extends $ {
  static properties = {
    hass: { attribute: !1 },
    _dashboards: { state: !0 },
    _urlPath: { state: !0 },
    _mode: { state: !0 },
    _newTitle: { state: !0 },
    _doc: { state: !0 },
    _selected: { state: !0 },
    _palette: { state: !0 },
    _filter: { state: !0 },
    _dirty: { state: !0 },
    _busy: { state: !0 },
    _status: { state: !0 },
    _error: { state: !0 }
  };
  _booted = !1;
  _paletteTimer;
  constructor() {
    super(), this._dashboards = [], this._urlPath = "", this._mode = "existing", this._newTitle = "", this._doc = void 0, this._selected = void 0, this._palette = [], this._filter = "", this._dirty = !1, this._busy = !1, this._status = "", this._error = "";
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
    const t = this._doc ? I(this._doc) : void 0, e = this._doc && this._selected ? Et(this._doc, this._selected) : void 0, s = !this._palette.some((i) => i.category === "bubble");
    return h`
      <div class="shell">
        <header>
          <span class="brand">
            <ha-icon icon="mdi:view-dashboard-edit-outline"></ha-icon>
            Homeview
          </span>

          <select @change=${this._onDashboardChange}>
            ${this._mode === "existing" && this._urlPath === "" ? h`<option value="" ?selected=${!0}>— choisir un dashboard —</option>` : c}
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
              />` : c}

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

        ${this._error ? h`<div class="banner error">${this._error}</div>` : c}
        ${s ? h`<div class="banner warn">
              Bubble Card n'est pas détecté : installez-le pour obtenir sa palette. Les
              cartes natives restent disponibles.
            </div>` : c}

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
                    @dragstart=${(l) => Ot(l, { kind: "palette", key: n.key })}
                    @dragend=${V}
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
    this._booted = !0, this._loadPalette(0), await this._refreshDashboards(), this._status = "Choisissez un dashboard, ou créez-en un.";
  }
  /**
   * `window.customCards` is filled by each card's module as it loads, and there is
   * no event for it: poll briefly so a slow Bubble Card module still lands in the
   * palette without a reload.
   */
  _loadPalette(t) {
    this._palette = Ce(window.customCards ?? []), !this._palette.some((e) => e.category === "bubble") && (t >= 6 || (this._paletteTimer = window.setTimeout(() => this._loadPalette(t + 1), 500)));
  }
  async _refreshDashboards() {
    if (this.hass)
      try {
        this._dashboards = await ft(this.hass);
      } catch (t) {
        this._error = `Liste des dashboards indisponible : ${L(t)}`;
      }
  }
  async _loadDashboard(t) {
    const e = this.hass;
    if (e) {
      this._busy = !0, this._urlPath = t, this._mode = "existing", this._error = "", this._status = "";
      try {
        const s = await ye(e, t);
        if (ie(s)) {
          this._doc = void 0, this._selected = void 0, this._error = `« ${t} » est généré par une stratégie. Prenez le contrôle depuis le dashboard (menu ⋮ → Take control) avant de l'éditer ici.`;
          return;
        }
        this._doc = ut(s, "Homeview"), this._selected = void 0, this._dirty = !1, this._status = this._doc.createdView ? "Aucune vue « sections » : une vue sera ajoutée à l'enregistrement." : "Chargé";
      } catch (s) {
        this._doc = void 0, this._error = t === q.url_path ? "Le dashboard par défaut n'est pas en mode storage (YAML ou stratégie) : il n'est pas modifiable ici. Choisissez un autre dashboard, ou créez-en un." : `Chargement impossible : ${L(s)}`;
      } finally {
        this._busy = !1;
      }
    }
  }
  _addSection() {
    this._doc && (this._doc = le(this._doc), this._dirty = !0);
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
          const s = this._newTitle.trim() || "Homeview";
          e = At(s), await we(t, { title: s, urlPath: e }), this._urlPath = e, this._mode = "existing", this._dashboards = await ft(t);
        }
        await xe(t, e, he(this._doc)), this._dirty = !1, this._status = `Enregistré dans « ${e} »`;
      } catch (e) {
        this._error = `Échec de l'enregistrement : ${L(e)}`;
      } finally {
        this._busy = !1;
      }
    }
  }
  _insertFromPalette(t) {
    if (!this._doc) return;
    const e = E(I(this._doc)), s = Math.max(0, e.length - 1), i = U(e[s]).length;
    this._doc = W(this._doc, { section: s, index: i }, t.create()), this._selected = { section: s, index: i }, this._dirty = !0;
  }
  _onDrop(t) {
    const { payload: e, to: s } = t.detail;
    if (this._doc) {
      if (e.kind === "palette") {
        const i = this._palette.find((o) => o.key === e.key);
        if (!i) return;
        this._doc = W(this._doc, s, i.create());
      } else
        this._doc = oe(this._doc, e.from, s);
      this._selected = { section: s.section, index: s.index }, this._dirty = !0;
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
    const { position: e, patch: s } = t.detail;
    !this._doc || !e || (this._doc = Ct(this._doc, e, (i) => ({ ...i, ...s })), this._dirty = !0);
  }
  _onGridChange(t) {
    const { position: e, grid: s } = t.detail;
    !this._doc || !e || (this._doc = ce(this._doc, e, s), this._dirty = !0);
  }
  _onCardRemove(t) {
    const { position: e } = t.detail;
    !this._doc || !e || (this._doc = St(this._doc, e), this._selected = void 0, this._dirty = !0);
  }
}
customElements.define("homeview-builder", ke);
