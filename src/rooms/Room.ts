import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.state = new RoomState();
  }

  onJoin(client: Client, options: any) {
    this.state.players++;
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players--;
    if (this.state.players <= 0) {
      console.log("no players left. closing room.")
      this.disconnect();
    }
    console.log(client.sessionId, "left!");
    console.log("Players left: ", this.state.players);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
