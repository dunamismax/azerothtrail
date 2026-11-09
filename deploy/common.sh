#!/usr/bin/env bash
# Shared shell glue for Azeroth Trail deploys on ubuntu-vm.
# shellcheck shell=bash disable=SC2034
set -Eeuo pipefail
SRV=/srv/www/azerothtrail.com
SITE=/etc/caddy/sites/azerothtrail.com.caddy
# Server-status tracker (Node, loopback :4315), run from $SRV/current/server.
UNIT=/etc/systemd/system/azerothtrail-status.service
SERVICE=azerothtrail-status.service
CADDY=/usr/local/lib/caddy/caddy
HOST=azerothtrail.com
BACKUP_PREFIX=/root/azerothtrail-backup-

die() { echo "ERROR: $*" >&2; exit 1; }

# Privileged steps run only inside the host-wide lock, as descriptor 9.
require_lock() {
  [[ $EUID == 0 ]] || die 'run as root through /usr/local/sbin/with-deploy-lock'
  [[ $(readlink /proc/$$/fd/9) == /run/astro-deploy/lock ]] || die 'shared deployment lock descriptor 9 is required'
  flock -n 9 || die 'shared deployment lock is not held'
}

# Everything this site owns on the host. Cutover refuses to run if it changed
# between prepare and cutover.
snapshot() {
  if [[ -L $SRV/current ]]; then echo "current -> $(readlink -f "$SRV/current")"; else echo 'current absent'; fi
  if [[ -f $SITE ]]; then sha256sum "$SITE"; else echo "absent $SITE"; fi
  if [[ -f $UNIT ]]; then sha256sum "$UNIT"; else echo "absent $UNIT"; fi
}

# Things this deploy must never change: other sites and the shared Caddy setup.
preserved() {
  sha256sum /etc/caddy/Caddyfile "$CADDY"
  find /etc/caddy/sites -maxdepth 1 -type f ! -name azerothtrail.com.caddy -print0 | sort -z | xargs -0 -r sha256sum
  find /etc/systemd/system -maxdepth 1 -type f -name '*.service' ! -name "$SERVICE" -print0 | sort -z | xargs -0 -r sha256sum
  find /srv/www -mindepth 2 -maxdepth 2 -name current ! -path "$SRV/current" -printf '%p -> %l\n' | sort
}

validate_caddy() { runuser -u caddy -- env HOME=/var/lib/caddy "$CADDY" validate --config /etc/caddy/Caddyfile --adapter caddyfile; }

# Fetch a path from the local Caddy over HTTPS with the real hostname.
# Retries while Caddy obtains the certificate after the first reload.
local_get() {
  local path=$1 attempt
  for attempt in {1..45}; do
    if curl -fsS --max-time 10 --resolve "$HOST:443:127.0.0.1" "https://$HOST$path"; then return 0; fi
    sleep 2
  done
  return 1
}

# Install (or update) the tracker's unit and restart it on the live release.
start_status_service() {
  install -m 0644 -o root -g root "$1" "$UNIT"
  systemctl daemon-reload
  systemctl enable --quiet "$SERVICE"
  systemctl restart "$SERVICE"
}

# The tracker answers on loopback (it may take a moment to bind).
wait_status_service() {
  local attempt
  for attempt in {1..30}; do
    if curl -fsS --max-time 3 http://127.0.0.1:4315/api/status/health >/dev/null; then return 0; fi
    sleep 1
  done
  return 1
}
