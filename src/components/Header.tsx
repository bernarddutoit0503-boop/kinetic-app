import { Search } from 'lucide-react';

const LogoK = ({ size = 24, className = "" }) => (
  <img
    src="/assets/brand/logo.png"
    width={size}
    height={size}
    className={`${className} object-contain`}
    alt="Kinetic Logo"
  />
);

export const Header = () => (
  <header className="bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_0_20px_rgba(163,255,120,0.05)] fixed top-0 w-full z-50">
    <div className="flex justify-between items-center px-6 h-16 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <LogoK size={28} className="text-primary" />
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
          <img
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy-B_X3tbgLrlYvoKSJN2xxZq1YXJObI8J6-Zp5AUTpI_KVlM12DxEpbYp0YRuElpJJ-GTTnETb9Sv-3sYUht8QSTBsLiXtpxHLB-iVHN6_qdSyd6e_FNNY1lG-R76sRRb_OyKtaNV4RdYLFUdWeDbP-Zs93Jxob4b3abxsF-yuoiz3GGalWGJL-Zd4fEX5b866UUA7YjAx0CvpD18qfaLc3cYZ3MjltGjtdpaiGt9KJ5a1e1NIcwCy00_wrToFZtMKEUetxRh7Q"
            alt="User profile"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <h1 className="font-headline tracking-tighter text-2xl font-bold text-primary uppercase italic">KINETIC</h1>
      <button aria-label="Search" className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
        <Search size={24} aria-hidden="true" />
      </button>
    </div>
  </header>
);
