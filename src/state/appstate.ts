import { create } from "zustand";

interface AppState {
  joinRoom: (data: { room: string; name: string }) => unknown;
}

export const useAppState = create<AppState>()((set) => ({
  joinRoom() {
    console.log("join room");
  },
}));
