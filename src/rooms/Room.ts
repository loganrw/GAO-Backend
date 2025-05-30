import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;
  state = new RoomState();

  onCreate(options: any) {

  }

  onJoin(client: Client, options: any) {

  }

  onLeave(client: Client, consented: boolean) {
    if (this.clients.length <= 0) this.disconnect();
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
