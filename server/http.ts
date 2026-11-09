// HTTP API for the status page. Bound to loopback; Caddy proxies /api/* to it.
//   GET  /api/status            current snapshot (JSON)
//   GET  /api/status/stream     live snapshots (Server-Sent Events)
//   GET  /api/status/health     liveness for the deploy checks
//   GET  /api/push/key          VAPID public key
//   POST /api/push/subscribe    { subscription, prefs }
//   POST /api/push/prefs        { endpoint } -> saved prefs
//   POST /api/push/unsubscribe  { endpoint }
//   POST /api/push/resubscribe  { oldEndpoint, subscription } (service worker)
//   POST /api/push/test         { endpoint }
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { DEFAULT_PREFS, validPrefs, type StatusService } from './service.ts';
import { validSubscription } from './webpush.ts';

export interface HttpOptions {
  allowedOrigins: string[];
  maxStreams?: number;
}

const MAX_BODY = 8 * 1024;

function send(res: ServerResponse, status: number, body: unknown, extra: Record<string, string> = {}): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Length': Buffer.byteLength(json),
    ...extra,
  });
  res.end(json);
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  if (!/^application\/json\b/i.test(req.headers['content-type'] ?? '')) throw new HttpError(415, 'expected application/json');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new HttpError(413, 'body too large');
    chunks.push(chunk as Buffer);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new HttpError(400, 'invalid JSON'); }
}

class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** A small per-client token bucket for POSTs. */
class RateLimit {
  private readonly buckets = new Map<string, { tokens: number; at: number }>();
  private readonly perMinute: number;
  constructor(perMinute: number) {
    this.perMinute = perMinute;
  }
  allow(key: string, now = Date.now()): boolean {
    const b = this.buckets.get(key) ?? { tokens: this.perMinute, at: now };
    b.tokens = Math.min(this.perMinute, b.tokens + ((now - b.at) / 60_000) * this.perMinute);
    b.at = now;
    if (this.buckets.size > 10_000) this.buckets.clear();
    this.buckets.set(key, b);
    if (b.tokens < 1) return false;
    b.tokens -= 1;
    return true;
  }
}

function clientKey(req: IncomingMessage): string {
  // Caddy sets X-Forwarded-For; the service only listens on loopback.
  const xff = req.headers['x-forwarded-for'];
  const first = (Array.isArray(xff) ? xff[0] : xff)?.split(',')[0]?.trim();
  return first || req.socket.remoteAddress || 'unknown';
}

export function createStatusServer(svc: StatusService, opts: HttpOptions): Server {
  const limit = new RateLimit(30);
  const maxStreams = opts.maxStreams ?? 5000;

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname.replace(/\/+$/, '') || '/';
    try {
      if (req.method === 'GET' || req.method === 'HEAD') {
        if (path === '/api/status') return send(res, 200, svc.snapshot());
        if (path === '/api/status/health') return send(res, 200, { ok: true, streams: svc.listenerCount });
        if (path === '/api/push/key') return send(res, 200, { publicKey: svc.vapid.publicKey });
        if (path === '/api/status/stream') return stream(req, res);
        return send(res, 404, { error: 'not found' });
      }
      if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' }, { Allow: 'GET, HEAD, POST' });

      const origin = req.headers.origin;
      if (origin && !opts.allowedOrigins.includes(origin)) return send(res, 403, { error: 'origin not allowed' });
      if (!limit.allow(clientKey(req))) return send(res, 429, { error: 'slow down' }, { 'Retry-After': '30' });
      const body = (await readJson(req)) as Record<string, unknown> | null;
      if (!body || typeof body !== 'object') throw new HttpError(400, 'expected an object');

      if (path === '/api/push/subscribe') {
        if (!validSubscription(body.subscription)) throw new HttpError(400, 'unsupported push subscription');
        const prefs = body.prefs === undefined ? DEFAULT_PREFS : validPrefs(body.prefs);
        if (!prefs) throw new HttpError(400, 'pick at least one region');
        const r = svc.addSubscription(body.subscription, prefs);
        if (r === 'full') return send(res, 503, { error: 'too many subscriptions' });
        return send(res, 200, { ok: true, result: r, prefs });
      }
      const endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
      if (path === '/api/push/unsubscribe') return send(res, 200, { ok: true, removed: svc.removeSubscription(endpoint) });
      if (path === '/api/push/prefs') {
        const prefs = svc.getPrefs(endpoint);
        return send(res, prefs ? 200 : 404, prefs ? { ok: true, prefs } : { error: 'unknown subscription' });
      }
      if (path === '/api/push/test') {
        const r = await svc.sendTest(endpoint);
        const status = r === 'sent' ? 200 : r === 'unknown' ? 404 : r === 'too-soon' ? 429 : 502;
        return send(res, status, { ok: r === 'sent', result: r });
      }
      if (path === '/api/push/resubscribe') {
        if (typeof body.oldEndpoint !== 'string' || !validSubscription(body.subscription)) throw new HttpError(400, 'bad resubscribe');
        return send(res, 200, { ok: svc.replaceSubscription(body.oldEndpoint, body.subscription) });
      }
      return send(res, 404, { error: 'not found' });
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      console.error(err);
      if (!res.headersSent) send(res, 500, { error: 'internal error' });
      else res.end();
    }
  });

  function stream(req: IncomingMessage, res: ServerResponse): void {
    if (svc.listenerCount >= maxStreams) return send(res, 503, { error: 'busy' }, { 'Retry-After': '30' });
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.socket?.setNoDelay(true);
    const write = (s: string) => { if (!res.writableEnded) res.write(s); };
    write('retry: 5000\n\n');
    const push = (snap: unknown) => write(`event: status\ndata: ${JSON.stringify(snap)}\n\n`);
    push(svc.snapshot());
    const unsubscribe = svc.subscribe(push);
    const ping = setInterval(() => write(': ping\n\n'), 25_000);
    const close = () => { clearInterval(ping); unsubscribe(); };
    req.on('close', close);
    res.on('error', close);
  }

  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 70_000;
  server.requestTimeout = 0; // streams stay open
  return server;
}
