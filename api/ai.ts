import { GoogleGenAI } from '@google/genai';

type Action = 'summary' | 'insight' | 'events';

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const LEAN_CONFIG = { thinkingConfig: { thinkingBudget: 0 } };

const CACHE_TTL_MS: Record<Action, number> = {
  summary: 15 * 60 * 1000,
  insight: 4 * 60 * 60 * 1000,
  events: 6 * 60 * 60 * 1000,
};

const cache = new Map<string, { expiresAt: number; value: unknown }>();
const rate = new Map<string, { resetAt: number; count: number }>();

function sendJson(res: any, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readJson(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise(resolve => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
      if (body.length > 20_000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function clientKey(req: any): string {
  const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(req: any): boolean {
  const key = clientKey(req);
  const now = Date.now();
  const current = rate.get(key);
  if (!current || current.resetAt <= now) {
    rate.set(key, { resetAt: now + 60_000, count: 1 });
    return true;
  }
  if (current.count >= 12) return false;
  current.count += 1;
  return true;
}

function cacheKey(action: Action, payload: any): string {
  if (action === 'summary') {
    return `${action}:${payload.title ?? ''}:${String(payload.content ?? '').slice(0, 300)}`;
  }
  if (action === 'insight') return `${action}:${payload.topic ?? ''}`;
  return action;
}

function cached(key: string): unknown | null {
  const hit = cache.get(key);
  if (!hit || hit.expiresAt <= Date.now()) return null;
  return hit.value;
}

function setCached(action: Action, key: string, value: unknown) {
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS[action], value });
}

function extractJson(text: string, startChar: string, endChar: string): string {
  const start = text.indexOf(startChar);
  const end = text.lastIndexOf(endChar);
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON payload in model response');
  return text.substring(start, end + 1);
}

function isGameEvent(value: unknown): value is { event_name: string; description?: string; subtitle?: string } {
  return Boolean(value && typeof value === 'object' && typeof (value as any).event_name === 'string');
}

function isLiveEvents(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return [
    'destiny2',
    'phasmophobia',
    'theisle',
    'rainbow6siege',
    'forhonor',
    'dota2',
    'helldivers2',
    'marvelrivals',
    'poe2',
  ].every(key => isGameEvent(data[key]));
}

async function generate(action: Action, payload: any) {
  if (!API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  if (action === 'summary') {
    const title = String(payload.title ?? '').slice(0, 220);
    const content = String(payload.content ?? '').slice(0, 300);
    if (!title || !content) throw new Error('Missing title or content');

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: LEAN_CONFIG,
      contents: `Kinetic AI. 3 bullet points (<=80 words total) for a tech/gaming enthusiast.\nTitle: ${title}\nContext: ${content}`,
    });
    return { text: response.text ?? null };
  }

  if (action === 'insight') {
    const topic = String(payload.topic ?? '').slice(0, 180);
    if (!topic) throw new Error('Missing topic');

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `3 punchy insider facts (<=60 words total) about "${topic}" for a hardcore gamer / tech enthusiast. Numbered list only, no intro text.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text ?? null };
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Return ONLY a JSON object (no markdown) with the current active in-game events for these 9 live-service games. Search each game's official site or Steam news page.
Games: Destiny 2 (Bungie.net), Phasmophobia (kineticgames.co.uk), The Isle (theisle-game.com), Rainbow Six Siege (ubisoft.com), For Honor (ubisoft.com), Dota 2 (dota2.com), Helldivers 2 (helldivers.com current Major Order / Galactic War state), Marvel Rivals (marvelrivals.com current ranked season + any live event), Path of Exile 2 (pathofexile2.com current league name + headline mechanic).
Format exactly:
{"destiny2":{"event_name":"...","description":"1-2 sentences player-benefit focused","subtitle":"2-3 words"},"phasmophobia":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"theisle":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"rainbow6siege":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"forhonor":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"dota2":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"helldivers2":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"marvelrivals":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"poe2":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"}}`,
    config: { tools: [{ googleSearch: {} }] },
  });

  const parsed = JSON.parse(extractJson(response.text ?? '', '{', '}'));
  if (!isLiveEvents(parsed)) throw new Error('Invalid live events payload');
  return { events: parsed };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!checkRateLimit(req)) {
    return sendJson(res, 429, { error: 'Too many AI requests. Try again in a minute.' });
  }

  const body = await readJson(req);
  const action = body.action as Action;
  if (!['summary', 'insight', 'events'].includes(action)) {
    return sendJson(res, 400, { error: 'Unknown AI action' });
  }

  const key = cacheKey(action, body);
  const hit = cached(key);
  if (hit) return sendJson(res, 200, hit);

  try {
    const value = await generate(action, body);
    setCached(action, key, value);
    return sendJson(res, 200, value);
  } catch (error) {
    console.error(`[ai] ${action} failed:`, error);
    return sendJson(res, 503, { error: 'AI service unavailable' });
  }
}
