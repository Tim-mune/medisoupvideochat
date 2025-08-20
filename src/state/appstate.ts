import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/types";
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";

interface AppState {
  joinRoom: (data: { roomName: string; userName: string }) => Promise<string>;
  // getUserMedia:()=>
  socket: Socket | null;
  device: Device | null;
  transport: Transport | null;
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream) => void;
  initSocketIO: () => Socket;
  createTansport: () => void;
  createRecvTransport: () => Promise<Transport | undefined>;
}

export const useAppState = create<AppState>((set, get) => ({
  socket: null,
  device: null,
  transport: null,
  localStream: null,

  initSocketIO() {
    const socket = io("https://localhost:3001", {
      secure: true,
      rejectUnauthorized: false, // allow self-signed cert in dev
    });
    set({ socket });
    return socket;
  },

  setLocalStream(stream) {
    set({ localStream: stream });
  },

  async joinRoom(data) {
    const { socket } = get();
    if (!socket) {
      toast.error("Reload your browser tab");
      return "Error";
    }
    try {
      const res = await socket?.emitWithAck("joinRoom", data);
      console.log("res", res);

      const device = new Device();
      await device.load({
        routerRtpCapabilities: res,
        preferLocalCodecsOrder: true,
      });
      set({ device });
      return data.roomName;
    } catch (error) {
      console.error("err", error);
      return "Error";
    }
  },

  async createTansport() {
    const { device, socket, localStream } = get();
    if (!socket) {
      toast.error("Please reload your browser");
      return;
    }

    const transportParams = await socket?.emitWithAck("createTransport");
    console.log("transport", transportParams);

    if (!transportParams) {
      toast.error("Server Failed WebRTC Transport");
    }
    const transport = device?.createSendTransport(transportParams);
    transport?.on(
      "connect",
      async ({ dtlsParameters }, callback, errorback) => {
        const transportId = await socket.emitWithAck("connectTransport", {
          transportId: transport.id,
          dtlsParameters,
        });
        callback();
        console.log(`connected!!`, transportId);
      }
    );
    transport?.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errorback) => {
        const transportId = await socket.emitWithAck("produce", {
          kind,
          rtpParameters,
          transportId: transport.id,
        });
        console.log("transport id producer", transportId);
        callback({ id: transportId });
      }
    );
    set({ transport });
    const tracks = localStream?.getTracks();
    tracks?.forEach(async (track) => await transport?.produce({ track }));
    console.log("send transport created successfully!", transport);
  },

  async createRecvTransport() {
    const { device, socket } = get();
    if (!socket || !device) return;

    const transportParams = await socket.emitWithAck("createTransport");
    const recvTransport = device.createRecvTransport(transportParams);
    recvTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errorback) => {
        console.log("recv transport dtls params", dtlsParameters);
        try {
          await socket.emitWithAck("connectTransport", {
            transportId: recvTransport.id,
            dtlsParameters,
          });
          callback();
        } catch (err) {
          // errorback(err);
        }
      }
    );

    return recvTransport;
  },
}));
