export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  smart_summary?: string;
  source_brand?: string;
  original_url?: string;
  publish_date?: string;
  image: string;
  readTime?: string;
  author?: {
    name: string;
    role: string;
    image: string;
  };
  featured?: boolean;
  live?: boolean;
  brand?: string;
  date?: string;
}

export const newsData: NewsItem[] = [
  // ── FEATURED ──────────────────────────────────────────────────────────────
  {
    id: 'the-isle-evrima',
    category: 'GAMING',
    title: 'The Isle: Evrima Branch Update',
    summary: 'Apex predators arrive as The Isle\'s Evrima update introduces fearsome new dinosaur models and terrifying survival mechanics.',
    original_url: 'https://www.theisle-game.com/en/news',
    image: '/assets/news/the-isle.jpg',
    featured: true,
    live: true,
    date: 'APR 02'
  },

  // ── GEAR ──────────────────────────────────────────────────────────────────
  {
    id: 'razer-huntsman-v3',
    category: 'GEAR',
    brand: 'Razer',
    title: 'Razer Huntsman V3 Pro: The Optical Evolution',
    summary: 'Redefining rapid-fire response with adjustable actuation and the world\'s most advanced optical switches.',
    original_url: 'https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro',
    // Local asset already in the project — reliable, no external dependency
    image: '/assets/gear/huntsman.jpg',
    readTime: '12 MIN READ'
  },
  {
    id: 'corsair-dominator',
    category: 'GEAR',
    brand: 'Corsair',
    title: 'Corsair Dominator Titanium: Overclocking the Aesthetic',
    summary: 'Precision-engineered for extreme speeds and unparalleled customization with per-key RGB and DDR5-7200 support.',
    original_url: 'https://www.corsair.com/us/en/p/memory/cmt32gx5m2b6400c32/dominator-titanium-rgb-ddr5-memory-cmt32gx5m2b6400c32',
    // Verified from Corsair assets CDN (fetched live from product page)
    image: 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMT32GX5M2B6400C32/DOMINATOR_-PLATINUM-RGB-32GB-_2x16GB_-DDR5-DRAM-6400MHz-C32-Memory-Kit-_-Black-0.webp',
    readTime: '8 MIN READ'
  },
  {
    id: 'logitech-g-pro',
    category: 'GEAR',
    brand: 'Logitech G',
    title: 'Logitech G Pro X Superlight 2: LIGHTSPEED Performance',
    summary: 'The choice of world-class esports athletes, now lighter and faster than ever with HERO 2 sensor tech.',
    original_url: 'https://www.logitechg.com/en-us/products/gaming-mice/pro-x-superlight-2.html',
    // Verified from Logitech G resource CDN (fetched live from product page)
    image: 'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2-se-pdp/gallery/pro-x-superlight-2-se-black-top-angle-gallery-1.png'
  },
  {
    id: 'ps5-pro-gpu',
    category: 'GEAR',
    brand: 'Sony',
    title: 'PS5 Pro: Deep-Dive on the Custom RDNA GPU Architecture',
    summary: 'Sony\'s engineers reveal how the PS5 Pro\'s 67% more compute units are leveraged through a custom cache hierarchy that nearly eliminates bandwidth bottlenecks at 4K.',
    smart_summary: 'The cache trick is why PS5 Pro hits native 4K where the base model needed checkerboard — not raw power alone.',
    original_url: 'https://www.playstation.com/en-us/ps5/',
    // Verified from PlayStation gmedia CDN (fetched live from PS5 page)
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-image-block-01-en-18sep24?$1200px$',
    readTime: '10 MIN READ',
    date: 'MAR 29'
  },
  {
    id: 'steelseries-apex-pro',
    category: 'GEAR',
    brand: 'SteelSeries',
    title: 'SteelSeries Apex Pro TKL Gen 3: OmniPoint 3.0 Raises the Bar',
    summary: 'Magnetic hall-effect switches now offer 0.1 mm actuation increments, dual-action binding, and zero debounce delay for the fastest possible response.',
    smart_summary: 'Two actions per keypress on the same switch — the esports meta just changed.',
    original_url: 'https://steelseries.com/gaming-keyboards/apex-pro-tkl-wireless-gen3',
    // Verified from SteelSeries Contentful CDN (fetched live from keyboards page)
    image: 'https://images.ctfassets.net/hmm5mo4qf4mf/44x2l6FDKwB2sortSx0tKH/4ecc47179763de82c4c6f9402fbc643a/7914ecec15a34949bb3ecdaebcf00934-3789.png?fm=webp&q=90&fit=scale&w=1200',
    readTime: '7 MIN READ',
    date: 'MAR 28'
  },
  {
    id: 'rtx-5090-overclock',
    category: 'GEAR',
    brand: 'NVIDIA',
    title: 'RTX 5090 Overclocking: Breaking the 3.5 GHz Boost Clock Barrier',
    summary: 'Enthusiasts are pushing Blackwell to 3.5 GHz+ using liquid nitrogen, revealing how much headroom NVIDIA left in the silicon at stock settings.',
    smart_summary: 'At 3.5 GHz the RTX 5090 hits 120 fps in 8K Cyberpunk — previously impossible without dedicated AI upscaling.',
    original_url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/',
    // Verified from NVIDIA content dam og:image (fetched live from product page)
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-5090-learn-more-og-1200x630.jpg',
    readTime: '14 MIN READ',
    date: 'APR 01'
  },

  // ── GAMING ────────────────────────────────────────────────────────────────
  {
    id: 'naraka-mode',
    category: 'GAMING',
    title: 'NARAKA: BLADEPOINT Mode Update',
    summary: 'Maintenance today introduced a new "Photo Booth" feature and Nirriti\'s Ruins Innerworld mode.',
    original_url: 'https://www.narakathegame.com/news/update/20240327/33459_1145459.html',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJD6cQE2s583bP1tShzH4Q4gqXevXxuUwLsrLDZ9KI2MZko33H7_jb9Pq0Ne6eSe_D-SI1fXxAQJjVVxmqRnWCdI5rUEqVFeXq_npplNyVQoLM0XFz8D9a6ljQz6n0-zCj3H__V9CNp6I5qE9NZgSfvvi9_VjnCNCPbXSRwXT0GznDNuDqNEhDqRJmafn67mDaHmGY3O-tl_m4HDjcKa5XA8EoUP1c4oWAPiw7fKAtlwmK8CayRJ8TTVx8wh7HEiC1awJrV_gyyg',
    live: true
  },
  {
    id: 'elden-ring-nightreign',
    category: 'GAMING',
    title: 'Elden Ring: Nightreign — Co-op Soulslike Perfected?',
    summary: 'FromSoftware\'s standalone 3-player co-op spin-off drops traditional NPC summons and builds an entirely new roguelite loop around Elden Ring\'s combat engine.',
    smart_summary: 'Every run generates a new world layout — expect 60+ hours before you see every biome.',
    original_url: 'https://en.bandainamcoent.eu/elden-ring/nightreign',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
    readTime: '9 MIN READ',
    date: 'APR 01',
    live: true
  },
  {
    id: 'gta6-pc-specs',
    category: 'GAMING',
    title: 'GTA VI PC Requirements Leaked: RTX 4070 at Recommended',
    summary: 'Alleged Rockstar internal documents surface minimum and recommended specs for the PC release, with ray-traced global illumination requiring an RTX 4070 or RX 7800 XT at 1440p/60.',
    smart_summary: 'RTX 3060 still playable at 1080p medium — the gap between min and recommended is unusually large.',
    original_url: 'https://www.rockstargames.com/VI',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop',
    readTime: '6 MIN READ',
    date: 'MAR 31'
  },
  {
    id: 'xbox-handheld-reveal',
    category: 'GAMING',
    title: 'Xbox Handheld Officially Revealed: ROG Ally DNA, Game Pass Built-In',
    summary: 'Microsoft confirms the Xbox handheld runs a custom AMD APU with RDNA 4 graphics, a 7-inch 120 Hz display, and native Xbox Game Pass integration at no extra cost.',
    smart_summary: 'Game Pass subscribers effectively get a handheld for the hardware price alone — no extra subscription needed.',
    original_url: 'https://www.xbox.com',
    image: 'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=800&auto=format&fit=crop',
    readTime: '8 MIN READ',
    date: 'MAR 30'
  },

  // ── TECH ──────────────────────────────────────────────────────────────────
  {
    id: 'nvidia-h200',
    category: 'TECH',
    title: 'NVIDIA H200: Scalability Reaching New Peaks',
    summary: 'The Hopper architecture successor promises a 2x throughput jump for foundational model training across HBM3e memory.',
    original_url: 'https://www.nvidia.com/en-us/data-center/h200/',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA96w3YAloDO3A30Ghjxk1S39M9OeNeXqtiskRp2xgXpzCz_4OZ2VliObse-N3eVkCA_eOCvmFHSCpQYS7-pmGq7qFpspl6sr4F1Zoz1WMI5QZYkiJUJTbu-SjTBfAHKA3uNFJ_aAfIXSPPXY5nAHwOqv8idDStGSOzkKIElcZVCYENKsesb7lwQnNbivtsZ0pnRDo5xukl3sXgwDRGHdC706ABj0JTMBIPThPWnUZ1Qk0CokpRR-07qTsuewCBAKSX4PyLsnCSMg'
  },
  {
    id: 'amd-ryzen-9-9950x',
    category: 'TECH',
    title: 'AMD Ryzen 9 9950X Review: Zen 5 Redefines Desktop Performance',
    summary: 'Zen 5\'s 16% IPC gain over Zen 4 translates directly to faster game load times, superior 1% low frametimes, and a new benchmark ceiling for content creators.',
    smart_summary: 'First x86 desktop CPU to sustain 5.7 GHz all-core — pair it with DDR5-6400 for maximum gaming uplift.',
    original_url: 'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html',
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9c4?w=800&auto=format&fit=crop',
    readTime: '15 MIN READ',
    date: 'MAR 27'
  },
  {
    id: 'intel-battlemage-arc',
    category: 'TECH',
    title: 'Intel Arc Battlemage B580: Value GPU Disruption',
    summary: 'At $249 the B580 trades blows with the RTX 4060 and RX 7600 XT, with XeSS 2 Super Sampling closing the gap further at 1440p.',
    smart_summary: 'Best price-per-frame at 1440p under $300 — finally a reason to consider Intel GPU for a gaming build.',
    original_url: 'https://www.intel.com/content/www/us/en/products/docs/discrete-gpus/arc/desktop/battlemage.html',
    image: 'https://images.unsplash.com/photo-1592464090715-4b96b4acdf2c?w=800&auto=format&fit=crop',
    readTime: '11 MIN READ',
    date: 'MAR 29'
  },
  {
    id: 'wi-fi-8-gaming-routers',
    category: 'TECH',
    title: 'Wi-Fi 8 Gaming Routers: Sub-1ms Latency Is Here',
    summary: 'The first wave of Wi-Fi 8 (802.11be) routers from ASUS and TP-Link leverage 320 MHz channels and Multi-Link Operation to deliver wired-equivalent latency for wireless gaming.',
    smart_summary: 'MLO lets your headset and controller share two bands simultaneously — lag spikes from wireless interference are now a solved problem.',
    original_url: 'https://www.asus.com/networking-iot-servers/wifi-routers/',
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop',
    readTime: '8 MIN READ',
    date: 'MAR 28'
  },

  // ── AI INTEL ──────────────────────────────────────────────────────────────
  {
    id: 'gpt-5-leak',
    category: 'AI INTEL',
    title: 'GPT-5 Framework: Recursive Reasoners',
    summary: 'Leaked benchmarks suggest the model eliminates hallucination in logical syllogisms and scores 98% on the Mercury suite.',
    original_url: 'https://openai.com/blog/planning-for-agi-and-beyond',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh-dPKUTSQRh3S7j-ZsjzNqMatrVUI0vV62dfeocwtgAIkiZxYGanvFq6oG8_CUmmbJ8yvUFCNCsmhPrbIY40YPqY8G8HW6TexoCLbhO1n5bO2X24TH1Mf-4OsTaHwxGoObd5GgGXkcLHN-mLpGKU01xrzhLc6R1-nDV1UqOUNWth-M5at4-1OOwZ8N7IWZ5GG_p2sN4bubgzjmzo2LluTU-5QnPtUmK4ixpaJB78IKhxbwi-4nj6uiFsilWp9Ibo5KxXcuswcQA'
  },
  {
    id: 'ai-npc-ubisoft',
    category: 'AI INTEL',
    title: 'Ubisoft\'s NEO NPC: LLM-Powered Characters That Remember Everything',
    summary: 'Ubisoft\'s NEO NPC system runs a small on-device LLM that gives every NPC persistent memory, reactive dialogue, and emergent personality — no scripted lines needed.',
    smart_summary: 'NPCs that remember you robbed them last Tuesday and hold a grudge — open-world games will never feel the same.',
    original_url: 'https://news.ubisoft.com/en-us/article/NEO-NPC',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    readTime: '7 MIN READ',
    date: 'APR 01'
  },
  {
    id: 'google-deepmind-genie2',
    category: 'AI INTEL',
    title: 'Google DeepMind Genie 2: Infinite Playable Worlds from a Single Image',
    summary: 'Genie 2 generates fully playable, physics-consistent 3D game environments from a single prompt image, running at interactive frame rates with consistent world state.',
    smart_summary: 'Describe a game world, get a playable prototype in seconds — the dev time for indie studios just collapsed.',
    original_url: 'https://deepmind.google/discover/blog/',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    readTime: '9 MIN READ',
    date: 'MAR 30'
  },
];
