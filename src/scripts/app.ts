// Progressive enhancement for every page. The HTML is complete without it:
// this script only filters by spec, faction and race, follows the chosen level
// and remembers preferences in this browser (localStorage).

type Faction = 'alliance' | 'horde';

interface Prefs {
  level: number;
  spec: string | null;
  faction: Faction | null;
  race: string | null;
  showAll: boolean;
  checks: Record<string, boolean>;
}

const root = document.documentElement;
const cls = root.dataset.class ?? '';
const KEY = `azerothtrail:v1:${cls}`;
const LAST_KEY = 'azerothtrail:v1:last';
const SPECS = (root.dataset.specs ?? '').split(' ').filter(Boolean);
const DEFAULT_SPEC = root.dataset.defaultSpec ?? null;

function clampLevel(n: number): number {
  return Number.isFinite(n) ? Math.min(60, Math.max(1, Math.round(n))) : 1;
}

function readPrefs(key: string, specs: readonly string[]): Prefs {
  const prefs: Prefs = { level: 1, spec: null, faction: null, race: null, showAll: false, checks: {} };
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Prefs>;
      if (typeof p.level === 'number') prefs.level = clampLevel(p.level);
      if (typeof p.spec === 'string' && specs.includes(p.spec)) prefs.spec = p.spec;
      if (p.faction === 'alliance' || p.faction === 'horde') prefs.faction = p.faction;
      if (typeof p.race === 'string') prefs.race = p.race;
      prefs.showAll = p.showAll === true;
      if (p.checks && typeof p.checks === 'object') prefs.checks = p.checks;
    }
  } catch {
    // Storage unavailable or corrupt: defaults.
  }
  return prefs;
}

function load(): Prefs {
  return readPrefs(KEY, SPECS);
}

function save(p: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Private mode or blocked storage: keep working for this page view.
  }
}

const prefs = load();
if (cls) {
  try {
    localStorage.setItem(LAST_KEY, cls);
  } catch {
    // Storage blocked.
  }
}

// A shared link like /druid/?level=37&spec=balance sets the level and spec once.
const query = new URLSearchParams(location.search);
const fromQuery = query.get('level');
if (fromQuery !== null && /^\d{1,2}$/.test(fromQuery)) {
  prefs.level = clampLevel(Number(fromQuery));
  save(prefs);
}
const specQuery = query.get('spec');
if (specQuery !== null && SPECS.includes(specQuery)) {
  prefs.spec = specQuery;
  save(prefs);
}
const currentSpec = (): string | null => prefs.spec ?? DEFAULT_SPEC;

/** Show only the chosen spec's blocks. The generated spec-filter.css does the hiding. */
function applySpec(): void {
  const spec = currentSpec();
  if (spec) root.dataset.spec = spec;
  else delete root.dataset.spec;
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="spec"]')) input.checked = input.value === spec;
  for (const a of document.querySelectorAll<HTMLElement>('[data-spec-link]')) a.classList.toggle('is-mine', a.dataset.specLink === spec);
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-set-spec]')) {
    const mine = btn.dataset.setSpec === spec;
    btn.setAttribute('aria-pressed', String(mine));
    const name = document.querySelector<HTMLElement>(`[data-spec-id="${CSS.escape(btn.dataset.setSpec ?? '')}"]`)?.dataset.specName ?? '';
    btn.textContent = mine ? `${name} is your spec on the level pages` : `Use ${name} on the level pages`;
  }
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-my-spec-href]')) {
    if (spec) a.href = (a.dataset.mySpecHref ?? '').replace('{spec}', spec);
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-my-spec-name]')) {
    const name = document.querySelector<HTMLElement>(`[data-spec-id="${CSS.escape(spec ?? '')}"]`)?.dataset.specName;
    if (name) el.textContent = name;
  }
}

function setSpec(spec: string): void {
  if (!SPECS.includes(spec)) return;
  prefs.spec = spec;
  save(prefs);
  applySpec();
}

// On a per-level page, that page's level is the one to follow.
const pageLevel = document.body.dataset.pageLevel;
const followLevel = (): number => (pageLevel ? clampLevel(Number(pageLevel)) : prefs.level);

// The layout lists the class's races as hidden <span data-race-id> elements.
function raceFaction(race: string | null): Faction | null {
  if (!race) return null;
  const f = document.querySelector<HTMLElement>(`[data-race-id="${CSS.escape(race)}"]`)?.dataset.faction;
  return f === 'alliance' || f === 'horde' ? f : null;
}

// Drop a stored race this class doesn't have (e.g. after content changes).
if (prefs.race && raceFaction(prefs.race) === null) prefs.race = null;

/** Show elements whose data-for lists the chosen faction or race (or that have no data-for). */
function applyFilters(): void {
  const showAll = prefs.showAll || (!prefs.faction && !prefs.race);
  root.toggleAttribute('data-show-all', prefs.showAll);
  if (prefs.faction) root.dataset.faction = prefs.faction;
  else delete root.dataset.faction;
  if (prefs.race) root.dataset.race = prefs.race;
  else delete root.dataset.race;

  for (const el of document.querySelectorAll<HTMLElement>('[data-for]')) {
    const ids = (el.dataset.for ?? '').split(' ').filter(Boolean);
    const raceOnly = ids.every((id) => id !== 'alliance' && id !== 'horde');
    const visible =
      showAll ||
      (prefs.race !== null && ids.includes(prefs.race)) ||
      (prefs.faction !== null && ids.includes(prefs.faction)) ||
      (prefs.race === null && raceOnly);
    el.classList.toggle('pref-hidden', !visible);
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-filter-summary]')) {
    const parts: string[] = [];
    if (prefs.showAll) parts.push('Showing every faction and race');
    else {
      const race = document.querySelector<HTMLElement>(`[data-race-id="${CSS.escape(prefs.race ?? '')}"]`)?.dataset.raceName;
      if (race) parts.push(`Showing ${race}`);
      else if (prefs.faction) parts.push(`Showing ${prefs.faction === 'alliance' ? 'Alliance' : 'Horde'}`);
      else parts.push('Showing every faction and race');
    }
    el.textContent = parts.join('');
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-toggle-show-all]')) {
    btn.setAttribute('aria-pressed', String(prefs.showAll));
    btn.textContent = prefs.showAll ? 'Show only my faction and race' : 'Show every faction and race';
    btn.hidden = !prefs.faction && !prefs.race;
  }
}

function applyLevel(): void {
  const level = followLevel();
  root.dataset.level = String(level);

  // Home: show the panel for the chosen level.
  const panels = document.querySelectorAll<HTMLElement>('[data-level-panel]');
  for (const panel of panels) panel.hidden = panel.dataset.levelPanel !== String(level);

  for (const el of document.querySelectorAll<HTMLElement>('[data-level-text]')) el.textContent = String(level);

  // Talent tables: highlight the row for this level.
  for (const row of document.querySelectorAll<HTMLElement>('tr[data-level]')) {
    const current = row.dataset.level === String(level);
    row.classList.toggle('is-current', current);
    if (current) row.setAttribute('aria-current', 'true');
    else row.removeAttribute('aria-current');
  }
  // Route: mark the current bracket.
  for (const el of document.querySelectorAll<HTMLElement>('[data-min][data-max]')) {
    const current = level >= Number(el.dataset.min) && level <= Number(el.dataset.max);
    el.classList.toggle('is-current', current);
  }
  // Level grids.
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-level-link]')) {
    if (a.dataset.levelLink === String(level)) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
  // "Jump to my level" links.
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-jump-level]')) {
    const target = document.querySelector<HTMLElement>(`${a.dataset.jumpLevel ?? ''}[data-level="${level}"]`);
    if (target?.id) a.href = `#${target.id}`;
  }
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-jump-bracket]')) {
    const target = [...document.querySelectorAll<HTMLElement>('.bracket[data-min]')].find(
      (b) => level >= Number(b.dataset.min) && level <= Number(b.dataset.max),
    );
    if (target?.id) a.href = `#${target.id}`;
  }

  const select = document.querySelector<HTMLSelectElement>('#pref-level');
  if (select && select.value !== String(level)) select.value = String(level);
}

function syncControls(): void {
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="faction"]')) input.checked = input.value === prefs.faction;
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="race"]')) {
    const allowed = !prefs.faction || input.dataset.faction === prefs.faction;
    const label = input.closest<HTMLElement>('.choice');
    if (label) label.hidden = !allowed;
    input.checked = allowed && input.value === prefs.race;
  }
}

function setLevel(level: number): void {
  prefs.level = clampLevel(level);
  save(prefs);
  applyLevel();
}

function initControls(): void {
  const select = document.querySelector<HTMLSelectElement>('#pref-level');
  select?.addEventListener('change', () => setLevel(Number(select.value)));
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-level-step]')) {
    btn.addEventListener('click', () => setLevel(prefs.level + Number(btn.dataset.levelStep)));
  }
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="faction"]')) {
    input.addEventListener('change', () => {
      prefs.faction = input.value === 'horde' ? 'horde' : 'alliance';
      if (prefs.race && raceFaction(prefs.race) !== prefs.faction) {
        const first = document.querySelector<HTMLInputElement>(`input[name="race"][data-faction="${prefs.faction}"]`);
        prefs.race = first?.value ?? null;
      }
      save(prefs);
      syncControls();
      applyFilters();
    });
  }
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="race"]')) {
    input.addEventListener('change', () => {
      prefs.race = input.value;
      prefs.faction = raceFaction(input.value) ?? prefs.faction;
      save(prefs);
      syncControls();
      applyFilters();
    });
  }
  for (const input of document.querySelectorAll<HTMLInputElement>('input[name="spec"]')) {
    input.addEventListener('change', () => setSpec(input.value));
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-set-spec]')) {
    btn.addEventListener('click', () => setSpec(btn.dataset.setSpec ?? ''));
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-toggle-show-all]')) {
    btn.addEventListener('click', () => {
      prefs.showAll = !prefs.showAll;
      save(prefs);
      applyFilters();
    });
  }
  // On the home page, level links switch the panel in place instead of navigating.
  if (document.querySelector('[data-level-panel]')) {
    for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-level-link]')) {
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        setLevel(Number(a.dataset.levelLink));
        document.querySelector<HTMLElement>('#now')?.scrollIntoView({ block: 'start' });
        select?.focus({ preventScroll: true });
      });
    }
  }
  // Checklists.
  for (const box of document.querySelectorAll<HTMLInputElement>('input[data-check-id]')) {
    const id = box.dataset.checkId ?? '';
    box.checked = prefs.checks[id] === true;
    box.addEventListener('change', () => {
      prefs.checks[id] = box.checked;
      save(prefs);
    });
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-reset-checks]')) {
    btn.addEventListener('click', () => {
      prefs.checks = {};
      save(prefs);
      for (const box of document.querySelectorAll<HTMLInputElement>('input[data-check-id]')) box.checked = false;
    });
  }
}

// If no faction is saved yet but a race is, derive it.
if (!prefs.faction && prefs.race) prefs.faction = raceFaction(prefs.race);

/** Home page: offer to pick up where the visitor left off. */
function applyContinue(): void {
  const box = document.querySelector<HTMLElement>('[data-continue]');
  if (!box) return;
  let last: string | null = null;
  try {
    last = localStorage.getItem(LAST_KEY);
  } catch {
    return;
  }
  const card = last ? document.querySelector<HTMLElement>(`[data-class-card="${CSS.escape(last)}"]`) : null;
  if (!last || !card) return;
  const specs = (card.dataset.classSpecs ?? '').split(' ').filter(Boolean);
  const p = readPrefs(`azerothtrail:v1:${last}`, specs);
  const spec = p.spec ?? card.dataset.classDefaultSpec ?? '';
  const specName = card.querySelector<HTMLElement>(`[data-spec-card="${CSS.escape(spec)}"]`)?.dataset.specName ?? '';
  const link = box.querySelector<HTMLAnchorElement>('a');
  const text = box.querySelector<HTMLElement>('[data-continue-text]');
  if (!link || !text) return;
  link.href = `/${last}/`;
  text.textContent = `${card.dataset.className ?? last}${specName ? ` · ${specName}` : ''} · level ${p.level}`;
  box.hidden = false;
}

initControls();
syncControls();
applyFilters();
applySpec();
applyLevel();
applyContinue();

// Header status dot: one quiet read of the status service on guide pages
// (the status page keeps it live itself). Missing service: the dot stays hollow.
async function headerStatus(): Promise<void> {
  const dots = document.querySelectorAll<HTMLElement>('[data-status-dot]');
  if (dots.length === 0 || document.querySelector('[data-status-app]')) return;
  try {
    const res = await fetch('/api/status', { cache: 'no-store' });
    if (!res.ok) return;
    const snap = (await res.json()) as { regions?: { key: string; state: string; name: string }[] };
    let region = 'us';
    try {
      const saved = JSON.parse(localStorage.getItem('azerothtrail:v1:status') ?? 'null') as { region?: string } | null;
      if (saved?.region && /^(us|eu|kr|tw)$/.test(saved.region)) region = saved.region;
    } catch { /* default region */ }
    const r = snap.regions?.find((x) => x.key === region);
    if (!r || !/^(online|offline|partial|unknown)$/.test(r.state)) return;
    const label = { online: 'up', offline: 'down', partial: 'partly up', unknown: 'unknown' }[r.state];
    for (const dot of dots) {
      dot.dataset.state = r.state;
      dot.closest('a')?.setAttribute('title', `WoW Forever servers (${r.name}): ${label}`);
    }
  } catch {
    /* offline or no status service */
  }
}
void headerStatus();
