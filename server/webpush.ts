// Web Push without dependencies: message encryption (RFC 8291, aes128gcm
// from RFC 8188) and VAPID authentication (RFC 8292), on node:crypto only.
import { createECDH, createHmac, createCipheriv, createPrivateKey, generateKeyPairSync, randomBytes, sign, type KeyObject } from 'node:crypto';

export const b64u = {
  encode: (b: Uint8Array): string => Buffer.from(b).toString('base64url'),
  decode: (s: string): Buffer => Buffer.from(s.replace(/\s+/g, ''), 'base64url'),
};

const hmac = (key: Uint8Array, data: Uint8Array): Buffer => createHmac('sha256', key).update(data).digest();

export interface Subscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface EncryptOptions {
  /** Test hooks: fixed sender key and salt (RFC 8291 Appendix A). */
  senderPrivateKey?: Buffer;
  salt?: Buffer;
  recordSize?: number;
}

/** Encrypt a push message body for one subscription (one aes128gcm record). */
export function encrypt(plaintext: Uint8Array, uaPublic: Buffer, authSecret: Buffer, opts: EncryptOptions = {}): Buffer {
  if (uaPublic.length !== 65 || uaPublic[0] !== 0x04) throw new Error('p256dh must be an uncompressed P-256 point');
  if (authSecret.length !== 16) throw new Error('auth secret must be 16 bytes');
  const ecdh = createECDH('prime256v1');
  if (opts.senderPrivateKey) ecdh.setPrivateKey(opts.senderPrivateKey);
  else ecdh.generateKeys();
  const asPublic = ecdh.getPublicKey();
  const ecdhSecret = ecdh.computeSecret(uaPublic);
  const salt = opts.salt ?? randomBytes(16);
  const rs = opts.recordSize ?? 4096;

  // RFC 8291 section 3.4: combine the ECDH secret with the auth secret.
  const prkKey = hmac(authSecret, ecdhSecret);
  const keyInfo = Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic]);
  const ikm = hmac(prkKey, Buffer.concat([keyInfo, Buffer.from([1])]));
  // RFC 8188 section 2.2/2.3: content encryption key and nonce.
  const prk = hmac(salt, ikm);
  const cek = hmac(prk, Buffer.from('Content-Encoding: aes128gcm\0\x01', 'binary')).subarray(0, 16);
  const nonce = hmac(prk, Buffer.from('Content-Encoding: nonce\0\x01', 'binary')).subarray(0, 12);

  const padded = Buffer.concat([plaintext, Buffer.from([2])]); // last-record delimiter, no padding
  if (padded.length + 16 > rs) throw new Error('push message too large for one record');
  const cipher = createCipheriv('aes-128-gcm', cek, nonce);
  const body = Buffer.concat([cipher.update(padded), cipher.final(), cipher.getAuthTag()]);

  const header = Buffer.alloc(16 + 4 + 1);
  salt.copy(header, 0);
  header.writeUInt32BE(rs, 16);
  header.writeUInt8(asPublic.length, 20);
  return Buffer.concat([header, asPublic, body]);
}

export interface VapidKeys {
  publicKey: string; // base64url uncompressed point, given to PushManager.subscribe
  privateJwk: { kty: 'EC'; crv: 'P-256'; x: string; y: string; d: string };
}

export function generateVapidKeys(): VapidKeys {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const jwk = privateKey.export({ format: 'jwk' }) as { x: string; y: string; d: string };
  const publicKey = b64u.encode(Buffer.concat([Buffer.from([4]), b64u.decode(jwk.x), b64u.decode(jwk.y)]));
  return { publicKey, privateJwk: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, d: jwk.d } };
}

export function validVapidKeys(v: unknown): v is VapidKeys {
  const k = v as VapidKeys | null;
  return !!k && typeof k.publicKey === 'string' && b64u.decode(k.publicKey).length === 65 && !!k.privateJwk && typeof k.privateJwk.d === 'string';
}

/** VAPID signer: one cached JWT per push-service origin, renewed well before expiry. */
export class Vapid {
  readonly publicKey: string;
  private readonly key: KeyObject;
  private readonly subject: string;
  private readonly cache = new Map<string, { jwt: string; renewAt: number }>();

  constructor(keys: VapidKeys, subject: string) {
    this.publicKey = keys.publicKey;
    this.key = createPrivateKey({ key: keys.privateJwk, format: 'jwk' });
    this.subject = subject;
  }

  jwt(audience: string, now = Date.now()): string {
    const hit = this.cache.get(audience);
    if (hit && hit.renewAt > now) return hit.jwt;
    const exp = Math.floor(now / 1000) + 12 * 3600; // RFC 8292: at most 24 hours
    const head = b64u.encode(Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
    const claims = b64u.encode(Buffer.from(JSON.stringify({ aud: audience, exp, sub: this.subject })));
    const signature = sign('sha256', Buffer.from(`${head}.${claims}`), { key: this.key, dsaEncoding: 'ieee-p1363' });
    const jwt = `${head}.${claims}.${b64u.encode(signature)}`;
    this.cache.set(audience, { jwt, renewAt: now + 6 * 3600 * 1000 });
    return jwt;
  }

  header(endpoint: string): string {
    return `vapid t=${this.jwt(new URL(endpoint).origin)}, k=${this.publicKey}`;
  }
}

export type SendResult = 'sent' | 'gone' | 'retry' | 'failed';

export interface SendOptions {
  ttl: number; // seconds the push service keeps it for an offline device
  urgency: 'very-low' | 'low' | 'normal' | 'high';
  /** Replaces an undelivered message with the same topic (max 32 base64url chars). */
  topic?: string;
  fetchImpl?: typeof fetch;
}

export async function sendPush(vapid: Vapid, sub: Subscription, payload: unknown, opts: SendOptions): Promise<{ result: SendResult; status: number }> {
  const body = encrypt(Buffer.from(JSON.stringify(payload)), b64u.decode(sub.keys.p256dh), b64u.decode(sub.keys.auth));
  const headers: Record<string, string> = {
    Authorization: vapid.header(sub.endpoint),
    'Content-Encoding': 'aes128gcm',
    'Content-Type': 'application/octet-stream',
    TTL: String(opts.ttl),
    Urgency: opts.urgency,
  };
  if (opts.topic) headers.Topic = opts.topic;
  try {
    const res = await (opts.fetchImpl ?? fetch)(sub.endpoint, { method: 'POST', headers, body: new Uint8Array(body), signal: AbortSignal.timeout(15_000) });
    await res.arrayBuffer().catch(() => undefined);
    if (res.status >= 200 && res.status < 300) return { result: 'sent', status: res.status };
    if (res.status === 404 || res.status === 410) return { result: 'gone', status: res.status };
    if (res.status === 429 || res.status >= 500) return { result: 'retry', status: res.status };
    return { result: 'failed', status: res.status };
  } catch {
    return { result: 'retry', status: 0 };
  }
}

/** Known browser push services. Anything else is refused, so the server never posts to arbitrary hosts. */
const PUSH_HOSTS = ['fcm.googleapis.com', 'android.googleapis.com', 'updates.push.services.mozilla.com', 'push.services.mozilla.com', 'push.apple.com', 'notify.windows.com'];

export function validSubscription(v: unknown): v is Subscription {
  const s = v as Subscription | null;
  if (!s || typeof s.endpoint !== 'string' || s.endpoint.length > 1024 || !s.keys) return false;
  let url: URL;
  try { url = new URL(s.endpoint); } catch { return false; }
  if (url.protocol !== 'https:' || url.port !== '' || url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (!PUSH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return false;
  if (typeof s.keys.p256dh !== 'string' || typeof s.keys.auth !== 'string') return false;
  const p = b64u.decode(s.keys.p256dh);
  return p.length === 65 && p[0] === 0x04 && b64u.decode(s.keys.auth).length === 16;
}
