import { LayoutGrid, Cpu, Gamepad2, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen } from '../types';

const NAV_ITEMS = [
  { id: 'feed' as Screen, label: 'Feed', icon: LayoutGrid },
  { id: 'ai' as Screen, label: 'AI', icon: Cpu },
  { id: 'gear' as Screen, label: 'Gear', icon: Gamepad2 },
  { id: 'hub' as Screen, label: 'Hub', icon: Rocket },
];

interface BottomNavProps {
  activeScreen: Screen;
  setScreen: (s: Screen) => void;
}

export const BottomNav = ({ activeScreen, setScreen }: BottomNavProps) => (
  <nav className="bg-background/90 backdrop-blur-2xl fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-2 z-50 rounded-t-[1.5rem] tonal-shift border-t border-primary/5">
    {NAV_ITEMS.map((item) => (
      <button
        key={item.id}
        onClick={() => setScreen(item.id)}
        aria-label={`Navigate to ${item.label}`}
        aria-current={activeScreen === item.id ? 'page' : undefined}
        className={`flex flex-col items-center gap-1 transition-all relative ${
          activeScreen === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <item.icon
          size={22}
          strokeWidth={activeScreen === item.id ? 3 : 2}
          aria-hidden="true"
          className={activeScreen === item.id ? 'drop-shadow-[0_0_8px_rgba(163,255,120,0.6)]' : ''}
        />
        <span className="font-label text-[10px] font-bold tracking-widest uppercase">{item.label}</span>
        {activeScreen === item.id && (
          <motion.div
            layoutId="nav-glow"
            className="absolute -inset-2 bg-primary/10 blur-xl rounded-full -z-10"
          />
        )}
      </button>
    ))}
  </nav>
);
