import { comp } from "../world";

interface AttributeConfig {}
export interface Attribute {
  name: string;
  config: AttributeConfig;
}
export class Attributes extends comp<Attribute[]>("attributes") {}
