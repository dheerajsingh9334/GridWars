import { Response } from 'express';
import TileHistory from '../models/TileHistory';
import { AuthRequest } from '../middleware/auth';

export const getMyHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const player = req.player!;
    const entries = await TileHistory.find({ playerId: player._id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json(entries.map((e) => ({
      id: e._id.toString(),
      x: e.x,
      y: e.y,
      color: e.color,
      action: e.action,
      player_name: e.playerName,
      created_at: e.createdAt,
    })));
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
