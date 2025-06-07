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
      data.data.excludeClient ? this.broadcast("message-sent", data, { except: client }) : this.broadcast("message-sent", data);
    });
    this.onMessage("get-first-turn", () => {
      let firstTurnPlayer = this.decideFirstTurn();
      this.state.turnPlayer = firstTurnPlayer;
      this.broadcast("turn-order", { firstTurn: firstTurnPlayer });
    });
    this.onMessage("change-turn", () => {
      let turn = this.state.turnPlayer === this.state.p1Id ? this.state.p2Id : this.state.p1Id;
      this.broadcast("changed-turn", { p1Turn: turn });
    })
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

  decideFirstTurn() {
    return Math.random() < 0.5 ? this.state.p1Id : this.state.p2Id;
  }

}
