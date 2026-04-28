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

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
