/** Repeater items (slides, bullets, stats...) carry an `active` flag set from
 * the admin's per-item Hide/Show toggle. Undefined/true = visible, so old
 * seeded data without the flag still renders. Every section component that
 * maps over a repeater array should filter through this first. */
export function visibleItems(arr) {
  return (arr || []).filter((item) => item.active !== false);
}
