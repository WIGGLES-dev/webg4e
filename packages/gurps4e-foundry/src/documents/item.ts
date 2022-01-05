import { GURPSActor } from "./actor";
import { Store } from "../mixins/document-store";
export class GURPSItem extends Store(Item) {
  get actor() {
    return super.actor as GURPSActor;
  }
}
