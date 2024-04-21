function d(n) {
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
function p(n, t) {
  return n.toSpliced(t, 1);
}
function o(n, t) {
  return !n.length || t > n.length ? [...n] : [...n.slice(0, t), n[t], ...n.slice(t)];
}
function L(n, t, e = t) {
  const i = Array.isArray(n) ? [...n] : d(n);
  let l = 0, r = -1, c = -1;
  e < t && ([t, e] = [e, t]);
  for (let s = 0; s < i.length && (r < 0 || c < 0); s++) {
    const u = i[s], a = l, h = a + u.length;
    t >= a && t <= h && (r = s), e >= a && e <= h && (c = s), l += u.length + 1;
  }
  return [Math.max(r, 0), c === -1 ? i.length - 1 : c];
}
function m(n, t, e = t) {
  const i = Array.isArray(n) ? [...n] : d(n), l = i.map((s) => s.length);
  t = Math.max(t, 0), e = Math.min(e, i.length - 1), e < t && ([t, e] = [e, t]);
  let r = l.slice(0, t).reduce((s, u) => s + u, 0);
  r += t;
  let c = l.slice(t, e + 1).reduce((s, u) => s + u, r);
  return c += e - t, [r, c];
}
function x(n, t) {
  if (t > n.length || t < 0)
    return;
  const i = n.slice(0, t).lastIndexOf(`
`) + 1;
  return t - i;
}
const A = {
  unordered: { pattern: /^\t*[-*] /, next: "same" },
  indent: { pattern: /^\t+/, next: "same" },
  numbered: {
    pattern: /^\t*\d+\. /,
    next: (n) => `${Number.parseInt(n) + 1}. `
  }
};
function C(n, t, e = n.length) {
  let i, l = null, r = null;
  for (let a = 0; a < t.length && !i; a++)
    l = n.match(t[a].pattern), l && (i = t[a].next);
  let [c, s] = g(n, e);
  c && l && i && (r = i === "same" ? l[0] : i(l[0]), s = r + s);
  const u = c === (l == null ? void 0 : l[0]) && e === n.length;
  return u && (c = ""), u && r ? { current: c, next: null, didEnd: !0, match: r } : c && r ? { current: c, next: s, didContinue: !0, match: r } : { current: c, next: s, didContinue: !1, didEnd: !1 };
}
function M(n, t, e) {
  let i = null, l = null;
  for (let r = 0; r < e.length && !i; r++) {
    const c = n.match(e[r].pattern);
    c && n.length === c[0].length && (i = e[r].pattern, l = t.match(i));
  }
  return i && l ? { current: n.replace(i, t), match: l[0] } : null;
}
function S(n, t = "indent") {
  return t === "indent" ? n.map((e) => `	${e}`) : n.map((e) => e.startsWith("	") ? e.slice(1) : e);
}
function b(n, t) {
  return [t, n];
}
export {
  C as continueList,
  A as continueListRules,
  p as deleteLine,
  o as duplicateLine,
  b as flip,
  x as getCursorInLine,
  m as getRangeFromSelectedLines,
  L as getSelectedLines,
  S as indent,
  f as joinLines,
  M as mergeList,
  g as splitAt,
  d as splitLines
};
