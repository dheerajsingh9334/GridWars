import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eraser, Pencil, RotateCw } from 'lucide-react';
import api from '@/lib/api';
import type { HistoryEntry } from '@/types';

const ICONS = {
  claim: Pencil,
  recapture: RotateCw,
  erase: Eraser,
} as const;

const ACTION_LABEL = {
  claim: 'Claimed',
  recapture: 'Recaptured',
  erase: 'Erased',
} as const;

const fmt = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
};

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<HistoryEntry[]>('/history')
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, []);

  const claimCount = entries.filter((e) => e.action !== 'erase').length;
  const eraseCount = entries.filter((e) => e.action === 'erase').length;

  return (
    <main className="min-h-screen w-full p-3 sm:p-6">
      <div className="mx-auto flex max-w-[960px] flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/play"
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Your history</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {entries.length} actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Stat label="Claims" value={claimCount} />
            <Stat label="Erases" value={eraseCount} />
          </div>
        </header>

        <section className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
          {loading ? (
            <p className="p-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              loading…
            </p>
          ) : entries.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No actions yet — head to the grid and claim your first tile.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {entries.map((e) => {
                const Icon = ICONS[e.action];
                return (
                  <li key={e.id} className="flex items-center gap-4 px-5 py-3">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-md ring-1 ring-border/60"
                      style={{
                        background: e.color ? `${e.color}22` : 'hsl(var(--muted) / 0.4)',
                        color: e.color ?? 'hsl(var(--muted-foreground))',
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{ACTION_LABEL[e.action]}</span>{' '}
                        <span className="text-muted-foreground">tile</span>{' '}
                        <span className="font-mono text-xs">({e.x}, {e.y})</span>
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {fmt(e.created_at)}
                        {e.color ? ` · ${e.color}` : ''}
                      </p>
                    </div>
                    <span
                      className="h-4 w-4 rounded-sm ring-1 ring-border/60"
                      style={{ background: e.color ?? 'transparent' }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5">
    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span className="ml-2 font-display text-sm font-medium">{value}</span>
  </div>
);

export default History;
