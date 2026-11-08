#!/usr/bin/env bash
# Atomic, reversible cutover of a prepared static release. Run as root under
# the shared lock:
#   /usr/local/sbin/with-deploy-lock CANDIDATE/deploy/cutover.sh CANDIDATE
# Writes only /srv/www/azerothtrail.com, /etc/caddy/sites/azerothtrail.com.caddy
# and a root-only backup in /root/azerothtrail-backup-*; reloads Caddy.
set -Eeuo pipefail
# shellcheck source=deploy/common.sh
source "$(dirname "$0")/common.sh"
require_lock
candidate=${1:?usage: cutover.sh CANDIDATE_DIRECTORY}
[[ -f $candidate/bundle/COMMIT && -f $candidate/bundle.sha256 && -f $candidate/expected-active ]] || die 'run deploy/prepare.sh first'
commit=$(cat "$candidate/bundle/COMMIT")
[[ $commit =~ ^[a-f0-9]{40}$ ]] || die 'invalid commit id'
cmp -s <(snapshot) "$candidate/expected-active" || die 'active release or site config changed since preparation; prepare again'

backup="$BACKUP_PREFIX$(date -u +%Y%m%dT%H%M%SZ)-${commit:0:8}"
install -d -m 0700 "$backup" "$backup/tools"
cp -a "$candidate/bundle" "$backup/staged"
[[ -z $(find "$backup/staged" -type l -print) ]] || die 'candidate bundle must contain no symlinks'
(cd "$backup/staged" && sha256sum --quiet -c "$candidate/bundle.sha256")
chown -R root:root "$backup/staged"
cp -a "$(dirname "$0")"/*.sh "$backup/tools/"
# Record the state to restore: the previous release pointer and site file, or their absence.
if [[ -L $SRV/current ]]; then readlink "$SRV/current" > "$backup/previous-current"; fi
if [[ -f $SITE ]]; then cp -a "$SITE" "$backup/site.caddy"; fi
preserved > "$backup/preserved-before"
touch "$backup/ready"
trap 'status=$?; if ((status != 0)); then echo "Cutover failed; restoring prior state" >&2; "$backup/tools/rollback.sh" "$backup"; fi' EXIT

# Stage the immutable release next to (not over) the live one.
install -d -m 0755 "$SRV" "$SRV/releases"
release="$SRV/releases/$commit"
if [[ -d $release ]]; then
  diff -qr "$backup/staged/web" "$release" >/dev/null || die "$release exists with different content"
else
  cp -a "$backup/staged/web" "$release.tmp"
  chown -R root:root "$release.tmp"
  find "$release.tmp" -type d -exec chmod 0755 {} +
  find "$release.tmp" -type f -exec chmod 0644 {} +
  mv -T "$release.tmp" "$release"
fi
[[ $(cat "$release/dist/version.txt") == "$commit" ]] || die 'release version.txt does not match the commit'

# Install and validate the site config before anything goes live.
install -m 0644 -o root -g root "$backup/staged/config/azerothtrail.com.caddy" "$SITE"
validate_caddy

# Switch atomically, then reload Caddy (it obtains the certificate on first use).
ln -sfn "$release" "$SRV/current.next"
mv -Tf "$SRV/current.next" "$SRV/current"
systemctl reload caddy

# Verify through Caddy with the real hostname and certificate.
live=$(local_get /version.txt) || die 'site did not answer over HTTPS'
[[ $live == "$commit" ]] || die "live version.txt is $live, expected $commit"
local_get /druid/ >/dev/null || die '/druid/ failed'
local_get /druid/route/ >/dev/null || die '/druid/route/ failed'
local_get /paladin/ >/dev/null || die '/paladin/ failed'

preserved > "$backup/preserved-after"
cmp -s "$backup/preserved-before" "$backup/preserved-after" || die 'another site or shared Caddy file changed during cutover'
[[ -z $(find "$release" \( -type f -o -type d \) \( ! -user root -o -perm /022 \) -print) ]] || die 'release ownership or permissions are wrong'

trap - EXIT
printf 'Deployed %s\n' "$commit"
printf 'Rollback: /usr/local/sbin/with-deploy-lock %s/tools/rollback.sh %s\n' "$backup" "$backup"
