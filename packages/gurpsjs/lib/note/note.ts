import { Item } from "../base/item";
export class Note extends Item {
  text = "";
  reference = "";
  constructor() {
    super();
  }
  getType() {
    return "note" as const;
  }
  saveGcs() {
    return {
      ...super.saveGcs(),
    };
  }
  loadGcs(data: any) {
    const {} = data;
    try {
    } catch (err) {}
    return this;
  }
}
