export const GRID_COLS = 40;
export const GRID_ROWS = 25;
export const TOTAL_TILES = GRID_COLS * GRID_ROWS;
export const CLAIM_COOLDOWN_MS = 800;

export const PLAYER_COLORS = [
  '#22d3ee', // cyan
  '#f472b6', // pink
  '#a78bfa', // violet
  '#fbbf24', // amber
  '#34d399', // emerald
  '#fb7185', // rose
  '#60a5fa', // blue
  '#f97316', // orange
  '#c084fc', // purple
  '#4ade80', // green
  '#facc15', // yellow
  '#2dd4bf', // teal
] as const;

export const ANIMAL_NAMES = [
  'Fox', 'Otter', 'Wolf', 'Hawk', 'Lynx', 'Owl', 'Bear', 'Raven',
  'Tiger', 'Panda', 'Eagle', 'Deer', 'Moth', 'Crab', 'Seal', 'Koi',
];

export const ADJECTIVES = [
  'Quick', 'Silent', 'Cosmic', 'Neon', 'Wild', 'Lone', 'Bold', 'Lucky',
  'Vivid', 'Solar', 'Frost', 'Rogue', 'Glow', 'Echo', 'Nova', 'Drift',
];

export const randomName = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)];
  return `${adj} ${noun}`;
};

export const randomColor = (): string => {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
};
