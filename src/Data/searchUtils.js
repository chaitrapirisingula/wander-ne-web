/**
 * Lowercase and strip apostrophes / straight and curly quotes for matching
 * (e.g. "oneill" matches "O'Neill").
 */
export function normalizeSearchable(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d'`"]/g, "");
}
