import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") p1Life: number;
  @type("number") p2Life: number;
  @type("string") p1Id: string;
  @type("string") p2Id: string;
}

export class RoomState extends Schema {

  @type("number") playerCount: number = 0;
  @type({ map: Player }) players = new MapSchema<Player>();

}
