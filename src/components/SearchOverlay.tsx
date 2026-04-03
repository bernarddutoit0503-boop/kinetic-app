import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { newsData, NewsItem } from '../data/news';
import { CACHE_KEYS } from '../constants';

interface SearchOverlayProps {
  key?: string | number; // React 19: key must be declared in props interface
  onClose: () => void;
  onArticleClick: (item: NewsItem) => void;
}

function getAllNews(): NewsItem[] {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.LIVE_NEWS);
    const live: NewsItem[] = cached ? JSON.parse(cached) : [];
    // Deduplicate by id in case live news overlaps with static
    const seen = new Set(newsData.map(n => n.id));
    const uniqueLive = live.filter(n => !seen.has(n.id));
    return [...uniqueLive, ...newsData];
  } catch {
    return [...newsData];
  }
}

const BROWSE_CATEGORIES = ['TECH', 'GAMING', 'AI INTEL', 'GEAR'] as const;

export const SearchOverlay = ({ onClose, onArticleClick }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const allNews = getAllNews();

  const results = query.trim().length > 1
    ? allNews.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.source_brand?.toLowerCase().includes(query.toLowerCase()) ||
        item.summary?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60]"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 right-0 z-[70] px-4 pt-4 max-w-2xl mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
          {/* Search input bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/20">
            <Search size={18} className="text-primary shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search news, gear, AI..."
              aria-label="Search articles"
              className="flex-1 bg-transparent text-on-surface font-body text-base outline-none placeholder:text-on-surface-variant/40"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results list */}
          {query.trim().length > 1 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">No results found</p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {results.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onArticleClick(item)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-bright transition-colors text-left"
                    >
                      {item.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-bright">
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-label text-[8px] font-black uppercase tracking-widest text-primary">
                            {item.category}
                          </span>
                          {item.source_brand && (
                            <span className="font-label text-[8px] text-on-surface-variant uppercase">
                              {item.source_brand}
                            </span>
                          )}
                        </div>
                        <p className="font-headline text-sm font-bold text-on-surface truncate">{item.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Browse categories (shown when query is empty) */}
          {query.trim().length <= 1 && (
            <div className="p-5">
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                Browse by category
              </p>
              <div className="flex flex-wrap gap-2">
                {BROWSE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-4 py-2 rounded-full bg-surface-bright text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest border border-outline-variant/30 hover:text-primary hover:border-primary transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
