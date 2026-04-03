import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArticleModal } from './components/ArticleModal';
import { SearchOverlay } from './components/SearchOverlay';
import { FeedView } from './components/views/FeedView';
import { AIView } from './components/views/AIView';
import { GearView } from './components/views/GearView';
import { HubView } from './components/views/HubView';
import { useBookmarks } from './hooks/useBookmarks';
import { getLiveServiceEvents } from './services/GeminiService';
import { Screen } from './types';
import { NewsItem } from './data/news';
import { CACHE_KEYS, CACHE_TTL_EVENTS_MS } from './constants';

export default function App() {
  const [screen, setScreen] = useState<Screen>('feed');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Background prefetch: silently warm up the Hub events cache while the user
  // reads the Feed, so navigating to Hub is instant. Uses a 2-second delay to
  // avoid competing with the primary live-news fetch on load.
  useEffect(() => {
    const timer = setTimeout(() => {
      const cached = localStorage.getItem(CACHE_KEYS.LIVE_EVENTS);
      const lastFetch = localStorage.getItem(CACHE_KEYS.LIVE_EVENTS_TIME);
      const isFresh = cached && lastFetch && (Date.now() - parseInt(lastFetch)) < CACHE_TTL_EVENTS_MS;
      if (!isFresh) {
        getLiveServiceEvents().then(data => {
          if (data) {
            localStorage.setItem(CACHE_KEYS.LIVE_EVENTS, JSON.stringify(data));
            localStorage.setItem(CACHE_KEYS.LIVE_EVENTS_TIME, Date.now().toString());
          }
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const openArticle = (item: NewsItem) => setActiveArticle(item);

  return (
    <div className="min-h-screen pb-24">
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {screen === 'feed' && (
              <FeedView
                key="feed"
                onArticleClick={openArticle}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
              />
            )}
            {screen === 'ai' && <AIView key="ai" />}
            {screen === 'gear' && (
              <GearView
                key="gear"
                onArticleClick={openArticle}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
              />
            )}
            {screen === 'hub' && <HubView key="hub" />}
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <BottomNav activeScreen={screen} setScreen={setScreen} />

      {/* Global article reader modal */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleModal
            key="article-modal"
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
            isBookmarked={isBookmarked(activeArticle.id)}
            onBookmarkToggle={() => toggleBookmark(activeArticle.id)}
          />
        )}
      </AnimatePresence>

      {/* Global search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            key="search-overlay"
            onClose={() => setIsSearchOpen(false)}
            onArticleClick={(item) => {
              setIsSearchOpen(false);
              setActiveArticle(item);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
