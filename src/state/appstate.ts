import { Device } from "mediasoup-client";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";

interface AppState {
  joinRoom: (data: { room: string; name: string }) => void;
  socket: Socket | null;
  device: Device | null;
  initSocketIO: () => Socket;
}

export const useAppState = create<AppState>((set) => ({
  socket: null,
  device: null,

  initSocketIO() {
    const socket = io("https://localhost:3001", {
      secure: true,
      rejectUnauthorized: false, // allow self-signed cert in dev
    });
    set({ socket });
    return socket;
  },

  joinRoom({ room, name }) {
    console.log("Joining room:", room, "as", name);
  },
}));
