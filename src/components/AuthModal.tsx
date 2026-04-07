import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  key?: string | number;
  onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fn = tab === 'signin' ? signIn : signUp;
    const err = await fn(email, password);

    setLoading(false);

    if (err) {
      setError(err);
    } else if (tab === 'signup') {
      setSuccess(true);
    } else {
      onClose();
    }
  };

  return (
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
        className="fixed inset-0 z-[90] flex items-center justify-center px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full max-w-sm bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center border-b border-outline-variant/10">
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
            >
              <X size={18} />
            </button>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap size={20} className="text-primary fill-primary" aria-hidden="true" />
              <span className="font-headline text-2xl font-extrabold tracking-tighter text-primary uppercase italic">KINETIC</span>
            </div>
            <p className="text-on-surface-variant font-label text-[11px] uppercase tracking-widest">
              Your feed. Your data. Everywhere.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-10 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                  <Zap size={22} className="text-primary fill-primary" aria-hidden="true" />
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface">Check your email</h3>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                  We sent a confirmation link to <strong className="text-on-surface">{email}</strong>. Click it to activate your account.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 font-label text-[10px] uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                >
                  Continue as guest →
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Tab switcher */}
                <div className="flex border-b border-outline-variant/10">
                  {(['signin', 'signup'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setError(null); }}
                      className={`flex-1 py-3 font-label text-[10px] font-black uppercase tracking-widest transition-colors ${
                        tab === t
                          ? 'text-primary border-b-2 border-primary -mb-px'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {t === 'signin' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="auth-email" className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
                      <input
                        id="auth-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-bright border border-outline-variant/20 rounded-lg font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="auth-password" className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
                      <input
                        id="auth-password"
                        type="password"
                        required
                        minLength={6}
                        autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-bright border border-outline-variant/20 rounded-lg font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    {tab === 'signup' && (
                      <p className="font-label text-[8px] text-on-surface-variant/50 uppercase tracking-widest">Minimum 6 characters</p>
                    )}
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 p-3 bg-error/10 border border-error/20 rounded-lg"
                      >
                        <AlertCircle size={13} className="text-error shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="font-label text-[10px] text-error leading-relaxed">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-on-primary rounded-full font-label font-black text-xs uppercase tracking-widest neon-glow active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Connecting...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>

                  {/* Guest */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-center font-label text-[9px] uppercase tracking-widest text-on-surface-variant/50 hover:text-on-surface-variant transition-colors py-1"
                  >
                    Continue as guest →
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
