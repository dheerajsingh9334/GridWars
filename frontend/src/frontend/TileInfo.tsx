import type { Tile } from '@/types';

interface TileInfoProps {
  tile: Tile | null;
  coord: { x: number; y: number } | null;
}

export function TileInfo({ tile, coord }: TileInfoProps) {
  if (!coord) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        hover a tile to inspect
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {tile ? (
        <>
          <span
            className="h-5 w-5 shrink-0 rounded-sm"
            style={{
              backgroundColor: tile.color,
              boxShadow: `0 0 10px ${tile.color}88`,
            }}
          />
          <div>
            <p className="font-mono text-xs font-semibold">
              ({coord.x}, {coord.y}) ·{' '}
              <span style={{ color: tile.color }}>{tile.player_name}</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {tile.color.toUpperCase()} · claimed {fmt(tile.claimed_at)}
            </p>
          </div>
        </>
      ) : (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          ({coord.x}, {coord.y}) · unclaimed
        </p>
      )}
    </div>
  );
}

const fmt = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};
