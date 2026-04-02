import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Using gemini-2.5-flash as the default high-performance model for 2026
const MODEL_NAME = "gemini-2.5-flash";

export async function summarizeArticle(title: string, content: string) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are the AI assistant for Kinetic, a futuristic tech and gaming news hub. 
      Please provide a concise, high-impact summary (3-4 bullet points) of the following article:
      
      Title: ${title}
      Content: ${content}
      
      Maintain a professional, forward-thinking, and insightful tone.`,
    });

    return response.text;
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    if (error?.message?.includes('429')) {
      return "NEURAL LINK RECHARGING...";
    }
    return "SIGNAL JAMMED: RE-ESTABLISHING KINETIC PULSE...";
  }
}

export async function getKineticInsights(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `As the Kinetic AI, provide 3 quick, intriguing "Fun Facts" or "Insider Intel" snippets about ${topic}. 
      Focus on things a hardcore fan or tech enthusiast would find cool. Keep them very punchy and short.`,
      config: {
        tools: [{ googleSearch: {} }] // Enable real-time grounding
      }
    });

    return response.text;
  } catch (error: any) {
    console.error("Kinetic Insights Error:", error);
    if (error?.message?.includes('429')) {
      return "NEURAL LINK RECHARGING...";
    }
    return "SIGNAL JAMMED: RE-ESTABLISHING KINETIC PULSE...";
  }
}

/**
 * Fetches the latest live tech and gaming news using Google Search grounding.
 * Returns a structured JSON of news items.
 * Implements "Copywriter" logic and "April Fools" filter.
 */
export async function getLiveNews() {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a high-level Tech Journalist and Copywriter for Kinetic, a next-gen news hub.
      
      TASK:
      1. Gather the top 5 most impactful tech and gaming news headlines from today (April 1st, 2026).
      2. TARGET SOURCES: Bungie.net (for Destiny 2 updates), Kineticgames.co.uk (for Phasmophobia updates), The Verge, TechCrunch, IGN, Polygon.
      3. APRIL FOOLS FILTER: Today is April 1st. You MUST detect and DISCARD any satirical, prank, or "April Fools" stories. Only return real, verified news.
      
      OUTPUT FORMAT:
      Return a JSON array of objects with the following structure:
      {
        "id": "unique-kebab-case-id",
        "category": "TECH" | "GAMING" | "AI INTEL" | "GEAR",
        "source_brand": "The name of the source (e.g., TechCrunch)",
        "title": "A punchy, high-impact headline",
        "original_url": "The source link",
        "image_url": "A high-quality image URL from the source if available, else a placeholder from Unsplash",
        "publish_date": "April 1, 2026",
        "smart_summary": "A 'Hook' sentence that explains the direct benefit to a gamer or tech enthusiast (e.g., 'This new architecture means 144fps is finally standard on entry-level laptops.')"
      }
      
      CRITICAL: Only return the JSON array starting with '[' and ending with ']'. Do not include any markdown formatting or prefix/suffix text.`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: "application/json" is currently incompatible with Grounding (Tools) in the SDK.
        // We will manually parse the text response instead.
      }
    });

    const text = response.text;
    // Extract JSON array from the response string (in case the model adds extra text)
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find JSON array in model response.");
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);
    
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Live News Fetch Error:", error);
    return null;
  }
}

/**
 * Fetches the current live-service event status for specific target games.
 */
export async function getLiveServiceEvents() {
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
      }
    });

    const text = response.text;
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find JSON object in model response.");
    }
    
    const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
    return parsed;
  } catch (error: any) {
    console.error("Live Events Fetch Error:", error);
    return null;
  }
}
