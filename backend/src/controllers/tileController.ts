import { Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import Tile from '../models/Tile';
import TileHistory from '../models/TileHistory';
import { AuthRequest } from '../middleware/auth';
import { GRID_COLS, GRID_ROWS } from '../config/constants';

let io: SocketServer | null = null;

export const setIo = (socketIo: SocketServer): void => {
  io = socketIo;
};

export const getAllTiles = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tiles = await Tile.find({}).lean();
    res.json(tiles.map((t) => ({
      x: t.x,
      y: t.y,
      player_id: t.playerId.toString(),
      player_name: t.playerName,
      color: t.color,
      claimed_at: t.claimedAt,
    })));
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const claimTile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = req.player!;
    const { x, y, color } = req.body as { x: number; y: number; color: string };

    if (
      typeof x !== 'number' || typeof y !== 'number' ||
      x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS
    ) {
      res.status(400).json({ message: 'Invalid tile coordinates' });
      return;
    }

    const existing = await Tile.findOne({ x, y });
    const action = existing ? 'recapture' : 'claim';

    const tile = await Tile.findOneAndUpdate(
      { x, y },
      {
        playerId: player._id,
        playerName: player.name,
        color: color || player.color,
        claimedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await TileHistory.create({
      playerId: player._id,
      playerName: player.name,
      x,
      y,
      color: color || player.color,
      action,
    });

    const tileData = {
      x: tile.x,
      y: tile.y,
      player_id: tile.playerId.toString(),
      player_name: tile.playerName,
      color: tile.color,
      claimed_at: tile.claimedAt,
    };

    // Broadcast to all connected clients
    if (io) io.emit('tile:update', tileData);

    res.json(tileData);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const eraseTile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = req.player!;
    const { x, y } = req.body as { x: number; y: number };

    const tile = await Tile.findOne({ x, y });
    if (!tile) {
      res.status(404).json({ message: 'Tile not found' });
      return;
    }

    if (tile.playerId.toString() !== player._id.toString()) {
      res.status(403).json({ message: 'You can only erase your own tiles' });
      return;
    }

    await Tile.deleteOne({ x, y });

    await TileHistory.create({
      playerId: player._id,
      playerName: player.name,
      x,
      y,
      color: tile.color,
      action: 'erase',
    });

    if (io) io.emit('tile:erase', { x, y });

    res.json({ message: 'Tile erased', x, y });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
