import { normalizeSearchable } from "./searchUtils";

/**
 * Match RTDB 2026_sponsors entry when the search text lines up with a chamber city.
 * Apostrophes/quotes ignored (e.g. "oneill" matches O'Neill).
 */
export function matchChamberSponsor(sponsors, searchQuery) {
  const q = normalizeSearchable((searchQuery || "").trim());
  if (!q || !Array.isArray(sponsors) || sponsors.length === 0) return null;

  const withLink = sponsors.filter(
    (s) => s && typeof s.link === "string" && s.link.trim()
  );
  if (withLink.length === 0) return null;

  const cityNorm = (s) => normalizeSearchable((s.city || "").trim());

  const exact = withLink.find((s) => cityNorm(s) === q);
  if (exact) return exact;

  if (q.length < 2) return null;

  const cityContainsQ = withLink.find((s) => {
    const c = cityNorm(s);
    return c.length > 0 && c.includes(q);
  });
  if (cityContainsQ) return cityContainsQ;

  return (
    withLink.find((s) => {
      const c = cityNorm(s);
      return c.length >= 3 && q.includes(c);
    }) || null
  );
}

/** Match sponsor when `site.city` matches sponsor `city` (apostrophes ignored). */
export function findChamberSponsorForCity(sponsors, siteCity) {
  const target = normalizeSearchable((siteCity || "").trim());
  if (!target || !Array.isArray(sponsors) || sponsors.length === 0) return null;
  return (
    sponsors.find(
      (s) =>
        s &&
        typeof s.link === "string" &&
        s.link.trim() &&
        normalizeSearchable((s.city || "").trim()) === target
    ) || null
  );
}

export function normalizeExternalUrl(link) {
  const u = (link || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}
