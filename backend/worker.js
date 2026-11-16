const ALLOWED_ORIGINS = new Set([
  'https://goldlexx.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);
const DEFAULT_NAME = 'Жак-Ив Кусто';
const DEFAULT_ABOUT = 'Исследователь';
const DEFAULT_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

const toB64Url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)))
  .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const fromB64Url = (value) => Uint8Array.from(
  atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4)),
  (char) => char.charCodeAt(0),
);
const id = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (n) => n.toString(16).padStart(2, '0')).join('');
const publicUser = ({ _id, name, about, avatar, email }) => ({ _id, name, about, avatar, email });
const isValidUrl = (value) => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};
const validId = (value) => /^[a-f\d]{24}$/i.test(value);

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: fromB64Url(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return toB64Url(bits);
}

async function makeToken(userId, secret) {
  const header = toB64Url(new TextEncoder().encode('{"alg":"HS256","typ":"JWT"}'));
  const payload = toB64Url(new TextEncoder().encode(JSON.stringify({ _id: userId, exp: Math.floor(Date.now() / 1000) + 604800 })));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${payload}`));
  return `${header}.${payload}.${toB64Url(signature)}`;
}

async function authenticate(request, env) {
  const match = request.headers.get('Authorization')?.match(/^Bearer ([\w.-]+)$/);
  if (!match || !env.JWT_SECRET) throw new HttpError(401, 'Необходима авторизация');
  try {
    const [header, payload, signature] = match[1].split('.');
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, fromB64Url(signature), new TextEncoder().encode(`${header}.${payload}`));
    const claims = JSON.parse(new TextDecoder().decode(fromB64Url(payload)));
    if (!valid || !claims._id || claims.exp <= Date.now() / 1000) throw new Error('invalid token');
    return claims._id;
  } catch { throw new HttpError(401, 'Необходима авторизация'); }
}

async function bodyOf(request) {
  try { return await request.json(); } catch { throw new HttpError(400, 'Некорректный JSON'); }
}

async function getCard(db, cardId) {
  const card = await db.prepare('SELECT _id, name, link, owner, created_at AS createdAt FROM cards WHERE _id = ?').bind(cardId).first();
  if (!card) throw new HttpError(404, 'Карточка с таким ID - не найдена');
  const { results } = await db.prepare('SELECT user_id FROM card_likes WHERE card_id = ?').bind(cardId).all();
  return { ...card, likes: results.map((row) => row.user_id) };
}

async function route(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method;
  const db = env.DB;

  if (method === 'POST' && path === '/signup') {
    const input = await bodyOf(request);
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const password = input.password;
    if (!/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) throw new HttpError(400, 'Некорректные данные пользователя');
    const user = {
      _id: id(), name: input.name ?? DEFAULT_NAME, about: input.about ?? DEFAULT_ABOUT,
      avatar: input.avatar ?? DEFAULT_AVATAR, email,
    };
    if (typeof user.name !== 'string' || user.name.length < 2 || user.name.length > 30
      || typeof user.about !== 'string' || user.about.length < 2 || user.about.length > 30
      || typeof user.avatar !== 'string' || !isValidUrl(user.avatar)) throw new HttpError(400, 'Некорректные данные пользователя');
    const salt = toB64Url(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword(password, salt);
    try {
      await db.prepare('INSERT INTO users (_id,name,about,avatar,email,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?,?,?)')
        .bind(user._id, user.name, user.about, user.avatar, user.email, passwordHash, salt, new Date().toISOString()).run();
    } catch (error) {
      if (/unique|constraint/i.test(error.message)) throw new HttpError(409, 'Пользователь с таким email уже существует');
      throw error;
    }
    return [user, 201];
  }

  if (method === 'POST' && path === '/signin') {
    const input = await bodyOf(request);
    const user = await db.prepare('SELECT _id,password_hash,password_salt FROM users WHERE email = ?').bind(String(input.email || '').trim().toLowerCase()).first();
    if (!user || typeof input.password !== 'string' || await hashPassword(input.password, user.password_salt) !== user.password_hash) throw new HttpError(401, 'Неправильные почта или пароль');
    return [{ token: await makeToken(user._id, env.JWT_SECRET) }, 200];
  }

  const userId = await authenticate(request, env);
  if (method === 'GET' && path === '/users') {
    const { results } = await db.prepare('SELECT _id,name,about,avatar,email FROM users').all();
    return [results, 200];
  }
  if (method === 'GET' && path === '/users/me') {
    const user = await db.prepare('SELECT _id,name,about,avatar,email FROM users WHERE _id = ?').bind(userId).first();
    if (!user) throw new HttpError(404, 'Пользователь не найден');
    return [user, 200];
  }
  const userMatch = path.match(/^\/users\/([a-f\d]{24})$/i);
  if (method === 'GET' && userMatch) {
    const user = await db.prepare('SELECT _id,name,about,avatar,email FROM users WHERE _id = ?').bind(userMatch[1]).first();
    if (!user) throw new HttpError(404, 'Пользователь с таким ID - не найден');
    return [user, 200];
  }
  if (method === 'PATCH' && path === '/users/me') {
    const input = await bodyOf(request);
    if (typeof input.name !== 'string' || input.name.length < 2 || input.name.length > 30
      || typeof input.about !== 'string' || input.about.length < 2 || input.about.length > 30) throw new HttpError(400, 'Некорректные данные пользователя');
    await db.prepare('UPDATE users SET name = ?, about = ? WHERE _id = ?').bind(input.name, input.about, userId).run();
    return [await db.prepare('SELECT _id,name,about,avatar,email FROM users WHERE _id = ?').bind(userId).first(), 200];
  }
  if (method === 'PATCH' && path === '/users/me/avatar') {
    const input = await bodyOf(request);
    if (typeof input.avatar !== 'string' || !isValidUrl(input.avatar)) throw new HttpError(400, 'Некорректная ссылка на аватар');
    await db.prepare('UPDATE users SET avatar = ? WHERE _id = ?').bind(input.avatar, userId).run();
    return [await db.prepare('SELECT _id,name,about,avatar,email FROM users WHERE _id = ?').bind(userId).first(), 200];
  }

  if (method === 'GET' && path === '/cards') {
    const { results: cards } = await db.prepare('SELECT _id,name,link,owner,created_at AS createdAt FROM cards ORDER BY created_at DESC').all();
    const { results: likes } = await db.prepare('SELECT card_id,user_id FROM card_likes').all();
    const likesByCard = new Map();
    for (const like of likes) likesByCard.set(like.card_id, [...(likesByCard.get(like.card_id) || []), like.user_id]);
    return [cards.map((card) => ({ ...card, likes: likesByCard.get(card._id) || [] })), 200];
  }
  if (method === 'POST' && path === '/cards') {
    const input = await bodyOf(request);
    if (typeof input.name !== 'string' || input.name.length < 2 || input.name.length > 30 || typeof input.link !== 'string' || !isValidUrl(input.link)) throw new HttpError(400, 'Некорректные данные карточки');
    const cardId = id();
    const createdAt = new Date().toISOString();
    await db.prepare('INSERT INTO cards (_id,name,link,owner,created_at) VALUES (?,?,?,?,?)').bind(cardId, input.name, input.link, userId, createdAt).run();
    return [{ _id: cardId, name: input.name, link: input.link, owner: userId, likes: [], createdAt }, 201];
  }
  const cardMatch = path.match(/^\/cards\/([a-f\d]{24})(?:\/(likes))?$/i);
  if (cardMatch && !validId(cardMatch[1])) throw new HttpError(400, 'Некорректный ID карточки');
  if (cardMatch && cardMatch[2] === 'likes' && ['PUT', 'DELETE'].includes(method)) {
    const exists = await db.prepare('SELECT _id FROM cards WHERE _id = ?').bind(cardMatch[1]).first();
    if (!exists) throw new HttpError(404, 'Карточка с таким ID - не найдена');
    if (method === 'PUT') await db.prepare('INSERT OR IGNORE INTO card_likes (card_id,user_id) VALUES (?,?)').bind(cardMatch[1], userId).run();
    else await db.prepare('DELETE FROM card_likes WHERE card_id = ? AND user_id = ?').bind(cardMatch[1], userId).run();
    return [await getCard(db, cardMatch[1]), 200];
  }
  if (cardMatch && !cardMatch[2] && method === 'DELETE') {
    const card = await db.prepare('SELECT _id,owner,name,link,created_at AS createdAt FROM cards WHERE _id = ?').bind(cardMatch[1]).first();
    if (!card) throw new HttpError(404, 'Карточка с таким ID - не найдена');
    if (card.owner !== userId) throw new HttpError(403, 'Нельзя удалить чужую карточку');
    const { results: likes } = await db.prepare('SELECT user_id FROM card_likes WHERE card_id = ?').bind(cardMatch[1]).all();
    await db.prepare('DELETE FROM cards WHERE _id = ?').bind(cardMatch[1]).run();
    return [{ ...card, likes: likes.map((row) => row.user_id) }, 200];
  }
  throw new HttpError(404, 'Запрашиваемый ресурс не найден');
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get('Origin') || '';
    const origin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : 'https://goldlexx.github.io';
    if (requestOrigin && !ALLOWED_ORIGINS.has(requestOrigin)) return json({ message: 'Origin is not allowed' }, 403, origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400', Vary: 'Origin',
    } });
    try {
      if (!['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) throw new HttpError(405, 'Метод не поддерживается');
      const [data, status] = await route(request, env);
      return json(data, status, origin);
    } catch (error) {
      console.error('Mesto API request failed', error);
      return json({ message: error instanceof HttpError ? error.message : 'Внутренняя ошибка сервера' }, error.status || 500, origin);
    }
  },
};
