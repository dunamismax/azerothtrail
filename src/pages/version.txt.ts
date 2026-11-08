import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';

// The deployed commit, so the live site can be checked against both remotes.
// deploy/prepare.sh builds from `git archive` (no .git) and sets
// AZEROTHTRAIL_COMMIT; local builds fall back to the checkout's HEAD.
function revision(): string {
  const fromEnv = process.env.AZEROTHTRAIL_COMMIT;
  if (fromEnv && /^[0-9a-f]{40}$/.test(fromEnv)) return fromEnv;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}

export const GET: APIRoute = () => new Response(`${revision()}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
