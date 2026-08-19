export function getSafeInternalPath(path: string | undefined, fallback = "/catalogo-apis") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return fallback;
  }

  return path;
}
