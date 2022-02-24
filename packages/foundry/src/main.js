import "./shims.js"
import "./widgets/ModifierBucket.svelte"
import "./macro.js"
import "./config.js"
import { Settings } from "./config.js"
import { Character, Party, Template } from "./actor.js"
import { Trait, Skill, Equipment, HitLocation, Attribute } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { sheetRouter, documentRouter } from "./router.js"
import { delegate } from "./delegate.js"

delegate(window)

Hooks.on("dropActorSheet", (actor, sheet, data) => {
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
})

Hooks.on("renderSystemSheet", (app, element) => {
  if (!app.actor) return
  element.get(0).addEventListener("drop", async (e) => {
    const keep =
      game.settings.get(game.system.id, Settings.ItemTransfer) === "keep"
    const id = e.dataTransfer.getData(`foundry/${game.system.id}/sheet2sheet`)
    if (!id) return
    const item = await fromUuid(id)
    if (item.actor?.id === app.actor.id) return
    const src = item.toObject()
    await app.actor.createEmbeddedDocuments("Item", [src])
    if (!keep) {
      await item.delete()
    }
  })
})

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
      "hit location": "/systems/gurps4e/views/HitLocationEditor.svelte.js",
    }),
    { makeDefault: true }
  )
})
