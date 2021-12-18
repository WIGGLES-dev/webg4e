import { World } from "./world";
import { Query } from "./query";
export abstract class System {
  constructor(protected world: World) {}
  abstract view(): Query;
  run() {}
}
