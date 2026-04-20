import { Zap } from 'lucide-react';

interface FooterProps {
  onLegalClick: () => void;
}

/** Site-wide footer. Sits at the bottom of the scrolling content on every
 *  view, just above the fixed BottomNav. Keeps a low visual profile but
 *  makes the aggregator disclaimer and takedown path unmissable. */
export const Footer = ({ onLegalClick }: FooterProps) => (
  <footer className="mt-16 pt-8 pb-6 border-t border-outline-variant/10 text-center space-y-4">
    <div className="flex items-center justify-center gap-2">
      <Zap size={14} className="text-primary fill-primary" aria-hidden="true" />
      <span className="font-headline text-sm font-extrabold tracking-tighter text-primary uppercase italic">
        KINETIC
      </span>
      <span className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-widest">
        // Independent news aggregator
      </span>
    </div>

    <p className="font-body text-xs text-on-surface-variant/70 max-w-md mx-auto leading-relaxed px-4">
      Kinetic aggregates publicly available news feeds. All content, images, and trademarks belong to
      their respective owners. Every article link points to the original publisher.
    </p>

    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onLegalClick}
        className="font-label text-[10px] uppercase tracking-widest text-primary hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
      >
        Legal &amp; Disclaimers
      </button>
      <span className="w-1 h-1 rounded-full bg-on-surface-variant/30" aria-hidden="true" />
      <a
        href="mailto:bernard.dutoit0503@gmail.com?subject=Kinetic%20takedown%20request"
        className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
      >
        Takedown Requests
      </a>
    </div>

    <p className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant/40 pt-2">
      © 2026 Kinetic • Not affiliated with any brand featured in the app
    </p>
  </footer>
);
