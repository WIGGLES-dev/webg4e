import "./shims";
import "./composition";
import { documentRouter, sheetRouter } from "./router";
import { Character, Party } from "./actor";
import { Equipment, Skill, Trait } from "./item";
import CharacterSheet from "./components/CharacterSheet.svelte";
import SkillSheet from "./components/SkillSheet.svelte";

Hooks.on("init", () => {
  CONFIG.Actor.documentClass = documentRouter(Actor, {
    character: Character,
    party: Party,
  });
  CONFIG.Item.documentClass = documentRouter(Item, {
    equipment: Equipment,
    skill: Skill,
    trait: Trait,
  });
  Actors.registerSheet(
    "base",
    sheetRouter(ActorSheet, {
      character: CharacterSheet,
    }),
    { makeDefault: true }
  );
  Items.registerSheet(
    "base",
    sheetRouter(ItemSheet, {
      skill: SkillSheet,
    })
  );
});
Hooks.on("ready", () => {});
