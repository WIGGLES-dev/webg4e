/**
 *
 * @param {*} SystemDocument Extend a system document with the necessary logic to hold weapon data
 * @returns
 */
export const Weapons = (SystemDocument) =>
  class extends SystemDocument {
    constructor(...args) {
      super(...args)
    }
    prepareDerivedData() {
      super.prepareDerivedData(...arguments)
      const weapons = this.getSystemFlag("weapons")
      this.model.weapons = weapons?.map((weapon) => {
        let name = this.name
        let damage = weapon.damage
        return {
          ...weapon,
          name,
          damage,
        }
      })
    }
  }
