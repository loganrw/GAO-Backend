import { Room, Client } from "@colyseus/core";
import { Player, RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.state = new RoomState();
    this.onMessage("damage-player", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.life -= data.damage;
    })
    this.onMessage("set-life", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.life = data.value;
    })
  }

  onJoin(client: Client, options: any) {
    this.state.playerCount++;
    this.state.players.set(client.sessionId, new Player());
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
