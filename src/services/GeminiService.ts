import { GoogleGenAI } from "@google/genai";
import { ERROR_MESSAGES } from "../constants";
import { LiveEvents } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// NOTE: This API key is embedded in the client bundle via the VITE_ prefix.
// For production, proxy these requests through a backend to keep the key server-side.
const MODEL_NAME = "gemini-2.5-flash";

export async function summarizeArticle(title: string, content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are the AI assistant for Kinetic, a futuristic tech and gaming news hub.
      Please provide a concise, high-impact summary (3-4 bullet points) of the following article:

      Title: ${title}
      Content: ${content}

      Maintain a professional, forward-thinking, and insightful tone.`,
    });
    return response.text ?? ERROR_MESSAGES.SIGNAL_JAMMED;
  } catch (error: unknown) {
    console.error("AI Summary Error:", error);
    if (error instanceof Error && error.message.includes('429')) {
      return ERROR_MESSAGES.NEURAL_RECHARGING;
    }
    return ERROR_MESSAGES.SIGNAL_JAMMED;
  }
}

export async function getKineticInsights(topic: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `As the Kinetic AI, provide 3 quick, intriguing "Fun Facts" or "Insider Intel" snippets about ${topic}.
      Focus on things a hardcore fan or tech enthusiast would find cool. Keep them very punchy and short.`,
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

/**
 * Fetches the latest live tech and gaming news using Google Search grounding.
 * Returns a structured array of news items or null on failure.
 */
export async function getLiveNews(): Promise<unknown[] | null> {
  try {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const isAprilFools = new Date().getMonth() === 3 && new Date().getDate() === 1;

    const aprilFoolsFilter = isAprilFools
      ? `3. APRIL FOOLS FILTER: Today is April 1st. You MUST detect and DISCARD any satirical, prank, or "April Fools" stories. Only return real, verified news.`
      : '';

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a high-level Tech Journalist and Copywriter for Kinetic, a next-gen news hub.

      TASK:
      1. Gather the top 5 most impactful tech and gaming news headlines from today (${today}).
      2. TARGET SOURCES: Bungie.net (for Destiny 2 updates), Kineticgames.co.uk (for Phasmophobia updates), The Verge, TechCrunch, IGN, Polygon.
      ${aprilFoolsFilter}

      OUTPUT FORMAT:
      Return a JSON array of objects with the following structure:
      {
        "id": "unique-kebab-case-id",
        "category": "TECH" | "GAMING" | "AI INTEL" | "GEAR",
        "source_brand": "The name of the source (e.g., TechCrunch)",
        "title": "A punchy, high-impact headline",
        "original_url": "The source link",
        "image": "A high-quality image URL from the source if available, else a placeholder from Unsplash",
        "publish_date": "${today}",
        "summary": "A brief one-sentence description of the story",
        "smart_summary": "A 'Hook' sentence that explains the direct benefit to a gamer or tech enthusiast (e.g., 'This new architecture means 144fps is finally standard on entry-level laptops.')"
      }

      CRITICAL: Only return the JSON array starting with '[' and ending with ']'. Do not include any markdown formatting or prefix/suffix text.`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: "application/json" is incompatible with Grounding tools in this SDK.
      },
    });

    const text = response.text;
    const jsonStart = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');

    if (jsonStart === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find JSON array in model response.");
    }

    const parsed = JSON.parse(text.substring(jsonStart, jsonEndIndex + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error("Live News Fetch Error:", error);
    return null;
  }
}

/**
 * Fetches the current live-service event status for Destiny 2 and Phasmophobia.
 */
export async function getLiveServiceEvents(): Promise<LiveEvents | null> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are the core intelligence for Kinetic.

      TASK: Determine the CURRENT, ACTIVE in-game events for two live-service games: Destiny 2 and Phasmophobia.
      Use Google Search to specifically look at Bungie.net and Kineticgames.co.uk to find the absolute latest intel.

      OUTPUT FORMAT:
      Return a JSON object with this exact structure:
      {
        "destiny2": {
          "event_name": "The actual name of the current event/episode (e.g., Guardian Games 2026, Episode: Revenant)",
          "description": "A punchy 1-2 sentence description of the event focused on the player benefit/activity."
        },
        "phasmophobia": {
          "event_name": "The actual name of the current event/update (e.g., Cursed Hollow, Blood Moon, Winter Update)",
          "subtitle": "A short 2-3 word subtitle (e.g., Seasonal Event, Major Update, Live Now)"
        }
      }

      CRITICAL: Only return the JSON object starting with '{' and ending with '}'. No formatting.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const jsonStart = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');

    if (jsonStart === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find JSON object in model response.");
    }

    return JSON.parse(text.substring(jsonStart, jsonEndIndex + 1)) as LiveEvents;
  } catch (error) {
    console.error("Live Events Fetch Error:", error);
    return null;
  }
}
