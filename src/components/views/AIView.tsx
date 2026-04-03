import { ArrowRight, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

// ── Types ──────────────────────────────────────────────────────────────────

interface QuickBriefItem {
  key?: string | number;
  tag: string;
  company: string;
  title: string;
  meta: string;
  url: string;
  accent: 'primary' | 'secondary' | 'tertiary';
}

// ── Quick brief card (compact row) ─────────────────────────────────────────

const QuickBrief = ({ tag, company, title, meta, url, accent }: QuickBriefItem) => {
  const tagClass = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    tertiary: 'bg-tertiary/20 text-tertiary',
  }[accent];

  return (
    <button
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      className="w-full flex items-center gap-4 p-4 bg-surface rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all group text-left active:scale-95"
    >
      <span className={`shrink-0 px-2 py-1 rounded font-label text-[8px] font-black uppercase tracking-widest ${tagClass}`}>
        {tag}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-label text-[8px] text-on-surface-variant uppercase tracking-widest mb-0.5">{company}</p>
        <p className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{title}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-label text-[8px] text-on-surface-variant uppercase">{meta}</p>
        <ExternalLink size={12} className="text-outline group-hover:text-primary transition-colors mt-1 ml-auto" aria-hidden="true" />
      </div>
    </button>
  );
};

// ── Company section header ──────────────────────────────────────────────────

const SectionHeader = ({ name, count, color = 'secondary' }: { name: string; count: string; color?: string }) => (
  <div className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
    <h3 className="font-headline text-2xl font-bold tracking-tight flex items-center gap-3">
      <span className={`w-1 h-8 bg-${color}`} aria-hidden="true" />
      {name}
    </h3>
    <span className="font-label text-xs text-on-surface-variant">{count}</span>
  </div>
);

// ── Feature article card ────────────────────────────────────────────────────

interface FeatureCardProps {
  tags: string[];
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  url: string;
  accentColor?: string;
}

const FeatureCard = ({ tags, title, body, image, imageAlt, url, accentColor = 'secondary' }: FeatureCardProps) => (
  <div className={`group relative bg-surface-variant rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-${accentColor}/30 transition-all duration-500`}>
    <div className="aspect-[16/9] overflow-hidden">
      <img
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        src={image}
        alt={imageAlt}
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="p-8">
      <div className="flex gap-2 mb-4 flex-wrap">
        {tags.map(t => (
          <span key={t} className={`px-3 py-1 bg-${accentColor}/20 text-${accentColor} rounded-full font-label text-[10px] font-bold uppercase`}>{t}</span>
        ))}
      </div>
      <h4 className={`font-headline text-3xl font-bold mb-4 leading-tight group-hover:text-${accentColor} transition-colors`}>
        {title}
      </h4>
      <p className="text-on-surface-variant mb-8 font-body text-lg leading-relaxed">{body}</p>
      <button
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        className={`flex items-center gap-2 font-label text-xs font-black uppercase tracking-widest text-${accentColor} group/btn`}
      >
        Full Coverage <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
      </button>
    </div>
  </div>
);

// ── Main view ──────────────────────────────────────────────────────────────

const QUICK_BRIEFS: QuickBriefItem[] = [
  {
    tag: 'Agents',
    company: 'OpenAI',
    title: 'Operator can now browse, book & purchase autonomously',
    meta: '2h ago',
    url: 'https://openai.com/operator',
    accent: 'secondary',
  },
  {
    tag: 'On-Device',
    company: 'Apple',
    title: 'Apple Intelligence Private Cloud Compute opens to researchers',
    meta: '5h ago',
    url: 'https://security.apple.com/blog/private-cloud-compute/',
    accent: 'primary',
  },
  {
    tag: 'Open Source',
    company: 'Meta AI',
    title: 'Llama 4 Scout: 17B active params, 109B total — beats GPT-4o on reasoning',
    meta: '1d ago',
    url: 'https://llama.meta.com/',
    accent: 'tertiary',
  },
  {
    tag: 'Coding',
    company: 'Microsoft',
    title: 'GitHub Copilot Workspace goes GA — full repo editing via chat',
    meta: '1d ago',
    url: 'https://githubnext.com/projects/copilot-workspace',
    accent: 'secondary',
  },
  {
    tag: 'Gaming AI',
    company: 'Ubisoft',
    title: 'NEO NPC: LLM-driven characters with persistent memory ship in Resurgence',
    meta: '2d ago',
    url: 'https://news.ubisoft.com/',
    accent: 'primary',
  },
  {
    tag: 'Robotics',
    company: 'Google DeepMind',
    title: 'ALOHA Unleashed learns dexterous tasks from 1 human demo in under a minute',
    meta: '3d ago',
    url: 'https://deepmind.google/discover/blog/',
    accent: 'tertiary',
  },
];

export const AIView = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    className="space-y-12"
  >
    {/* ── Hero banner ── */}
    <section className="relative overflow-hidden rounded-2xl p-8 lg:p-12 border border-secondary/10">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-background" />
        <img
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA96w3YAloDO3A30Ghjxk1S39M9OeNeXqtiskRp2xgXpzCz_4OZ2VliObse-N3eVkCA_eOCvmFHSCpQYS7-pmGq7qFpspl6sr4F1Zoz1WMI5QZYkiJUJTbu-SjTBfAHKA3uNFJ_aAfIXSPPXY5nAHwOqv8idDStGSOzkKIElcZVCYENKsesb7lwQnNbivtsZ0pnRDo5xukl3sXgwDRGHdC706ABj0JTMBIPThPWnUZ1Qk0CokpRR-07qTsuewCBAKSX4PyLsnCSMg"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Volume 42 • Edition 08</span>
        </div>
        <h2 className="font-headline text-5xl lg:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-none">
          AI <span className="text-secondary italic">WEEKLY</span>
        </h2>
        <p className="text-on-surface-variant text-lg lg:text-xl max-w-md mb-8 leading-relaxed">
          Decoding the intelligence explosion. Frontier models hit the physical world, agents go autonomous, and gaming AI gets a permanent upgrade.
        </p>
      </div>
    </section>

    {/* ── Quick briefs ── */}
    <div className="space-y-4">
      <h3 className="font-headline text-xs font-black tracking-[0.3em] text-primary uppercase border-l-4 border-primary pl-4">
        RAPID INTEL
      </h3>
      <div className="space-y-2">
        {QUICK_BRIEFS.map(brief => (
          <QuickBrief key={brief.title} {...brief} />
        ))}
      </div>
    </div>

    {/* ── Main two-col grid ── */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

      {/* LEFT — feature articles */}
      <div className="lg:col-span-8 space-y-10">

        {/* OpenAI */}
        <div className="space-y-6">
          <SectionHeader name="OPENAI" count="3 UPDATES" />
          <FeatureCard
            tags={['Reasoning', 'Breaking']}
            title="GPT-5: The Dawn of Recursive Reasoners"
            body="Leaked internal benchmarks suggest GPT-5 hits 98% on the Mercury reasoning suite, effectively eliminating hallucination in logical syllogisms. A step-change above o3 in structured tasks."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCh-dPKUTSQRh3S7j-ZsjzNqMatrVUI0vV62dfeocwtgAIkiZxYGanvFq6oG8_CUmmbJ8yvUFCNCsmhPrbIY40YPqY8G8HW6TexoCLbhO1n5bO2X24TH1Mf-4OsTaHwxGoObd5GgGXkcLHN-mLpGKU01xrzhLc6R1-nDV1UqOUNWth-M5at4-1OOwZ8N7IWZ5GG_p2sN4bubgzjmzo2LluTU-5QnPtUmK4ixpaJB78IKhxbwi-4nj6uiFsilWp9Ibo5KxXcuswcQA"
            imageAlt="GPT-5 article"
            url="https://openai.com/blog"
            accentColor="secondary"
          />
        </div>

        {/* Anthropic */}
        <div className="space-y-6">
          <SectionHeader name="ANTHROPIC" count="2 UPDATES" color="primary" />
          <FeatureCard
            tags={['Extended Thinking', 'Coding']}
            title="Claude 3.7 Sonnet: Hybrid Reasoning on Demand"
            body="Claude 3.7 Sonnet's hybrid reasoning mode lets it toggle between near-instant replies and deep chain-of-thought depending on task complexity — producing state-of-the-art results on SWE-bench with 62.3% solve rate."
            image="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop"
            imageAlt="Claude 3.7 Sonnet"
            url="https://www.anthropic.com/claude/sonnet"
            accentColor="primary"
          />
        </div>

        {/* Meta */}
        <div className="space-y-6">
          <SectionHeader name="META AI" count="2 UPDATES" color="tertiary" />
          <FeatureCard
            tags={['Open Source', 'Multimodal']}
            title="Llama 4: Mixture-of-Experts Goes Open Weight"
            body="Meta's Llama 4 Scout deploys 17B active parameters from a 109B total MoE architecture, delivering GPT-4o-class performance in an open-weight package that runs on a single H100 for inference."
            image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop"
            imageAlt="Llama 4 meta"
            url="https://llama.meta.com/"
            accentColor="tertiary"
          />
        </div>

        {/* Google DeepMind */}
        <div className="space-y-6">
          <SectionHeader name="GOOGLE DEEPMIND" count="3 UPDATES" color="secondary" />
          <FeatureCard
            tags={['World Models', 'Gaming']}
            title="Genie 2: Infinite Playable Worlds from a Single Image"
            body="Genie 2 generates fully playable, physics-consistent 3D environments from a single prompt image at interactive frame rates. Indie studios could prototype full game worlds in seconds rather than months."
            image="https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&auto=format&fit=crop"
            imageAlt="Genie 2 world model"
            url="https://deepmind.google/discover/blog/"
            accentColor="secondary"
          />
        </div>
      </div>

      {/* RIGHT — sidebar */}
      <div className="lg:col-span-4 space-y-10">

        {/* Google Gemini sidebar */}
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold tracking-tight border-b border-outline-variant/30 pb-4">GOOGLE GEMINI</h3>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Gemini 2.5 Pro hits 2M token context', meta: '1h ago • Infrastructure', url: 'https://deepmind.google/technologies/gemini/' },
              { title: 'Gemini Live adds real-time screen sharing', meta: '4h ago • Mobile', url: 'https://deepmind.google/technologies/gemini/' },
              { title: 'NotebookLM Audio Overviews go multilingual', meta: '1d ago • Productivity', url: 'https://notebooklm.google.com/' },
            ].map(item => (
              <button
                key={item.title}
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                className="flex gap-4 group text-left"
              >
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-surface-bright">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZLeW1TlEGtC4PRYKpW5YPpK8ZgW0wfq2grp6lRuWwA34qO6kXbwmsRylNBpvOeFmZEmTvoEOYIBt1TtjRocj6gbbTWgPQIS7NhSakUCgmx7UROK8UM5jQY4heDIklxuxN5Mb8FbZrtaS-v8YxiCmQjpIsN5mBfwcbq3hUlCc3VETvPS7aSjXtEGmZKYMrcKS0huJ1Rh_G_zBsupZfJsKptiZaoPKD4eb8LwFj7wkSJcFvew21Yqe7f8G-eNGkEopZnekC1-6mJA"
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h6 className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors mb-1">{item.title}</h6>
                  <span className="font-label text-[9px] text-on-surface-variant uppercase">{item.meta}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI in Gaming sidebar */}
        <div className="space-y-4">
          <h3 className="font-headline text-xl font-bold tracking-tight border-b border-outline-variant/30 pb-4">AI IN GAMING</h3>
          <div className="flex flex-col gap-3">
            {[
              { co: 'NVIDIA', title: 'ACE NPCs debut in AAA title — 30ms response time', tag: 'DLSS 4' },
              { co: 'Valve', title: 'Steam AI Game Detector flags 1,200 titles in 30 days', tag: 'Policy' },
              { co: 'Xbox', title: 'DirectML 2.0 brings on-device AI to Game Bar', tag: 'Tools' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outline-variant/5">
                <span className="font-label text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded shrink-0">{item.tag}</span>
                <div>
                  <p className="font-label text-[8px] text-on-surface-variant uppercase mb-0.5">{item.co}</p>
                  <p className="font-headline text-xs font-bold leading-tight text-on-surface">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market intel */}
        <div className="bg-surface-variant rounded-2xl p-6 border-l-4 border-primary shadow-xl">
          <h4 className="font-label text-[10px] font-black tracking-widest text-primary uppercase mb-6">Market Intel</h4>
          <div className="space-y-4">
            {[
              { ticker: 'NVIDIA', val: '+4.2%', up: true },
              { ticker: 'MSFT', val: '+1.8%', up: true },
              { ticker: 'META', val: '+3.1%', up: true },
              { ticker: 'GOOGLE', val: '-0.5%', up: false },
              { ticker: 'AMD', val: '+2.4%', up: true },
            ].map(row => (
              <div key={row.ticker} className="flex justify-between items-center">
                <span className="text-on-surface-variant text-xs font-label uppercase">{row.ticker}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${row.up ? 'text-primary' : 'text-error'}`}>{row.val}</span>
                  {row.up
                    ? <TrendingUp size={14} className="text-primary" aria-hidden="true" />
                    : <TrendingDown size={14} className="text-error" aria-hidden="true" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
