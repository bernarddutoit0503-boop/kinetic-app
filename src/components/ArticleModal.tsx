import { useState } from 'react';
import { X, ExternalLink, Bookmark, BookmarkCheck, Cpu, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { summarizeArticle } from '../services/GeminiService';
import { NewsImage } from './NewsImage';
import { NewsItem } from '../data/news';
import { ToastType } from '../hooks/useToast';

interface ArticleModalProps {
  key?: string | number;
  article: NewsItem;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onToast: (message: string, type?: ToastType) => void;
}

export const ArticleModal = ({ article, onClose, isBookmarked, onBookmarkToggle, onToast }: ArticleModalProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const content = (article.smart_summary ?? article.summary ?? '').slice(0, 400);
    const result = await summarizeArticle(article.title, content);
    setSummary(result);
    setLoadingSummary(false);
    onToast('Analysis ready', 'success');
  };

  const handleBookmark = () => {
    onBookmarkToggle();
    onToast(isBookmarked ? 'Bookmark removed' : 'Article saved', isBookmarked ? 'info' : 'success');
  };

  const handleShare = async () => {
    const url = article.original_url ?? window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.smart_summary ?? article.summary, url });
      } catch {
        // user cancelled — no toast needed
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(url);
      onToast('Link copied to clipboard', 'info');
    }
  };

  const bulletPoints = summary
    ? summary.split('\n').filter(line => line.trim().length > 0)
    : [];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-[70] max-h-[92vh] bg-surface rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-outline-variant rounded-full" aria-hidden="true" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image */}
          {article.image && (
            <div className="relative h-52 w-full overflow-hidden shrink-0">
              <NewsImage
                src={article.image}
                alt={article.title}
                category={article.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            </div>
          )}

          <div className="px-6 pb-32 space-y-5">
            {/* Meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full font-label text-[9px] font-black tracking-widest uppercase">
                  {article.category}
                </span>
                {article.source_brand && (
                  <span className="text-on-surface-variant text-[9px] font-label uppercase tracking-widest">
                    {article.source_brand}
                  </span>
                )}
              </div>
              {(article.publish_date ?? article.date) && (
                <span className="text-[9px] text-outline font-label uppercase">
                  {article.publish_date ?? article.date}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-headline text-3xl font-bold leading-tight tracking-tighter text-on-surface">
              {article.title}
            </h2>

            {/* Body */}
            <p className="text-on-surface-variant font-body text-base leading-relaxed">
              {article.smart_summary ?? article.summary}
            </p>

            {/* AI Analysis panel */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={14} className="text-primary animate-pulse" aria-hidden="true" />
                <span className="font-label text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                  Kinetic AI Analysis
                </span>
              </div>

              {!summary && !loadingSummary && (
                <button
                  onClick={handleGenerateSummary}
                  className="w-full py-3 border border-primary/30 rounded-lg font-label text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 active:scale-95 transition-all"
                >
                  Generate Analysis
                </button>
              )}

              {loadingSummary && (
                <div className="flex flex-col gap-2" aria-busy="true" aria-label="Generating analysis">
                  <span className="text-[8px] text-primary/60 font-black animate-pulse">PROCESSING NEURAL FEED...</span>
                  <div className="flex gap-2" aria-hidden="true">
                    <div className="w-1 h-4 bg-primary/40 animate-bounce" />
                    <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {summary && (
                <div className="space-y-2">
                  {bulletPoints.map((point, i) => (
                    <p key={i} className="text-on-surface font-body text-sm leading-relaxed opacity-90">
                      {point}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 pb-6 bg-surface/95 border-t border-outline-variant/10 backdrop-blur-xl flex gap-3">
          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            className={`p-3 rounded-full border transition-all active:scale-95 ${
              isBookmarked
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Share article"
            className="p-3 rounded-full border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-all active:scale-95"
          >
            <Share2 size={18} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close article"
            className="p-3 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            <X size={18} />
          </button>

          {/* Read full article */}
          {article.original_url && (
            <button
              onClick={() => window.open(article.original_url, '_blank', 'noopener,noreferrer')}
              className="flex-1 py-3 bg-primary text-on-primary rounded-full font-label font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 neon-glow active:scale-95 transition-all"
            >
              Read Full Article <ExternalLink size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};
