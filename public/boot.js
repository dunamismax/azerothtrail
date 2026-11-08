// Runs synchronously in <head>: mark JS as available and apply saved
// preferences before first paint. Everything else lives in the bundled app.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var cls = root.getAttribute('data-class');
  if (!cls) return;
  try {
    var raw = window.localStorage.getItem('azerothtrail:v1:' + cls);
    if (!raw) return;
    var p = JSON.parse(raw);
    if (p && typeof p.level === 'number' && p.level >= 1 && p.level <= 60) root.setAttribute('data-level', String(p.level));
    if (p && (p.faction === 'alliance' || p.faction === 'horde')) root.setAttribute('data-faction', p.faction);
    if (p && typeof p.race === 'string' && /^[a-z-]{1,32}$/.test(p.race)) root.setAttribute('data-race', p.race);
    if (p && p.showAll === true) root.setAttribute('data-show-all', '');
  } catch (e) {
    /* storage blocked: defaults apply */
  }
})();
