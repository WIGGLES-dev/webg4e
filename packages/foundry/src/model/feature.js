export const features = (SystemDocument) =>
  class extends SystemDocument {
    constructor(...args) {
      super(...args)
    }
    prepareDerivedData() {
      super.prepareDerivedData(...arguments)
    }
  }
