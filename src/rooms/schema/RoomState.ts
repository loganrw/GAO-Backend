import { Schema, type } from "@colyseus/schema";

export class RoomState extends Schema {

  @type("number") life: number = 0;

}
