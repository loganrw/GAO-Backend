import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {

}

export class RoomState extends Schema {

  @type("number") playerCount: number = 0;
  @type("number") p1Life: number;
  @type("number") p2Life: number;
  @type("string") p1Id: string;
  @type("string") p2Id: string;
  @type("string") messages: string[];
  @type("boolean") p1Turn: boolean;
  @type({ map: Player }) players = new MapSchema<Player>();

}
