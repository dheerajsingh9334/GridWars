import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Player from "../models/Player";
import { randomName, randomColor } from "../config/constants";
import { AuthRequest } from "../middleware/auth";

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };
    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const existing = await Player.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const player = await Player.create({
      email,
      password: hashed,
      name: name?.trim() || randomName(),
      color: randomColor(),
    });

    const token = signToken(player._id.toString());
    res.cookie("gw_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      player: {
        id: player._id,
        email: player.email,
        name: player.name,
        color: player.color,
        createdAt: player.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const player = await Player.findOne({ email });
    if (!player) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, player.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken(player._id.toString());
    res.cookie("gw_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      player: {
        id: player._id,
        email: player.email,
        name: player.name,
        color: player.color,
        createdAt: player.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  const p = req.player!;
  res.json({
    id: p._id,
    email: p.email,
    name: p.name,
    color: p.color,
    createdAt: p.createdAt,
  });
};
