import "./shims.js"
import { Character, Party } from "./actor.js"
import { Trait, Skill, Equipment } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { sheetRouter, documentRouter } from "./router.js"
import CharacterSheet from "./components/CharacterSheet.svelte"
import GCSCharacterSheet from "./components/GCS.svelte"
import SkillEditor from "./components/SkillEditor.svelte"
import TraitEditor from "./components/TraitEditor.svelte"
import EquipmentEditor from "./components/EquipmentEditor.svelte"
import StandardItemEditor from "./components/StandardItemEditor.svelte"
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
      character: CharacterSheet,
    }),
    { makeDefault: true }
  )
  Actors.registerSheet(
    "gcs",
    sheetRouter(ActorSheet, {
      character: GCSCharacterSheet,
    })
  )
  Items.registerSheet(
    "base",
    sheetRouter(ItemSheet, {
      skill: SkillEditor,
      trait: TraitEditor,
      equipment: EquipmentEditor,
    }),
    { makeDefault: true }
  )
})
