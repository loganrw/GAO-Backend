import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") handSize: number;
  @type("number") life: number;
  @type("number") enemyLife: number;
}

export class RoomState extends Schema {

  @type("number") playerCount: number = 0;
  @type({ map: Player }) players = new MapSchema<Player>();

}
