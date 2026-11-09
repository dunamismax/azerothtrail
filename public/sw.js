// Azeroth Trail service worker: shows server-status alerts sent by Web Push
// and opens the status page when one is clicked. It caches nothing.
'use strict';

var DEFAULT_URL = '/status/';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Only this site's pages and Blizzard's forums may be opened from an alert.
function safeUrl(url) {
  if (typeof url !== 'string') return DEFAULT_URL;
  if (/^\/[a-z0-9/_-]*$/i.test(url)) return url;
  if (url.indexOf('https://us.forums.blizzard.com/') === 0) return url;
  return DEFAULT_URL;
}

self.addEventListener('push', function (event) {
  var msg = {};
  try {
    msg = event.data ? event.data.json() : {};
  } catch (e) {
    msg = { body: event.data ? event.data.text() : '' };
  }
  var title = typeof msg.title === 'string' && msg.title ? msg.title : 'WoW Forever server status';
  var options = {
    body: typeof msg.body === 'string' ? msg.body : '',
    tag: typeof msg.tag === 'string' && msg.tag ? msg.tag : 'status',
    renotify: true,
    icon: '/icons/status-192.png',
    badge: '/icons/badge-72.png',
    timestamp: Date.parse(msg.at) || Date.now(),
    requireInteraction: msg.kind === 'up',
    data: { url: safeUrl(msg.url) },
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(function () {
      // Let open status pages react (the chime) without a second notification.
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
        clients.forEach(function (c) {
          c.postMessage({ type: 'push', kind: msg.kind });
        });
      });
    }),
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = safeUrl(event.notification.data && event.notification.data.url);
  var target = new URL(url, self.location.origin);
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
      for (var i = 0; i < clients.length; i++) {
        var c = clients[i];
        var u = new URL(c.url);
        if (u.origin === target.origin && u.pathname === target.pathname && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(target.href);
    }),
  );
});

// The browser rotated the push subscription: carry the alert settings over.
self.addEventListener('pushsubscriptionchange', function (event) {
  var oldEndpoint = event.oldSubscription && event.oldSubscription.endpoint;
  event.waitUntil(
    fetch('/api/push/key', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (k) {
        var s = k.publicKey.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        var bin = atob(s);
        var key = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) key[i] = bin.charCodeAt(i);
        return self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
      })
      .then(function (sub) {
        if (!oldEndpoint) return;
        return fetch('/api/push/resubscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ oldEndpoint: oldEndpoint, subscription: sub.toJSON() }),
        });
      })
      .catch(function () {}),
  );
});
