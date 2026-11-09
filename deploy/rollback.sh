#!/usr/bin/env bash
# Restore the release pointer and site config saved by a cutover, under the
# shared lock:
#   /usr/local/sbin/with-deploy-lock /root/azerothtrail-backup-STAMP/tools/rollback.sh /root/azerothtrail-backup-STAMP
# Releases are never deleted, so the replaced release is still on disk.
set -Eeuo pipefail
# shellcheck source=deploy/common.sh
source "$(dirname "$0")/common.sh"
require_lock
backup=${1:?usage: rollback.sh /root/azerothtrail-backup-TIMESTAMP-COMMIT}
[[ $backup == "$BACKUP_PREFIX"* && -f $backup/ready ]] || die 'invalid or incomplete backup directory'

if [[ -f $backup/previous-current ]]; then
  previous=$(cat "$backup/previous-current")
  [[ -d $previous ]] || die "previous release $previous is missing"
  ln -sfn "$previous" "$SRV/current.next"
  mv -Tf "$SRV/current.next" "$SRV/current"
else
  # First deploy: there was no site before it.
  rm -f "$SRV/current" "$SRV/current.next"
fi

# The tracker: the previous unit on the restored release, or none at all.
if [[ -f $backup/status.service ]]; then
  start_status_service "$backup/status.service"
else
  systemctl disable --now --quiet "$SERVICE" 2>/dev/null || true
  rm -f "$UNIT"
  systemctl daemon-reload
fi

if [[ -f $backup/site.caddy ]]; then
  install -m 0644 -o root -g root "$backup/site.caddy" "$SITE"
else
  rm -f "$SITE"
fi

validate_caddy
systemctl reload caddy

if [[ -f $backup/previous-current ]]; then
  printf 'Restored %s; live version: %s\n' "$(readlink "$SRV/current")" "$(local_get /version.txt || echo unreachable)"
else
  echo 'Removed the site (it did not exist before this backup was taken)'
fi
