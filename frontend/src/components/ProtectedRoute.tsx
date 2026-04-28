import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { player, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground pulse-soft">
          Loading…
        </p>
      </div>
    );
  }
  if (!player) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
