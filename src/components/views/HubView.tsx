import { TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useCachedData } from '../../hooks/useCachedData';
import { getLiveServiceEvents } from '../../services/GeminiService';
import { LiveEvents } from '../../types';
import { CACHE_KEYS, GAME_URLS } from '../../constants';

export const HubView = () => {
  const { data: liveEvents, loading } = useCachedData<LiveEvents>(
    CACHE_KEYS.LIVE_EVENTS,
    CACHE_KEYS.LIVE_EVENTS_TIME,
    getLiveServiceEvents as () => Promise<LiveEvents | null>
  );

  const d2Title = liveEvents?.destiny2?.event_name
    ? `DESTINY 2 : ${liveEvents.destiny2.event_name}`
    : 'DESTINY 2 : GUARDIAN GAMES';
  const d2Desc = liveEvents?.destiny2?.description
    ?? 'Represent your class in the ultimate competition. Hoverboards, new rewards, and glory await in Guardian Games 2026.';
  const phasmoTitle = liveEvents?.phasmophobia?.event_name
    ? `PHASMOPHOBIA : ${liveEvents.phasmophobia.event_name.toUpperCase()}`
    : 'PHASMOPHOBIA : CURSED HOLLOW';
  const phasmoSub = liveEvents?.phasmophobia?.subtitle ?? 'Spooky Season';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="space-y-12"
    >
      <section className="relative w-full h-[530px] rounded-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        <img
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsznI8JaLB9Uu9_AEjSM4jnflbvambXF9NKzvpx7mTcEFn2qJ_yzNd0q_wsnD6DlkPs1138AfUnVIngJyGxd3IEVhFj9gutQwsvx3THCrurnyr9bznTvqJcDQsVvOfVxjqlmHEE8JWzKe3hqmF3uZj4EeOB99OAvU0WwVTYy_JVCHnMxqeXbirCFM9LWjuL8ccHL3dcqJFt-ph3_UuaLyE_5g5XI-hBwTd9x6YWQZ5aq2pOtddv9AquZ8chX44QkqSVDpc-nstg"
          alt="Destiny 2 live event"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-secondary text-on-secondary font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
              {loading ? 'SCANNING PULSE...' : 'LIVE SERVICE PULSE'}
            </span>
            <div className="flex items-center text-primary">
              <TrendingUp size={14} fill="currentColor" aria-hidden="true" />
              <span className="font-headline font-bold ml-1">TOP TRENDING</span>
            </div>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 uppercase leading-none italic">
            {d2Title}
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl font-body mb-8 max-w-lg leading-relaxed">
            {d2Desc}
          </p>
          <div className="flex gap-4">
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
          </div>
        </div>
      </section>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-headline text-3xl font-bold tracking-tight text-primary uppercase italic">The Hub</h3>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-1">Recently Launched &amp; Coming Soon</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div
          onClick={() => window.open(GAME_URLS.PHASMOPHOBIA, '_blank', 'noopener,noreferrer')}
          role="article"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && window.open(GAME_URLS.PHASMOPHOBIA, '_blank', 'noopener,noreferrer')}
          aria-label={phasmoTitle}
          className="md:col-span-12 group cursor-pointer"
        >
          <div className="h-full bg-surface rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all duration-300">
            <div className="relative h-64 md:h-full flex flex-col">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsznI8JaLB9Uu9_AEjSM4jnflbvambXF9NKzvpx7mTcEFn2qJ_yzNd0q_wsnD6DlkPs1138AfUnVIngJyGxd3IEVhFj9gutQwsvx3THCrurnyr9bznTvqJcDQsVvOfVxjqlmHEE8JWzKe3hqmF3uZj4EeOB99OAvU0WwVTYy_JVCHnMxqeXbirCFM9LWjuL8ccHL3dcqJFt-ph3_UuaLyE_5g5XI-hBwTd9x6YWQZ5aq2pOtddv9AquZ8chX44QkqSVDpc-nstg"
                alt="Phasmophobia live event"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-variant via-transparent to-transparent"></div>
              <div className="mt-auto p-8 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" aria-hidden="true"></span>
                  <span className="font-label text-[10px] text-secondary uppercase tracking-widest font-black">{phasmoSub}</span>
                </div>
                <h4 className="font-headline text-4xl font-bold text-on-surface uppercase italic mb-2 tracking-tighter">{phasmoTitle}</h4>
                <div className="flex items-center gap-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline text-2xl font-black text-secondary">EVENT</span>
                    <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">Live Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
