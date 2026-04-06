import { useState } from 'react';
import { ArrowRight, TrendingUp, RotateCcw, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useCachedData } from '../../hooks/useCachedData';
import { useReadHistory } from '../../hooks/useReadHistory';
import { getLiveNews } from '../../services/GeminiService';
import { newsData, NewsItem } from '../../data/news';
import { LiveInsight } from '../LiveInsight';
import { SkeletonCard, SkeletonFeatured } from '../SkeletonCard';
import { NewsImage } from '../NewsImage';
import { CACHE_KEYS, FEED_CATEGORIES, CACHE_TTL_NEWS_MS } from '../../constants';
import { ToastType } from '../../hooks/useToast';

interface FeedViewProps {
  key?: string | number;
  onArticleClick: (item: NewsItem) => void;
  isBookmarked: (id: string) => boolean;
  onBookmarkToggle: (id: string) => void;
  onToast: (message: string, type?: ToastType) => void;
}

export const FeedView = ({ onArticleClick, isBookmarked, onBookmarkToggle, onToast }: FeedViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Feed');
  const { data: liveNews, loading: loadingLive, refresh } = useCachedData<NewsItem[]>(
    CACHE_KEYS.LIVE_NEWS,
    CACHE_KEYS.LIVE_NEWS_TIME,
    getLiveNews as () => Promise<NewsItem[] | null>,
    CACHE_TTL_NEWS_MS
  );
  const { recordRead, topCategories, hasHistory } = useReadHistory();

  const handleArticleClick = (item: NewsItem) => {
    recordRead(item.category);
    onArticleClick(item);
  };

  const featuredStory = newsData.find(item => item.featured) ?? newsData[0];
  const combinedNews = [...(liveNews ?? []), ...newsData];

  const top = topCategories();

  const filteredNews = combinedNews.filter(item => {
    if (selectedCategory === 'Feed') {
      return !item.featured && item.category !== 'GEAR';
    }
    if (selectedCategory === 'For You') {
      const topThree = top.slice(0, 3);
      return topThree.length > 0 && topThree.includes(item.category);
    }
    if (selectedCategory === 'Tech') return item.category === 'TECH' || item.category === 'AI INTEL';
    if (selectedCategory === 'Gaming') return item.category === 'GAMING';
    if (selectedCategory === 'AI') return item.category === 'AI INTEL';
    return true;
  });

  // For "For You", sort by how frequently the user reads each category
  const displayNews = selectedCategory === 'For You' && top.length > 0
    ? [...filteredNews].sort((a, b) => {
        const aScore = top.indexOf(a.category);
        const bScore = top.indexOf(b.category);
        return (aScore === -1 ? 999 : aScore) - (bScore === -1 ? 999 : bScore);
      })
    : filteredNews;

  const showForYouEmpty = selectedCategory === 'For You' && !hasHistory;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Featured Story */}
      <section className="relative group">
        {loadingLive && !featuredStory ? (
          <SkeletonFeatured />
        ) : (
          <div className="relative h-[480px] w-full rounded-xl overflow-hidden shadow-2xl">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={featuredStory.image}
              alt={featuredStory.title}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full font-label text-[10px] font-black tracking-widest uppercase">
                  {featuredStory.category}
                </span>
                <span className="flex items-center gap-1 text-primary font-label text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" aria-hidden="true"></span>
                  Live
                </span>
              </div>
              <h2 className="font-headline text-4xl font-bold leading-[0.95] tracking-tighter text-on-surface">
                {featuredStory.title.split(':').map((part, i) => (
                  <span key={i}>{part}{i === 0 && <br/>}<span className="text-primary italic">{i === 1 && part}</span></span>
                ))}
              </h2>
              <p className="text-on-surface-variant line-clamp-2 font-body text-lg leading-relaxed max-w-[90%]">
                {featuredStory.summary}
              </p>
              <button
                onClick={() => handleArticleClick(featuredStory)}
                className="bg-primary text-on-primary px-8 py-3 rounded-full font-label font-bold text-sm tracking-wide active:scale-95 transition-all neon-glow hover:scale-105"
              >
                READ ARTICLE
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Live AI Pulse */}
      <LiveInsight topic={featuredStory.title} />

      {/* Category Filter */}
      <div
        className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4"
        role="tablist"
        aria-label="News categories"
      >
        {FEED_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-6 py-2 rounded-full font-label text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              selectedCategory === cat ? 'bg-primary text-on-primary neon-glow' : 'bg-surface text-on-surface-variant hover:bg-surface-bright'
            }`}
          >
            {cat === 'For You' ? (
              <span className="flex items-center gap-1.5">
                <Sparkles size={10} aria-hidden="true" />
                {cat}
              </span>
            ) : cat}
          </button>
        ))}
      </div>

      {/* Latest Transmissions */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-xs font-black tracking-[0.3em] text-primary uppercase border-l-4 border-primary pl-4">
            {selectedCategory === 'For You' ? 'YOUR FEED' : 'LATEST TRANSMISSIONS'}
          </h3>
          <button
            onClick={() => { refresh(); onToast('Fetching live intel...', 'info'); }}
            aria-label="Refresh live news"
            disabled={loadingLive}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
          >
            <RotateCcw size={13} className={loadingLive ? 'animate-spin' : ''} aria-hidden="true" />
            <span className="font-label text-[9px] uppercase tracking-widest">Refresh</span>
          </button>
        </div>

        {/* Live news loading state */}
        {loadingLive && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {loadingLive && (
          <div
            className="p-3 border border-primary/20 rounded-xl bg-primary/5 flex items-center gap-3"
            aria-busy="true"
            aria-label="Loading live news"
          >
            <TrendingUp size={14} className="text-primary shrink-0" aria-hidden="true" />
            <span className="font-label text-[10px] uppercase font-bold text-primary">Gathering Live Intel...</span>
          </div>
        )}

        {/* For You empty state */}
        {showForYouEmpty && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Sparkles size={32} className="text-primary/30" aria-hidden="true" />
            <p className="font-headline text-sm uppercase tracking-[0.2em] text-on-surface-variant/50">
              Read a few articles to unlock your personalised feed
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {displayNews.map((item) => (
            <div
              key={item.id}
              onClick={() => handleArticleClick(item)}
              role="article"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleArticleClick(item)}
              aria-label={item.title}
              className={`glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:scale-[1.01] transition-all duration-300 active:scale-95 ${item.live ? 'border-l-2 border-primary' : ''}`}
            >
              {item.image && (
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden shrink-0">
                  <NewsImage
                    src={item.image}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className={`p-6 ${item.image ? 'md:w-2/3' : 'w-full'} space-y-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${item.live ? 'bg-primary text-on-primary' : 'bg-surface-bright text-tertiary'}`}>
                      {item.category}
                    </span>
                    {item.source_brand && (
                      <span className="text-on-surface-variant text-[8px] font-label uppercase tracking-widest">{item.source_brand}</span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onBookmarkToggle(item.id); }}
                    aria-label={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                    className={`transition-colors active:scale-95 ${isBookmarked(item.id) ? 'text-primary' : 'text-outline hover:text-primary'}`}
                  >
                    {isBookmarked(item.id)
                      ? <BookmarkCheck size={15} />
                      : <Bookmark size={15} />}
                  </button>
                </div>
                <h4 className="font-headline text-xl font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-on-surface-variant font-body text-sm line-clamp-2">
                  {item.live && <span className="text-primary font-bold mr-2 uppercase tracking-tighter">Hook //</span>}
                  {item.smart_summary || item.summary}
                </p>
                {item.live && (
                  <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                    <span className="text-[9px] text-outline uppercase">{item.publish_date}</span>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
