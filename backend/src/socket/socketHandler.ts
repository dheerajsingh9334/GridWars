import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import { Request } from "express";

let onlineCount = 0;

export const initSocket = (io: SocketServer): void => {
  io.use((socket, next) => {
    const rawCookies = socket.request.headers.cookie;
    let token: string | undefined;
    if (rawCookies) {
      const match = rawCookies.match(/(?:^|;\\s*)gw_token=([^;]*)/);
      if (match) token = match[1];
    }
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
