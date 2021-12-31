import { comp } from "../world";

interface LocationConfig {}
export interface Location {
  name: string;
  config: LocationConfig;
}
export class Locations extends comp<Location[]>("locations") {}
