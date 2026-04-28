import { Trophy } from 'lucide-react';
import { useMemo } from 'react';
import type { Tile, TileKey } from '@/types';

interface LeaderboardProps {
  tiles: Map<TileKey, Tile>;
  myPlayerId: string | null;
}

interface Row {
  player_id: string;
  player_name: string;
  color: string;
  count: number;
}

export function Leaderboard({ tiles, myPlayerId }: LeaderboardProps) {
  const rows = useMemo<Row[]>(() => {
    const map = new Map<string, Row>();
    tiles.forEach((t) => {
      const r = map.get(t.player_id);
      if (r) r.count += 1;
      else map.set(t.player_id, { player_id: t.player_id, player_name: t.player_name, color: t.color, count: 1 });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [tiles]);

  const max = rows[0]?.count ?? 1;

  return (
    <aside className="glass flex h-full flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Leaderboard</h2>
      </div>

      {rows.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">No claims yet. Click a tile to start.</p>
      ) : (
        <ol className="space-y-2.5">
          {rows.map((r, i) => {
            const isMe = r.player_id === myPlayerId;
            const w = (r.count / max) * 100;
            return (
              <li
                key={r.player_id}
                className="fade-in-up relative overflow-hidden rounded-lg border border-border bg-card/40 px-3 py-2"
              >
                <div
                  className="absolute inset-y-0 left-0 opacity-15 transition-all duration-500"
                  style={{ width: `${w}%`, backgroundColor: r.color }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="w-4 font-mono text-[10px] tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: r.color, boxShadow: `0 0 8px ${r.color}` }}
                    />
                    <span className={`truncate text-sm ${isMe ? 'font-bold text-primary' : 'text-foreground'}`}>
                      {r.player_name}
                      {isMe && <span className="ml-1 text-[10px] uppercase">· you</span>}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold tabular-nums">{r.count}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </aside>
  );
}
