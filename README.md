# Azeroth Trail

A World of Warcraft: Forever leveling guide, live at <https://azerothtrail.com>.
Two classes, every spec, on the **Normal PvE ruleset**:

- **Paladin** (`/paladin/`): Holy, Protection and Retribution.
- **Druid** (`/druid/`): Balance, Feral and Restoration.

Every spec can level from 10 to 60 with its own talent order, and has a
level-60 page with builds, rotation, stats and a first-week checklist. The
leveling orders follow a current source point for point: Icy Veins' level
sliders for Holy, Retribution, Balance, Feral and Restoration, and Mobalytics'
Protection order. Level-60 builds come from the Icy Veins calculators. Dated
notes say where sources disagree.

The home page (`/`) picks a class and spec. Each class page answers "What
should I do at my level?" for levels 1-60 in the chosen spec: where to quest,
what to train (priorities differ by spec, and talent spells only show once the
spec has the talent), the next talent point, how that spec plays the bracket,
and the dungeon worth trying. Level, spec, faction and starting race are
remembered in the browser (localStorage only). Every page is static HTML that
reads fine with JavaScript off, in which case it shows every spec; the script
only filters and remembers.

`/zones/` ("Where to level") answers the question for any class: pick a level
and faction and it shows the zone to go to, its quest hubs, zones that work as
well when it's crowded, and every dungeon in range, then every zone and all 28
dungeons by level. The home page carries the same finder. Its level and faction
follow the class guide you used last. New dungeons use Blizzard's levels;
Classic dungeons use the in-game Group Finder's, which the class level pages
now show too.

`/status/` is a live WoW: Forever server-status tracker: every ruleset in all
four regions, read from Blizzard's official status page, with browser alerts
(Web Push) the moment servers come back online. See
[Server status tracker](#server-status-tracker).

Pages per class: `/<class>/` (my level), `/<class>/level/N/`, `/<class>/route/`,
`/<class>/quests/`, `/<class>/specs/` (compare specs, races, professions),
`/<class>/<spec>/` (10-60), `/<class>/<spec>/endgame/` (level 60) and
`/<class>/sources/`.

## Stack

- Astro 7.4.2, static output, strict TypeScript 6.0.3 (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`), exact dependency pins and a committed
  `package-lock.json`.
- One small client script (`src/scripts/app.ts`) plus `public/boot.js`, which
  applies saved preferences (including `<html data-spec>` and the theme,
  `<html data-theme>`) before first paint. The header's theme button cycles
  Auto, Light and Dark; Auto follows the device.
  `/spec-filter.css` is generated from the class registry and hides the other
  specs' blocks. No inline scripts or styles, so the site runs under a strict
  `script-src 'self'; style-src 'self'` CSP.
- Node 24.22.1+ (the server runs 24.22.1 via `/opt/astro-runtime`; local Node
  26 also works). The `.ts` scripts run directly with Node's type stripping.

## Local commands

```sh
npm ci                 # install exactly what package-lock.json pins
npm run status         # status tracker on 127.0.0.1:4315 (state in .status-data/)
npm run dev            # dev server at http://127.0.0.1:4321 (proxies /api to the tracker)
npm run check          # astro check + tsc + content verification
npm run build          # static site in dist/
npm run preview        # serve dist/ at http://127.0.0.1:4322
npm test               # content verification, status tests, build, smoke test of dist/
npm run test:status    # status tracker tests only (no network)
node scripts/smoke.ts https://azerothtrail.com <commit>   # check the live site
```

`npm run verify` (part of `check`) fails the build when:

- a level from 1 to 60 maps to zero or two route brackets, or brackets leave a gap;
- a talent point breaks a row gate (5 points per row), exceeds max rank or skips
  a prerequisite, or a build (leveling, variant or level-60) doesn't end on its
  stated split;
- any of the six leveling builds drifts from its source's order, written out
  independently in the verifier, or a level-60 build's split changes;
- a bracket lacks advice for a spec, a trainer override names an unknown spec,
  or a talent spell names no talent;
- a dungeon's range drifts from Blizzard's official one, or a Classic dungeon's
  from the Group Finder's;
- the zone finder (`src/data/world/`) leaves a level without exactly one
  bracket, names a zone where that faction has no hub or whose levels miss the
  bracket, or picks a dungeon out of range;
- a section cites a source or note id that doesn't exist.

`scripts/smoke.ts` checks every page and level page, every internal link and
`#anchor`, assets, the sitemap, bracket links, talent rows, level-60 builds, a block per spec
on every level page, the spec stylesheet, the absence of inline code and, for a
URL, HTTPS headers, the 404 page and `/version.txt`.

## Layout

```
src/data/types.ts                 shared content types (ClassGuide, SpecGuide, ...)
src/data/registry.ts              list of classes; pages are generated from it
src/data/classes/paladin/
  index.ts                        races, milestones, labels, wiring
  route.ts                        level brackets: both factions, race branches, advice per spec
  training.ts                     trainer schedule with per-spec priorities
  quests.ts                       class quests
  talents.ts                      talent trees, three leveling builds, level-60 builds
  holy.ts, protection.ts,         spec pages: leveling sections, dual spec,
  retribution.ts                  level-60 sections and checklist
  overview.ts                     races, professions and tips for every spec
  dungeons.ts                     official ranges (new) and Classic dungeons
  sources.ts                      numbered sources and dated update notes
src/data/classes/druid/           same shape: balance.ts, feral.ts, restoration.ts, forms.ts
src/data/world/index.ts           class-free zone finder: zones, hubs, all 28 dungeons, brackets
src/lib/guide.ts                  level lookups, build expansion, trainer lists, validation
src/components/                   LevelPanel, BracketCard, TalentTable, BuildSummary, ...
src/pages/                        /, /spec-filter.css, /[cls]/... (see above)
src/pages/status.astro            /status/ page; src/scripts/status.ts drives it
public/sw.js                      service worker: shows push alerts, opens /status/
server/                           status tracker (Node, no dependencies, runs as .ts)
  main.ts                         entry point and configuration (environment)
  service.ts                      polling schedule, state on disk, push fan-out
  blizzard.ts                     Blizzard's status GraphQL (persisted query, auto-rediscovered)
  forums.ts                       blue posts and player reports from the Forever forums
  tracker.ts                      ruleset state, confirmed transitions, history
  webpush.ts                      Web Push: RFC 8291 encryption and RFC 8292 VAPID
  http.ts                         /api/status, /api/status/stream (SSE), /api/push/*
scripts/test-status.ts            tracker tests (RFC 8291 test vector, fake Blizzard and push services)
caddy/azerothtrail.com.caddy      the site's Caddy fragment
deploy/                           prepare, cutover and rollback scripts, tracker systemd unit
```

## Server status tracker

The only part of the site that runs on the server. `server/main.ts` polls
`https://worldofwarcraft.blizzard.com/en-us/graphql` (the endpoint behind
Blizzard's [Forever server-status page](https://worldofwarcraft.blizzard.com/en-us/forever/us/server-status))
for the `forever-us`, `-eu`, `-kr` and `-tw` rulesets: every 20 s while any
ruleset is down, every 45 s while all are up, and 8 s after a changed reading.
A change counts only once two readings in a row agree, and is dated from the
first. Blizzard only accepts persisted queries, so when a site build changes
the query hash the tracker reads the new one out of the page's
`realm-status.*.js`.

Supporting sources, every 3 minutes: Blizzard staff posts in the Forever
forum categories (the forum's Blizzard tracker) and new player threads about
downtime in the last hour.

Pages get snapshots over Server-Sent Events (`/api/status/stream`, polling as a
fallback). Alerts use Web Push with no third-party service: the tracker signs
with its own VAPID key and encrypts per RFC 8291 (checked against the RFC's
test vector). Subscriptions are accepted only for known browser push services
(FCM, Mozilla, Apple, Windows), and dropped when the push service says they're
gone. Without background push (some browsers, Brave by default), the page
falls back to notifications while the tab is open; on iOS, alerts need the
page added to the Home Screen.

Environment (all optional): `HOST`/`PORT` (127.0.0.1:4315),
`STATUS_STATE_DIR` (systemd's `STATE_DIRECTORY`, else `.status-data`),
`STATUS_SITE_URL`, `STATUS_ALLOWED_ORIGINS` (origins allowed to POST),
`STATUS_USER_AGENT`.

State lives in `STATUS_STATE_DIR`: `state.json` (ruleset states and history),
`subscriptions.json` (push endpoints and alert settings, nothing else) and
`vapid.json` (the signing key; deleting it invalidates every subscription).

## Adding another class

Mostly a content task:

1. Copy `src/data/classes/paladin/` to `src/data/classes/<class>/` and rewrite
   each file. Keep bracket ids in the form `lvl-<min>-<max>`; they are public
   link targets, so never rename one after publishing.
2. Give the class its `races` (with factions), `trees` and `talents` (row, max
   rank and prerequisites from a launch calculator), and one `SpecGuide` per
   spec: a 10-60 `build`, optional `endgameBuilds`, `dualSpec` advice, leveling
   sections and an `endgame` part. Every bracket needs a `specPlan` entry per
   spec, and trainer spells can override `priority` per spec with `specs`.
   Spec slugs can't be `route`, `quests`, `sources`, `specs`, `level` or
   `endgame`.
3. Add it to `classes` in `src/data/registry.ts`. All pages, the 60 level
   pages, the sitemap and the spec stylesheet are generated for it. Every class
   uses the same copper accent; there are no per-class colours to add.
4. Write each spec's source order into `scripts/verify-content.ts`, then run
   `npm test`.

If a new race id appears, nothing else needs changing: filtering uses the
`data-for` ids from the data files.

### Keeping content honest

- Set `lastVerified` in the class's `index.ts` when you recheck it.
- When newer evidence changes a recommendation, change the data and add an
  `UpdateNote` in `sources.ts` (`update`, `correction`, `uncertain` or
  `confirmed`) with its sources, then link it from the section it affects
  (`notes: [...]`). It also appears on the Sources page.
- Questing brackets are suggestions; dungeon `official` ranges must be
  Blizzard's. Use `null` for a dungeon with no published Forever range.

## Deploying to ubuntu-vm

The site follows the host's static Astro pattern (as xrayservice.net does):
an unprivileged build of a pushed commit, then one locked root transaction that
stages an immutable release, installs the Caddy fragment, validates, switches a
symlink, restarts the status tracker on the new release and reloads Caddy. Caddy obtains the certificate for `azerothtrail.com`
and `www.azerothtrail.com` itself (DNS points straight at the host).

On the server:

| Path | What |
| --- | --- |
| `/home/sawyer/github/azerothtrail` | checkout (same dual-push remote as the Mac) |
| `/home/sawyer/astro-work/azerothtrail-<commit>` | prepared candidate |
| `/srv/www/azerothtrail.com/releases/<commit>/dist` | immutable releases, root-owned |
| `/srv/www/azerothtrail.com/current` | symlink to the live release |
| `/etc/caddy/sites/azerothtrail.com.caddy` | site config, imported by the main Caddyfile |
| `/etc/systemd/system/azerothtrail-status.service` | status tracker (`DynamicUser`, loopback :4315), runs `current/server/main.ts` |
| `/var/lib/azerothtrail-status` | tracker state, push subscriptions and VAPID key (kept across deploys) |
| `/root/azerothtrail-backup-<stamp>-<commit>` | per-deploy rollback state and tools |
| `/var/log/caddy/azerothtrail-access.log` | access log |

### Redeploy

1. On the Mac, commit to `main`, run `npm test`, and `git push origin main`
   (pushes GitHub and Codeberg).
2. Build the candidate on the server as `sawyer` (no lock needed):

   ```sh
   ssh root@ubuntu-vm
   runuser -u sawyer -- git -C /home/sawyer/github/azerothtrail pull --ff-only
   runuser -u sawyer -- /home/sawyer/github/azerothtrail/deploy/prepare.sh
   ```

   `prepare.sh` refuses a dirty tree or a commit that isn't on `origin/main`,
   exports it with `git archive`, runs `npm ci`, `npm run check`, the build and
   the smoke test, and prints the exact cutover command.
3. Cut over as root under the shared lock (the path comes from step 2's output):

   ```sh
   /usr/local/sbin/with-deploy-lock /home/sawyer/astro-work/azerothtrail-COMMIT/deploy/cutover.sh /home/sawyer/astro-work/azerothtrail-COMMIT
   ```

   It rechecks that nothing changed since prepare, saves a backup, stages the
   release, validates the full Caddy config before the switch, restarts the
   status tracker and waits for it, reloads Caddy, checks `/version.txt`, key
   routes and `/api/status/health` over HTTPS through the real hostname, and
   confirms no other site's or service's files changed. Any failure restores the
   previous state automatically. It prints the rollback command.
4. From anywhere: `node scripts/smoke.ts https://azerothtrail.com COMMIT`.

### Roll back

Run the command the cutover printed:

```sh
/usr/local/sbin/with-deploy-lock /root/azerothtrail-backup-STAMP-COMMIT/tools/rollback.sh /root/azerothtrail-backup-STAMP-COMMIT
```

It puts back the release pointer, site file and tracker unit from before that
deploy, restarts the tracker on that release (or removes it, if that deploy
added it) and reloads Caddy. Rolling back the very first deploy removes the site. Releases
are never deleted, so `ls /srv/www/azerothtrail.com/releases` shows what's
available, and `ls -d /root/azerothtrail-backup-*` lists the backups (newest last).
To go back several deploys, use the backup of the oldest deploy you want to undo.

No credentials or keys live in this repository; Caddy manages TLS on the host,
and the tracker generates its VAPID key on first start.

Tracker logs: `journalctl -u azerothtrail-status -f`.
