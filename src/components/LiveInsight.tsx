import { Cpu } from 'lucide-react';
import { useCachedData } from '../hooks/useCachedData';
import { getKineticInsights } from '../services/GeminiService';
import { CACHE_KEYS, ERROR_MESSAGES, CACHE_TTL_INSIGHTS_MS } from '../constants';

interface LiveInsightProps {
  topic: string;
}

export const LiveInsight = ({ topic }: LiveInsightProps) => {
  const { data: insight, loading } = useCachedData<string>(
    `${CACHE_KEYS.INSIGHT_PREFIX}${topic}`,
    `${CACHE_KEYS.INSIGHT_TIME_PREFIX}${topic}`,
    () => getKineticInsights(topic),
    CACHE_TTL_INSIGHTS_MS
  );

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      <div className="flex items-center gap-2 mb-4">
        <Cpu size={16} className="text-primary animate-pulse" aria-hidden="true" />
        <span className="font-label text-[10px] font-black tracking-[0.2em] text-primary uppercase">
          LIVE AI PULSE : {topic.toUpperCase()}
        </span>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading AI insights">
          <span className="text-[8px] text-primary/60 font-black animate-pulse">SCANNING NEURAL LINKS...</span>
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-1 h-4 bg-primary/40 animate-bounce"></div>
            <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-4 bg-primary/40 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      ) : (
        <p className="text-on-surface font-body text-sm leading-relaxed whitespace-pre-line lowercase italic opacity-80">
          {insight ?? ERROR_MESSAGES.SIGNAL_JAMMED}
        </p>
      )}
    </div>
  );
};
