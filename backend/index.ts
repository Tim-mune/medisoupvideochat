import fs from "fs";
import https from "https";
import express from "express";
import { Server } from "socket.io";
import { createWorkers } from "./worker";

const app = express();

const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");
const httpsServer = https.createServer({ key, cert }, app);

const io = new Server(httpsServer, {
  cors: {
    origin: "https://localhost:3001",
    methods: ["GET", "POST"],
  },
});

const { router, worker } = await createWorkers();

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("getRtpCap", (ack) => {
//     ack(router.rtpCapabilities);
//   });
// });

httpsServer.listen(3001, () =>
  console.log(`Server running on https://localhost:3001`)
);
