export function accountInitials(...names: Array<string | null | undefined>) {
  const source = names.map((name) => name?.trim() ?? "").find(Boolean) ?? "";
  const words = source
    .replace(/\b(s\.?a\.?s\.?|s\.?a\.?|ltda\.?|inc\.?)\b/gi, " ")
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return "MC";
}

export function accountLabel(displayName: string, companyName = "") {
  if (displayName.trim()) {
    return displayName.trim();
  }

  if (companyName.trim()) {
    return companyName.trim();
  }

  return "Mi cuenta";
}
