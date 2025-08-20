import type { Router } from "mediasoup/types";
import type { Client } from "./Client";

export class Room {
  private clients = new Map<string, Client>();
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  getClients() {
    return [...this.clients.values()];
  }

  // getClient(name: string) {
  //   return this.clients.get(name)?.getTransports();
  // }

  addClient(userName: string, client: Client) {
    this.clients.set(userName, client);
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  getRouter() {
    return this.router;
  }
}
