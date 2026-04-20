import { motion } from 'motion/react';
import { X, Zap, Mail } from 'lucide-react';

// Contact email used for copyright/takedown requests. Swap this for a
// dedicated legal@ address once one is set up.
const CONTACT_EMAIL = 'bernard.dutoit0503@gmail.com';

interface LegalModalProps {
  key?: string | number;
  onClose: () => void;
}

/** One big scrollable disclaimer. Written in plain English, not legalese —
 *  the goal is to make good-faith intent obvious, not to look lawyerly.
 *  Not a substitute for actual legal counsel. */
export const LegalModal = ({ onClose }: LegalModalProps) => (
  <>
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-md z-[80]"
      onClick={onClose}
    />

    {/* Panel */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
      onClick={e => e.stopPropagation()}
    >
      <div className="w-full max-w-2xl max-h-full bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 pt-8 pb-6 text-center border-b border-outline-variant/10 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close legal notice"
            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
          >
            <X size={18} />
          </button>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap size={20} className="text-primary fill-primary" aria-hidden="true" />
            <span className="font-headline text-2xl font-extrabold tracking-tighter text-primary uppercase italic">KINETIC</span>
          </div>
          <p className="text-on-surface-variant font-label text-[11px] uppercase tracking-widest">
            Legal Notice & Disclaimers
          </p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 text-on-surface-variant font-body text-sm leading-relaxed">

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">Content ownership</h3>
            <p>
              Kinetic is a news aggregation and discovery platform. We do not own, produce, or host any of
              the news articles, images, videos, or audio content displayed. All titles, summaries, images,
              thumbnails, trademarks, logos, and brand names are the property of their respective owners.
              Kinetic displays headlines and short excerpts under fair-use principles to help users discover
              content and drive traffic to the original publishers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">Links &amp; full content</h3>
            <p>
              Every article link in Kinetic points to the original source. To read full articles, we direct
              you to — and encourage you to visit — the publisher's website. Kinetic never hosts, rehosts,
              or redistributes full article bodies.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">Source feeds</h3>
            <p>
              News content is aggregated via publicly available RSS feeds from The Verge, TechCrunch, IGN,
              Polygon, Ars Technica, Wired, PC Gamer, GameSpot, Tom's Hardware, Variety, Anime News Network,
              and others. We make no claim to their content and are not affiliated with any of them.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">Game trademarks &amp; imagery</h3>
            <p>
              Hub game artwork, trademarks, and event names are the property of their respective publishers
              (Bungie, Kinetic Games, Arrowhead, NetEase, Grinding Gear Games, Ubisoft, Valve, and others).
              Steam library images are served from Valve's public CDN. Play buttons link to the official
              store page for the respective game.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">AI-generated content</h3>
            <p>
              Some features (article summaries, insights, Hub event descriptions) use generative AI via
              Google Gemini. AI-generated content is provided for convenience, may contain inaccuracies or
              out-of-date information, and should not be relied upon as a substitute for reading the
              original article or visiting the official source.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">No affiliation</h3>
            <p>
              Kinetic is an independent project and is not affiliated with, endorsed by, or sponsored by
              any of the publishers, game studios, hardware brands, or AI companies featured in the app.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">Copyright concerns &amp; takedowns</h3>
            <p>
              If you are a rights holder and believe content featured in Kinetic infringes on your rights,
              please contact us at the address below. We respect the rights of content creators and respond
              to valid takedown requests promptly in accordance with applicable copyright law.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Kinetic%20takedown%20request`}
              className="inline-flex items-center gap-2 mt-2 text-primary hover:opacity-80 transition-opacity font-label text-xs uppercase tracking-widest"
            >
              <Mail size={14} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </section>

          <section className="space-y-2">
            <h3 className="font-headline text-base font-bold text-on-surface uppercase tracking-tight">User data</h3>
            <p>
              Signed-in accounts are managed via Supabase. Bookmarks, read history, and hype counts are
              stored to sync your experience across devices. We do not sell user data or share it with
              third parties for advertising.
            </p>
          </section>

          <p className="text-on-surface-variant/60 font-label text-[10px] uppercase tracking-widest pt-4 border-t border-outline-variant/10">
            Last updated: April 2026 • Kinetic is an independent project.
          </p>
        </div>

        {/* Footer button */}
        <div className="shrink-0 px-6 py-4 border-t border-outline-variant/10 bg-surface-variant/30">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-widest active:scale-95 transition-all neon-glow"
          >
            Understood
          </button>
        </div>
      </div>
    </motion.div>
  </>
);
