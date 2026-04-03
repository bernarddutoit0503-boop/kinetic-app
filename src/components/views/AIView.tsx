import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export const AIView = () => (
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
          alt="AI Weekly background"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true"></span>
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
            <span className="w-1 h-8 bg-secondary" aria-hidden="true"></span> OPENAI
          </h3>
          <span className="font-label text-xs text-on-surface-variant">4 UPDATES</span>
        </div>

        <div className="group relative bg-surface-variant rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-secondary/30 transition-all duration-500">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh-dPKUTSQRh3S7j-ZsjzNqMatrVUI0vV62dfeocwtgAIkiZxYGanvFq6oG8_CUmmbJ8yvUFCNCsmhPrbIY40YPqY8G8HW6TexoCLbhO1n5bO2X24TH1Mf-4OsTaHwxGoObd5GgGXkcLHN-mLpGKU01xrzhLc6R1-nDV1UqOUNWth-M5at4-1OOwZ8N7IWZ5GG_p2sN4bubgzjmzo2LluTU-5QnPtUmK4ixpaJB78IKhxbwi-4nj6uiFsilWp9Ibo5KxXcuswcQA"
              alt="GPT-5 Framework article"
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
              Full Coverage <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
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
                  alt="Gemini 1.5 Pro"
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
                <TrendingUp size={14} className="text-primary" aria-hidden="true" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase">MSFT</span>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-bold">+1.8%</span>
                <TrendingUp size={14} className="text-primary" aria-hidden="true" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase">GOOGLE</span>
              <div className="flex items-center gap-2">
                <span className="text-error text-xs font-bold">-0.5%</span>
                <TrendingDown size={14} className="text-error" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
