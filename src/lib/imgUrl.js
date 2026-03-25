// Prefix local /images/... paths with Vite's base URL.
// Absolute URLs (Supabase Storage, http/https) are returned unchanged.
export const imgUrl = (src) => {
  if (!src || src.startsWith('http')) return src
  if (src.startsWith('/')) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    return base + src
  }
  return src
}
