import { useState } from 'react';
import { Cpu, Gamepad2, LayoutGrid, Zap } from 'lucide-react';

// Category-themed fallback shown when an external image URL fails to load
const CategoryFallback = ({ category, className }: { category: string; className?: string }) => {
  const config: Record<string, { icon: typeof Cpu; color: string; label: string }> = {
    'TECH':     { icon: Cpu,      color: 'from-secondary/20 to-background',  label: 'TECH'     },
    'GAMING':   { icon: Gamepad2, color: 'from-primary/20 to-background',    label: 'GAMING'   },
    'AI INTEL': { icon: Zap,      color: 'from-tertiary/20 to-background',   label: 'AI INTEL' },
    'GEAR':     { icon: LayoutGrid,color: 'from-secondary/20 to-background', label: 'GEAR'     },
  };

  const { icon: Icon, color, label } = config[category?.toUpperCase()] ?? config['TECH'];

  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${color} border border-outline-variant/10 ${className ?? ''}`}>
      <Icon size={28} className="text-on-surface-variant/30 mb-2" aria-hidden="true" />
      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-on-surface-variant/30">{label}</span>
    </div>
  );
};

interface NewsImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
}

/** Drop-in img replacement that shows a category-themed fallback on error.
 *  Prevents broken image icons when AI-returned URLs have hotlink protection.
 */
export const NewsImage = ({ src, alt, category = 'TECH', className = '' }: NewsImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <CategoryFallback category={category} className={`w-full h-full ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};
