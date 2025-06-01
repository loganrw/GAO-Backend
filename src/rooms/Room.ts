import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.state = new RoomState();
    this.onMessage("damage-player", (client, data) => {
      console.log(this.state);
      const player = this.state.players.get(client.sessionId);
      console.log(player);
      player.life = 10;
      player.life -= data.damage;
    })
  }

  onJoin(client: Client, options: any) {
    this.state.playerCount++;
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
