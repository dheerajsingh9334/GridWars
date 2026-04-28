import { memo, useEffect, useState } from 'react';
import { GRID_COLS, GRID_ROWS } from '@/config/constants';
import type { Tile, TileKey } from '@/types';
import { tileKey } from '@/types';

export type Tool = 'paint' | 'brush' | 'erase' | 'pick';

interface GridCanvasProps {
  tiles: Map<TileKey, Tile>;
  lastChanged: TileKey | null;
  hoveredTile: Tile | null;
  onHover: (tile: Tile | null, x: number, y: number) => void;
  onAction: (x: number, y: number) => void;
  onDragPaint: (x: number, y: number) => void;
  myPlayerId: string | null;
  tool: Tool;
  brushColor: string;
}

const cursorFor = (tool: Tool) => {
  switch (tool) {
    case 'erase': return 'cursor-not-allowed';
    case 'pick': return 'cursor-crosshair';
    case 'brush': return 'cursor-cell';
    default: return 'cursor-pointer';
  }
};

function GridCanvasImpl({
  tiles, lastChanged, onHover, onAction, onDragPaint, myPlayerId, tool, brushColor,
}: GridCanvasProps) {
  const [poppingKey, setPoppingKey] = useState<TileKey | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!lastChanged) return;
    setPoppingKey(lastChanged);
    const t = setTimeout(() => setPoppingKey(null), 350);
    return () => clearTimeout(t);
  }, [lastChanged]);

  useEffect(() => {
    const stop = () => setIsDragging(false);
    window.addEventListener('mouseup', stop);
    window.addEventListener('mouseleave', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('mouseleave', stop);
    };
  }, []);

  return (
    <div
      className={`grid w-full select-none gap-[2px] rounded-2xl bg-grid-line p-[2px] shadow-[var(--shadow-card)] ${cursorFor(tool)}`}
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
      }}
      onMouseLeave={() => onHover(null, -1, -1)}
    >
      {Array.from({ length: GRID_ROWS }).map((_, y) =>
        Array.from({ length: GRID_COLS }).map((_, x) => {
          const k = tileKey(x, y);
          const tile = tiles.get(k);
          const isMine = tile && tile.player_id === myPlayerId;
          const isPopping = poppingKey === k;
          return (
            <button
              key={k}
              type="button"
              title={tile ? `${tile.player_name} · (${x},${y})` : `(${x},${y}) · unclaimed`}
              aria-label={`Tile ${x},${y}${tile ? ` owned by ${tile.player_name}` : ' unclaimed'}`}
              onMouseEnter={() => {
                onHover(tile ?? null, x, y);
                if (isDragging && tool === 'brush') onDragPaint(x, y);
              }}
              onMouseDown={() => {
                if (tool === 'brush') {
                  setIsDragging(true);
                  onDragPaint(x, y);
                }
              }}
              onClick={() => {
                if (tool !== 'brush') onAction(x, y);
              }}
              className={[
                'group relative aspect-square rounded-[3px] transition-all duration-200 ease-out',
                'hover:z-30 hover:scale-110',
                tool === 'pick' && tile ? 'hover:ring-2 hover:ring-white/60' : '',
                !tile ? 'bg-grid-empty hover:bg-secondary' : '',
              ].join(' ')}
              style={{
                ...(tile ? {
                  backgroundColor: tile.color,
                  boxShadow: isMine
                    ? `0 0 0 1px ${tile.color}, 0 0 8px ${tile.color}80`
                    : undefined,
                } : undefined),
                ...(!tile ? { ['--hover-glow' as string]: brushColor } : {}),
              }}
            >
              {!tile && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-[3px] opacity-0 transition-opacity duration-150 group-hover:opacity-30"
                  style={{ backgroundColor: brushColor }}
                />
              )}
              {tile && (
                <span
                  className="pointer-events-none absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-card/95 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-[var(--shadow-card)] backdrop-blur group-hover:block"
                  style={{ borderColor: tile.color }}
                >
                  <span
                    className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle"
                    style={{ backgroundColor: tile.color }}
                  />
                  {tile.player_name}
                </span>
              )}
              {isPopping && (
                <span
                  className="tile-pop absolute inset-0 rounded-[3px]"
                  style={{ backgroundColor: tile?.color ?? brushColor }}
                />
              )}
              {isPopping && (
                <span
                  className="tile-ripple pointer-events-none absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${tile?.color ?? brushColor}` }}
                />
              )}
            </button>
          );
        }),
      )}
    </div>
  );
}

export const GridCanvas = memo(GridCanvasImpl);
