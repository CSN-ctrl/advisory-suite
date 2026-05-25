/** Use CMS URL when set; otherwise fall back to bundled default asset. */
export function resolveMediaSrc(cmsValue: string | undefined, defaultSrc: string): string {
  const trimmed = cmsValue?.trim() ?? "";
  if (!trimmed) {
    return defaultSrc;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  return trimmed.startsWith("@/") ? defaultSrc : trimmed;
}
