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
const rooms = new Map<string, Room>();

io.on("connection", (socket) => {
  let client: Client | undefined;
  let clientRoomName: string | undefined;

  console.log("a user connected", socket.id);

  socket.on("joinRoom", ({ roomName, userName }, ack) => {
    // reuse or create Room
    let room = rooms.get(roomName);
    if (!room) {
      room = new Room(router);
      rooms.set(roomName, room);
    }

    // create client and add to room
    client = new Client(userName, roomName, router);
    room.addClient(userName, client);
    clientRoomName = roomName;

    // have socket join the socket.io room so we can broadcast easily
    socket.join(roomName);

    // return router rtp caps
    ack(router.rtpCapabilities);

    console.log(`socket ${socket.id} joined room ${roomName} as ${userName}`);
  });

  socket.on("createTransport", async (ack) => {
    try {
      if (!client) return ack({ error: "Client not registered" });
      const transportParams = await client.createTransport();
      ack(transportParams);
    } catch (error) {
      console.log(error);
      // @ts-ignore
      ack({ error: error?.message ?? String(error) });
    }
  });

  socket.on("connectTransport", async (values, ack) => {
    try {
      if (!client) return ack({ error: "Client not registered" });
      const transport = client.getTransports().get(values.transportId);
      if (!transport) return ack({ error: "Transport not found" });

      await transport.connect({ dtlsParameters: values.dtlsParameters });
      ack({ ok: true });
    } catch (err) {
      console.error("connectTransport err", err);
      ack({ error: String(err) });
    }
  });

  socket.on("produce", async ({ kind, rtpParameters, transportId }, ack) => {
    try {
      if (!client || !clientRoomName)
        return ack({ error: "Client not registered" });
      const transport = client.getTransports().get(transportId);
      if (!transport) return ack({ error: "Transport not found" });

      const producer = await transport.produce({ kind, rtpParameters });
      client.addProducer(producer);

      // Broadcast to everyone else in room that a new producer exists
      socket.to(clientRoomName).emit("newProducer", {
        kind,
        producerId: producer.id,
        producerUserName: client.userName,
      });

      ack({ id: producer.id });
    } catch (err) {
      console.error("produce error", err);
      ack({ error: String(err) });
    }
  });

  socket.on(
    "consume",
    async ({ producerId, rtpCapabilities, transportId }, ack) => {
      try {
        if (!client) return ack({ error: "Client not registered" });

        const transport = client.getTransports().get(transportId);
        if (!transport) return ack({ error: "Transport not found" });

        if (!router.canConsume({ producerId, rtpCapabilities })) {
          return ack({ error: "Cannot consume" });
        }

        const consumer = await transport.consume({
          producerId,
          rtpCapabilities,
          paused: false,
        });

        client.addConsumer(consumer);

        ack({
          id: consumer.id,
          producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
      } catch (err) {
        console.error("consume err", err);
        ack({ error: String(err) });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    // TODO: remove client from room, cleanup transports/producers/consumers etc.
    // (implement client/room cleanup logic here)
  });
});

httpsServer.listen(3001, () =>
  console.log(`Server running on https://localhost:3001`)
);
