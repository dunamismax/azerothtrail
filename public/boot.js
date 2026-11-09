// Runs synchronously in <head>: mark JS as available and apply saved
// preferences before first paint. Everything else lives in the bundled app.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var cls = root.getAttribute('data-class');
  if (!cls) return;
  var specs = (root.getAttribute('data-specs') || '').split(' ');
  var spec = root.getAttribute('data-default-spec');
  try {
    var raw = window.localStorage.getItem('azerothtrail:v1:' + cls);
    var p = raw ? JSON.parse(raw) : null;
    if (p && typeof p.level === 'number' && p.level >= 1 && p.level <= 60) root.setAttribute('data-level', String(p.level));
    if (p && (p.faction === 'alliance' || p.faction === 'horde')) root.setAttribute('data-faction', p.faction);
    if (p && typeof p.race === 'string' && /^[a-z-]{1,32}$/.test(p.race)) root.setAttribute('data-race', p.race);
    if (p && p.showAll === true) root.setAttribute('data-show-all', '');
    if (p && typeof p.spec === 'string' && specs.indexOf(p.spec) !== -1) spec = p.spec;
  } catch (e) {
    /* storage blocked: defaults apply */
  }
  // A shared link like /paladin/?spec=holy picks the spec.
  var m = /[?&]spec=([a-z-]{1,32})/.exec(window.location.search);
  if (m && specs.indexOf(m[1]) !== -1) spec = m[1];
  if (spec) root.setAttribute('data-spec', spec);
})();
