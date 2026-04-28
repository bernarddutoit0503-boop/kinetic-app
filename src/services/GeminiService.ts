import { ERROR_MESSAGES } from "../constants";
import { LiveEvents } from "../types";

async function postAI<T>(body: Record<string, unknown>): Promise<T | null> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

/** On-demand summary - only called when user taps "Generate Analysis" in the modal. */
export async function summarizeArticle(title: string, content: string): Promise<string> {
  try {
    const response = await postAI<{ text: string | null }>({
      action: 'summary',
      title,
      content,
    });
    return response?.text ?? ERROR_MESSAGES.SIGNAL_JAMMED;
  } catch (error: unknown) {
    console.error("AI Summary Error:", error);
    if (error instanceof Error && error.message.includes('429')) return ERROR_MESSAGES.NEURAL_RECHARGING;
    return ERROR_MESSAGES.SIGNAL_JAMMED;
  }
}

/** 3 punchy insider facts about a topic, routed through the server. */
export async function getKineticInsights(topic: string): Promise<string | null> {
  try {
    const response = await postAI<{ text: string | null }>({
      action: 'insight',
      topic,
    });
    return response?.text ?? null;
  } catch (error: unknown) {
    console.error("Kinetic Insights Error:", error);
    return null;
  }
}

/** Live news fetched from the /api/news Vercel serverless RSS aggregator. */
export async function getLiveNews(): Promise<unknown[] | null> {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error(`news api returned ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error("Live News Fetch Error:", error);
    return null;
  }
}

/** Live game events, routed through the server so the Gemini key stays private. */
export async function getLiveServiceEvents(): Promise<LiveEvents | null> {
  try {
    const response = await postAI<{ events: LiveEvents }>({ action: 'events' });
    return response?.events ?? null;
  } catch (error) {
    console.error("Live Events Fetch Error:", error);
    return null;
  }
}
