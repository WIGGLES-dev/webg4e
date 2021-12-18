import type { Character } from "./character";
import { AttributeDef } from "../attribute/attribute-def";
import { HitLocationTable } from "../body/hit-location-table";
import defaultCharacterSettings from "../../static/default-character-settings.json";
const blockOptions = [
  "reaction conditional_modifiers",
  "melee",
  "ranged",
  "advantages skills",
  "spells",
  "equipment",
  "other_equipment",
  "notes",
] as const;
export class CharacterSettings {
  private static _global: CharacterSettings;
  static get global() {
    if (this._global) return this._global;
    const settings = new CharacterSettings();
    settings.loadGcs(defaultCharacterSettings.settings);
    this._global = settings;
    return this._global;
  }
  defaultLengthUnits?: string;
  defaultWeightUnits?: string;
  blockLayout = [...blockOptions];
  attributes = new Map<string, AttributeDef>();
  hitLocations = new HitLocationTable();
  useMultiplicativeModifier = false;
  useModifyingDicePlusAdds = false;
  useSimpleMetricConversion = false;
  constructor(private character?: Character) {}
  getAttributeSelectInformation(): [value: string, label: string][] {
    return [...this.attributes.values()].map((def) => [
      def.id || "",
      def.name || "",
    ]);
  }
  initAttributes(character: Character, data: any[] = []) {
    for (const def of this.attributes.values()) {
      const attribute = def.createAttribute(character);
      const attr = data.find((attr: any) => attr.attr_id === def.id);
      if (attr) {
        attribute.initTo(attr.adj, attr.damage);
      }
      character.attributes.set(def.id, attribute);
    }
  }
  saveGcs() {
    const attributes = [...this.attributes.values()].map((attr) =>
      attr.saveGcs()
    );
    const hit_locations = this.hitLocations.saveGcs();
    return {
      default_length_units: this.defaultLengthUnits,
      default_weight_units: this.defaultWeightUnits,
      block_layout: this.blockLayout,
      attributes,
      hit_locations,
    };
  }
  loadGcs(data: any) {
    try {
      const {
        default_length_units,
        default_weight_units,
        block_layout,
        attributes = [],
        hit_locations = [],
        use_multiplicative_modifiers,
        use_modifying_dice_plus_adds,
        use_simple_metric_conversion,
      } = data;
      this.defaultLengthUnits = default_length_units;
      this.defaultWeightUnits = default_weight_units;
      this.blockLayout = block_layout;
      this.useMultiplicativeModifier = use_multiplicative_modifiers;
      this.useModifyingDicePlusAdds = use_modifying_dice_plus_adds;
      this.useSimpleMetricConversion = use_simple_metric_conversion;
      this.hitLocations.loadGcs(hit_locations);
      attributes.forEach((data: any) => {
        const def = new AttributeDef(data.id);
        def.loadGcs(data);
        this.attributes.set(def.id, def);
      });
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
