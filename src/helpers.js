export const toFixed2 = (n) =>
  +n
    .toString()
    .split(".")
    .map((s, i) => (i ? s.slice(0, 2) : s))
    .join(".");
