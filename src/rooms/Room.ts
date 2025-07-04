import { Room, Client } from "@colyseus/core";
import { Player, RoomState } from "./schema/RoomState";

export class MyRoom extends Room<RoomState> {
  maxClients = 2;
  maxPhase = 4;
  state = new RoomState();

  onCreate(options: any) {
    this.maxClients = this.maxClients;
    this.onMessage("set-life", (client, data) => {
      this.state.p1Id === client.sessionId ? this.state.p1Life = data.value : this.state.p2Life = data.value;
    });
    this.onMessage("send-message", (client, data) => {
      data.data.excludeClient ? this.broadcast("message-sent", data, { except: client }) : this.broadcast("message-sent", data);
    });
    this.onMessage("get-first-turn", (client, data) => {
      let firstTurnPlayer;
      // Player 1 Decides turn
      if (this.state.p1Id === client.sessionId) {
        firstTurnPlayer = this.decideFirstTurn();
        this.state.turnPlayer = firstTurnPlayer;
        if (data) data.data?.excludeClient ? this.broadcast("turn-order", { firstTurn: firstTurnPlayer }, { except: client }) : this.broadcast("turn-order", { firstTurn: firstTurnPlayer });
      }
    });
    this.onMessage("advance-phase", () => {
      if (this.state.currentPhase === this.maxPhase) {
        this.state.currentPhase = 0;
        let turn = this.state.turnPlayer === this.state.p1Id ? this.state.p2Id : this.state.p1Id;
        this.state.turnPlayer = turn;
        this.broadcast("changed-turn", { playerTurn: turn });
        this.broadcast("phase-change", {
          phase: this.state.currentPhase
        });
      } else {
        this.state.currentPhase++;
        this.broadcast("phase-change", {
          phase: this.state.currentPhase
        });
      }
    });
    this.onMessage("change-turn", () => {
      let turn = this.state.turnPlayer === this.state.p1Id ? this.state.p2Id : this.state.p1Id;
      this.broadcast("changed-turn", { playerTurn: turn });
    });
    this.onMessage("card-played", (client, data) => {
      if (this.state.p1Id === client.sessionId) {
        this.broadcast("p1-played", {
          data: {
            card: data.card,
            blob: data.blob
          }
        });
      } else {
        this.broadcast("p2-played", {
          data: {
            card: data.card,
            blob: data.blob
          }
        });
      }
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

  decideFirstTurn() {
    return Math.random() < 0.5 ? this.state.p1Id : this.state.p2Id;
  }

}
