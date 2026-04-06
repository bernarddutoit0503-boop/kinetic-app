import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArticleModal } from './components/ArticleModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ToastContainer } from './components/ToastContainer';
import { FeedView } from './components/views/FeedView';
import { AIView } from './components/views/AIView';
import { GearView } from './components/views/GearView';
import { HubView } from './components/views/HubView';
import { BookmarksView } from './components/views/BookmarksView';
import { useBookmarks } from './hooks/useBookmarks';
import { useToast } from './hooks/useToast';
import { getLiveServiceEvents } from './services/GeminiService';
import { Screen } from './types';
import { NewsItem } from './data/news';
import { CACHE_KEYS, CACHE_TTL_EVENTS_MS } from './constants';

export default function App() {
  const [screen, setScreen] = useState<Screen>('feed');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarks, isBookmarked, toggle: toggleBookmarkRaw } = useBookmarks();
  const { toasts, toast, dismiss } = useToast();

  // Wrap bookmark toggle so it fires a toast from anywhere (feed cards, gear cards, modal)
  const toggleBookmark = (id: string) => {
    const wasSaved = isBookmarked(id);
    toggleBookmarkRaw(id);
    toast(wasSaved ? 'Bookmark removed' : 'Article saved', wasSaved ? 'info' : 'success');
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Background prefetch: warm up Hub events cache 2 s after load
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

  return (
    <div className="min-h-screen pb-24">
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {screen === 'feed' && (
              <FeedView
                key="feed"
                onArticleClick={setActiveArticle}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
                onToast={toast}
              />
            )}
            {screen === 'ai' && <AIView key="ai" />}
            {screen === 'gear' && (
              <GearView
                key="gear"
                onArticleClick={setActiveArticle}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
              />
            )}
            {screen === 'hub' && <HubView key="hub" />}
            {screen === 'saved' && (
              <BookmarksView
                key="saved"
                bookmarks={bookmarks}
                onArticleClick={setActiveArticle}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
              />
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <BottomNav
        activeScreen={screen}
        setScreen={setScreen}
        bookmarkCount={bookmarks.length}
      />

      {/* Global article reader modal */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleModal
            key="article-modal"
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
            isBookmarked={isBookmarked(activeArticle.id)}
            onBookmarkToggle={() => toggleBookmarkRaw(activeArticle.id)}
            onToast={toast}
          />
        )}
      </AnimatePresence>

      {/* Global search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            key="search-overlay"
            onClose={() => setIsSearchOpen(false)}
            onArticleClick={item => {
              setIsSearchOpen(false);
              setActiveArticle(item);
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
