/**
 * Formats a LINE ID or URL into a clickable LINE direct chat link
 * Supports:
 * - Full URLs (e.g., https://line.me/ti/p/~topsalecoway1919 or https://line.me/R/ti/p/@...)
 * - Official account IDs with @ (e.g., @cowaycare.th -> https://line.me/R/ti/p/@cowaycare.th)
 * - Standard IDs without @ (e.g., topsalecoway1919 -> https://line.me/ti/p/~topsalecoway1919)
 */
export function formatLineUrl(idOrUrl?: string, fallback: string = 'https://line.me/ti/p/~cowaypartner'): string {
  if (!idOrUrl || !idOrUrl.trim()) return fallback;
  const trimmed = idOrUrl.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  if (trimmed.startsWith('@')) {
    return `https://line.me/R/ti/p/${trimmed}`;
  }
  
  return `https://line.me/ti/p/~${trimmed}`;
}
