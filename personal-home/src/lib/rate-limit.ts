// Best-effort, in-memory per-key rate limiting (e.g. for the contact API
// route, keyed by IP). Vercel serverless functions aren't guaranteed to
// reuse the same instance across requests, so this is defense-in-depth
// against a single abusive client hitting a warm instance repeatedly — not
// a strong distributed rate limit. If real abuse shows up, the actual
// backstop is enabling Vercel's platform-level Attack Challenge Mode /
// Firewall (no code change); a stateless Upstash Redis-backed limiter is
// the upgrade path if a real distributed limit becomes necessary, and
// would replace only this module.

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 5
const MAX_TRACKED_KEYS = 1000

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

function pruneExpired(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key)
  }
}

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  pruneExpired(now)

  const bucket = buckets.get(key)
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now })
    return false
  }

  bucket.count += 1
  return bucket.count > MAX_REQUESTS_PER_WINDOW
}
