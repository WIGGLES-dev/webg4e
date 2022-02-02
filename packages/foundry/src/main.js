import "./shims.js"
import { Character, Party } from "./actor.js"
import { Trait, Skill, Equipment } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { sheetRouter, documentRouter } from "./router.js"
import "./style.css"

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
    }),
    { makeDefault: true }
  )
})
