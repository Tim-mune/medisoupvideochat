import fs from "fs";
import https from "https";
import express from "express";
import { Server } from "socket.io";
import { createWorkers } from "./worker";
import { Client } from "./classes/Client";
import { Room } from "./classes/Room";

const app = express();

const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");
const httpsServer = https.createServer({ key, cert }, app);

const io = new Server(httpsServer, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const { router } = await createWorkers();

io.on("connection", (socket) => {
  let client: Client;
  console.log("a user connected");

  socket.on("joinRoom", ({ roomName, userName }, ack) => {
    client = new Client(userName, roomName, router);
    const room = new Room(router);
    room.addClient(userName, client);
    ack(router.rtpCapabilities);
  });

  socket.on("createTransport", async (ack) => {
    try {
      const transportParams = await client.createTransport();
      transportParams;
      ack(transportParams);
    } catch (error) {
      console.log(error);
    }
  });
});

httpsServer.listen(3001, () =>
  console.log(`Server running on https://localhost:3001`)
);
