import "./shims.js"
import "./widgets/ModifierBucket.svelte"
import "./macro.js"
import { Character, Party, Template } from "./actor.js"
import { Trait, Skill, Equipment, HitLocation, Attribute } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { sheetRouter, documentRouter } from "./router.js"
import { delegate } from "./delegate.js"

delegate(window)

function updateSheetTitle(document, changes) {
  const { sheet } = document
  if (sheet.rendered && "name" in changes) {
    sheet.element.find(".window-title").text(changes.name)
  }
}

Hooks.on("updateActor", updateSheetTitle)
Hooks.on("updateItem", updateSheetTitle)

function applyTemplate(actor, sheet, data) {
  if (data.type === "Actor") {
    const actor = game.actors.get(data.id)
    if (actor.type === "template") {
      const items = []
      const effects = []
      for (const item of actor.items.values()) {
        const data = item.toObject()
        data.flags.gurps4e = data.flags.gurps4e || {}
        data.flags.gurps4e.templateSrc = item.uuid
        items.push(data)
      }
      for (const effect of actor.effects.values()) {
        const data = effect.toObject()
        effects.push(data)
      }
      actor.createEmbeddedDocuments("Item", items).then(() => {
        actor.createEmbeddedDocuments("Effect", effects)
      })
      return false
    }
  }
}

Hooks.on("dropActorSheet", applyTemplate)

Hooks.on("init", () => {
  CONFIG.Actor.documentClass = documentRouter(Actor, {
    character: Character,
    party: Party,
    template: Template,
  })
  CONFIG.Item.documentClass = documentRouter(Item, {
    trait: Trait,
    skill: Skill,
    equipment: Equipment,
    "hit location": HitLocation,
    attribute: Attribute,
  })
  CONFIG.ActiveEffect.documentClass = SystemActiveEffect
  Actors.registerSheet(
    "base",
    sheetRouter(ActorSheet, {
      character: "/systems/gurps4e/views/CharacterEditor.svelte.js",
      party: "/systems/gurps4e/views/PartyEditor.svelte.js",
      template: "/systems/gurps4e/views/TemplateEditor.svelte.js",
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
      attribute: "/systems/gurps4e/views/AttributeEditor.svelte.js",
      "hit location": "/systems/gurps4e/view/HitLocationEditor.svelte.js",
    }),
    { makeDefault: true }
  )
})
