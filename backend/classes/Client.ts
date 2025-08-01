import type { Room } from "./Room";
import type {
  Producer,
  WebRtcTransport,
  Consumer,
  Router,
} from "mediasoup/types";

export class Client {
  private transports: Map<string, WebRtcTransport> = new Map();
  private producers: Map<string, Producer> = new Map();
  private consumers: Map<string, Consumer> = new Map();
  constructor(
    public userName: string,
    public roomName: string,
    public router: Router
  ) {}

  async createTransport() {
    const transport = await this.router.createWebRtcTransport({
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      listenInfos: [{ ip: "127.0.0.1", announcedIp: "qqqqq", protocol: "udp" }],
      initialAvailableOutgoingBitrate: 5000000,
    });
    transport.setMaxIncomingBitrate(5000000);
    const clientParams = {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
    return clientParams;
  }

  addProducer(producer: Producer) {
    this.producers.set(producer.id, producer);
  }

  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  // close() {
  //   this.transports.forEach((t) => t.close());
  //   this.producers.forEach((p) => p.close());
  //   this.consumers.forEach((c) => c.close());
  // }
}
