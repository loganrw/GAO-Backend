import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") p1HandSize: number;
  @type("string") p2HandSize: number;
  @type("number") p1Life: number;
  @type("number") p2Life: number;
}

export class RoomState extends Schema {

  @type("number") playerCount: number = 0;
  @type({ map: Player }) players = new MapSchema<Player>();

}
