import { HitLocation } from "./hit-location";
export class HitLocationTable {
  id?: string;
  name?: string;
  roll?: string;
  locations: HitLocation[] = [];
  owningLocation?: HitLocation;
  locationLookup = new Map<string, HitLocation>();
  saveGcs() {
    const locations =
      this.locations?.map((location) => location.saveGcs()) ?? [];
    return {
      id: this.id,
      name: this.name,
      roll: this.roll,
      locations,
    };
  }
  loadGcs(data: any) {
    try {
      const { id, name, roll, locations } = data;
      this.id = id;
      this.name = name;
      this.roll = roll;
      if (locations instanceof Array) {
        this.locations = locations?.map((data: any) => {
          const location = new HitLocation();
          location.loadGcs(data);
          return location;
        });
      }
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
