import { LayoutGrid, Cpu, Gamepad2, Rocket, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  setScreen: (s: Screen) => void;
  bookmarkCount: number;
}

const NAV_ITEMS = [
  { id: 'feed'  as Screen, label: 'Feed',  icon: LayoutGrid },
  { id: 'ai'   as Screen, label: 'AI',    icon: Cpu        },
  { id: 'gear' as Screen, label: 'Gear',  icon: Gamepad2   },
  { id: 'hub'  as Screen, label: 'Hub',   icon: Rocket     },
  { id: 'saved' as Screen, label: 'Saved', icon: Bookmark   },
];

export const BottomNav = ({ activeScreen, setScreen, bookmarkCount }: BottomNavProps) => (
  <nav className="bg-background/90 backdrop-blur-2xl fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-2 pb-2 z-50 rounded-t-[1.5rem] tonal-shift border-t border-primary/5">
    {NAV_ITEMS.map((item) => {
      const isActive = activeScreen === item.id;
      const showBadge = item.id === 'saved' && bookmarkCount > 0 && !isActive;

      return (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          aria-label={`Navigate to ${item.label}`}
          aria-current={isActive ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 transition-all relative px-2 ${
            isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className="relative">
            <item.icon
              size={22}
              strokeWidth={isActive ? 3 : 2}
              aria-hidden="true"
              className={isActive ? 'drop-shadow-[0_0_8px_rgba(163,255,120,0.6)]' : ''}
            />
            {showBadge && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-primary text-on-primary rounded-full font-label text-[8px] font-black flex items-center justify-center px-0.5">
                {bookmarkCount > 99 ? '99' : bookmarkCount}
              </span>
            )}
          </div>
          <span className="font-label text-[10px] font-bold tracking-widest uppercase">{item.label}</span>
          {isActive && (
            <motion.div
              layoutId="nav-glow"
              className="absolute -inset-2 bg-primary/10 blur-xl rounded-full -z-10"
            />
          )}
        </button>
      );
    })}
  </nav>
);
