import { Item } from "./item";

export class Comment implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public content?: string,
    public post?: any,
    public publishedAt?: Date,
    public author?: any
  ) {
    this["@id"] = _id;
  }
}
