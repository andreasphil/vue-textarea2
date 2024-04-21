import { defineComponent as G, useCssVars as J, ref as C, computed as B, watchEffect as Q, watch as U, openBlock as N, createElementBlock as $, normalizeClass as g, createElementVNode as T, withKeys as L, withModifiers as y, Fragment as X, renderList as Y, renderSlot as Z, createTextVNode as _, toDisplayString as ee, nextTick as F } from "vue";
import { continueListRules as te, splitLines as ne, getSelectedLines as oe, joinLines as v, indent as le, getCursorInLine as ie, continueList as ae, deleteLine as D, duplicateLine as se, mergeList as re, getRangeFromSelectedLines as b, flip as ue } from "./text.js";
const de = ["readonly", "spellcheck", "value"], ce = /* @__PURE__ */ G({
  __name: "Textarea2",
  props: {
    allowFlipLines: { type: Boolean, default: !0 },
    contextProvider: { type: Function, default: (m) => ({}) },
    continueLists: { type: [Boolean, Array], default: () => Object.values(te) },
    cutFullLine: { type: Boolean, default: !0 },
    deleteLine: { type: Boolean, default: !0 },
    duplicateLine: { type: Boolean, default: !0 },
    insertTabs: { type: Boolean, default: !0 },
    mergeListsOnPaste: { type: Boolean, default: !0 },
    modelValue: {},
    readonly: { type: Boolean, default: !1 },
    scrollBeyondLastLine: { type: [Boolean, Number], default: !0 },
    spellcheck: { type: Boolean, default: !0 },
    tabSize: { default: 4 }
  },
  emits: ["update:modelValue"],
  setup(m, { expose: S, emit: w }) {
    J((e) => ({
      "5509c433": P.value,
      "307c2ae4": e.tabSize,
      bfdbe7f4: O.value
    }));
    const s = m, R = w, r = C(null);
    function f(e) {
      const t = Array.isArray(e) ? v(e) : e;
      R("update:modelValue", t);
    }
    function j(e) {
      e.target instanceof HTMLTextAreaElement && f(e.target.value);
    }
    const d = B(() => ne(s.modelValue)), M = B(
      () => d.value.map((e, t) => ({
        row: e,
        key: `${t}#${e}`,
        context: s.contextProvider(e)
      }))
    ), O = C("auto");
    async function E() {
      var e, t;
      O.value = "auto", await F(), O.value = (e = r.value) != null && e.scrollHeight ? `${(t = r.value) == null ? void 0 : t.scrollHeight}px` : "auto";
    }
    Q(() => {
      r.value && E();
    }), U(
      () => s.modelValue,
      () => {
        r.value && E();
      }
    );
    const P = B(() => s.scrollBeyondLastLine === !0 ? "18rem" : typeof s.scrollBeyondLastLine == "number" ? `${s.scrollBeyondLastLine}rem` : void 0);
    function H(e) {
      const t = [...d.value], n = e.shiftKey ? "outdent" : "indent";
      p(({ adjustSelection: i, selectedLines: o }) => {
        const [l, a] = o, u = t.slice(l, a + 1), c = le(u, n);
        u.every((W, q) => W === c[q]) || (t.splice(l, a - l + 1, ...c), f(v(t)), i(l === a ? { to: "relative", delta: n === "indent" ? 1 : -1 } : { to: "lines", start: l, end: a }));
      });
    }
    function I() {
      const e = [...d.value], t = s.continueLists ? s.continueLists : [];
      p(({ selectionStart: n, selectedLines: i, adjustSelection: o }) => {
        const [l] = i, a = ie(s.modelValue, n), u = ae(e[l], t, a);
        e.splice(l, 1, u.current), u.next !== null && e.splice(l + 1, 0, u.next), f(v(e)), "didContinue" in u && u.didContinue ? o({ to: "relative", delta: u.match.length + 1 }) : "didEnd" in u && u.didEnd ? o({ to: "startOfLine", startOf: l }) : o({ to: "relative", delta: 1 });
      });
    }
    function k(e) {
      const t = [...d.value];
      p(({ selectedLines: n, adjustSelection: i }) => {
        const [o, l] = n, a = e === "up" ? o - 1 : o + 1;
        if (o !== l || a < 0 || a >= t.length)
          return;
        const [u, c] = ue(t[o], t[a]);
        t[o] = u, t[a] = c, f(v(t)), i({ to: "endOfLine", endOf: a });
      });
    }
    function A(e) {
      p(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd)
          return;
        e.preventDefault(), await navigator.clipboard.writeText(d.value[n]);
        const o = D(d.value, n);
        f(v(o));
        const l = Math.min(n, o.length - 1);
        t.adjustSelection({ to: "endOfLine", endOf: l });
      });
    }
    function x(e) {
      p(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd)
          return;
        e.preventDefault();
        const o = se(d.value, n);
        f(v(o)), t.adjustSelection({ to: "endOfLine", endOf: n + 1 });
      });
    }
    function z(e) {
      p(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd)
          return;
        e.preventDefault();
        const o = D(d.value, n);
        f(v(o));
        const l = Math.min(n, o.length - 1);
        t.adjustSelection({ to: "endOfLine", endOf: l });
      });
    }
    function K(e) {
      var i;
      const t = (i = e.clipboardData) == null ? void 0 : i.getData("text/plain"), n = [...d.value];
      p(({ selectedLines: o, adjustSelection: l }) => {
        if (!t || !s.continueLists)
          return;
        const [a, u] = o;
        if (a !== u)
          return;
        const c = re(n[a], t, s.continueLists);
        c !== null && (e.preventDefault(), n[a] = c.current, f(v(n)), l({
          to: "relative",
          delta: c.current.length - c.match.length,
          collapse: !0
        }));
      });
    }
    async function V(e, t = !0) {
      if (!r.value)
        return;
      const { selectionStart: n, selectionEnd: i } = r.value;
      if (t && await F(), e.to === "absolute")
        r.value.setSelectionRange(e.start, e.end ?? e.start);
      else if (e.to === "relative") {
        const o = n + e.delta, l = e.collapse ? o : i + e.delta;
        r.value.setSelectionRange(o, l);
      } else if (e.to === "startOfLine") {
        const [o] = b(d.value, e.startOf);
        r.value.setSelectionRange(o, o);
      } else if (e.to === "endOfLine") {
        const [, o] = b(d.value, e.endOf);
        r.value.setSelectionRange(o, o);
      } else if (e.to === "lines") {
        const [o, l] = b(
          d.value,
          e.start,
          e.end
        );
        r.value.setSelectionRange(o, l);
      }
    }
    function h(e) {
      var t;
      (t = r.value) == null || t.focus(), e && V(e);
    }
    async function p(e, t = { ignoreReadonly: !1 }) {
      if (!r.value || s.readonly && !t.ignoreReadonly)
        return;
      const { selectionStart: n, selectionEnd: i } = r.value;
      await e({
        adjustSelection: V,
        focus: h,
        selectedLines: oe(
          d.value,
          n,
          i
        ),
        selectionEnd: i,
        selectionStart: n
      });
    }
    return S({ withContext: p }), (e, t) => (N(), $("div", {
      class: g({ [e.$style.wrapper]: !0, [e.$style.wrapperReadonly]: e.readonly }),
      onClick: t[8] || (t[8] = (n) => h())
    }, [
      T("textarea", {
        class: g(e.$style.textarea),
        readonly: e.readonly,
        spellcheck: e.spellcheck,
        value: s.modelValue,
        onInput: j,
        onKeydown: [
          t[0] || (t[0] = L(y((n) => e.allowFlipLines ? k("down") : void 0, ["alt", "prevent"]), ["down"])),
          t[1] || (t[1] = L(y((n) => e.allowFlipLines ? k("up") : void 0, ["alt", "prevent"]), ["up"])),
          t[2] || (t[2] = L(y((n) => I(), ["prevent"]), ["enter"])),
          t[3] || (t[3] = L(y((n) => e.duplicateLine ? x(n) : void 0, ["meta", "shift"]), ["d"])),
          t[4] || (t[4] = L(y((n) => e.deleteLine ? z(n) : void 0, ["meta", "shift"]), ["k"])),
          t[5] || (t[5] = L(y((n) => e.cutFullLine ? A(n) : void 0, ["meta"]), ["x"])),
          t[6] || (t[6] = L(y((n) => e.insertTabs ? H(n) : void 0, ["prevent"]), ["tab"]))
        ],
        onPaste: t[7] || (t[7] = (n) => e.mergeListsOnPaste ? K(n) : void 0),
        ref_key: "textareaEl",
        ref: r
      }, null, 42, de),
      T("div", {
        class: g(e.$style.output),
        "data-testid": "output"
      }, [
        (N(!0), $(X, null, Y(M.value, ({ row: n, key: i, context: o }, l) => (N(), $("div", {
          class: g(e.$style.row),
          key: i
        }, [
          Z(e.$slots, "row", {
            row: n,
            context: o,
            index: l
          }, () => [
            _(ee(n), 1)
          ])
        ], 2))), 128))
      ], 2)
    ], 2));
  }
}), fe = "_wrapper_11m78_6", pe = "_wrapperReadonly_11m78_17", ve = "_textarea_11m78_25", Le = "_output_11m78_31", ye = "_row_11m78_65", me = {
  wrapper: fe,
  wrapperReadonly: pe,
  textarea: ve,
  output: Le,
  row: ye
}, we = (m, S) => {
  const w = m.__vccOpts || m;
  for (const [s, R] of S)
    w[s] = R;
  return w;
}, ge = {
  $style: me
}, Oe = /* @__PURE__ */ we(ce, [["__cssModules", ge]]);
export {
  Oe as default
};
