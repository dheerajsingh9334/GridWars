import { Sparkles, Users, Grid3x3 } from 'lucide-react';
import { TOTAL_TILES } from '@/config/constants';
import type { Player } from '@/types';

interface HudProps {
  player: (Player & { color: string }) | null;
  online: number;
  claimedCount: number;
  myCount: number;
  isAuthed?: boolean;
  rightSlot?: React.ReactNode;
}

export function Hud({ player, online, claimedCount, myCount, isAuthed, rightSlot }: HudProps) {
  const pct = ((claimedCount / TOTAL_TILES) * 100).toFixed(1);

  return (
    <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Grid3x3 className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold uppercase tracking-[0.2em] text-glow">
            Grid<span className="text-primary">/</span>Wars
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            real-time pixel battle
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Stat icon={<Users className="h-3.5 w-3.5" />} label="online" value={online} />
        <Stat
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="claimed"
          value={`${claimedCount}/${TOTAL_TILES}`}
          sub={`${pct}%`}
        />
        {player && (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2">
            <span
              className="h-3 w-3 rounded-full pulse-soft"
              style={{ backgroundColor: player.color, boxShadow: `0 0 10px ${player.color}` }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {isAuthed ? 'you' : 'guest'} · {myCount} tiles
              </span>
              <span className="font-mono text-sm font-semibold">{player.name}</span>
            </div>
          </div>
        )}
        {rightSlot}
      </div>
    </header>
  );
}

function Stat({
  icon, label, value, sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-end leading-none">
      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}{label}
      </span>
      <span className="mt-1 font-mono text-base font-bold tabular-nums text-foreground">
        {value}
        {sub && <span className="ml-1 text-xs text-muted-foreground">{sub}</span>}
      </span>
    </div>
  );
}
