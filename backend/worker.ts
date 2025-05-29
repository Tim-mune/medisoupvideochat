import mediasoup from "mediasoup";
export const createWorkers = async () => {
  const worker = await mediasoup.createWorker({
    rtcMaxPort: 41000,
    rtcMinPort: 40000,
    logLevel: "warn",
    logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
  });
  console.log("worker initialized");

  const router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
          "packetization-mode": 1,
          "profile-level-id": "42e01f",
          "level-asymmetry-allowed": 1,
        },
      },
    ],
  });
  console.log("router initialized");

  return { worker, router };
};
