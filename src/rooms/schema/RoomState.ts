import { Schema, type } from "@colyseus/schema";

export class RoomState extends Schema {

  @type("number") players: number = 0;

}
