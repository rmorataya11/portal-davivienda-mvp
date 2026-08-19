export function getSafeInternalPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return undefined;
  }

  return path;
}
