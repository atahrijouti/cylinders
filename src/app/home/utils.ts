export const mkNextAnimationFrame =
  <Args extends unknown[]>(fn: (...args: Args) => void) =>
  (...args: Args) =>
    requestAnimationFrame(() => fn(...args))
