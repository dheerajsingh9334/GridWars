import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PREVIEW_TILES = Array.from({ length: 96 });
const PREVIEW_COLORS = [
  '#22d3ee', '#a78bfa', '#f472b6', '#facc15', '#34d399', '#fb7185',
  '#60a5fa', '#fbbf24', '#c084fc', '#4ade80',
];

const Landing = () => {
  const { player, loading } = useAuth();
  if (!loading && player) return <Navigate to="/play" replace />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[160px]" />
      </div>

      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 font-mono text-sm text-primary ring-1 ring-primary/30">
            ⬢
          </span>
          <span className="font-mono text-sm uppercase tracking-[0.3em]">Gridwars</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/auth?mode=signup"
            className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Get started <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Live · realtime · multiplayer
          </span>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Claim a tile.
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Watch the world react.
            </span>
          </h1>
          <p className="max-w-xl text-pretty text-lg text-muted-foreground">
            A shared canvas of hundreds of blocks. Every click syncs in real time across every
            player online. Build territory, paint art, or just leave your mark.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
            >
              Start playing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-base text-foreground transition hover:bg-secondary"
            >
              I have an account
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-border/40 pt-8 text-sm">
            <Feature icon={<Zap className="h-4 w-4" />} label="Instant sync" value="<100ms" />
            <Feature icon={<Users className="h-4 w-4" />} label="Live presence" value="Every click" />
            <Feature icon={<Sparkles className="h-4 w-4" />} label="Full history" value="Every tile" />
          </dl>
        </div>

        {/* Animated preview grid */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 blur-2xl" />
          <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>preview · room/01</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                live
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1.5">
              {PREVIEW_TILES.map((_, i) => {
                const filled = (i * 7) % 11 < 5;
                const c = PREVIEW_COLORS[i % PREVIEW_COLORS.length];
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm transition-all duration-700"
                    style={{
                      background: filled ? c : 'hsl(var(--muted) / 0.25)',
                      boxShadow: filled ? `0 0 12px ${c}55` : 'none',
                      animation: filled ? `pulseTile 4s ease-in-out ${i * 90}ms infinite` : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulseTile {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.94); opacity: 0.78; }
        }
      `}</style>
    </main>
  );
};

const Feature = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-1.5 text-primary">{icon}</span>
    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
    <dd className="font-display text-lg font-medium">{value}</dd>
  </div>
);

export default Landing;
