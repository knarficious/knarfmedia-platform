import { Item } from "./item";

export class Publication implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public summary?: string,
    public content?: string,
    public author?: any,
    public tags?: string[],
    public filePath?: string,
    public publishedAt?: Date,
    public updatedAt?: Date,
    public comments?: string[]
  ) {
    this["@id"] = _id;
  }
}
