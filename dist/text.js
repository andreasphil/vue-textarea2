function h(n) {
  return n.split(`
`);
}
function f(n) {
  return n.join(`
`);
}
function g(n, t) {
  return [n.slice(0, t), n.slice(t)];
}
function p(n, t, e = t) {
  const i = Array.isArray(n) ? [...n] : h(n);
  let r = 0, l = -1, c = -1;
  e < t && ([t, e] = [e, t]);
  for (let s = 0; s < i.length && (l < 0 || c < 0); s++) {
    const a = i[s], u = r, d = u + a.length;
    t >= u && t <= d && (l = s), e >= u && e <= d && (c = s), r += a.length + 1;
  }
  return [Math.max(l, 0), c === -1 ? i.length - 1 : c];
}
function o(n, t, e = t) {
  const i = Array.isArray(n) ? [...n] : h(n), r = i.map((s) => s.length);
  t = Math.max(t, 0), e = Math.min(e, i.length - 1), e < t && ([t, e] = [e, t]);
  let l = r.slice(0, t).reduce((s, a) => s + a, 0);
  l += t;
  let c = r.slice(t, e + 1).reduce((s, a) => s + a, l);
  return c += e - t, [l, c];
}
function L(n, t) {
  if (t > n.length || t < 0)
    return;
  const i = n.slice(0, t).lastIndexOf(`
`) + 1;
  return t - i;
}
const x = {
  unordered: { pattern: /^\t*[-*] /, next: "same" },
  indent: { pattern: /^\t+/, next: "same" },
  numbered: {
    pattern: /^\t*\d+\. /,
    next: (n) => `${Number.parseInt(n) + 1}. `
  }
};
function m(n, t, e = n.length) {
  let i, r = null, l = null;
  for (let u = 0; u < t.length && !i; u++)
    r = n.match(t[u].pattern), r && (i = t[u].next);
  let [c, s] = g(n, e);
  c && r && i && (l = i === "same" ? r[0] : i(r[0]), s = l + s);
  const a = c === (r == null ? void 0 : r[0]) && e === n.length;
  return a && (c = ""), a && l ? { current: c, next: null, didEnd: !0, match: l } : c && l ? { current: c, next: s, didContinue: !0, match: l } : { current: c, next: s, didContinue: !1, didEnd: !1 };
}
function A(n, t, e) {
  let i = null, r = null;
  for (let l = 0; l < e.length && !i; l++) {
    const c = n.match(e[l].pattern);
    c && n.length === c[0].length && (i = e[l].pattern, r = t.match(i));
  }
  return i && r ? { current: n.replace(i, t), match: r[0] } : null;
}
function C(n, t = "indent") {
  return t === "indent" ? n.map((e) => `	${e}`) : n.map((e) => e.startsWith("	") ? e.slice(1) : e);
}
function M(n, t) {
  return [t, n];
}
export {
  m as continueList,
  x as continueListRules,
  M as flip,
  L as getCursorInLine,
  o as getRangeFromSelectedLines,
  p as getSelectedLines,
  C as indent,
  f as joinLines,
  A as mergeList,
  g as splitAt,
  h as splitLines
};
