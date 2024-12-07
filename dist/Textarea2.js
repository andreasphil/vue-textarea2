import { defineComponent as re, useCssVars as ue, ref as h, computed as $, watchEffect as K, watch as de, reactive as ce, openBlock as y, createElementBlock as w, normalizeClass as k, createElementVNode as S, withKeys as v, withModifiers as R, Fragment as X, renderList as Y, renderSlot as fe, createTextVNode as z, toDisplayString as B, createCommentVNode as D, createBlock as pe, resolveDynamicComponent as ve, nextTick as P } from "vue";
import { continueListRules as me, splitLines as ye, getSelectedLines as Le, joinLines as L, indent as we, getCursorInLine as ge, continueList as ke, deleteLine as U, duplicateLine as Se, mergeList as Re, replaceRange as be, getRangeFromSelectedLines as T, flip as xe } from "./text.js";
const Ce = ["readonly", "spellcheck", "value"], he = ["data-active", "onClick"], $e = /* @__PURE__ */ re({
  __name: "Textarea2",
  props: {
    allowFlipLines: { type: Boolean, default: !0 },
    autocomplete: { default: null },
    contextProvider: { type: Function, default: (b) => ({}) },
    continueLists: { type: [Boolean, Array], default: () => Object.values(me) },
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
  setup(b, { expose: E, emit: C }) {
    ue((e) => ({
      af0e24ec: J.value,
      "513a58ed": e.tabSize,
      "574788c6": N.value,
      "7c0d5590": o.menuY,
      "7c0d558f": o.menuX
    }));
    const s = b, O = C, d = h(null);
    function p(e) {
      const t = Array.isArray(e) ? L(e) : e;
      O("update:modelValue", t);
    }
    function W(e) {
      e.target instanceof HTMLTextAreaElement && p(e.target.value);
    }
    const c = $(() => ye(s.modelValue)), G = $(
      () => c.value.map((e, t) => ({
        row: e,
        key: `${t}#${e}`,
        context: s.contextProvider(e)
      }))
    ), N = h("auto");
    async function F() {
      var e, t;
      N.value = "auto", await P(), N.value = (e = d.value) != null && e.scrollHeight ? `${(t = d.value) == null ? void 0 : t.scrollHeight}px` : "auto";
    }
    K(() => {
      d.value && F();
    }), de(
      () => s.modelValue,
      () => {
        d.value && F();
      }
    );
    const J = $(() => s.scrollBeyondLastLine === !0 ? "18rem" : typeof s.scrollBeyondLastLine == "number" ? `${s.scrollBeyondLastLine}rem` : void 0);
    function Q(e) {
      const t = [...c.value], n = e.shiftKey ? "outdent" : "indent";
      f(({ adjustSelection: i, selectedLines: l }) => {
        const [a, r] = l, m = t.slice(a, r + 1), u = we(m, n);
        m.every((ae, se) => ae === u[se]) || (t.splice(a, r - a + 1, ...u), p(L(t)), i(a === r ? { to: "relative", delta: n === "indent" ? 1 : -1 } : { to: "lines", start: a, end: r }));
      });
    }
    function Z(e) {
      if (!s.continueLists || !s.continueLists.length) return;
      e.preventDefault();
      const t = [...c.value], n = s.continueLists ? s.continueLists : [];
      f(({ selectionStart: i, selectedLines: l, adjustSelection: a }) => {
        const [r] = l, m = ge(s.modelValue, i), u = ke(t[r], n, m);
        t.splice(r, 1, u.current), u.next !== null && t.splice(r + 1, 0, u.next), p(L(t)), "didContinue" in u && u.didContinue ? a({ to: "relative", delta: u.match.length + 1 }) : "didEnd" in u && u.didEnd ? a({ to: "startOfLine", startOf: r }) : a({ to: "relative", delta: 1 });
      });
    }
    function A(e) {
      const t = [...c.value];
      f(({ selectedLines: n, adjustSelection: i }) => {
        const [l, a] = n, r = e === "up" ? l - 1 : l + 1;
        if (l !== a || r < 0 || r >= t.length) return;
        const [m, u] = xe(t[l], t[r]);
        t[l] = m, t[r] = u, p(L(t)), i({ to: "endOfLine", endOf: r });
      });
    }
    function _(e) {
      f(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd) return;
        e.preventDefault(), await navigator.clipboard.writeText(c.value[n]);
        const l = U(c.value, n);
        p(L(l));
        const a = Math.min(n, l.length - 1);
        t.adjustSelection({ to: "endOfLine", endOf: a });
      });
    }
    function ee(e) {
      f(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd) return;
        e.preventDefault();
        const l = Se(c.value, n);
        p(L(l)), t.adjustSelection({ to: "endOfLine", endOf: n + 1 });
      });
    }
    function te(e) {
      f(async (t) => {
        const [n, i] = t.selectedLines;
        if (n !== i || t.selectionStart !== t.selectionEnd) return;
        e.preventDefault();
        const l = U(c.value, n);
        p(L(l));
        const a = Math.min(n, l.length - 1);
        t.adjustSelection({ to: "endOfLine", endOf: a });
      });
    }
    function ne(e) {
      var i;
      const t = (i = e.clipboardData) == null ? void 0 : i.getData("text/plain"), n = [...c.value];
      f(({ selectedLines: l, adjustSelection: a }) => {
        if (!t || !s.continueLists) return;
        const [r, m] = l;
        if (r !== m) return;
        const u = Re(n[r], t, s.continueLists);
        u !== null && (e.preventDefault(), n[r] = u.current, p(L(n)), a({
          to: "relative",
          delta: u.current.length - u.match.length,
          collapse: !0
        }));
      });
    }
    const o = ce({
      active: !1,
      focused: 0,
      menuX: "0px",
      menuY: "0px",
      mode: void 0,
      query: "",
      start: 0
    }), x = h(), H = h(null);
    async function oe() {
      var t;
      if (!o.active) return { x: "0px", y: "0px" };
      x.value = {
        before: s.modelValue.substring(0, o.start),
        after: s.modelValue.substring(o.start)
      }, await P();
      const e = (t = H.value) == null ? void 0 : t.getBoundingClientRect();
      return x.value = void 0, {
        x: e != null && e.right ? `${e.right}px` : "0px",
        y: e != null && e.bottom ? `${e.bottom}px` : "0px"
      };
    }
    function M(e) {
      if (!s.autocomplete) return;
      const t = [
        "Alt",
        "ArrowDown",
        "ArrowUp",
        "Backspace",
        "Control",
        "Meta",
        "Shift"
      ];
      if (o.active) {
        if (e.key === "Enter") {
          if (!g.value[o.focused]) return;
          j(g.value[o.focused]), e.preventDefault();
        } else if (!t.includes(e.key) && !e.key.match(/^\w$/))
          V();
        else if (o.mode) {
          let n = s.modelValue.substring(o.start);
          const i = new RegExp(`^\\${o.mode.trigger}(\\w*)`), l = n.match(i);
          l ? o.query = l[1] : V();
        }
      } else {
        const n = s.autocomplete.find((i) => i.trigger === e.key);
        if (!n) return;
        f(({ selectionStart: i }) => {
          o.active = !0, o.mode = n, o.query = "", o.start = i - 1, oe().then(({ x: l, y: a }) => {
            o.menuX = l, o.menuY = a;
          });
        });
      }
    }
    const g = $(() => {
      var t, n;
      if (!((t = o.mode) != null && t.commands)) return [];
      const e = (n = o.query) == null ? void 0 : n.toLowerCase();
      return e ? o.mode.commands.filter((i) => {
        const l = i.name.toLowerCase();
        return e && l.includes(e);
      }) : o.mode.commands.filter((i) => i.initial);
    });
    K(() => {
      o.focused >= g.value.length && (o.focused = 0);
    });
    function le(e) {
      o.active && (o.focused = Math.max(o.focused - 1, 0), e.preventDefault());
    }
    function ie(e) {
      if (!o.active) return;
      const t = o.focused + 1;
      o.focused = Math.min(g.value.length - 1, t), e.preventDefault();
    }
    function j(e) {
      let t;
      typeof e.value == "function" ? t = e.value() : typeof e.value == "string" && (t = e.value), t ?? (t = ""), f(({ selectionEnd: n, adjustSelection: i }) => {
        const l = be(
          s.modelValue,
          o.start,
          n + 1,
          t
        );
        p(l);
        const a = o.start + t.length;
        i({ to: "absolute", start: a }, !0);
      }), V();
    }
    function V() {
      o.active = !1, o.focused = 0, o.menuX = "0px", o.menuY = "0px", o.mode = void 0, o.query = "", o.start = 0;
    }
    async function q(e, t = !0) {
      if (!d.value) return;
      const { selectionStart: n, selectionEnd: i } = d.value;
      if (t && await P(), e.to === "absolute")
        d.value.setSelectionRange(e.start, e.end ?? e.start);
      else if (e.to === "relative") {
        const l = n + e.delta, a = e.collapse ? l : i + e.delta;
        d.value.setSelectionRange(l, a);
      } else if (e.to === "startOfLine") {
        const [l] = T(c.value, e.startOf);
        d.value.setSelectionRange(l, l);
      } else if (e.to === "endOfLine") {
        const [, l] = T(c.value, e.endOf);
        d.value.setSelectionRange(l, l);
      } else if (e.to === "lines") {
        const [l, a] = T(
          c.value,
          e.start,
          e.end
        );
        d.value.setSelectionRange(l, a);
      }
    }
    function I(e) {
      var t;
      (t = d.value) == null || t.focus(), e && q(e);
    }
    async function f(e, t = { ignoreReadonly: !1 }) {
      if (!d.value || s.readonly && !t.ignoreReadonly) return;
      const { selectionStart: n, selectionEnd: i } = d.value;
      await e({
        adjustSelection: q,
        focus: I,
        selectedLines: Le(
          c.value,
          n,
          i
        ),
        selectionEnd: i,
        selectionStart: n
      });
    }
    return E({ withContext: f }), (e, t) => (y(), w("div", {
      class: k({ [e.$style.wrapper]: !0, [e.$style.wrapperReadonly]: e.readonly }),
      onClick: t[11] || (t[11] = (n) => I())
    }, [
      S("textarea", {
        class: k(e.$style.textarea),
        readonly: e.readonly,
        spellcheck: e.spellcheck,
        value: s.modelValue,
        onInput: W,
        onKeydown: [
          t[0] || (t[0] = v(R((n) => e.allowFlipLines ? A("down") : void 0, ["alt", "prevent"]), ["down"])),
          t[1] || (t[1] = v(R((n) => e.allowFlipLines ? A("up") : void 0, ["alt", "prevent"]), ["up"])),
          t[2] || (t[2] = v((n) => o.active ? M(n) : Z(n), ["enter"])),
          t[3] || (t[3] = v(R((n) => e.duplicateLine ? ee(n) : void 0, ["meta", "shift"]), ["d"])),
          t[4] || (t[4] = v(R((n) => e.deleteLine ? te(n) : void 0, ["meta", "shift"]), ["k"])),
          t[5] || (t[5] = v(R((n) => e.cutFullLine ? _(n) : void 0, ["meta"]), ["x"])),
          t[6] || (t[6] = v(R((n) => e.insertTabs ? Q(n) : void 0, ["prevent"]), ["tab"])),
          t[7] || (t[7] = v((n) => o.active ? le(n) : void 0, ["up"])),
          t[8] || (t[8] = v((n) => o.active ? ie(n) : void 0, ["down"]))
        ],
        onKeyup: t[9] || (t[9] = (n) => M(n)),
        onPaste: t[10] || (t[10] = (n) => e.mergeListsOnPaste ? ne(n) : void 0),
        ref_key: "textareaEl",
        ref: d
      }, null, 42, Ce),
      S("div", {
        class: k(e.$style.output),
        "data-testid": "output"
      }, [
        (y(!0), w(X, null, Y(G.value, ({ row: n, key: i, context: l }, a) => (y(), w("div", {
          class: k(e.$style.row),
          key: i
        }, [
          fe(e.$slots, "row", {
            row: n,
            context: l,
            index: a
          }, () => [
            z(B(n), 1)
          ])
        ], 2))), 128))
      ], 2),
      x.value !== void 0 ? (y(), w("div", {
        key: 0,
        class: k(e.$style.menuPositionHelper)
      }, [
        S("span", null, B(x.value.before), 1),
        S("span", {
          ref_key: "menuPositionHelperEl",
          ref: H
        }, null, 512),
        S("span", null, B(x.value.after), 1)
      ], 2)) : D("", !0),
      e.autocomplete && o.active && g.value.length ? (y(), w("menu", {
        key: 1,
        class: k(e.$style.autocomplete),
        role: "menu"
      }, [
        (y(!0), w(X, null, Y(g.value, (n, i) => (y(), w("li", {
          key: n.id
        }, [
          S("button", {
            "data-active": o.focused === i ? !0 : void 0,
            onClick: (l) => j(n)
          }, [
            n.icon ? (y(), pe(ve(n.icon), { key: 0 })) : D("", !0),
            z(" " + B(n.name), 1)
          ], 8, he)
        ]))), 128))
      ], 2)) : D("", !0)
    ], 2));
  }
}), Be = "_wrapper_1tt2l_6", Ee = "_wrapperReadonly_1tt2l_13", Oe = "_textarea_1tt2l_21", Ne = "_output_1tt2l_27", Ve = "_row_1tt2l_61", De = "_autocomplete_1tt2l_69", Pe = "_menuPositionHelper_1tt2l_75", Te = {
  wrapper: Be,
  wrapperReadonly: Ee,
  textarea: Oe,
  output: Ne,
  row: Ve,
  autocomplete: De,
  menuPositionHelper: Pe
}, Fe = (b, E) => {
  const C = b.__vccOpts || b;
  for (const [s, O] of E)
    C[s] = O;
  return C;
}, Ae = {
  $style: Te
}, je = /* @__PURE__ */ Fe($e, [["__cssModules", Ae]]);
export {
  je as default
};
