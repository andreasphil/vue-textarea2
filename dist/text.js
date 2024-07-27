function d(t) {
  return t.split(`
`);
}
function f(t) {
  return t.join(`
`);
}
function g(t, n) {
  return [t.slice(0, n), t.slice(n)];
}
function p(t, n) {
  return t.toSpliced(n, 1);
}
function o(t, n) {
  return !t.length || n > t.length ? [...t] : [...t.slice(0, n), t[n], ...t.slice(n)];
}
function L(t, n, e, i) {
  return t.substring(0, n) + i + t.substring(e - 1);
}
function b(t, n, e = n) {
  const i = Array.isArray(t) ? [...t] : d(t);
  let l = 0, r = -1, c = -1;
  e < n && ([n, e] = [e, n]);
  for (let s = 0; s < i.length && (r < 0 || c < 0); s++) {
    const u = i[s], a = l, h = a + u.length;
    n >= a && n <= h && (r = s), e >= a && e <= h && (c = s), l += u.length + 1;
  }
  return [Math.max(r, 0), c === -1 ? i.length - 1 : c];
}
function m(t, n, e = n) {
  const i = Array.isArray(t) ? [...t] : d(t), l = i.map((s) => s.length);
  n = Math.max(n, 0), e = Math.min(e, i.length - 1), e < n && ([n, e] = [e, n]);
  let r = l.slice(0, n).reduce((s, u) => s + u, 0);
  r += n;
  let c = l.slice(n, e + 1).reduce((s, u) => s + u, r);
  return c += e - n, [r, c];
}
function x(t, n) {
  if (n > t.length || n < 0) return;
  const i = t.slice(0, n).lastIndexOf(`
`) + 1;
  return n - i;
}
const A = {
  unordered: { pattern: /^\t*[-*] /, next: "same" },
  indent: { pattern: /^\t+/, next: "same" },
  numbered: {
    pattern: /^\t*\d+\. /,
    next: (t) => `${Number.parseInt(t) + 1}. `
  }
};
function C(t, n, e = t.length) {
  let i, l = null, r = null;
  for (let a = 0; a < n.length && !i; a++)
    l = t.match(n[a].pattern), l && (i = n[a].next);
  let [c, s] = g(t, e);
  c && l && i && (r = i === "same" ? l[0] : i(l[0]), s = r + s);
  const u = c === (l == null ? void 0 : l[0]) && e === t.length;
  return u && (c = ""), u && r ? { current: c, next: null, didEnd: !0, match: r } : c && r ? { current: c, next: s, didContinue: !0, match: r } : { current: c, next: s, didContinue: !1, didEnd: !1 };
}
function M(t, n, e) {
  let i = null, l = null;
  for (let r = 0; r < e.length && !i; r++) {
    const c = t.match(e[r].pattern);
    c && t.length === c[0].length && (i = e[r].pattern, l = n.match(i));
  }
  return i && l ? { current: t.replace(i, n), match: l[0] } : null;
}
function S(t, n = "indent") {
  return n === "indent" ? t.map((e) => `	${e}`) : t.map((e) => e.startsWith("	") ? e.slice(1) : e);
}
function y(t, n) {
  return [n, t];
}
export {
  C as continueList,
  A as continueListRules,
  p as deleteLine,
  o as duplicateLine,
  y as flip,
  x as getCursorInLine,
  m as getRangeFromSelectedLines,
  b as getSelectedLines,
  S as indent,
  f as joinLines,
  M as mergeList,
  L as replaceRange,
  g as splitAt,
  d as splitLines
};
