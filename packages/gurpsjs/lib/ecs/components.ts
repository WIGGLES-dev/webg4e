import { bundle } from "ecs";
import { Level } from "./systems/level";
import { Value, Quantity } from "./systems/item";
import { Host, FeatureBonus } from "./systems/feature";
import { Locations } from "./systems/location";
import { Attributes } from "./systems/attribute";

export class Item extends bundle(Value, Quantity) {}
export class Skill extends bundle(Level, FeatureBonus) {}
export class Trait extends bundle() {}
export class Character extends bundle(Host, Locations, Attributes) {}
