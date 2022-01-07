import "./styles.css";
import "./shims";
import { GURPSChatLog } from "./svelte-chat-log";
import { GURPSActorSheet } from "./svelte-actor-sheet";
import { GURPSItemSheet } from "./svelte-item-sheet";
import { GURPSActor } from "./documents/actor";
import { GURPSItem } from "./documents/item";
import { WorldInterface } from "gurpsjs2";

const world = new WorldInterface();

const init = () => {
  //CONFIG.ui.chat = GURPSChatLog;
  CONFIG.Actor.documentClass = GURPSActor;
  CONFIG.Item.documentClass = GURPSItem;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("gurps4e", GURPSActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("gurps4e", GURPSItemSheet, { makeDefault: true });
};
const setup = () => {};
const ready = () => {};
Hooks.once("init", init);
Hooks.once("setup", setup);
Hooks.once("ready", ready);
