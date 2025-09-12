// Checks if `valueToCheck` appears (case-insensitive, substring) in redactingData[tableName][*][keyName]
export function containsKeywordInTable(
  valueToCheck,
  keyName,
  tableName,
  redactingData
) {
  if (valueToCheck == null || !keyName || !tableName || !redactingData) return false;

  const rows = redactingData?.[tableName];
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  // Build variants for dates to improve hit-rate
  const dateVariants = (isoLike) => {
    const v = String(isoLike ?? "");
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v); // e.g. 1981-12-05T00:00:00
    if (!m) return [v];
    const [, y, mo, d] = m;
    return [v, `${y}-${mo}-${d}`, `${mo}/${d}/${y}`]; // ISO full, YYYY-MM-DD, MM/DD/YYYY
  };

  const needle = normalize(valueToCheck);

  return rows.some((row) => {
    if (!row || typeof row !== "object") return false;
    const raw = row[keyName];
    if (raw == null) return false;

    // For DateOfBirth, try several formats
    const candidates =
      keyName.toLowerCase().includes("date")
        ? dateVariants(raw).map(normalize)
        : [normalize(raw)];

    return candidates.some((c) => c && needle && c.includes(needle));
  });
}
