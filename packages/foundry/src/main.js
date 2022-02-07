import "./shims.js"
import "./widgets/ModifierBucket.svelte"
import "./macro.js"
import { Character, Party } from "./actor.js"
import { Trait, Skill, Equipment } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { sheetRouter, documentRouter } from "./router.js"

function updateSheetTitle(document, changes) {
  const { sheet } = document
  if (sheet.rendered && "name" in changes) {
    sheet.element.find(".window-title").text(changes.name)
  }
}

Hooks.on("updateActor", updateSheetTitle)
Hooks.on("updateItem", updateSheetTitle)

Hooks.on("init", () => {
  CONFIG.Actor.documentClass = documentRouter(Actor, {
    character: Character,
    party: Party,
  })
  CONFIG.Item.documentClass = documentRouter(Item, {
    trait: Trait,
    skill: Skill,
    equipment: Equipment,
  })
  CONFIG.ActiveEffect.documentClass = SystemActiveEffect
  Actors.registerSheet(
    "base",
    sheetRouter(ActorSheet, {
      character: "/systems/gurps4e/views/CharacterEditor.svelte.js",
      party: "/systems/gurps4e/views/PartyEditor.svelte.js",
    }),
    { makeDefault: true }
  )
  Actors.registerSheet(
    "gcs",
    sheetRouter(ActorSheet, {
      character: "/systems/gurps4e/views/GCS.svelte.js",
    })
  )
  Items.registerSheet(
    "base",
    sheetRouter(ItemSheet, {
      skill: "/systems/gurps4e/views/SkillEditor.svelte.js",
      trait: "/systems/gurps4e/views/TraitEditor.svelte.js",
      equipment: "/systems/gurps4e/views/EquipmentEditor.svelte.js",
      template: "/systems/gurps4e/views/TemplateEditor.svelte.js",
    }),
    { makeDefault: true }
  )
})
