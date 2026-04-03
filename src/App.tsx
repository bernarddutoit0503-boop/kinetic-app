import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FeedView } from './components/views/FeedView';
import { AIView } from './components/views/AIView';
import { GearView } from './components/views/GearView';
import { HubView } from './components/views/HubView';
import { Screen } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('feed');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {screen === 'feed' && <FeedView key="feed" />}
            {screen === 'ai' && <AIView key="ai" />}
            {screen === 'gear' && <GearView key="gear" />}
            {screen === 'hub' && <HubView key="hub" />}
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <BottomNav activeScreen={screen} setScreen={setScreen} />
    </div>
  );
}
