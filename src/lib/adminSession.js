// Génération / vérification d'un cookie de session admin signé (HMAC-SHA256).
// Compatible Edge Runtime (middleware) et Node.js Runtime (routes API).

const encoder = new TextEncoder();

const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 1000; // 24h

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD manquant côté serveur');
  const issuedAt = Date.now().toString();
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(issuedAt));
  return `${issuedAt}.${bufferToHex(sig)}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const issuedAtNum = Number(issuedAt);
  if (!Number.isFinite(issuedAtNum)) return false;

  const age = Date.now() - issuedAtNum;
  if (age < 0 || age > SESSION_MAX_AGE_MS) return false;

  const key = await hmacKey(secret);
  const expected = await crypto.subtle.sign('HMAC', key, encoder.encode(issuedAt));
  return timingSafeEqual(bufferToHex(expected), signature);
}

export const SESSION_COOKIE = 'admin_auth';
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;
