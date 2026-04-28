export interface Player {
  id: string;
  email: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Tile {
  x: number;
  y: number;
  player_id: string;
  player_name: string;
  color: string;
  claimed_at: string;
}

export type TileKey = `${number}:${number}`;
export const tileKey = (x: number, y: number): TileKey => `${x}:${y}`;

export interface HistoryEntry {
  id: string;
  x: number;
  y: number;
  color: string | null;
  action: 'claim' | 'recapture' | 'erase';
  player_name: string;
  created_at: string;
}
