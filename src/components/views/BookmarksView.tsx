import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { newsData, NewsItem } from '../../data/news';
import { CACHE_KEYS } from '../../constants';
import { NewsImage } from '../NewsImage';

interface BookmarksViewProps {
  key?: string | number;
  bookmarks: string[];
  onArticleClick: (item: NewsItem) => void;
  onBookmarkToggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

function getAllNews(): NewsItem[] {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.LIVE_NEWS);
    const live: NewsItem[] = cached ? JSON.parse(cached) : [];
    // Live-first: deduplicate and prioritize live news
    const liveIds = new Set(live.map(n => n.id));
    const uniqueStatic = newsData.filter(n => !liveIds.has(n.id));
    return live.length > 0 ? [...live, ...uniqueStatic] : [...newsData];
  } catch {
    return [...newsData];
  }
}

const CATEGORY_ORDER = ['GAMING', 'TECH', 'AI INTEL', 'GEAR'];

export const BookmarksView = ({ bookmarks, onArticleClick, onBookmarkToggle, isBookmarked }: BookmarksViewProps) => {
  const allNews = getAllNews();
  const saved = bookmarks
    .map(id => allNews.find(n => n.id === id))
    .filter((n): n is NewsItem => n !== undefined);

  // Group by category in a defined order
  const grouped = CATEGORY_ORDER.reduce<Record<string, NewsItem[]>>((acc, cat) => {
    const items = saved.filter(n => n.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="space-y-1 pt-2">
        <h2 className="font-headline text-4xl font-bold tracking-tighter text-on-surface uppercase italic">
          Saved <span className="text-primary">Intel</span>
        </h2>
        <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          {saved.length} article{saved.length !== 1 ? 's' : ''} bookmarked
        </p>
      </div>

      {/* Empty state */}
      {saved.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-40">
          <Bookmark size={40} className="text-on-surface-variant" aria-hidden="true" />
          <div className="text-center space-y-1">
            <p className="font-headline text-sm uppercase tracking-widest text-on-surface">No saved articles yet</p>
            <p className="font-body text-xs text-on-surface-variant">Tap the bookmark icon on any article to save it here</p>
          </div>
        </div>
      )}

      {/* Grouped articles */}
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-4">
          <h3 className="font-headline text-xs font-black tracking-[0.3em] text-primary uppercase border-l-4 border-primary pl-4">
            {category}
          </h3>
          <div className="space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => onArticleClick(item)}
                role="article"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onArticleClick(item)}
                aria-label={item.title}
                className="glass-panel rounded-xl overflow-hidden flex gap-4 group cursor-pointer hover:scale-[1.01] transition-all duration-300 active:scale-95"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 shrink-0 overflow-hidden">
                  <NewsImage
                    src={item.image}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 py-3 pr-4 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-label text-[8px] font-black uppercase tracking-widest text-primary">
                      {item.category}
                    </span>
                    {item.source_brand && (
                      <span className="font-label text-[8px] text-on-surface-variant uppercase tracking-widest">
                        {item.source_brand}
                      </span>
                    )}
                  </div>
                  <h4 className="font-headline text-sm font-bold leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-1">
                    {item.smart_summary ?? item.summary}
                  </p>
                </div>

                {/* Bookmark toggle */}
                <button
                  onClick={e => { e.stopPropagation(); onBookmarkToggle(item.id); }}
                  aria-label="Remove bookmark"
                  className="shrink-0 pr-4 text-primary hover:text-error transition-colors active:scale-95 self-center"
                >
                  <Bookmark size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
};
