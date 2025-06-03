import { Room, Client } from "@colyseus/core";
import { Player, RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.state = new RoomState();
    this.onMessage("set-life", (client, data) => {
      client.userData.slot === "p1" ? this.state.players.set("p1Life", data.value) : this.state.players.set("p2Life", data.value);
    });
    this.onMessage("get-enemy-life", (client, data) => {
      client.userData.slot === "p1" ? client.send(this.state.players.get("p2Life")) : client.send(this.state.players.get("p1Life"));
    });
  }

  onJoin(client: Client, options: any) {
    this.state.playerCount++;
    this.state.players.set(client.sessionId, new Player());
    client.userData = { slot: (this.clients.length % 2 == 0) ? "p2" : "p1" }
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
