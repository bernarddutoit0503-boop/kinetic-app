import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArticleModal } from './components/ArticleModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { FeedView } from './components/views/FeedView';
import { AIView } from './components/views/AIView';
import { GearView } from './components/views/GearView';
import { HubView } from './components/views/HubView';
import { BookmarksView } from './components/views/BookmarksView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useBookmarks } from './hooks/useBookmarks';
import { useToast } from './hooks/useToast';
import { getLiveServiceEvents, getLiveNews } from './services/GeminiService';
import { Screen } from './types';
import { NewsItem } from './data/news';
import { CACHE_KEYS, CACHE_TTL_EVENTS_MS, CACHE_TTL_NEWS_MS } from './constants';

// Auth prompt: show once per session if user is not signed in
const AUTH_PROMPT_KEY = 'kinetic_auth_prompted';

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('feed');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { bookmarks, isBookmarked, toggle: toggleBookmarkRaw } = useBookmarks(user?.id ?? null);
  const { toasts, toast, dismiss } = useToast();

  // Show auth modal once per session if not signed in
  useEffect(() => {
    if (authLoading) return;
    if (user) return;
    const alreadyPrompted = sessionStorage.getItem(AUTH_PROMPT_KEY);
    if (!alreadyPrompted) {
      const timer = setTimeout(() => {
        setIsAuthOpen(true);
        sessionStorage.setItem(AUTH_PROMPT_KEY, '1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

  // Close auth modal when user successfully signs in
  useEffect(() => {
    if (user) setIsAuthOpen(false);
  }, [user]);

  const toggleBookmark = (id: string) => {
    const wasSaved = isBookmarked(id);
    toggleBookmarkRaw(id);
    toast(wasSaved ? 'Bookmark removed' : 'Article saved', wasSaved ? 'info' : 'success');
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Background prefetch: warm up news + Hub events caches on load
  useEffect(() => {
    /** Check if cached data is stale (expired TTL or from a previous day) */
    const isStale = (cacheKey: string, timeKey: string, ttl: number) => {
      const cached = localStorage.getItem(cacheKey);
      const lastFetch = localStorage.getItem(timeKey);
      if (!cached || !lastFetch) return true;
      const fetchTime = parseInt(lastFetch);
      // Stale if TTL expired OR if data is from a previous calendar day
      if (Date.now() - fetchTime >= ttl) return true;
      const cachedDate = new Date(fetchTime).toDateString();
      const today = new Date().toDateString();
      return cachedDate !== today;
    };

    // Prefetch live news immediately if stale (ensures fresh daily content)
    if (isStale(CACHE_KEYS.LIVE_NEWS, CACHE_KEYS.LIVE_NEWS_TIME, CACHE_TTL_NEWS_MS)) {
      getLiveNews().then(data => {
        if (data) {
          localStorage.setItem(CACHE_KEYS.LIVE_NEWS, JSON.stringify(data));
          localStorage.setItem(CACHE_KEYS.LIVE_NEWS_TIME, Date.now().toString());
        }
      });
    }

    // Prefetch Hub events 2s later (lower priority)
    const timer = setTimeout(() => {
      if (isStale(CACHE_KEYS.LIVE_EVENTS, CACHE_KEYS.LIVE_EVENTS_TIME, CACHE_TTL_EVENTS_MS)) {
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
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />

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

      {/* Auth modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal key="auth-modal" onClose={() => setIsAuthOpen(false)} />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
