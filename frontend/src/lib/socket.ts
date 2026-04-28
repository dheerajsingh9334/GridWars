import { io } from "socket.io-client";
import { SOCKET_URL } from "@/config/constants";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true, // Enable cookies
});

export default socket;
