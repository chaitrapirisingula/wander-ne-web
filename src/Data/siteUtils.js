/** Stable key — prefer Firebase id; fallback to name|city|state (Explore/Map must not key only by name). */
export function siteKey(site) {
  if (!site) return "";
  const id = site.id;
  if (id != null && String(id).trim() !== "") return String(id);
  return [site.name, site.city, site.state].filter(Boolean).join("|");
}

/** One row per site id (or name|city|state). Use before filter/map so RTDB duplicates don’t multiply cards. */
export function dedupeSitesByKey(sites) {
  if (!sites?.length) return [];
  const seen = new Set();
  const out = [];
  for (const s of sites) {
    const k = siteKey(s);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}
