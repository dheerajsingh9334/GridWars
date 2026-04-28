import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import tileRoutes from "./routes/tiles";
import historyRoutes from "./routes/history";
import { setIo } from "./controllers/tileController";
import { initSocket } from "./socket/socketHandler";

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Allow both local and deployed frontends
const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://grid-wars-phi.vercel.app",
].concat(CLIENT_URL ? [CLIENT_URL] : []);

const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Provide io to tile controller for broadcasting
setIo(io);
initSocket(io);

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tiles", tileRoutes);
app.use("/api/history", historyRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || "5000", 10);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
