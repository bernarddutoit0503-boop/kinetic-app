import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Toast, ToastType } from '../hooks/useToast';

const ICON = {
  success: CheckCircle,
  info: Info,
  error: AlertCircle,
} as const;

const STYLE = {
  success: 'border-primary/30 text-primary',
  info:    'border-secondary/30 text-secondary',
  error:   'border-error/30 text-error',
} as const;

interface ToastContainerProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, dismiss }: ToastContainerProps) => (
  // Sits above the bottom nav (z-[80]), anchored above it (bottom-24)
  <div className="fixed bottom-24 left-0 right-0 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
    <AnimatePresence>
      {toasts.map(t => {
        const Icon = ICON[t.type];
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface/95 backdrop-blur-xl border shadow-xl max-w-sm w-full ${STYLE[t.type]}`}
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface flex-1">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);
