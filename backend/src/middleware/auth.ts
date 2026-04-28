import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Player, { IPlayer } from "../models/Player";

export interface AuthRequest extends Request {
  player?: IPlayer;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies.gw_token;
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
    };
    const player = await Player.findById(decoded.id).select("-password");
    if (!player) {
      res.status(401).json({ message: "Player not found" });
      return;
    }
    req.player = player;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
