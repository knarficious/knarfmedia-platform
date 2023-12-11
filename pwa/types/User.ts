import { Item } from "./item";

export class User implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public username?: string,
    public plainPassword?: string,
    public email?: string
  ) {
    this["@id"] = _id;
  }
}
