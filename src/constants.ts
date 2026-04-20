export const CACHE_TTL_MS = 60 * 60 * 1000;            // 60 min (default)
export const CACHE_TTL_NEWS_MS = 30 * 60 * 1000;       // 30 min — live news refreshes more often
export const LIVE_NEWS_COUNT = 15;                      // fetch 15 live articles (up from 5)
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
export const STREAK_KEY = 'kinetic_streak';
export const STREAK_DATE_KEY = 'kinetic_streak_date';
export const HYPE_KEY = 'kinetic_hype';
export const READ_HISTORY_KEY = 'kinetic_read_history';

export const ERROR_MESSAGES = {
  SIGNAL_JAMMED: 'SIGNAL JAMMED: RE-ESTABLISHING KINETIC PULSE...',
  NEURAL_RECHARGING: 'NEURAL LINK RECHARGING...',
} as const;

export const FEED_CATEGORIES = ['Feed', 'For You', 'Tech', 'Gaming', 'AI', 'Entertainment'] as const;
export const GEAR_BRANDS = ['All Labs', 'Razer', 'Corsair', 'Logitech G', 'SteelSeries'] as const;

export const GAME_URLS = {
  DESTINY2_PLAY: 'https://www.bungie.net/7/en/Destiny/GuardianGames',
  DESTINY2_YOUTUBE: 'https://www.youtube.com/@DestinyTheGame',
  PHASMOPHOBIA: 'https://kineticgames.co.uk/',
  PHASMOPHOBIA_STORE: 'https://store.steampowered.com/app/739630/Phasmophobia/',
  THE_ISLE: 'https://www.theisle-game.com/en/news',
  THE_ISLE_STORE: 'https://store.steampowered.com/app/376210/The_Isle/',
  R6_SIEGE: 'https://www.ubisoft.com/en-gb/game/rainbow-six/siege',
  R6_SIEGE_ESPORTS: 'https://www.ubisoft.com/en-gb/game/rainbow-six/siege/esports',
  FOR_HONOR: 'https://www.ubisoft.com/en-gb/game/for-honor',
  FOR_HONOR_STORE: 'https://store.steampowered.com/app/304390/For_Honor/',
  DOTA2: 'https://www.dota2.com/home',
  DOTA2_STORE: 'https://store.steampowered.com/app/570/Dota_2/',
  HELLDIVERS2: 'https://www.helldivers.com/',
  HELLDIVERS2_STORE: 'https://store.steampowered.com/app/553850/HELLDIVERS_2/',
  MARVEL_RIVALS: 'https://www.marvelrivals.com/en/',
  MARVEL_RIVALS_STORE: 'https://store.steampowered.com/app/2767030/Marvel_Rivals/',
  POE2: 'https://www.pathofexile2.com/',
  POE2_STORE: 'https://store.steampowered.com/app/2694490/Path_of_Exile_2/',
  RAZER_HUNTSMAN: 'https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro', // full V3 Pro, not mini
} as const;

// Static fallback event data used until AI fetch completes or if it fails
export const GAME_EVENT_FALLBACKS = {
  destiny2: {
    event_name: 'Guardian Games 2026',
    description: 'Represent your class in the ultimate competition. Hoverboards, new rewards, and glory await.',
    subtitle: 'Seasonal Event',
  },
  phasmophobia: {
    event_name: 'Cursed Hollow',
    description: 'A new seasonal haunt brings cursed equipment and double XP weekends to the most terrifying ghost-hunting sim.',
    subtitle: 'Seasonal Event',
  },
  theisle: {
    event_name: 'Evrima: Apex Update',
    description: 'New apex predators and overhauled survival mechanics arrive on the Evrima branch.',
    subtitle: 'Major Update',
  },
  rainbow6siege: {
    event_name: 'Year 10 Season 1',
    description: 'New operator, reworked map, and a limited-time mode are live for Year 10 Season 1.',
    subtitle: 'New Season',
  },
  forhonor: {
    event_name: 'Shadows of the Hitokiri',
    description: 'A limited-time event brings exclusive armour sets and a new 4v4 brawl mode with altered rules.',
    subtitle: 'Limited Event',
  },
  dota2: {
    event_name: 'Crownfall Act IV',
    description: 'The final act of Crownfall brings new hero arcanas, treasure caches, and a 7.37 balance patch.',
    subtitle: 'Battle Pass Event',
  },
  helldivers2: {
    event_name: 'Galactic War: Major Order',
    description: 'Helldivers are deployed across the galaxy to defend Super Earth. Complete the active Major Order for community-wide rewards.',
    subtitle: 'Major Order',
  },
  marvelrivals: {
    event_name: 'Current Ranked Season',
    description: 'A new hero, map, and competitive split are live — climb the ranked ladder before the season locks in.',
    subtitle: 'Ranked Season',
  },
  poe2: {
    event_name: 'Current Endgame League',
    description: 'The current three-month league introduces a new mechanic, boss fight, and economy reset — prime time for a fresh build.',
    subtitle: 'New League',
  },
} as const;
