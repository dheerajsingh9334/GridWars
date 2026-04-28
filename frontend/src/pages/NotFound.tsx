import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card/40 font-mono text-2xl">
      ??
    </div>
    <h1 className="font-mono text-xl font-bold uppercase tracking-[0.2em]">404 — Not Found</h1>
    <p className="text-sm text-muted-foreground">This tile doesn't exist.</p>
    <Link
      to="/"
      className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:opacity-90"
    >
      Go home
    </Link>
  </main>
);

export default NotFound;
