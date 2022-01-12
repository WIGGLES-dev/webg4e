import type template from "../template.json";
export type Template = typeof template;

export interface DynamicView {
  currentView: string;
}
export interface Composable {
  parentId: string | null;
  childrenIds: string[] | null;
}
export interface CharacterSource {
  type: "character";
  data: CharacterData;
}
export interface CharacterData extends Composable {
  allies: string[];
}
export interface PartySource {
  type: "party";
  data: PartyData;
}
export interface PartyData extends Composable {}

type SystemActorDataSource = CharacterSource | PartySource;
type SystemActorData = CharacterData | PartyData;

export interface PointCost {
  points: number;
}

export interface SkillSource {
  type: "skill";
  data: SkillData;
}
export interface SkillData extends PointCost, Composable {
  isTechnique: boolean;
}
export interface TraitSource {
  type: "trait";
  data: TraitData;
}
export interface TraitData extends PointCost, Composable {}
export interface EquipmentSource {
  type: "equipment";
  data: EquipmentData;
}
export interface EquipmentData {
  quantity: number;
  weight: number;
  value: number;
}

type SystemItemDataSource = SkillSource | TraitSource | EquipmentSource;
type SystemItemData = SkillData | TraitData | EquipmentData;

declare global {
  interface DataConfig {
    Actor: SystemActorData;
    Item: SystemItemData;
  }
  interface SourceConfig {
    Actor: SystemActorDataSource;
    Item: SystemItemDataSource;
  }
  interface SystemConfig {
    Actor: {
      character: CharacterData;
      party: PartyData;
    };
    Item: {
      skill: SkillData;
      trait: TraitData;
      equipment: EquipmentData;
    };
  }
}

export type TemplateActorTypes = keyof SystemConfig["Actor"];
export type TemplateItemTypes = keyof SystemConfig["Item"];

export type TemplateData<
  D extends keyof SystemConfig,
  T extends keyof SystemConfig[D]
> = SystemConfig[D][T];

export type TemplateSource<
  D extends keyof SystemConfig,
  T extends keyof SystemConfig[D]
> = {
  type: T;
  data: SystemConfig[D][T];
};
