/**
 * Utility for safely using backend image URLs.
 * - Encodes spaces/special chars in filenames
 * - Marks localhost URLs as unoptimized for Next.js <Image>
 */

/** Encode a backend URL safely (handles spaces in filenames) */
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    // Already encoded or no special chars → return as-is
    if (!url.includes(" ")) return url;
    // Split on ? to preserve query strings
    const [base, query] = url.split("?");
    const encoded = encodeURI(base);
    return query ? `${encoded}?${query}` : encoded;
  } catch {
    return url;
  }
}

/** Whether a URL should skip Next.js image optimization (localhost / relative) */
export function isUnoptimized(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://localhost") || url.startsWith("http://127.");
}
