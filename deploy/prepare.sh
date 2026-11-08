#!/usr/bin/env bash
# Build and test a clean, pushed commit as the unprivileged checkout owner,
# outside the deploy lock. Prints the exact cutover command.
#
#   deploy/prepare.sh [CANDIDATE_DIR]
set -Eeuo pipefail
repo=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=deploy/common.sh
source "$repo/deploy/common.sh"
[[ $EUID != 0 ]] || die 'prepare as the checkout owner, not root'
[[ -z $(git -C "$repo" status --porcelain) ]] || die 'commit all source changes first'
git -C "$repo" fetch --quiet origin
commit=$(git -C "$repo" rev-parse HEAD)
git -C "$repo" merge-base --is-ancestor "$commit" origin/main || die "$commit is not on origin/main; push it first"
candidate=${1:-/home/sawyer/astro-work/azerothtrail-$commit}
[[ ! -e $candidate ]] || die "$candidate exists; choose a new candidate directory"
mkdir -p "$candidate"
git -C "$repo" archive "$commit" | tar -x -C "$candidate"
cd "$candidate"
export AZEROTHTRAIL_COMMIT=$commit
astro-runtime npm ci --no-audit --no-fund
astro-runtime npm run check
astro-runtime npm run build
astro-runtime node scripts/smoke.ts dist "$commit"
mkdir -p bundle/web bundle/config
cp -a dist bundle/web/
cp caddy/azerothtrail.com.caddy bundle/config/
printf '%s\n' "$commit" > bundle/COMMIT
(cd bundle && find . -type f -print0 | sort -z | xargs -0 sha256sum) > bundle.sha256
snapshot > expected-active
printf 'Candidate verified: %s\nCommit: %s\n' "$candidate" "$commit"
printf 'Deploy (as root): /usr/local/sbin/with-deploy-lock %s/deploy/cutover.sh %s\n' "$candidate" "$candidate"
