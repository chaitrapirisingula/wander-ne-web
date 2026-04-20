/**
 * Match RTDB 2026_sponsors entry when the search text lines up with a chamber city.
 * Prefers exact city match, then city containing the query, then query containing full city name.
 */
export function matchChamberSponsor(sponsors, searchQuery) {
  const q = (searchQuery || "").trim().toLowerCase();
  if (!q || !Array.isArray(sponsors) || sponsors.length === 0) return null;

  const withLink = sponsors.filter(
    (s) => s && typeof s.link === "string" && s.link.trim()
  );
  if (withLink.length === 0) return null;

  const cityNorm = (s) => (s.city || "").trim().toLowerCase();

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

export function normalizeExternalUrl(link) {
  const u = (link || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}
