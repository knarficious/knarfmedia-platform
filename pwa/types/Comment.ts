import { Item } from "./item";

export class Comment implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public content?: string,
    public post?: string,
    public publishedAt?: Date,
    public author?: string
  ) {
    this["@id"] = _id;
  }
}
