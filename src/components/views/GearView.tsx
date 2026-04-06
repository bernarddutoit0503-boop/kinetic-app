import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useCachedData } from '../../hooks/useCachedData';
import { getLiveNews } from '../../services/GeminiService';
import { newsData, NewsItem } from '../../data/news';
import { SkeletonGearCard } from '../SkeletonCard';
import { NewsImage } from '../NewsImage';
import { CACHE_KEYS, GEAR_BRANDS, GAME_URLS, CACHE_TTL_NEWS_MS } from '../../constants';

interface GearViewProps {
  key?: string | number; // React 19: key must be declared in props interface
  onArticleClick: (item: NewsItem) => void;
  isBookmarked: (id: string) => boolean;
  onBookmarkToggle: (id: string) => void;
}

export const GearView = ({ onArticleClick, isBookmarked, onBookmarkToggle }: GearViewProps) => {
  const [selectedBrand, setSelectedBrand] = useState('All Labs');
  const { data: liveNews, loading } = useCachedData<NewsItem[]>(
    CACHE_KEYS.LIVE_NEWS,
    CACHE_KEYS.LIVE_NEWS_TIME,
    getLiveNews as () => Promise<NewsItem[] | null>,
    CACHE_TTL_NEWS_MS
  );

  const gearItems = [...(liveNews ?? []), ...newsData].filter(item => item.category === 'GEAR');
  const filteredGear = selectedBrand === 'All Labs'
    ? gearItems
    : gearItems.filter(item => (
        item.brand === selectedBrand ||
        item.source_brand?.toLowerCase().includes(selectedBrand.toLowerCase())
      ));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-16"
    >
      <section className="relative group overflow-hidden rounded-xl bg-surface border border-outline-variant/10">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <img
          className="w-full h-[500px] object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          src="/assets/gear/huntsman.jpg"
          alt="Razer Huntsman V3 Pro"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true"></span>
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Hardware of the Week</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-6">
            RAZER HUNTSMAN V3 PRO: THE OPTICAL EVOLUTION.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            Redefining rapid-fire response with adjustable actuation and the world's most advanced optical switches.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.open(GAME_URLS.RAZER_HUNTSMAN, '_blank', 'noopener,noreferrer')}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-label font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Deep Dive Specs
            </button>
            <button className="glass-panel border border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-label font-bold uppercase tracking-widest text-xs active:scale-95 transition-all">
              View Gallery
            </button>
          </div>
        </div>
      </section>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" role="tablist" aria-label="Filter by brand">
        {GEAR_BRANDS.map((brand) => (
          <button
            key={brand}
            role="tab"
            aria-selected={selectedBrand === brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-6 py-2 rounded-full border font-label text-xs font-bold uppercase tracking-widest shrink-0 transition-all active:scale-95 ${
              selectedBrand === brand ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:text-primary'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {loading && filteredGear.length === 0
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonGearCard key={i} />)
            : filteredGear.length > 0
              ? filteredGear.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onArticleClick(item)}
                  className="bg-surface rounded-xl overflow-hidden group border border-outline-variant/5 cursor-pointer active:scale-95 transition-all"
                >
                  <div className="relative aspect-video">
                    <NewsImage
                      src={item.image}
                      alt={item.title}
                      category={item.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-sm font-label text-[10px] font-extrabold uppercase tracking-widest">
                      {item.brand || 'Performance Lab'}
                    </span>
                  </div>
                  <div className="p-8">
                    <h2 className="font-headline text-3xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
                    <p className="text-on-surface-variant leading-relaxed mb-6 italic">{item.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">{item.readTime || '5 min read'}</span>
                        <span className="text-outline" aria-hidden="true">•</span>
                        <span className="font-label text-xs text-primary uppercase tracking-widest">Tech Report</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); onBookmarkToggle(item.id); }}
                        aria-label={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                        className={`transition-colors active:scale-95 ${isBookmarked(item.id) ? 'text-primary' : 'text-outline hover:text-primary'}`}
                      >
                        {isBookmarked(item.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>
                  </div>
                </article>
              ))
              : (
                <div className="text-center py-20 opacity-40">
                  <p className="font-headline text-xs uppercase tracking-[0.5em]">SECTOR QUIET: NO RECENT INTEL DETECTED.</p>
                </div>
              )
          }
        </div>

        <aside className="md:col-span-4 space-y-8">
          <div className="bg-surface-bright rounded-xl p-8 border-l-2 border-primary neon-pulse">
            <h4 className="font-headline text-lg font-bold uppercase tracking-tighter mb-6">Market Vitals</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">GPU Index</span>
                <span className="text-primary font-headline font-bold">+4.2%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary shadow-[0_0_8px_rgba(156,255,147,1)]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">SSD Scarcity</span>
                <span className="text-secondary font-headline font-bold">CRITICAL</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="w-11/12 h-full bg-secondary"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
