# Azeroth Trail

A personal World of Warcraft: Forever leveling guide, live at
<https://azerothtrail.com>. The first guide is **Druid, Normal PvE ruleset**:
solo Feral to 60, Bear for occasional dungeons, Restoration from 40 and as the
main group role at 60.

The home page answers "What should I do at my level?" for levels 1-60: where
to quest, what to train or which class quest to do, the next talent point, and
the dungeon worth trying. Faction, starting race and level are remembered in
the browser (localStorage only). Every page is static HTML that reads fine
with JavaScript off; the script only filters and remembers.

## Stack

- Astro 7.4.2, static output, strict TypeScript 6.0.3 (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`), exact dependency pins and a committed
  `package-lock.json`.
- One small client script (`src/scripts/app.ts`) plus `public/boot.js`, which
  applies saved preferences before first paint. No inline scripts or styles, so
  the site runs under a strict `script-src 'self'; style-src 'self'` CSP.
- Node 24.22.1+ (the server runs 24.22.1 via `/opt/astro-runtime`; local Node
  26 also works). The `.ts` scripts run directly with Node's type stripping.

## Local commands

```sh
npm ci                 # install exactly what package-lock.json pins
npm run dev            # dev server at http://127.0.0.1:4321
npm run check          # astro check + tsc + content verification
npm run build          # static site in dist/
npm run preview        # serve dist/ at http://127.0.0.1:4322
npm test               # content verification, build, smoke test of dist/
node scripts/smoke.ts https://azerothtrail.com <commit>   # check the live site
```

`npm run verify` (part of `check`) fails the build when:

- a level from 1 to 60 maps to zero or two route brackets, or brackets leave a gap;
- a talent point breaks a row gate (5 points per row), exceeds max rank or skips
  a prerequisite, or a build doesn't end on its stated split;
- the Druid builds or brackets drift from the PDF's own wording, or a dungeon's
  range drifts from Blizzard's official one;
- a section cites a source or note id that doesn't exist.

`scripts/smoke.ts` checks every page and level page, every internal link and
`#anchor`, assets, the PDF's SHA-256, bracket links, talent rows, the absence
of inline code and, for a URL, HTTPS headers, the 404 page and `/version.txt`.

## Layout

```
src/data/types.ts                 shared content types (ClassGuide and friends)
src/data/registry.ts              list of classes; pages are generated from it
src/data/classes/druid/
  index.ts                        races, milestones, PDF metadata, wiring
  route.ts                        level brackets, both factions, race branches
  training.ts                     trainer schedule with gold-tight priorities
  forms.ts                        forms and class-quest walkthroughs
  talents.ts                      talent trees and both builds
  feral.ts, restoration.ts        spec pages: sections, gear, checklist
  dungeons.ts                     official ranges (new) and Classic dungeons
  sources.ts                      numbered sources and dated update notes
src/lib/guide.ts                  level lookups, build expansion, validation
src/components/                   LevelPanel, BracketCard, TalentTable, ...
src/pages/[cls]/                  /druid/, /route/, /quests/, /<spec>/, /sources/, /level/N/
public/guides/druid/              the original PDF, served for download
caddy/azerothtrail.com.caddy      the site's Caddy fragment
deploy/                           prepare, cutover and rollback scripts
```

## Adding another class

Mostly a content task:

1. Copy `src/data/classes/druid/` to `src/data/classes/<class>/` and rewrite
   each file. Keep bracket ids in the form `lvl-<min>-<max>`; they are public
   link targets, so never rename one after publishing.
2. Give the class its `races` (with factions), `trees` and `talents` (row and
   max rank from a launch calculator), a `leveling` and an `endgame`
   `SpecGuide`, its brackets, trainer schedule, class quests, sources and notes.
3. Add it to `classes` in `src/data/registry.ts`. All pages, including the 60
   level pages, are generated for it at `/<class>/...`.
4. Add class-specific cross-checks to `scripts/verify-content.ts` when there's
   a reference document to hold the data to, then run `npm test`.

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
symlink and reloads Caddy. Caddy obtains the certificate for `azerothtrail.com`
and `www.azerothtrail.com` itself (DNS points straight at the host).

On the server:

| Path | What |
| --- | --- |
| `/home/sawyer/github/azerothtrail` | checkout (same dual-push remote as the Mac) |
| `/home/sawyer/astro-work/azerothtrail-<commit>` | prepared candidate |
| `/srv/www/azerothtrail.com/releases/<commit>/dist` | immutable releases, root-owned |
| `/srv/www/azerothtrail.com/current` | symlink to the live release |
| `/etc/caddy/sites/azerothtrail.com.caddy` | site config, imported by the main Caddyfile |
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
   release, validates the full Caddy config before the switch, reloads Caddy,
   checks `/version.txt` and key routes over HTTPS through the real hostname,
   and confirms no other site's files changed. Any failure restores the
   previous state automatically. It prints the rollback command.
4. From anywhere: `node scripts/smoke.ts https://azerothtrail.com COMMIT`.

### Roll back

Run the command the cutover printed:

```sh
/usr/local/sbin/with-deploy-lock /root/azerothtrail-backup-STAMP-COMMIT/tools/rollback.sh /root/azerothtrail-backup-STAMP-COMMIT
```

It puts back the release pointer and site file from before that deploy and
reloads Caddy. Rolling back the very first deploy removes the site. Releases
are never deleted, so `ls /srv/www/azerothtrail.com/releases` shows what's
available, and `ls -d /root/azerothtrail-backup-*` lists the backups (newest last).
To go back several deploys, use the backup of the oldest deploy you want to undo.

No credentials or keys live in this repository; Caddy manages TLS on the host.
