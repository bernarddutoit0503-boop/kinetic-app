import { GoogleGenAI } from "@google/genai";
import { ERROR_MESSAGES, LIVE_NEWS_COUNT } from "../constants";
import { LiveEvents } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// NOTE: This API key is in the client bundle. For production, proxy these
// calls through a backend endpoint to keep the key server-side.

// gemini-2.5-flash with thinking disabled — fastest + lowest token cost
// for structured tasks that don't need deep reasoning.
const MODEL_NAME = "gemini-2.5-flash";
const LEAN_CONFIG = { thinkingConfig: { thinkingBudget: 0 } };

/** On-demand summary — only called when user taps "Generate Analysis" in the modal.
 *  Kept intentionally short: 3 bullets max, 80 words total to minimise tokens.
 */
export async function summarizeArticle(title: string, content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: LEAN_CONFIG,
      contents: `Kinetic AI. 3 bullet points (≤80 words total) for a tech/gaming enthusiast.\nTitle: ${title}\nContext: ${content.slice(0, 300)}`,
    });
    return response.text ?? ERROR_MESSAGES.SIGNAL_JAMMED;
  } catch (error: unknown) {
    console.error("AI Summary Error:", error);
    if (error instanceof Error && error.message.includes('429')) return ERROR_MESSAGES.NEURAL_RECHARGING;
    return ERROR_MESSAGES.SIGNAL_JAMMED;
  }
}

/** 3 punchy insider facts about a topic — grounded with live search.
 *  Result is cached for 4 hours so the model is called at most ~6×/day per topic.
 */
export async function getKineticInsights(topic: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      // No LEAN_CONFIG here — grounding tools require thinking budget untouched
      contents: `3 punchy insider facts (≤60 words total) about "${topic}" for a hardcore gamer / tech enthusiast. Numbered list only, no intro text.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text ?? null;
  } catch (error: unknown) {
    console.error("Kinetic Insights Error:", error);
    return null;
  }
}

/** Live news — returns top articles. Cached 30 min by useCachedData.
 *  Prompt is trimmed to the minimum needed for correct JSON output.
 *  Count is controlled by LIVE_NEWS_COUNT (default 15).
 */
export async function getLiveNews(): Promise<unknown[] | null> {
  try {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const aprilFools = new Date().getMonth() === 3 && new Date().getDate() === 1;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Return ONLY a JSON array (no markdown) of the ${LIVE_NEWS_COUNT} biggest tech/gaming/AI/hardware news items from ${today}.
Sources: The Verge, TechCrunch, IGN, Polygon, Ars Technica, Wired, Tom's Hardware, PC Gamer, GameSpot, Bungie.net, Kineticgames.co.uk.${aprilFools ? '\nSkip April Fools jokes — real news only.' : ''}
Include a mix of categories: at least 3 TECH, 3 GAMING, 3 AI INTEL, and 2 GEAR items.
Each object: {"id":"kebab-id","category":"TECH|GAMING|AI INTEL|GEAR","source_brand":"...","title":"...","original_url":"...","image":"url-or-unsplash","publish_date":"${today}","summary":"one sentence","smart_summary":"one-line gamer/tech benefit hook","live":true}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error("No JSON array in response");

    const parsed = JSON.parse(text.substring(start, end + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error("Live News Fetch Error:", error);
    return null;
  }
}

/** Live game events — cached 6 hours by useCachedData (events don't change often).
 *  Covers: Destiny 2, Phasmophobia, The Isle, Rainbow Six Siege, For Honor, Dota 2.
 */
export async function getLiveServiceEvents(): Promise<LiveEvents | null> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Return ONLY a JSON object (no markdown) with the current active in-game events for these 6 live-service games. Search each game's official site or Steam news page.
Games: Destiny 2 (Bungie.net), Phasmophobia (kineticgames.co.uk), The Isle (theisle-game.com), Rainbow Six Siege (ubisoft.com), For Honor (ubisoft.com), Dota 2 (dota2.com).
Format exactly:
{"destiny2":{"event_name":"...","description":"1-2 sentences player-benefit focused","subtitle":"2-3 words"},"phasmophobia":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"theisle":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"rainbow6siege":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"forhonor":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"},"dota2":{"event_name":"...","description":"1-2 sentences","subtitle":"2-3 words"}}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No JSON object in response");

    return JSON.parse(text.substring(start, end + 1)) as LiveEvents;
  } catch (error) {
    console.error("Live Events Fetch Error:", error);
    return null;
  }
}
