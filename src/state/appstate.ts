import { create } from "zustand";

interface AppState {}

export const useAppState = create<AppState>()((set) => ({}));
