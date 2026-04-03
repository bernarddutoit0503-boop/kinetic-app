export const CACHE_TTL_MS = 60 * 60 * 1000;            // 60 min (default)
export const CACHE_TTL_NEWS_MS = 30 * 60 * 1000;       // 30 min — live news refreshes more often
export const CACHE_TTL_EVENTS_MS = 6 * 60 * 60 * 1000; // 6 hr  — game events are stable
export const CACHE_TTL_INSIGHTS_MS = 4 * 60 * 60 * 1000; // 4 hr — insights don't change fast

export const CACHE_KEYS = {
  LIVE_NEWS: 'kinetic_live_news',
  LIVE_NEWS_TIME: 'kinetic_last_fetch',
  LIVE_EVENTS: 'kinetic_live_events',
  LIVE_EVENTS_TIME: 'kinetic_events_fetch',
  INSIGHT_PREFIX: 'kinetic_insight_',
  INSIGHT_TIME_PREFIX: 'kinetic_insight_time_',
} as const;

export const BOOKMARK_KEY = 'kinetic_bookmarks';

export const ERROR_MESSAGES = {
  SIGNAL_JAMMED: 'SIGNAL JAMMED: RE-ESTABLISHING KINETIC PULSE...',
  NEURAL_RECHARGING: 'NEURAL LINK RECHARGING...',
} as const;

export const FEED_CATEGORIES = ['Feed', 'Tech', 'Gaming', 'AI'] as const;
export const GEAR_BRANDS = ['All Labs', 'Razer', 'Corsair', 'Logitech G', 'SteelSeries'] as const;

export const GAME_URLS = {
  DESTINY2_PLAY: 'https://www.bungie.net/7/en/Destiny/GuardianGames',
  DESTINY2_YOUTUBE: 'https://www.youtube.com/@DestinyTheGame',
  PHASMOPHOBIA: 'https://kineticgames.co.uk/',
  RAZER_HUNTSMAN: 'https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro',
} as const;
