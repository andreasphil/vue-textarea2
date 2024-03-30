import { defineComponent as K, useCssVars as _, ref as E, computed as b, watchEffect as W, watch as q, openBlock as B, createElementBlock as O, normalizeClass as g, createElementVNode as N, withKeys as m, withModifiers as L, Fragment as G, renderList as J, renderSlot as Q, createTextVNode as U, toDisplayString as X, nextTick as T } from "vue";
import { continueListRules as Y, splitLines as Z, getSelectedLines as ee, joinLines as v, indent as te, getCursorInLine as ne, continueList as oe, mergeList as le, getRangeFromSelectedLines as x, flip as ae } from "./text.js";
const se = ["readonly", "spellcheck", "value"], re = /* @__PURE__ */ K({
  __name: "Textarea2",
  props: {
    allowFlipLines: { type: Boolean, default: !0 },
    contextProvider: { type: Function, default: (y) => ({}) },
    continueLists: { type: [Boolean, Array], default: () => Object.values(Y) },
    cutFullLine: { type: Boolean, default: !0 },
    insertTabs: { type: Boolean, default: !0 },
    mergeListsOnPaste: { type: Boolean, default: !0 },
    modelValue: {},
    readonly: { type: Boolean, default: !1 },
    scrollBeyondLastLine: { type: [Boolean, Number], default: !0 },
    spellcheck: { type: Boolean, default: !0 },
    tabSize: { default: 4 }
  },
  emits: ["update:modelValue"],
  setup(y, { expose: R, emit: w }) {
    _((e) => ({
      "65eb1598": P.value,
      "33d1db9f": e.tabSize,
      "0436cfaa": $.value
    }));
    const r = y, S = w, i = E(null);
    function f(e) {
      const t = Array.isArray(e) ? v(e) : e;
      S("update:modelValue", t);
    }
    function F(e) {
      e.target instanceof HTMLTextAreaElement && f(e.target.value);
    }
    const d = b(() => Z(r.modelValue)), M = b(
      () => d.value.map((e, t) => ({
        row: e,
        key: `${t}#${e}`,
        context: r.contextProvider(e)
      }))
    ), $ = E("auto");
    async function V() {
      var e, t;
      $.value = "auto", await T(), $.value = (e = i.value) != null && e.scrollHeight ? `${(t = i.value) == null ? void 0 : t.scrollHeight}px` : "auto";
    }
    W(() => {
      i.value && V();
    }), q(
      () => r.modelValue,
      () => {
        i.value && V();
      }
    );
    const P = b(() => r.scrollBeyondLastLine === !0 ? "18rem" : typeof r.scrollBeyondLastLine == "number" ? `${r.scrollBeyondLastLine}rem` : void 0);
    function j(e) {
      const t = [...d.value], o = e.shiftKey ? "outdent" : "indent";
      p(({ adjustSelection: a, selectedLines: n }) => {
        const [l, s] = n, u = t.slice(l, s + 1), c = te(u, o);
        u.every((A, z) => A === c[z]) || (t.splice(l, s - l + 1, ...c), f(v(t)), a(l === s ? { to: "relative", delta: o === "indent" ? 1 : -1 } : { to: "lines", start: l, end: s }));
      });
    }
    function D() {
      const e = [...d.value], t = r.continueLists ? r.continueLists : [];
      p(({ selectionStart: o, selectedLines: a, adjustSelection: n }) => {
        const [l] = a, s = ne(r.modelValue, o), u = oe(e[l], t, s);
        e.splice(l, 1, u.current), u.next !== null && e.splice(l + 1, 0, u.next), f(v(e)), "didContinue" in u && u.didContinue ? n({ to: "relative", delta: u.match.length + 1 }) : "didEnd" in u && u.didEnd ? n({ to: "startOfLine", startOf: l }) : n({ to: "relative", delta: 1 });
      });
    }
    function h(e) {
      const t = [...d.value];
      p(({ selectedLines: o, adjustSelection: a }) => {
        const [n, l] = o, s = e === "up" ? n - 1 : n + 1;
        if (n !== l || s < 0 || s >= t.length)
          return;
        const [u, c] = ae(t[n], t[s]);
        t[n] = u, t[s] = c, f(v(t)), a({ to: "endOfLine", endOf: s });
      });
    }
    function H(e) {
      const t = [...d.value];
      p(async ({ selectedLines: o, adjustSelection: a }) => {
        const [n, l] = o;
        if (n !== l)
          return;
        e.preventDefault(), await navigator.clipboard.writeText(t[n]), t.splice(n, 1), f(v(t));
        const s = Math.min(n, t.length - 1);
        a({ to: "startOfLine", startOf: s });
      });
    }
    function I(e) {
      var a;
      const t = (a = e.clipboardData) == null ? void 0 : a.getData("text/plain"), o = [...d.value];
      p(({ selectedLines: n, adjustSelection: l }) => {
        if (!t || !r.continueLists)
          return;
        const [s, u] = n;
        if (s !== u)
          return;
        const c = le(o[s], t, r.continueLists);
        c !== null && (e.preventDefault(), o[s] = c.current, f(v(o)), l({
          to: "relative",
          delta: c.current.length - c.match.length,
          collapse: !0
        }));
      });
    }
    async function k(e, t = !0) {
      if (!i.value)
        return;
      const { selectionStart: o, selectionEnd: a } = i.value;
      if (t && await T(), e.to === "absolute")
        i.value.setSelectionRange(e.start, e.end ?? e.start);
      else if (e.to === "relative") {
        const n = o + e.delta, l = e.collapse ? n : a + e.delta;
        i.value.setSelectionRange(n, l);
      } else if (e.to === "startOfLine") {
        const [n] = x(d.value, e.startOf);
        i.value.setSelectionRange(n, n);
      } else if (e.to === "endOfLine") {
        const [, n] = x(d.value, e.endOf);
        i.value.setSelectionRange(n, n);
      } else if (e.to === "lines") {
        const [n, l] = x(
          d.value,
          e.start,
          e.end
        );
        i.value.setSelectionRange(n, l);
      }
    }
    function C(e) {
      var t;
      (t = i.value) == null || t.focus(), e && k(e);
    }
    async function p(e, t = { ignoreReadonly: !1 }) {
      if (!i.value || r.readonly && !t.ignoreReadonly)
        return;
      const { selectionStart: o, selectionEnd: a } = i.value;
      await e({
        adjustSelection: k,
        focus: C,
        selectedLines: ee(
          d.value,
          o,
          a
        ),
        selectionEnd: a,
        selectionStart: o
      });
    }
    return R({ withContext: p }), (e, t) => (B(), O("div", {
      class: g({ [e.$style.wrapper]: !0, [e.$style.wrapperReadonly]: e.readonly }),
      onClick: t[6] || (t[6] = (o) => C())
    }, [
      N("textarea", {
        class: g(e.$style.textarea),
        readonly: e.readonly,
        spellcheck: e.spellcheck,
        value: r.modelValue,
        onInput: F,
        onKeydown: [
          t[0] || (t[0] = m(L((o) => e.allowFlipLines ? h("down") : void 0, ["alt", "prevent"]), ["down"])),
          t[1] || (t[1] = m(L((o) => e.allowFlipLines ? h("up") : void 0, ["alt", "prevent"]), ["up"])),
          t[2] || (t[2] = m(L((o) => e.continueLists ? D() : void 0, ["prevent"]), ["enter"])),
          t[3] || (t[3] = m(L((o) => e.cutFullLine ? H(o) : void 0, ["meta"]), ["x"])),
          t[4] || (t[4] = m(L((o) => e.insertTabs ? j(o) : void 0, ["prevent"]), ["tab"]))
        ],
        onPaste: t[5] || (t[5] = (o) => e.mergeListsOnPaste ? I(o) : void 0),
        ref_key: "textareaEl",
        ref: i
      }, null, 42, se),
      N("div", {
        class: g(e.$style.output)
      }, [
        (B(!0), O(G, null, J(M.value, ({ row: o, key: a, context: n }, l) => (B(), O("div", {
          class: g(e.$style.row),
          key: a
        }, [
          Q(e.$slots, "row", {
            row: o,
            context: n,
            index: l
          }, () => [
            U(X(o), 1)
          ])
        ], 2))), 128))
      ], 2)
    ], 2));
  }
}), ie = "_wrapper_11m78_6", ue = "_wrapperReadonly_11m78_17", de = "_textarea_11m78_25", ce = "_output_11m78_31", fe = "_row_11m78_65", pe = {
  wrapper: ie,
  wrapperReadonly: ue,
  textarea: de,
  output: ce,
  row: fe
}, ve = (y, R) => {
  const w = y.__vccOpts || y;
  for (const [r, S] of R)
    w[r] = S;
  return w;
}, ye = {
  $style: pe
}, we = /* @__PURE__ */ ve(re, [["__cssModules", ye]]);
export {
  we as default
};
