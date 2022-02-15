import { writable } from "svelte/store"

export const Settings = {
  ItemTransfer: "sheetTransfer",
  DefaultCharacterAttributes: "defaultCharacterAttributes",
  DefaultCharacterHitLocations: "defaultCharacterHitLocations",
}

const storeCache = {}

function createSetting(key, data) {
  game.settings.register(game.system.id, key, {
    onChange(value) {
      storeCache[key]?.set(value)
    },
    ...data,
  })
}

Hooks.on("init", async () => {
  createSetting(Settings.ItemTransfer, {
    name: "Sheet To Sheet Transfer Preference",
    hint: "Configure wether or not transferred items are kept on a sheet when they are moved to a different sheet.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      keep: "Keep Items",
      delte: "Delete Items",
    },
    default: "keep",
  })
  createSetting(Settings.DefaultCharacterAttributes, {
    name: "Default Character Attributes",
    hint: "Configure what attribute set characters created for this world are",
    scope: "world",
    config: true,
    type: String,
    choices: {
      basic: "Basic Set",
    },
    default: "basic",
  })
  createSetting(Settings.DefaultCharacterHitLocations, {
    name: "Default Character Hit Locations",
    hint: "Configure what hit location set characters create for this world are",
    scope: "world",
    config: true,
    type: String,
    choices: {
      basic: "Basic Set",
    },
    default: "basic",
  })
})

export function settingStore(key) {
  if (!(key in storeCache)) {
    storeCache[setting] = writable(game.settings.get(game.system.id, setting))
  }
  return storeCache[key]
}
