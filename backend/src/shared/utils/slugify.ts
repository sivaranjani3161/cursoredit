/**
 * Converts a string into a URL-safe slug.
 * e.g. "Hello World! 123" → "hello-world-123"
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
