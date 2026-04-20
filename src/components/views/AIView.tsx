import { useMemo } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useCachedData } from '../../hooks/useCachedData';
import { getLiveNews } from '../../services/GeminiService';
import { NewsItem } from '../../data/news';
import { CACHE_KEYS, CACHE_TTL_NEWS_MS } from '../../constants';

// ── Company classification ────────────────────────────────────────────────
// AI INTEL items are bucketed into company sections via title regex. Order
// matters: more specific patterns (Anthropic, Claude) run before general ones
// (Google, Meta) so a "Claude beats Gemini" headline lands in the right bucket.

type Company = 'OpenAI' | 'Anthropic' | 'Meta AI' | 'Google DeepMind' | 'Other';

type Accent = 'primary' | 'secondary' | 'tertiary';

interface CompanyConfig {
  name: Exclude<Company, 'Other'>;
  pattern: RegExp;
  accent: Accent;
}

const COMPANIES: CompanyConfig[] = [
  { name: 'Anthropic', pattern: /\b(Anthropic|Claude)\b/i, accent: 'primary' },
  { name: 'OpenAI', pattern: /\b(OpenAI|GPT-?[0-9]|ChatGPT|Sora|DALL-?E)\b/i, accent: 'secondary' },
  { name: 'Meta AI', pattern: /\b(Meta|Llama)\b/i, accent: 'tertiary' },
  { name: 'Google DeepMind', pattern: /\b(Google|DeepMind|Gemini|Bard|Gemma|Genie)\b/i, accent: 'secondary' },
];

const GAMING_AI_KW = /\b(game|gaming|NPC|Ubisoft|NVIDIA ACE|Valve|Xbox|Nintendo|PlayStation|Unreal|Unity)\b/i;

function detectCompany(title: string): Company {
  for (const c of COMPANIES) if (c.pattern.test(title)) return c.name;
  return 'Other';
}

const ACCENT_CYCLE: Accent[] = ['secondary', 'primary', 'tertiary'];

// ── Quick brief card (compact row) ─────────────────────────────────────────

interface QuickBriefProps {
  key?: string | number;
  tag: string;
  company: string;
  title: string;
  meta: string;
  url: string;
  accent: Accent;
}

const QuickBrief = ({ tag, company, title, meta, url, accent }: QuickBriefProps) => {
  const tagClass = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    tertiary: 'bg-tertiary/20 text-tertiary',
  }[accent];

  return (
    <button
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      className="w-full flex items-center gap-4 p-4 bg-surface rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all group text-left active:scale-95"
    >
      <span className={`shrink-0 px-2 py-1 rounded font-label text-[8px] font-black uppercase tracking-widest ${tagClass}`}>
        {tag}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-label text-[8px] text-on-surface-variant uppercase tracking-widest mb-0.5">{company}</p>
        <p className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{title}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-label text-[8px] text-on-surface-variant uppercase">{meta}</p>
        <ExternalLink size={12} className="text-outline group-hover:text-primary transition-colors mt-1 ml-auto" aria-hidden="true" />
      </div>
    </button>
  );
};

// ── Company section header ──────────────────────────────────────────────────

const SectionHeader = ({ name, count, color = 'secondary' }: { name: string; count: string; color?: string }) => (
  <div className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
    <h3 className="font-headline text-2xl font-bold tracking-tight flex items-center gap-3">
      <span className={`w-1 h-8 bg-${color}`} aria-hidden="true" />
      {name}
    </h3>
    <span className="font-label text-xs text-on-surface-variant">{count}</span>
  </div>
);

// ── Feature article card ────────────────────────────────────────────────────

interface FeatureCardProps {
  tags: string[];
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  url: string;
  accentColor?: string;
}

const FeatureCard = ({ tags, title, body, image, imageAlt, url, accentColor = 'secondary' }: FeatureCardProps) => (
  <button
    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    className={`block w-full text-left group relative bg-surface-variant rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-${accentColor}/30 transition-all duration-500 active:scale-[0.995]`}
  >
    <div className="aspect-[16/9] overflow-hidden">
      <img
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        src={image}
        alt={imageAlt}
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="p-8">
      <div className="flex gap-2 mb-4 flex-wrap">
        {tags.map(t => (
          <span key={t} className={`px-3 py-1 bg-${accentColor}/20 text-${accentColor} rounded-full font-label text-[10px] font-bold uppercase`}>{t}</span>
        ))}
      </div>
      <h4 className={`font-headline text-3xl font-bold mb-4 leading-tight group-hover:text-${accentColor} transition-colors`}>
        {title}
      </h4>
      <p className="text-on-surface-variant mb-8 font-body text-lg leading-relaxed line-clamp-3">{body}</p>
      <span className={`flex items-center gap-2 font-label text-xs font-black uppercase tracking-widest text-${accentColor}`}>
        Full Coverage <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </span>
    </div>
  </button>
);

// ── Empty-state placeholder ────────────────────────────────────────────────

const EmptyCard = ({ name }: { name: string }) => (
  <div className="rounded-2xl border border-dashed border-outline-variant/20 p-8 text-center bg-surface-variant/30">
    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
      No recent {name} intel — check back soon.
    </p>
  </div>
);

// ── Sidebar row (Gemini + AI in Gaming) ─────────────────────────────────────

interface SidebarRowProps {
  key?: string | number;
  title: string;
  meta: string;
  url: string;
  image: string;
}

const SidebarRow = ({ title, meta, url, image }: SidebarRowProps) => (
  <button
    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    className="flex gap-4 group text-left w-full active:scale-[0.98] transition-transform"
  >
    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-surface-bright">
      <img
        className="w-full h-full object-cover"
        src={image}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex flex-col justify-center min-w-0">
      <h6 className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors mb-1 line-clamp-2">{title}</h6>
      <span className="font-label text-[9px] text-on-surface-variant uppercase truncate">{meta}</span>
    </div>
  </button>
);

// ── Main view ──────────────────────────────────────────────────────────────

export const AIView = () => {
  // Reuse the same LIVE_NEWS cache as FeedView — no extra fetch.
  const { data: allNews, loading } = useCachedData<NewsItem[]>(
    CACHE_KEYS.LIVE_NEWS,
    CACHE_KEYS.LIVE_NEWS_TIME,
    getLiveNews as () => Promise<NewsItem[] | null>,
    CACHE_TTL_NEWS_MS,
  );

  const aiNews = useMemo(
    () => (allNews ?? []).filter(n => n.category === 'AI INTEL'),
    [allNews],
  );

  const byCompany = useMemo(() => {
    const map: Record<Company, NewsItem[]> = {
      OpenAI: [],
      Anthropic: [],
      'Meta AI': [],
      'Google DeepMind': [],
      Other: [],
    };
    for (const n of aiNews) map[detectCompany(n.title)].push(n);
    return map;
  }, [aiNews]);

  const rapidIntel = aiNews.slice(0, 6);
  const gamingAI = useMemo(
    () => aiNews.filter(n => GAMING_AI_KW.test(n.title)).slice(0, 3),
    [aiNews],
  );
  const geminiItems = byCompany['Google DeepMind'].slice(0, 3);

  const noData = !loading && aiNews.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-12"
    >
      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden rounded-2xl p-8 lg:p-12 border border-secondary/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-background" />
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
              {loading ? 'SCANNING INTEL...' : `${aiNews.length} LIVE SIGNAL${aiNews.length === 1 ? '' : 'S'}`}
            </span>
          </div>
          <h2 className="font-headline text-5xl lg:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-none">
            AI <span className="text-secondary italic">WEEKLY</span>
          </h2>
          <p className="text-on-surface-variant text-lg lg:text-xl max-w-md mb-8 leading-relaxed">
            Decoding the intelligence explosion. Frontier models, autonomous agents, and gaming AI — all pulled live from the feed.
          </p>
        </div>
      </section>

      {/* ── Rapid briefs ── */}
      <div className="space-y-4">
        <h3 className="font-headline text-xs font-black tracking-[0.3em] text-primary uppercase border-l-4 border-primary pl-4">
          RAPID INTEL
        </h3>
        {loading && rapidIntel.length === 0 && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-surface animate-pulse" aria-hidden="true" />
            ))}
          </div>
        )}
        {noData && <EmptyCard name="AI" />}
        <div className="space-y-2">
          {rapidIntel.map((item, i) => (
            <QuickBrief
              key={item.id}
              tag={detectCompany(item.title).split(' ')[0]}
              company={item.source_brand ?? 'Feed'}
              title={item.title}
              meta={item.publish_date ?? 'Recent'}
              url={item.original_url ?? '#'}
              accent={ACCENT_CYCLE[i % 3]}
            />
          ))}
        </div>
      </div>

      {/* ── Main two-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT — feature articles per company */}
        <div className="lg:col-span-8 space-y-10">
          {COMPANIES.map(({ name, accent }) => {
            const items = byCompany[name];
            const headline = items[0];
            return (
              <div key={name} className="space-y-6">
                <SectionHeader
                  name={name.toUpperCase()}
                  count={`${items.length} UPDATE${items.length === 1 ? '' : 'S'}`}
                  color={accent}
                />
                {headline ? (
                  <FeatureCard
                    tags={[name, 'LIVE']}
                    title={headline.title}
                    body={headline.summary}
                    image={headline.image}
                    imageAlt={headline.title}
                    url={headline.original_url ?? '#'}
                    accentColor={accent}
                  />
                ) : (
                  <EmptyCard name={name} />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT — sidebar */}
        <div className="lg:col-span-4 space-y-10">

          {/* Google Gemini sidebar */}
          <div className="space-y-6">
            <h3 className="font-headline text-xl font-bold tracking-tight border-b border-outline-variant/30 pb-4">GOOGLE GEMINI</h3>
            {geminiItems.length === 0 ? (
              <EmptyCard name="Gemini" />
            ) : (
              <div className="flex flex-col gap-5">
                {geminiItems.map(item => (
                  <SidebarRow
                    key={item.id}
                    title={item.title}
                    meta={`${item.publish_date ?? 'Recent'} • ${item.source_brand ?? 'Feed'}`}
                    url={item.original_url ?? '#'}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>

          {/* AI in Gaming sidebar */}
          <div className="space-y-4">
            <h3 className="font-headline text-xl font-bold tracking-tight border-b border-outline-variant/30 pb-4">AI IN GAMING</h3>
            {gamingAI.length === 0 ? (
              <EmptyCard name="Gaming AI" />
            ) : (
              <div className="flex flex-col gap-3">
                {gamingAI.map(item => (
                  <button
                    key={item.id}
                    onClick={() => window.open(item.original_url ?? '#', '_blank', 'noopener,noreferrer')}
                    className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outline-variant/5 text-left hover:border-primary/20 transition-colors active:scale-[0.98]"
                  >
                    <span className="font-label text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded shrink-0">LIVE</span>
                    <div className="min-w-0">
                      <p className="font-label text-[8px] text-on-surface-variant uppercase mb-0.5 truncate">{item.source_brand ?? 'Feed'}</p>
                      <p className="font-headline text-xs font-bold leading-tight text-on-surface line-clamp-2">{item.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Market intel — static, no RSS source for stock prices */}
          <div className="bg-surface-variant rounded-2xl p-6 border-l-4 border-primary shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-label text-[10px] font-black tracking-widest text-primary uppercase">Market Intel</h4>
              <span className="font-label text-[8px] text-on-surface-variant/60 uppercase tracking-widest">Indicative</span>
            </div>
            <div className="space-y-4">
              {[
                { ticker: 'NVIDIA', val: '+4.2%', up: true },
                { ticker: 'MSFT', val: '+1.8%', up: true },
                { ticker: 'META', val: '+3.1%', up: true },
                { ticker: 'GOOGLE', val: '-0.5%', up: false },
                { ticker: 'AMD', val: '+2.4%', up: true },
              ].map(row => (
                <div key={row.ticker} className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs font-label uppercase">{row.ticker}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${row.up ? 'text-primary' : 'text-error'}`}>{row.val}</span>
                    {row.up
                      ? <TrendingUp size={14} className="text-primary" aria-hidden="true" />
                      : <TrendingDown size={14} className="text-error" aria-hidden="true" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
