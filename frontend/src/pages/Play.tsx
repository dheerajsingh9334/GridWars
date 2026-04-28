import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Clock, LogOut } from 'lucide-react';
import { CLAIM_COOLDOWN_MS } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import { useGrid } from '@/hooks/useGrid';
import { usePresence } from '@/hooks/usePresence';
import api from '@/lib/api';
import type { Tile } from '@/types';
import { tileKey } from '@/types';
import { GridCanvas, type Tool } from '@/frontend/GridCanvas';
import { Hud } from '@/frontend/Hud';
import { Leaderboard } from '@/frontend/Leaderboard';
import { TileInfo } from '@/frontend/TileInfo';
import { Toolbar } from '@/frontend/Toolbar';

const Play = () => {
  const { player, signOut } = useAuth();
  const { tiles, loading, lastChanged, applyOptimistic, removeOptimistic } = useGrid();
  const online = usePresence();
  const [hover, setHover] = useState<{ tile: Tile | null; x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>('paint');
  const [color, setColor] = useState<string>(player?.color || '#22d3ee');
  const lastClaimRef = useRef(0);
  const dragPaintedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (player?.color) setColor(player.color);
  }, [player?.color]);

  const myCount = useMemo(() => {
    if (!player) return 0;
    let n = 0;
    tiles.forEach((t) => { if (t.player_id === player.id) n++; });
    return n;
  }, [tiles, player]);

  const doClaim = async (x: number, y: number, throttle: boolean) => {
    if (!player) return;
    if (throttle) {
      const now = Date.now();
      if (now - lastClaimRef.current < CLAIM_COOLDOWN_MS) {
        toast('Slow down a little 🌶', { icon: '⏱' });
        return;
      }
      lastClaimRef.current = now;
    }

    const optimistic: Tile = {
      x, y,
      player_id: player.id,
      player_name: player.name,
      color,
      claimed_at: new Date().toISOString(),
    };
    applyOptimistic(optimistic);

    try {
      await api.post('/tiles/claim', { x, y, color });
    } catch {
      toast.error('Claim failed — try again');
    }
  };

  const handleAction = async (x: number, y: number) => {
    if (!player) return;
    const existing = tiles.get(tileKey(x, y));

    if (tool === 'pick') {
      if (existing) {
        setColor(existing.color);
        toast.success(`Color picked: ${existing.color.toUpperCase()}`);
      }
      return;
    }

    if (tool === 'erase') {
      if (!existing) return;
      if (existing.player_id !== player.id) {
        toast.error("You can only erase tiles you've claimed.");
        return;
      }
      removeOptimistic(x, y);
      try {
        await api.post('/tiles/erase', { x, y });
      } catch {
        toast.error('Erase failed — try again');
      }
      return;
    }

    await doClaim(x, y, true);
  };

  const handleDragPaint = (x: number, y: number) => {
    const k = `${x}:${y}`;
    if (dragPaintedRef.current.has(k)) return;
    dragPaintedRef.current.add(k);
    void doClaim(x, y, false);
  };

  useEffect(() => {
    const reset = () => dragPaintedRef.current.clear();
    window.addEventListener('mouseup', reset);
    return () => window.removeEventListener('mouseup', reset);
  }, []);

  return (
    <main className="min-h-screen w-full p-3 sm:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <Hud
          player={player ? { ...player, color } : null}
          online={online}
          claimedCount={tiles.size}
          myCount={myCount}
          isAuthed={!!player}
          rightSlot={
            <div className="flex items-center gap-2">
              <Link
                to="/history"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Clock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">History</span>
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          }
        />

        <Toolbar tool={tool} onToolChange={setTool} color={color} onColorChange={setColor} />

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col gap-3">
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground pulse-soft">
                    Connecting to grid…
                  </p>
                </div>
              )}
              <GridCanvas
                tiles={tiles}
                lastChanged={lastChanged}
                hoveredTile={hover?.tile ?? null}
                onHover={(tile, x, y) => setHover(x < 0 ? null : { tile, x, y })}
                onAction={handleAction}
                onDragPaint={handleDragPaint}
                myPlayerId={player?.id ?? null}
                tool={tool}
                brushColor={color}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TileInfo tile={hover?.tile ?? null} coord={hover ? { x: hover.x, y: hover.y } : null} />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {tool === 'brush'
                  ? 'click + drag to paint · live sync'
                  : tool === 'erase'
                  ? 'click your tiles to erase'
                  : tool === 'pick'
                  ? 'click any tile to sample its color'
                  : 'click to capture · updates broadcast live'}
              </p>
            </div>
          </section>

          <Leaderboard tiles={tiles} myPlayerId={player?.id ?? null} />
        </div>
      </div>
    </main>
  );
};

export default Play;
