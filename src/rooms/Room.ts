import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;
  state = new RoomState();

  onCreate(options: any) {
    this.state.players = 0;
  }

  onJoin(client: Client, options: any) {
    this.state.players++;
    console.log(this.state);
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players--;
    if (this.state.players <= 0) {
      this.disconnect();
    }
    console.log(client.sessionId, "left!");
    console.log("Players left: ", this.state.players);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
