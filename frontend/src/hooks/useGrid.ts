import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import socket from '@/lib/socket';
import type { Tile, TileKey } from '@/types';
import { tileKey } from '@/types';

export function useGrid() {
  const [tiles, setTiles] = useState<Map<TileKey, Tile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [lastChanged, setLastChanged] = useState<TileKey | null>(null);

  // Load initial tiles
  useEffect(() => {
    api.get<Tile[]>('/tiles')
      .then((res) => {
        const map = new Map<TileKey, Tile>();
        res.data.forEach((t) => map.set(tileKey(t.x, t.y), t));
        setTiles(map);
      })
      .catch((err) => {
        console.error('Failed to load tiles:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = (tile: Tile) => {
      setTiles((prev) => {
        const next = new Map(prev);
        next.set(tileKey(tile.x, tile.y), tile);
        return next;
      });
      setLastChanged(tileKey(tile.x, tile.y));
    };

    const handleErase = ({ x, y }: { x: number; y: number }) => {
      setTiles((prev) => {
        const next = new Map(prev);
        next.delete(tileKey(x, y));
        return next;
      });
    };

    socket.on('tile:update', handleUpdate);
    socket.on('tile:erase', handleErase);

    return () => {
      socket.off('tile:update', handleUpdate);
      socket.off('tile:erase', handleErase);
    };
  }, []);

  const applyOptimistic = (tile: Tile) => {
    setTiles((prev) => {
      const next = new Map(prev);
      next.set(tileKey(tile.x, tile.y), tile);
      return next;
    });
    setLastChanged(tileKey(tile.x, tile.y));
  };

  const removeOptimistic = (x: number, y: number) => {
    setTiles((prev) => {
      const next = new Map(prev);
      next.delete(tileKey(x, y));
      return next;
    });
  };

  return { tiles, loading, lastChanged, applyOptimistic, removeOptimistic };
}
