// Entry point of the Azeroth Trail status service.
//   node server/main.ts
// Configuration (environment):
//   HOST, PORT                     listen address (default 127.0.0.1:4315)
//   STATUS_STATE_DIR               state, subscriptions and VAPID keys
//                                  (default $STATE_DIRECTORY from systemd, else ./.status-data)
//   STATUS_ALLOWED_ORIGINS         comma-separated origins allowed to POST
//   STATUS_SITE_URL                public site URL (VAPID subject)
//   STATUS_USER_AGENT              User-Agent for requests to Blizzard
import { createStatusServer } from './http.ts';
import { StatusService } from './service.ts';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4315);
const siteUrl = process.env.STATUS_SITE_URL ?? 'https://azerothtrail.com';
const stateDir = process.env.STATUS_STATE_DIR ?? process.env.STATE_DIRECTORY?.split(':')[0] ?? '.status-data';
const allowedOrigins = (process.env.STATUS_ALLOWED_ORIGINS ?? `${siteUrl},http://127.0.0.1:4321,http://localhost:4321,http://127.0.0.1:4322`)
  .split(',').map((s) => s.trim()).filter(Boolean);

const svc = new StatusService({
  stateDir,
  siteUrl,
  vapidSubject: `${siteUrl.replace(/\/$/, '')}/status/`,
  userAgent: process.env.STATUS_USER_AGENT ?? 'Mozilla/5.0 (compatible; realm-status-tracker/1.0)',
  log: (m) => console.log(`[status] ${m}`),
});

const server = createStatusServer(svc, { allowedOrigins });
server.listen(port, host, () => {
  console.log(`[status] listening on http://${host}:${port}, state in ${stateDir}, ${svc.subscriptionCount} push subscriptions`);
  svc.start();
});

const shutdown = () => {
  svc.stop();
  server.close();
  server.closeAllConnections();
  setTimeout(() => process.exit(0), 500).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
