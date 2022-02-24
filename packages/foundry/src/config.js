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

async function loadConfigFile(file) {}

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
  const bassicAttrPath = `systems/${game.system.id}/static/basic.attributes`
  const humanoidBodyPath = `systems/${game.system.id}/static/humanoid.body`
  createSetting(Settings.DefaultCharacterAttributes, {
    name: "Default Character Attributes",
    hint: "Configure what attribute set characters created for this world are",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [bassicAttrPath]: "basic",
    },
    default: bassicAttrPath,
  })
  createSetting(Settings.DefaultCharacterHitLocations, {
    name: "Default Character Hit Locations",
    hint: "Configure what hit location set characters create for this world are",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [humanoidBodyPath]: "humanoid",
    },
    default: humanoidBodyPath,
  })
})

export function settingStore(key) {
  if (!(key in storeCache)) {
    storeCache[setting] = writable(game.settings.get(game.system.id, setting))
  }
  return storeCache[key]
}

async function retrieveConfig(path) {
  const res = await fetch(path)
  const txt = await res.text()
  try {
    const json = JSON.parse(txt)
    return json
  } catch (err) {}
}

Hooks.on("preCreateActor", (actor, data, options, id) => {
  if (data.type === "character") {
    ;(async () => {
      const defaultAttributes = await retrieveConfig(
        game.settings.get(game.system.id, Settings.DefaultCharacterAttributes)
      )
      const defaultBody = await retrieveConfig(
        game.settings.get(game.system.id, Settings.DefaultCharacterHitLocations)
      )
      const attributeItems =
        defaultAttributes?.map?.((data) => {
          return {
            name: data.fullName || "New Attribute",
            type: "attribute",
            data,
          }
        }) ?? []
      const hitLocationItems =
        defaultBody?.map?.((data) => {
          return {
            name: data.tableName || "New Hit Location",
            type: "hit location",
            data,
          }
        }) ?? []
      data.items = [...attributeItems, ...hitLocationItems]
      Actor.create(data, { noHook: true })
    })()
    return false
  }
})
Hooks.on("preCreateItem", (item, data, options, id) => {})
