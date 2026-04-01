import { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Bolt, 
  Bookmark, 
  LayoutGrid, 
  Cpu, 
  Gamepad2, 
  Rocket, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { summarizeArticle, getKineticInsights, getLiveNews } from './services/GeminiService';
import { newsData, NewsItem } from './data/news';

// --- Icons ---

const LogoK = ({ size = 24, className = "" }) => (
  <img 
    src="/assets/brand/logo.png" 
    width={size} 
    height={size} 
    className={`${className} object-contain`} 
    alt="Kinetic Logo"
  />
);

// --- Types ---

type Screen = 'feed' | 'ai' | 'gear' | 'hub';

// --- AI Components ---

const LiveInsight = ({ topic }: { topic: string }) => {
  const [insight, setInsight] = useState<string>('Analyzing data streams...');
  const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function fetchInsight() {
          try {
            const data = await getKineticInsights(topic);
            setInsight(data);
          } catch (err) {
            setInsight('SIGNAL JAMMED: RE-ESTABLISHING KINETIC PULSE...');
          } finally {
            setLoading(false);
          }
        }
        fetchInsight();
      }, [topic]);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      <div className="flex items-center gap-2 mb-4">
        <Cpu size={16} className="text-primary animate-pulse" />
        <span className="font-label text-[10px] font-black tracking-[0.2em] text-primary uppercase">LIVE AI PULSE : {topic.toUpperCase()}</span>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2">
          <span className="text-[8px] text-primary/60 font-black animate-pulse">SCANNING NEURAL LINKS...</span>
          <div className="flex gap-2">
            <div className="w-1 h-4 bg-primary/40 animate-bounce"></div>
            <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      ) : (
        <p className="text-on-surface font-body text-sm leading-relaxed whitespace-pre-line lowercase italic opacity-80">
          {insight}
        </p>
      )}
    </div>
  );
};

// --- Components ---

const Header = () => (
  <header className="bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_0_20px_rgba(163,255,120,0.05)] fixed top-0 w-full z-50">
    <div className="flex justify-between items-center px-6 h-16 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <LogoK size={28} className="text-primary" />
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
          <img 
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy-B_X3tbgLrlYvoKSJN2xxZq1YXJObI8J6-Zp5AUTpI_KVlM12DxEpbYp0YRuElpJJ-GTTnETb9Sv-3sYUht8QSTBsLiXtpxHLB-iVHN6_qdSyd6e_FNNY1lG-R76sRRb_OyKtaNV4RdYLFUdWeDbP-Zs93Jxob4b3abxsF-yuoiz3GGalWGJL-Zd4fEX5b866UUA7YjAx0CvpD18qfaLc3cYZ3MjltGjtdpaiGt9KJ5a1e1NIcwCy00_wrToFZtMKEUetxRh7Q" 
            alt="Profile"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <h1 className="font-headline tracking-tighter text-2xl font-bold text-primary uppercase italic">KINETIC</h1>
      <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
        <Search size={24} />
      </button>
    </div>
  </header>
);

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const navItems = [
    { id: 'feed' as Screen, label: 'Feed', icon: LayoutGrid },
    { id: 'ai' as Screen, label: 'AI', icon: Cpu },
    { id: 'gear' as Screen, label: 'Gear', icon: Gamepad2 },
    { id: 'hub' as Screen, label: 'Hub', icon: Rocket },
  ];

  return (
    <nav className="bg-background/90 backdrop-blur-2xl fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-2 z-50 rounded-t-[1.5rem] tonal-shift border-t border-primary/5">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            activeScreen === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <item.icon 
            size={22} 
            strokeWidth={activeScreen === item.id ? 3 : 2} 
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
};

// --- Screen Views ---

const FeedView = () => {
  const [selectedCategory, setSelectedCategory] = useState('Feed');
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    async function fetchLive() {
      const CACHE_KEY = 'kinetic_live_news';
      const TIMESTAMP_KEY = 'kinetic_last_fetch';
      const SIXTY_MINUTES = 60 * 60 * 1000;

      const cachedData = localStorage.getItem(CACHE_KEY);
      const lastFetch = localStorage.getItem(TIMESTAMP_KEY);
      const currentTime = Date.now();

      if (cachedData && lastFetch && (currentTime - parseInt(lastFetch)) < SIXTY_MINUTES) {
        console.log("Loading live news from neural cache...");
        setLiveNews(JSON.parse(cachedData));
        return;
      }

      console.log("Transmitting request to Gemini neural link (60m window)...");
      setLoadingLive(true);
      const data = await getLiveNews();
      if (data && Array.isArray(data)) {
        setLiveNews(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(TIMESTAMP_KEY, currentTime.toString());
      }
      setLoadingLive(false);
    }
    fetchLive();
  }, []);

  const featuredStory = newsData.find(item => item.featured) || newsData[0];
  
  const combinedNews = [...liveNews, ...newsData];

  const filteredNews = combinedNews.filter(item => {
    // Prevent showing featured item in the list if it's already in the top section
    if (item.featured && selectedCategory === 'Feed') return false; 
    
    if (selectedCategory === 'Feed') return item.category !== 'GEAR';
    if (selectedCategory === 'Tech') return item.category === 'TECH' || item.category === 'AI INTEL';
    if (selectedCategory === 'Gaming') return item.category === 'GAMING';
    if (selectedCategory === 'AI') return item.category === 'AI INTEL';
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Featured Story */}
      <section className="relative group">
        <div className="relative h-[480px] w-full rounded-xl overflow-hidden shadow-2xl">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src={featuredStory.image} 
            alt="Featured"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full font-label text-[10px] font-black tracking-widest uppercase">{featuredStory.category}</span>
              <span className="flex items-center gap-1 text-primary font-label text-[10px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                Live
              </span>
            </div>
            <h2 className="font-headline text-4xl font-bold leading-[0.95] tracking-tighter text-on-surface">
              {featuredStory.title.split(':').map((part, i) => (
                <span key={i}>{part}{i === 0 && <br/>}<span className="text-primary italic">{i === 1 && part}</span></span>
              ))}
            </h2>
            <p className="text-on-surface-variant line-clamp-2 font-body text-lg leading-relaxed max-w-[90%]">
              {featuredStory.summary}
            </p>
            <button 
              onClick={() => featuredStory.original_url && window.open(featuredStory.original_url, '_blank')}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label font-bold text-sm tracking-wide active:scale-95 transition-all neon-glow hover:scale-105"
            >
              READ ARTICLE
            </button>
          </div>
        </div>
      </section>

      {/* Live AI Pulse */}
      <LiveInsight topic={featuredStory.title} />

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {['Feed', 'Tech', 'Gaming', 'AI'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-6 py-2 rounded-full font-label text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              selectedCategory === cat ? 'bg-primary text-on-primary neon-glow' : 'bg-surface text-on-surface-variant hover:bg-surface-bright'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Latest Transmissions */}
      <div className="space-y-8">
        <h3 className="font-headline text-xs font-black tracking-[0.3em] text-primary uppercase border-l-4 border-primary pl-4">LATEST TRANSMISSIONS</h3>
        
        {/* Live News Injection */}
        {loadingLive && (
          <div className="p-4 border border-primary/20 rounded-xl bg-primary/5 animate-pulse flex items-center gap-3">
            <TrendingUp size={16} className="text-primary" />
            <span className="font-label text-[10px] uppercase font-bold text-primary">Gathering Live Grounding Intel...</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          {filteredNews.map((item) => (
             <div 
               key={item.id} 
               onClick={() => item.original_url && window.open(item.original_url, '_blank')}
               className={`glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:scale-[1.01] transition-all duration-300 active:scale-95 ${item.live ? 'border-l-2 border-primary' : ''}`}
             >
               {item.image && (
                 <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                   <img 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     src={item.image} 
                     alt={item.title}
                     referrerPolicy="no-referrer"
                   />
                 </div>
               )}
               <div className={`p-6 ${item.image ? 'md:w-2/3' : 'w-full'} space-y-3`}>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${item.live ? 'bg-primary text-on-primary' : 'bg-surface-bright text-tertiary'}`}>
                       {item.category}
                     </span>
                     {item.source_brand && <span className="text-on-surface-variant text-[8px] font-label uppercase tracking-widest">{item.source_brand}</span>}
                   </div>
                   {item.live ? (
                     <span className="flex items-center gap-1 text-primary font-label text-[8px] font-bold tracking-widest uppercase">LIVE PULSE</span>
                   ) : (
                     item.readTime && <span className="text-on-surface-variant text-[10px] font-label">{item.readTime}</span>
                   )}
                 </div>
                 <h4 className="font-headline text-xl font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                 <p className="text-on-surface-variant font-body text-sm line-clamp-2">
                   {item.live && <span className="text-primary font-bold mr-2 uppercase tracking-tighter">Hook //</span>}
                   {item.smart_summary || item.summary}
                 </p>
                 {item.live && (
                   <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                     <span className="text-[9px] text-outline uppercase">{item.publish_date}</span>
                     <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AIView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="space-y-12"
  >
    <section className="relative overflow-hidden rounded-2xl p-8 lg:p-12 border border-secondary/10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-background"></div>
        <img 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA96w3YAloDO3A30Ghjxk1S39M9OeNeXqtiskRp2xgXpzCz_4OZ2VliObse-N3eVkCA_eOCvmFHSCpQYS7-pmGq7qFpspl6sr4F1Zoz1WMI5QZYkiJUJTbu-SjTBfAHKA3uNFJ_aAfIXSPPXY5nAHwOqv8idDStGSOzkKIElcZVCYENKsesb7lwQnNbivtsZ0pnRDo5xukl3sXgwDRGHdC706ABj0JTMBIPThPWnUZ1Qk0CokpRR-07qTsuewCBAKSX4PyLsnCSMg" 
          alt="AI Weekly"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Volume 42 • Edition 08</span>
        </div>
        <h2 className="font-headline text-5xl lg:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-none">
          AI <span className="text-secondary italic">WEEKLY</span>
        </h2>
        <p className="text-on-surface-variant text-lg lg:text-xl max-w-md mb-8 leading-relaxed">
          Decoding the intelligence explosion. This week: The frontier shifts as foundational models meet the physical world.
        </p>
        <button className="px-8 py-3 bg-secondary text-on-secondary rounded-full font-label font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all">
          Deep Dive
        </button>
      </div>
    </section>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
          <h3 className="font-headline text-2xl font-bold tracking-tight flex items-center gap-3">
            <span className="w-1 h-8 bg-secondary"></span> OPENAI
          </h3>
          <span className="font-label text-xs text-on-surface-variant">4 UPDATES</span>
        </div>

        <div className="group relative bg-surface-variant rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-secondary/30 transition-all duration-500">
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh-dPKUTSQRh3S7j-ZsjzNqMatrVUI0vV62dfeocwtgAIkiZxYGanvFq6oG8_CUmmbJ8yvUFCNCsmhPrbIY40YPqY8G8HW6TexoCLbhO1n5bO2X24TH1Mf-4OsTaHwxGoObd5GgGXkcLHN-mLpGKU01xrzhLc6R1-nDV1UqOUNWth-M5at4-1OOwZ8N7IWZ5GG_p2sN4bubgzjmzo2LluTU-5QnPtUmK4ixpaJB78IKhxbwi-4nj6uiFsilWp9Ibo5KxXcuswcQA" 
              alt="GPT-5"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-8">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full font-label text-[10px] font-bold uppercase">Multimodal</span>
              <span className="px-3 py-1 bg-surface-bright text-on-surface-variant rounded-full font-label text-[10px] font-bold uppercase">Breaking</span>
            </div>
            <h4 className="font-headline text-3xl font-bold mb-4 leading-tight group-hover:text-secondary transition-colors">
              GPT-5 Framework: The Dawn of Recursive Reasoners
            </h4>
            <p className="text-on-surface-variant mb-8 font-body text-lg leading-relaxed">
              Leaked internal benchmarks suggest the upcoming flagship model achieves 98% on the Mercury reasoning suite, effectively eliminating hallucination in logical syllogisms.
            </p>
            <button className="flex items-center gap-2 font-label text-xs font-black uppercase tracking-widest text-secondary group/btn">
              Full Coverage <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-12">
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold tracking-tight border-b border-outline-variant/30 pb-4">GOOGLE GEMINI</h3>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZLeW1TlEGtC4PRYKpW5YPpK8ZgW0wfq2grp6lRuWwA34qO6kXbwmsRylNBpvOeFmZEmTvoEOYIBt1TtjRocj6gbbTWgPQIS7NhSakUCgmx7UROK8UM5jQY4heDIklxuxN5Mb8FbZrtaS-v8YxiCmQjpIsN5mBfwcbq3hUlCc3VETvPS7aSjXtEGmZKYMrcKS0huJ1Rh_G_zBsupZfJsKptiZaoPKD4eb8LwFj7wkSJcFvew21Yqe7f8G-eNGkEopZnekC1-6mJA" 
                  alt="Gemini"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h6 className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors mb-1">Gemini 1.5 Pro hits 2M Context</h6>
                <span className="font-label text-[9px] text-on-surface-variant uppercase">3h ago • Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-variant rounded-2xl p-6 border-l-4 border-primary shadow-xl">
          <h4 className="font-label text-[10px] font-black tracking-widest text-primary uppercase mb-6">Market Intel</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase">NVIDIA</span>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold">+4.2%</span>
                <TrendingUp size={14} className="text-primary" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase">MSFT</span>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold">+1.8%</span>
                <TrendingUp size={14} className="text-primary" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase">GOOGLE</span>
              <div className="flex items-center gap-2">
                <span className="text-error text-xs font-bold">-0.5%</span>
                <TrendingDown size={14} className="text-error" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const GearView = () => {
  const [selectedBrand, setSelectedBrand] = useState('All Labs');
  const [liveNews] = useState<NewsItem[]>(() => {
    const cached = localStorage.getItem('kinetic_live_news');
    return cached ? JSON.parse(cached) : [];
  });

  const gearItems = [...liveNews, ...newsData].filter(item => item.category === 'GEAR');
  const filteredGear = selectedBrand === 'All Labs' 
    ? gearItems 
    : gearItems.filter(item => (item.brand === selectedBrand || item.source_brand?.toLowerCase().includes(selectedBrand.toLowerCase())));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-16"
    >
      <section className="relative group overflow-hidden rounded-xl bg-surface border border-outline-variant/10">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <img 
          className="w-full h-[500px] object-cover scale-105 group-hover:scale-100 transition-transform duration-700" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuACNHGd0feJTgm2efTvnL6U8jq3MGfoCd6CYMdPKg3IAriTwLbgf0Gxy2yVzRhX_hP1KvqhpxPR8gvdH1wFZC5WNIHwm2ai0npETKjyzJNmJsmPyp-4x11icO5Mrgf0WUu3Ga41FpuK8mqPbZJ_UzHXDRG83YGR4szsCOziOQfrwWHIk4AKZ2X37jTciW0Z73HPt-yRq8yKhuwR_25LaHZhWnPJQ7p45v69iMUZSnbQxKqeB37KDmHS2IzShAAXjdkUhJ8Fjai0HA" 
          alt="Razer"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Hardware of the Week</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-6">
            RAZER HUNTSMAN V3 PRO: THE OPTICAL EVOLUTION.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            Redefining rapid-fire response with adjustable actuation and the world's most advanced optical switches.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-primary/20">
              Deep Dive Specs
            </button>
            <button className="glass-panel border border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-label font-bold uppercase tracking-widest text-xs active:scale-95 transition-all">
              View Gallery
            </button>
          </div>
        </div>
      </section>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['All Labs', 'Razer', 'Corsair', 'Logitech G', 'SteelSeries'].map((brand) => (
          <button 
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-6 py-2 rounded-full border font-label text-xs font-bold uppercase tracking-widest shrink-0 transition-all active:scale-95 ${
              selectedBrand === brand ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:text-primary'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {filteredGear.length > 0 ? filteredGear.map((item) => (
            <article 
              key={item.id} 
              onClick={() => item.original_url && window.open(item.original_url, '_blank')}
              className="bg-surface rounded-xl overflow-hidden group border border-outline-variant/5 cursor-pointer active:scale-95 transition-all"
            >
              <div className="relative aspect-video">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={item.image} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-sm font-label text-[10px] font-extrabold uppercase tracking-widest">{item.brand || 'Performance Lab'}</span>
              </div>
              <div className="p-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-on-surface-variant leading-relaxed mb-6 italic">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">{item.readTime || '5 min read'}</span>
                    <span className="text-outline">•</span>
                    <span className="font-label text-xs text-primary uppercase tracking-widest">Tech Report</span>
                  </div>
                  <Bookmark size={18} className="text-outline hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            </article>
          )) : (
            <div className="text-center py-20 opacity-40">
              <p className="font-headline text-xs uppercase tracking-[0.5em]">SECTOR QUIET: NO RECENT INTEL DETECTED.</p>
            </div>
          )}
        </div>

        <aside className="md:col-span-4 space-y-8">
          <div className="bg-surface-bright rounded-xl p-8 border-l-2 border-primary neon-pulse">
            <h4 className="font-headline text-lg font-bold uppercase tracking-tighter mb-6">Market Vitals</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">GPU Index</span>
                <span className="text-primary font-headline font-bold">+4.2%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary shadow-[0_0_8px_rgba(156,255,147,1)]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">SSD Scarcity</span>
                <span className="text-secondary font-headline font-bold">CRITICAL</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="w-11/12 h-full bg-secondary"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

const HubView = () => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="space-y-12"
  >
    <section className="relative w-full h-[530px] rounded-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
      <img 
        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJD6cQE2s583bP1tShzH4Q4gqXevXxuUwLsrLDZ9KI2MZko33H7_jb9Pq0Ne6eSe_D-SI1fXxAQJjVVxmqRnWCdI5rUEqVFeXq_npplNyVQoLM0XFz8D9a6ljQz6n0-zCj3H__V9CNp6I5qE9NZgSfvvi9_VjnCNCPbXSRwXT0GznDNuDqNEhDqRJmafn67mDaHmGY3O-tl_m4HDjcKa5XA8EoUP1c4oWAPiw7fKAtlwmK8CayRJ8TTVx8wh7HEiC1awJrV_gyyg" 
        alt="Marathon"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest font-bold rounded-full">New Release</span>
          <div className="flex items-center text-primary">
            <TrendingUp size={14} fill="currentColor" />
            <span className="font-headline font-bold ml-1">9.8/10</span>
          </div>
        </div>
        <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-4 uppercase leading-none italic">MARATHON</h2>
        <p className="text-on-surface-variant text-lg md:text-xl font-body mb-8 max-w-lg leading-relaxed">
          Bungie's premier extraction shooter returns. A high-stakes sci-fi experience reimagined for the 2026 competitive landscape.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-primary text-on-primary font-label font-bold rounded-full hover:opacity-90 active:scale-95 transition-all">
            PRE-ORDER NOW
          </button>
          <button className="px-8 py-3 bg-surface text-on-surface font-label font-bold rounded-full border border-outline-variant/30 backdrop-blur-md hover:bg-surface-bright transition-all">
            VIEW DETAILS
          </button>
        </div>
      </div>
    </section>

    <div className="flex justify-between items-end mb-8">
      <div>
        <h3 className="font-headline text-3xl font-bold tracking-tight text-primary uppercase italic">The Hub</h3>
        <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-1">Recently Launched & Coming Soon</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 group cursor-pointer">
        <div className="h-full bg-surface rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all duration-300">
          <div className="relative h-64 md:h-full flex flex-col">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsznI8JaLB9Uu9_AEjSM4jnflbvambXF9NKzvpx7mTcEFn2qJ_yzNd0q_wsnD6DlkPs1138AfUnVIngJyGxd3IEVhFj9gutQwsvx3THCrurnyr9bznTvqJcDQsVvOfVxjqlmHEE8JWzKe3hqmF3uZj4EeOB99OAvU0WwVTYy_JVCHnMxqeXbirCFM9LWjuL8ccHL3dcqJFt-ph3_UuaLyE_5g5XI-hBwTd9x6YWQZ5aq2pOtddv9AquZ8chX44QkqSVDpc-nstg" 
              alt="Astra"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-variant via-transparent to-transparent"></div>
            <div className="mt-auto p-8 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="font-label text-[10px] text-primary uppercase tracking-widest font-black">Editor's Choice</span>
              </div>
              <h4 className="font-headline text-4xl font-bold text-on-surface uppercase italic mb-2 tracking-tighter">ASTRA : BEYOND</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl font-black text-secondary">9.5</span>
                  <span className="font-label text-xs text-on-surface-variant uppercase">/ 10 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-variant rounded-xl p-6 border border-outline-variant/10 hover:bg-surface transition-all group cursor-pointer">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcivuhczCykgO3uudDYtECE8tAGpNo4x0mHKRXOJ8uwdPXTRrrw_rkfNfkDwA3gRq3zV77ES6h4X3iA0G-KYcwBrY9PqqeNhFRQs6_v7FquNtNOxvoJf8aK-8zUHtPq8MS4UDmLU38v_PclXr2hvj5snAwlHI1pddx_C-krMtQZW7yhMwhbO7qqEo_DHaz2kIJqUs1gWEa3C16fKIaEj96UAtaqDcKgdvALFgwbxmOASFPvtPWMAIXB-i-rBSFzmZnpOMGQSbR2A" 
                alt="Pixel Rush"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h5 className="font-headline font-bold text-on-surface text-lg leading-tight uppercase tracking-tight">PIXEL RUSH</h5>
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mt-1">Retro Platformer</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-primary">
              <TrendingUp size={14} fill="currentColor" />
              <span className="font-headline font-bold ml-1">8.9</span>
            </div>
            <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold">Oct 12, 2024</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('feed');

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {screen === 'feed' && <FeedView key="feed" />}
          {screen === 'ai' && <AIView key="ai" />}
          {screen === 'gear' && <GearView key="gear" />}
          {screen === 'hub' && <HubView key="hub" />}
        </AnimatePresence>
      </main>

      <BottomNav activeScreen={screen} setScreen={setScreen} />
    </div>
  );
}
