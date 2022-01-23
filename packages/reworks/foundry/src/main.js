import "./shims.js"
import { SystemActor } from "./actor.js"
import { SystemItem } from "./item.js"
import { SystemActiveEffect } from "./effect.js"
import { router } from "./router.js"
import CharacterSheet from "./components/CharacterSheet.svelte"
import SkillEditor from "./components/SkillEditor.svelte"
import TraitEditor from "./components/TraitEditor.svelte"
import EquipmentEditor from "./components/EquipmentEditor.svelte"
import StandardItemEditor from "./components/StandardItemEditor.svelte"
import "./style.css"
Hooks.on("init", () => {
  CONFIG.Actor.documentClass = SystemActor
  CONFIG.Item.documentClass = SystemItem
  CONFIG.ActiveEffect.documentClass = SystemActiveEffect
  Actors.registerSheet(
    "base",
    router(ActorSheet, {
      character: CharacterSheet,
    }),
    { makeDefault: true }
  )
  Items.registerSheet(
    "base",
    router(ItemSheet, {
      skill: SkillEditor,
      trait: TraitEditor,
      equipment: EquipmentEditor,
    }),
    { makeDefault: true }
  )
})
