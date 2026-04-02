export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string; // Fallback or static summary
  smart_summary?: string; // AI dynamic hook
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
  brand?: string; // For filtering gear companies
  date?: string;
}

export const newsData: NewsItem[] = [
  {
    id: 'invincible-s4-e5',
    category: 'TECH',
    title: 'Invincible Season 4 Episode 5 Breaks Records',
    summary: 'The highly anticipated episode 5 of Invincible Season 4 has dropped, changing the entire trajectory of the animated superhero epic. Mark\'s journey takes a dark turn.',
    original_url: 'https://www.ign.com/articles/invincible-season-4-episode-5-give-us-a-moment-review',
    image: 'https://static.wikia.nocookie.net/amazon-invincible/images/1/13/Mark_Grayson_%28Invincible%29.png',
    featured: true,
    live: true,
    date: 'APR 02'
  },
  {
    id: 'razer-huntsman-v3',
    category: 'GEAR',
    brand: 'Razer',
    title: 'Razer Huntsman V3 Pro: The Optical Evolution',
    summary: 'Redefining rapid-fire response with adjustable actuation and the world\'s most advanced optical switches.',
    original_url: 'https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro-mini',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACNHGd0feJTgm2efTvnL6U8jq3MGfoCd6CYMdPKg3IAriTwLbgf0Gxy2yVzRhX_hP1KvqhpxPR8gvdH1wFZC5WNIHwm2ai0npETKjyzJNmJsmPyp-4x11icO5Mrgf0WUu3Ga41FpuK8mqPbZJ_UzHXDRG83YGR4szsCOziOQfrwWHIk4AKZ2X37jTciW0Z73HPt-yRq8yKhuwR_25LaHZhWnPJQ7p45v69iMUZSnbQxKqeB37KDmHS2IzShAAXjdkUhJ8Fjai0HA',
    readTime: '12 MIN READ'
  },
  {
    id: 'corsair-dominator',
    category: 'GEAR',
    brand: 'Corsair',
    title: 'Corsair Dominator Titanium: Overclocking the Aesthetic',
    summary: 'Precision-engineered for extreme speeds and unparalleled customization.',
    original_url: 'https://www.corsair.com/us/en/p/memory/cmp32gx5m2b7200c34/dominator-titanium-rgb-32gb-2x16gb-ddr5-7200mt-s-cl34-intel-xmp-memory-kit-black-cmp32gx5m2b7200c34',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1K24Iu6gU11jTk5J8yJqQOj7WTLYx8PIW1ow4x2za17hvJSZ2okE2jzTnUqT64ddMgCXwLXFDba0LCqlkrCWcf-PA-233U5GNgfrNsbexSuKSrfDn_Z4vYwX5nyYmDR5IbC8tbAVPSrXEBPkPblGQN_ilO-I7h2j5uDGie6DtsSKy3cO07fXzUTEm3UqCY8qmZaJ0fB4I_HmhcZxY7tYqYnAfDpIDadK-4Ykgn2UtOmtLj4NmhKzT7m1xCH870QLYvFNEaAVcog',
    readTime: '8 MIN READ'
  },
  {
    id: 'logitech-g-pro',
    category: 'GEAR',
    brand: 'Logitech G',
    title: 'Logitech G Pro X Superlight 2: LIGHTSPEED Performance',
    summary: 'The choice of world-class esports athletes, now lighter and faster than ever.',
    original_url: 'https://www.logitechg.com/en-us/products/gaming-mice/pro-x-superlight-2-wireless-mouse.910-006628.html',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA70s5SOTDOT2Zvyeqgmm58tXTnRcuULtMpEMS2Xk_RWzCcZRlu9-mamp6NHOFbXJunuAhLVUuSmlIngIFEFPmNTT_YiaCPf1HovuoEp-hIAumpbWpioVO0XLDGPVYvKsuPrGXWKl5JDXfoDuMF24aaQyDi6RqjtAngnoFiBdb0h18U119T0wsiVs_DpqM4hsY6dV9zyqadaO9ePx75T6xox30g2Es27g-IjzIdWpoYTwmu5PNqPogWfHpP2x_X8iz96QO2cgs4tw'
  },
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
    id: 'gpt-5-leak',
    category: 'AI INTEL',
    title: 'GPT-5 Framework: Recursive Reasoners',
    summary: 'Leaked benchmarks suggest the model eliminates hallucination in logical syllogisms.',
    original_url: 'https://openai.com/blog/planning-for-agi-and-beyond',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh-dPKUTSQRh3S7j-ZsjzNqMatrVUI0vV62dfeocwtgAIkiZxYGanvFq6oG8_CUmmbJ8yvUFCNCsmhPrbIY40YPqY8G8HW6TexoCLbhO1n5bO2X24TH1Mf-4OsTaHwxGoObd5GgGXkcLHN-mLpGKU01xrzhLc6R1-nDV1UqOUNWth-M5at4-1OOwZ8N7IWZ5GG_p2sN4bubgzjmzo2LluTU-5QnPtUmK4ixpaJB78IKhxbwi-4nj6uiFsilWp9Ibo5KxXcuswcQA'
  },
  {
    id: 'nvidia-h200',
    category: 'TECH',
    title: 'NVIDIA H200: Scalability Reaching New Peaks',
    summary: 'The Hopper architecture successor promises a 2x throughput jump for foundational model training.',
    original_url: 'https://www.nvidia.com/en-us/data-center/h200/',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA96w3YAloDO3A30Ghjxk1S39M9OeNeXqtiskRp2xgXpzCz_4OZ2VliObse-N3eVkCA_eOCvmFHSCpQYS7-pmGq7qFpspl6sr4F1Zoz1WMI5QZYkiJUJTbu-SjTBfAHKA3uNFJ_aAfIXSPPXY5nAHwOqv8idDStGSOzkKIElcZVCYENKsesb7lwQnNbivtsZ0pnRDo5xukl3sXgwDRGHdC706ABj0JTMBIPThPWnUZ1Qk0CokpRR-07qTsuewCBAKSX4PyLsnCSMg'
  }
];
