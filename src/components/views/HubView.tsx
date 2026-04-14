import { TrendingUp, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useCachedData } from '../../hooks/useCachedData';
import { useHype } from '../../hooks/useHype';
import { useAuth } from '../../context/AuthContext';
import { getLiveServiceEvents } from '../../services/GeminiService';
import { LiveEvents, GameEvent } from '../../types';
import { CACHE_KEYS, GAME_URLS, CACHE_TTL_EVENTS_MS, GAME_EVENT_FALLBACKS } from '../../constants';

// ── Helpers ────────────────────────────────────────────────────────────────

function resolveEvent(live: GameEvent | undefined, fallback: { event_name: string; description: string; subtitle: string }): { event_name: string; description: string; subtitle: string } {
  return {
    event_name: live?.event_name ?? fallback.event_name,
    description: live?.description ?? fallback.description,
    subtitle: live?.subtitle ?? fallback.subtitle,
  };
}

// ── Small game card ────────────────────────────────────────────────────────

interface GameCardProps {
  key?: string | number;
  gameKey: string;
  title: string;
  event: { event_name: string; description: string; subtitle: string };
  image: string;
  playUrl: string;
  infoUrl: string;
  loading: boolean;
  hypeCount: number;
  onHype: () => void;
  accent?: 'primary' | 'secondary' | 'tertiary';
}

const GameCard = ({ title, event, image, playUrl, infoUrl, loading, hypeCount, onHype, accent = 'primary' }: GameCardProps) => {
  const accentClass = {
    primary: 'text-primary border-primary',
    secondary: 'text-secondary border-secondary',
    tertiary: 'text-tertiary border-tertiary',
  }[accent];

  const dotClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
  }[accent];

  const badgeClass = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    tertiary: 'bg-tertiary/20 text-tertiary',
  }[accent];

  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative h-40 overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        {/* Live pulse badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClass}`} aria-hidden="true" />
          <span className={`font-label text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeClass}`}>
            {loading ? 'SCANNING...' : event.subtitle}
          </span>
        </div>
        {/* Hype count badge (shows after first vote) */}
        {hypeCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="text-[10px]" aria-hidden="true">🔥</span>
            <span className="font-label text-[8px] font-black text-on-surface">{hypeCount}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">{title}</p>
          <h4 className={`font-headline text-base font-bold leading-tight uppercase tracking-tight ${accentClass.split(' ')[0]}`}>
            {event.event_name}
          </h4>
        </div>
        <p className="text-on-surface-variant font-body text-xs leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => window.open(playUrl, '_blank', 'noopener,noreferrer')}
            className={`flex-1 py-2 rounded-lg font-label text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 hover:bg-primary/10 ${accentClass}`}
          >
            Play
          </button>
          <button
            onClick={() => window.open(infoUrl, '_blank', 'noopener,noreferrer')}
            aria-label={`More info about ${title}`}
            className="p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
          >
            <ExternalLink size={13} />
          </button>
          {/* Hype button */}
          <button
            onClick={onHype}
            aria-label={`Hype ${title}`}
            className="px-3 py-2 rounded-lg border border-outline-variant/20 text-sm hover:bg-primary/5 active:scale-90 transition-all"
          >
            🔥
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main view ──────────────────────────────────────────────────────────────

export const HubView = () => {
  const { user } = useAuth();
  const { data: liveEvents, loading } = useCachedData<LiveEvents>(
    CACHE_KEYS.LIVE_EVENTS,
    CACHE_KEYS.LIVE_EVENTS_TIME,
    getLiveServiceEvents as () => Promise<LiveEvents | null>,
    CACHE_TTL_EVENTS_MS
  );
  const { addHype, getHype } = useHype(user?.id ?? null);

  const d2 = resolveEvent(liveEvents?.destiny2, GAME_EVENT_FALLBACKS.destiny2);

  const games = [
    {
      gameKey: 'phasmophobia',
      title: 'Phasmophobia',
      event: resolveEvent(liveEvents?.phasmophobia, GAME_EVENT_FALLBACKS.phasmophobia),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_hero.jpg',
      playUrl: GAME_URLS.PHASMOPHOBIA_STORE,
      infoUrl: GAME_URLS.PHASMOPHOBIA,
      loading,
      accent: 'secondary' as const,
    },
    {
      gameKey: 'theisle',
      title: 'The Isle',
      event: resolveEvent(liveEvents?.theisle, GAME_EVENT_FALLBACKS.theisle),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/376210/library_hero.jpg',
      playUrl: GAME_URLS.THE_ISLE_STORE,
      infoUrl: GAME_URLS.THE_ISLE,
      loading,
      accent: 'primary' as const,
    },
    {
      gameKey: 'rainbow6siege',
      title: 'Rainbow Six Siege',
      event: resolveEvent(liveEvents?.rainbow6siege, GAME_EVENT_FALLBACKS.rainbow6siege),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_hero.jpg',
      playUrl: GAME_URLS.R6_SIEGE,
      infoUrl: GAME_URLS.R6_SIEGE_ESPORTS,
      loading,
      accent: 'tertiary' as const,
    },
    {
      gameKey: 'forhonor',
      title: 'For Honor',
      event: resolveEvent(liveEvents?.forhonor, GAME_EVENT_FALLBACKS.forhonor),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/304390/library_hero.jpg',
      playUrl: GAME_URLS.FOR_HONOR_STORE,
      infoUrl: GAME_URLS.FOR_HONOR,
      loading,
      accent: 'secondary' as const,
    },
    {
      gameKey: 'dota2',
      title: 'Dota 2',
      event: resolveEvent(liveEvents?.dota2, GAME_EVENT_FALLBACKS.dota2),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_hero.jpg',
      playUrl: GAME_URLS.DOTA2_STORE,
      infoUrl: GAME_URLS.DOTA2,
      loading,
      accent: 'primary' as const,
    },
    {
      gameKey: 'helldivers2',
      title: 'Helldivers 2',
      event: resolveEvent(liveEvents?.helldivers2, GAME_EVENT_FALLBACKS.helldivers2),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/library_hero.jpg',
      playUrl: GAME_URLS.HELLDIVERS2_STORE,
      infoUrl: GAME_URLS.HELLDIVERS2,
      loading,
      accent: 'primary' as const,
    },
    {
      gameKey: 'marvelrivals',
      title: 'Marvel Rivals',
      event: resolveEvent(liveEvents?.marvelrivals, GAME_EVENT_FALLBACKS.marvelrivals),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2767030/library_hero.jpg',
      playUrl: GAME_URLS.MARVEL_RIVALS_STORE,
      infoUrl: GAME_URLS.MARVEL_RIVALS,
      loading,
      accent: 'secondary' as const,
    },
    {
      gameKey: 'poe2',
      title: 'Path of Exile 2',
      event: resolveEvent(liveEvents?.poe2, GAME_EVENT_FALLBACKS.poe2),
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2694490/library_hero.jpg',
      playUrl: GAME_URLS.POE2_STORE,
      infoUrl: GAME_URLS.POE2,
      loading,
      accent: 'tertiary' as const,
    },
  ];

  // Most hyped games float to the top
  const sortedGames = [...games].sort((a, b) => getHype(b.gameKey) - getHype(a.gameKey));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="space-y-10"
    >
      {/* ── Destiny 2 Hero ── */}
      <section className="relative w-full h-[530px] rounded-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
        <img
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          src="https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/library_hero.jpg"
          alt="Destiny 2 live event"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-secondary text-on-secondary font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
              {loading ? 'SCANNING PULSE...' : 'LIVE SERVICE PULSE'}
            </span>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp size={14} fill="currentColor" aria-hidden="true" />
              <span className="font-headline font-bold text-sm">TOP TRENDING</span>
            </div>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 uppercase leading-none italic">
            DESTINY 2{d2.event_name ? ` : ${d2.event_name}` : ''}
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl font-body mb-8 max-w-lg leading-relaxed">
            {d2.description}
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => window.open(GAME_URLS.DESTINY2_PLAY, '_blank', 'noopener,noreferrer')}
              className="px-8 py-3 bg-primary text-on-primary font-label font-bold rounded-full hover:opacity-90 active:scale-95 transition-all neon-glow"
            >
              PLAY NOW
            </button>
            <button
              onClick={() => window.open(GAME_URLS.DESTINY2_YOUTUBE, '_blank', 'noopener,noreferrer')}
              className="px-8 py-3 bg-surface text-on-surface font-label font-bold rounded-full border border-outline-variant/30 backdrop-blur-md hover:bg-surface-bright transition-all"
            >
              VIEW INTEL
            </button>
            {/* Destiny 2 hype button */}
            <button
              onClick={() => addHype('destiny2')}
              aria-label="Hype Destiny 2"
              className="px-4 py-3 bg-surface/80 backdrop-blur-md font-label font-bold rounded-full border border-outline-variant/30 hover:bg-surface-bright transition-all active:scale-95 flex items-center gap-2"
            >
              <span aria-hidden="true">🔥</span>
              {getHype('destiny2') > 0 && (
                <span className="font-label text-[10px] font-black text-on-surface">{getHype('destiny2')}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Section header ── */}
      <div>
        <h3 className="font-headline text-3xl font-bold tracking-tight text-primary uppercase italic">The Hub</h3>
        <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-1">
          Live service intel — all active events, updated every 6 hours
        </p>
      </div>

      {/* ── Game grid (sorted by hype) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sortedGames.map(game => (
          <GameCard
            key={game.gameKey}
            {...game}
            hypeCount={getHype(game.gameKey)}
            onHype={() => addHype(game.gameKey)}
          />
        ))}
      </div>

      {/* ── Footer note ── */}
      <p className="text-center font-label text-[9px] uppercase tracking-widest text-on-surface-variant/40 pb-2">
        Event data sourced via AI grounding — verify on official channels for prize eligibility
      </p>
    </motion.div>
  );
};
