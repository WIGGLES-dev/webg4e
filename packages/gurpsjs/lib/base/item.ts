import { set } from "prop";
import { Subject } from "rxjs";
import type { Feature } from "../feature/feature";
import { MeleeWeapon } from "../weapon/melee-weapon";
import { RangedWeapon } from "../weapon/ranged-weapon";
import { WeaponStats } from "../weapon/weapon-stats";
import { v4 } from "uuid";
import { store } from "../store";
const Base = store(class {});
export abstract class Item extends Base {
  id = v4();
  name: string = "";
  features: Feature[] = [];
  //defaults: unknown[] = [];
  weapons: WeaponStats[] = [];
  isSatisfied = true;
  unsatisfiedReason?: string;
  notes = "";
  userDesc = "";
  categories: string[] = [];
  isContainer?: boolean;
  open = true;
  editNotifier = new Subject<null>();
  constructor() {
    super();
  }
  get formattedName(): string {
    return this.name;
  }
  get depth(): number {
    return this.depth;
  }
  get selected(): boolean {
    return false;
  }
  withOwner(owner: Item) {
    return this.derive(owner);
  }
  addWeapon(type: "melee" | "ranged") {
    this.update((item) => {
      const instance =
        type === "melee" ? new MeleeWeapon() : new RangedWeapon();
      item.weapons.push(instance);
    });
  }
  removeWeapon(weapon: WeaponStats | number) {
    this.update((item) => {
      item.weapons = item.weapons.filter((instance, i) =>
        typeof weapon === "number" ? i !== weapon : instance !== weapon
      );
    });
  }
  run() {
    super.run();
    this.editNotifier.next(null);
  }
  abstract getType(): string;
  saveGcs(merge?: Record<string, any>) {
    const containerPostfix = this.isContainer ? "_container" : "";
    const type = this.getType() + containerPostfix;
    const weapons = this.weapons.map((weapon) => weapon.saveGcs());
    return {
      type,
      name: this.name,
      id: this.id,
      features: this.features,
      weapons,
      //defaults: this.defaults,
      notes: this.notes,
      open: this.open,
      userdesc: this.userDesc,
      categories: this.categories,
    };
  }
  loadGcs(data: any, merge?: Record<string, any>): this {
    try {
      const {
        id,
        name,
        features = [],
        weapons,
        defaults = [],
        notes,
        userdesc,
        categories,
        open,
      } = data;
      if (typeof id === "string") {
        this.id = id;
      } else {
      }
      if (typeof name === "string") this.name = name;
      if (typeof notes === "string") this.notes === notes;
      if (userdesc != null) this.userDesc = userdesc;
      if (categories instanceof Array) this.categories = categories;
      if (typeof open === "boolean") this.open = open;
      if (weapons instanceof Array) {
        this.weapons = weapons
          .map((weapon: any) => {
            let instance: WeaponStats;
            if (weapon.type === "ranged_weapon") {
              instance = new RangedWeapon();
            } else if (weapon.type === "melee_weapon") {
              instance = new MeleeWeapon();
            } else {
              return;
            }
            instance.loadGcs(weapon);
            return instance;
          })
          .filter((value: any) => value !== null) as WeaponStats[];
      }
    } catch (err) {
      console.error(err);
    }
    return this;
  }
  saveFoundry() {
    const data = this.saveGcs();
    return {
      type: this.getType(),
      name: this.name || `New ${this.getType()}`,
      data,
    };
  }
  loadFoundry(data: any, merge?: Record<string, any>): this {
    const { data: gcsData, _id, name, img, type } = data;
    return this.loadGcs({ ...gcsData, id: _id, name }, merge);
  }
}
