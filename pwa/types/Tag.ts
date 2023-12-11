import { Item } from "./item";

export class Tag implements Item {
  public "@id"?: string;

  constructor(_id?: string, public name?: string) {
    this["@id"] = _id;
  }
}
