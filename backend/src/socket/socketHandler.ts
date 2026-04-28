import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import { Request } from "express";

let onlineCount = 0;

export const initSocket = (io: SocketServer): void => {
  io.use((socket, next) => {
    const token = (socket.request as Request).cookies?.gw_token as
      | string
      | undefined;
    if (!token) {
      // Allow unauthenticated connections for online count
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        id: string;
      };
      socket.data.playerId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    onlineCount++;
    io.emit("presence:count", onlineCount);

    socket.on("disconnect", () => {
      onlineCount = Math.max(0, onlineCount - 1);
      io.emit("presence:count", onlineCount);
    });
  });
};
