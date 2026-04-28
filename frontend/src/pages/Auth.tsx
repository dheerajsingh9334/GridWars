import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Grid3x3, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Mode = 'signin' | 'signup';

const Auth = () => {
  const nav = useNavigate();
  const { player, signIn, signUp } = useAuth();
  const initialMode: Mode =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'signup'
      ? 'signup'
      : 'signin';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player) nav('/play', { replace: true });
  }, [player, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name || undefined);
        toast.success('Account created — welcome!');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
      }
      nav('/play', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <Link
        to="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        back home
      </Link>

      <div className="glass w-full max-w-md rounded-2xl p-8 fade-in-up">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Grid3x3 className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.2em] text-glow">
              Grid<span className="text-primary">/</span>Wars
            </h1>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {mode === 'signin' ? 'sign in to continue' : 'create your player'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                display name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Neon Fox"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center font-mono text-xs text-muted-foreground">
          {mode === 'signin' ? 'New here?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  );
};

export default Auth;
