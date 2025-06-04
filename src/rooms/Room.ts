import { Room, Client } from "@colyseus/core";
import { Player, RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;
  state = new RoomState();

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.onMessage("set-life", (client, data) => {
      this.state.p1Id === client.sessionId ? this.state.p1Life = data.value : this.state.p2Life = data.value;
    });
    this.onMessage("send-message", (client, data) => {
      this.broadcast("message-sent", data.message, { except: client });
    });
  }

  onJoin(client: Client, options: any) {
    this.state.playerCount++;
    this.state.players.set(client.sessionId, new Player());
    this.clients.length % 2 === 0 ? this.state.p2Id = client.sessionId : this.state.p1Id = client.sessionId;
  }

  onLeave(client: Client, consented: boolean) {
    this.state.playerCount--;
    if (this.state.playerCount <= 0) {
      this.disconnect();
    }
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
