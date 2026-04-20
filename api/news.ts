// Vercel serverless function: aggregates RSS feeds from major tech/gaming
// sources and returns the freshest articles in the shape FeedView expects.
//
// No external dependencies — uses fetch (Node 18+) and a small regex-based
// RSS parser. Runs in both Vercel (production) and the Vite dev middleware.

interface NewsItem {
  id: string;
  category: string;
  source_brand: string;
  title: string;
  original_url: string;
  image: string;
  publish_date: string;
  summary: string;
  live: boolean;
}

interface RankedItem extends NewsItem {
  _ts: number;
}

type Feed = { url: string; source: string; category: string };

const FEEDS: Feed[] = [
  // TECH
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'TECH' },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'TECH' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'TECH' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'TECH' },
  // GAMING — use topic-scoped feeds where possible to keep entertainment
  // content out of the gaming pipeline.
  { url: 'https://feeds.ign.com/ign/games-all', source: 'IGN', category: 'GAMING' },
  { url: 'https://www.polygon.com/rss/index.xml', source: 'Polygon', category: 'GAMING' },
  { url: 'https://www.pcgamer.com/rss/', source: 'PC Gamer', category: 'GAMING' },
  { url: 'https://www.gamespot.com/feeds/news', source: 'GameSpot', category: 'GAMING' },
  // GEAR
  { url: 'https://www.tomshardware.com/feeds/all', source: "Tom's Hardware", category: 'GEAR' },
  // ENTERTAINMENT — dedicated feeds for film / TV / anime coverage.
  { url: 'https://feeds.ign.com/ign/movies-all', source: 'IGN Movies', category: 'ENTERTAINMENT' },
  { url: 'https://feeds.ign.com/ign/tv-all', source: 'IGN TV', category: 'ENTERTAINMENT' },
  { url: 'https://variety.com/feed/', source: 'Variety', category: 'ENTERTAINMENT' },
  { url: 'https://www.animenewsnetwork.com/all/rss.xml', source: 'Anime News Network', category: 'ENTERTAINMENT' },
];

// None of the source feeds are AI-only, so re-categorise items whose title
// mentions AI/LLM topics to keep the AI INTEL tab populated with real content.
// Checked first so AI content beats entertainment (e.g. an AI-in-film piece
// stays in AI INTEL, not ENTERTAINMENT).
const AI_KEYWORDS = /\b(AI|A\.I\.|GPT|LLM|OpenAI|Anthropic|DeepMind|Gemini|Claude|Llama|Mistral|generative|chatbot|copilot|machine learning|neural net)\b/i;

// High-confidence entertainment keywords used to reclassify stragglers from
// broad TECH/GAMING feeds (e.g. Polygon still mixes in TV content).
// Deliberately conservative — "trailer" alone is too broad (game trailers).
const ENT_KEYWORDS = /\b(anime|manga|box office|Netflix series|Netflix original|HBO series|Disney\+ series|Paramount\+|Apple TV\+|Crunchyroll|season finale|film review|movie review)\b/i;

const PLACEHOLDERS: Record<string, string> = {
  TECH: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
  GAMING: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop',
  GEAR: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop',
  'AI INTEL': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1489599511986-c2b4d5bbbf89?w=800&auto=format&fit=crop',
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function unwrapCdata(s: string): string {
  const m = s.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return m ? m[1] : s;
}

function extractTag(xml: string, tag: string): string {
  const escaped = tag.replace(/:/g, '\\:');
  const re = new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i');
  const m = xml.match(re);
  if (!m) return '';
  return unwrapCdata(m[1].trim());
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const escaped = tag.replace(/:/g, '\\:');
  const re = new RegExp(`<${escaped}\\b[^>]*\\b${attr}=["']([^"']+)["']`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

function extractImage(itemXml: string, descHtml: string): string | null {
  const mc = extractAttr(itemXml, 'media:content', 'url');
  if (mc) return mc;
  const mt = extractAttr(itemXml, 'media:thumbnail', 'url');
  if (mt) return mt;
  const encType = extractAttr(itemXml, 'enclosure', 'type');
  const encUrl = extractAttr(itemXml, 'enclosure', 'url');
  if (encUrl && (encType.startsWith('image/') || /\.(jpe?g|png|webp|gif)/i.test(encUrl))) {
    return encUrl;
  }
  const img = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (img) return img[1];
  return null;
}

function formatDate(ms: number): string {
  return new Date(ms)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();
}

async function fetchFeed(feed: Feed, signal: AbortSignal): Promise<RankedItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KineticBot/1.0; +https://kinetic.app)',
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
      signal,
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
    const items: RankedItem[] = [];

    for (const itemXml of itemMatches.slice(0, 8)) {
      const title = stripHtml(extractTag(itemXml, 'title'));
      if (!title) continue;

      // <link> is a text node in RSS, an attribute on Atom — try both.
      let link = stripHtml(extractTag(itemXml, 'link'));
      if (!link) link = extractAttr(itemXml, 'link', 'href');

      const pubDateRaw =
        extractTag(itemXml, 'pubDate') ||
        extractTag(itemXml, 'published') ||
        extractTag(itemXml, 'updated') ||
        extractTag(itemXml, 'dc:date');
      const parsedMs = pubDateRaw ? new Date(pubDateRaw).getTime() : NaN;
      const dateMs = Number.isFinite(parsedMs) ? parsedMs : Date.now();

      const descHtml =
        extractTag(itemXml, 'content:encoded') ||
        extractTag(itemXml, 'description') ||
        extractTag(itemXml, 'summary');
      const summary = stripHtml(descHtml).slice(0, 220);

      const image = extractImage(itemXml, descHtml);
      // Classification priority:
      // 1. AI mention in title → AI INTEL (even if from an entertainment feed)
      // 2. Dedicated entertainment feed → ENTERTAINMENT
      // 3. Entertainment keyword match in a broad TECH/GAMING feed → ENTERTAINMENT
      // 4. Fall back to the feed's declared category
      let category: string;
      if (AI_KEYWORDS.test(title)) category = 'AI INTEL';
      else if (feed.category === 'ENTERTAINMENT') category = 'ENTERTAINMENT';
      else if (ENT_KEYWORDS.test(title)) category = 'ENTERTAINMENT';
      else category = feed.category;

      items.push({
        _ts: dateMs,
        id: slugify(title) || `${slugify(feed.source)}-${dateMs}`,
        category,
        source_brand: feed.source,
        title,
        original_url: link,
        image: image || PLACEHOLDERS[category] || PLACEHOLDERS.TECH,
        publish_date: formatDate(dateMs),
        summary,
        live: true,
      });
    }
    return items;
  } catch (err) {
    console.error(`[news] ${feed.source} failed:`, err);
    return [];
  }
}

export default async function handler(_req: any, res: any) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const results = await Promise.all(FEEDS.map(f => fetchFeed(f, controller.signal)));
    clearTimeout(timeout);

    const ranked = results.flat().sort((a, b) => b._ts - a._ts);

    // De-dupe by id (rare cross-source clashes) and trim to 30. The cap is
    // larger than the Feed tab needs because AIView also filters this stream
    // down to AI INTEL items — it needs enough headroom to find a few.
    const seen = new Set<string>();
    const items: NewsItem[] = [];
    for (const r of ranked) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      const { _ts, ...rest } = r;
      void _ts;
      items.push(rest);
      if (items.length >= 30) break;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // Edge cache for 15 min, serve stale for an hour while revalidating.
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.end(JSON.stringify(items));
  } catch (err) {
    clearTimeout(timeout);
    console.error('[news] handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Failed to fetch news' }));
  }
}
