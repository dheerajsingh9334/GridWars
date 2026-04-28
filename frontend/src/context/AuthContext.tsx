import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "@/lib/api";
import socket from "@/lib/socket";
import type { Player } from "@/types";

interface AuthContextValue {
  player: Player | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Player>("/auth/me")
      .then((res) => {
        setPlayer(res.data);
        socket.connect();
      })
      .catch(() => {
        setPlayer(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await api.post<{ player: Player }>("/auth/signin", {
      email,
      password,
    });
    setPlayer(res.data.player);
    socket.connect();
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const res = await api.post<{ player: Player }>("/auth/signup", {
      email,
      password,
      name,
    });
    setPlayer(res.data.player);
    socket.connect();
  };

  const signOut = () => {
    setPlayer(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ player, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
