/**
 * Converts any stored media URL into a browser-loadable URL that goes through
 * the Next.js /api/media proxy, so the browser never has to reach the backend
 * directly (avoids port/CORS/firewall issues).
 *
 * Handles:
 *   http://localhost:3001/uploads/file.jpg  → /api/media/uploads/file.jpg
 *   http://127.0.0.1:3001/uploads/file.jpg  → /api/media/uploads/file.jpg
 *   /uploads/file.jpg                        → /api/media/uploads/file.jpg
 *   https://cdn.example.com/img.jpg          → https://cdn.example.com/img.jpg (unchanged)
 */

const BACKEND_ORIGINS = [
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';

  // Strip any known backend origin and proxy via /api/media/
  for (const origin of BACKEND_ORIGINS) {
    if (url.startsWith(origin)) {
      const path = url.slice(origin.length); 
      const clean = path.startsWith('/') ? path.slice(1) : path;
      return `/api/media/${clean}`;
    }
  }

  // Already an external/CDN URL — return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Relative path like /uploads/file.jpg
  const clean = url.startsWith('/') ? url.slice(1) : url;
  return `/api/media/${clean}`;
}
