import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { BOOKMARK_KEY, READ_HISTORY_KEY, STREAK_KEY, STREAK_DATE_KEY, HYPE_KEY } from '../constants';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Migrate anonymous localStorage data into the DB on first sign-up/sign-in
async function migrateLocalData(userId: string) {
  try {
    // Bookmarks
    const rawBookmarks = localStorage.getItem(BOOKMARK_KEY);
    const bookmarkIds: string[] = rawBookmarks ? JSON.parse(rawBookmarks) : [];
    if (bookmarkIds.length > 0) {
      await supabase.from('bookmarks').upsert(
        bookmarkIds.map(id => ({ user_id: userId, article_id: id })),
        { onConflict: 'user_id,article_id' }
      );
    }

    // Read history — convert array to counts
    const rawHistory = localStorage.getItem(READ_HISTORY_KEY);
    const history: string[] = rawHistory ? JSON.parse(rawHistory) : [];
    if (history.length > 0) {
      const counts: Record<string, number> = {};
      for (const cat of history) counts[cat] = (counts[cat] ?? 0) + 1;
      await supabase.from('read_history').upsert(
        Object.entries(counts).map(([category, read_count]) => ({ user_id: userId, category, read_count })),
        { onConflict: 'user_id,category' }
      );
    }

    // Streak
    const storedStreak = parseInt(localStorage.getItem(STREAK_KEY) ?? '0', 10);
    const lastDate = localStorage.getItem(STREAK_DATE_KEY);
    if (storedStreak > 0 && lastDate) {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('streaks').upsert(
        { user_id: userId, streak_count: storedStreak, last_date: today },
        { onConflict: 'user_id' }
      );
    }

    // Hype
    const rawHype = localStorage.getItem(HYPE_KEY);
    const hype: Record<string, number> = rawHype ? JSON.parse(rawHype) : {};
    if (Object.keys(hype).length > 0) {
      await supabase.from('hype').upsert(
        Object.entries(hype).map(([game_key, count]) => ({ user_id: userId, game_key, count })),
        { onConflict: 'user_id,game_key' }
      );
    }
  } catch {
    // Migration is best-effort — don't block auth flow
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) await migrateLocalData(data.user.id);
    return null;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) await migrateLocalData(data.user.id);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
