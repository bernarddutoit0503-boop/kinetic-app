import { Search, Zap, LogIn, LogOut } from 'lucide-react';
import { useStreak } from '../hooks/useStreak';
import { useAuth } from '../context/AuthContext';

const LogoK = ({ size = 24, className = "" }) => (
  <img
    src="/assets/brand/logo.png"
    width={size}
    height={size}
    className={`${className} object-contain`}
    alt="Kinetic Logo"
  />
);

interface HeaderProps {
  onSearchClick: () => void;
  onAuthClick: () => void;
}

export const Header = ({ onSearchClick, onAuthClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { streak, justUnlocked } = useStreak(user?.id ?? null);

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_0_20px_rgba(163,255,120,0.05)] fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-6 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <LogoK size={28} className="text-primary" />
          {user ? (
            <div
              title={user.email ?? 'Signed in'}
              className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
            >
              <span className="font-label text-[10px] font-black text-primary uppercase">
                {(user.email ?? 'U')[0].toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy-B_X3tbgLrlYvoKSJN2xxZq1YXJObI8J6-Zp5AUTpI_KVlM12DxEpbYp0YRuElpJJ-GTTnETb9Sv-3sYUht8QSTBsLiXtpxHLB-iVHN6_qdSyd6e_FNNY1lG-R76sRRb_OyKtaNV4RdYLFUdWeDbP-Zs93Jxob4b3abxsF-yuoiz3GGalWGJL-Zd4fEX5b866UUA7YjAx0CvpD18qfaLc3cYZ3MjltGjtdpaiGt9KJ5a1e1NIcwCy00_wrToFZtMKEUetxRh7Q"
                alt="Guest"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        <h1 className="font-headline tracking-tighter text-2xl font-bold text-primary uppercase italic">KINETIC</h1>

        <div className="flex items-center gap-3">
          {/* Reading streak */}
          <div
            aria-label={`${streak}-day reading streak`}
            title={`${streak}-day streak`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
              justUnlocked
                ? 'border-primary bg-primary/15 text-primary animate-pulse'
                : 'border-outline-variant/30 text-on-surface-variant'
            }`}
          >
            <Zap
              size={11}
              className={justUnlocked ? 'text-primary fill-primary' : 'text-on-surface-variant'}
              aria-hidden="true"
            />
            <span className="font-label text-[9px] font-black uppercase tracking-widest">
              {streak}D
            </span>
          </div>

          {/* Auth button */}
          {user ? (
            <button
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
              className="text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              aria-label="Sign in"
              title="Sign in"
              className="text-primary hover:opacity-80 transition-opacity active:scale-95"
            >
              <LogIn size={18} />
            </button>
          )}

          <button
            aria-label="Search articles"
            onClick={onSearchClick}
            className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <Search size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
