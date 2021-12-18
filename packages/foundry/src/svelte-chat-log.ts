import { svelteApp } from "./mixins/svelte-rendered";
import ChatLogComponent from "./components/ChatLog.svelte";
const Base = svelteApp(ChatLog, ChatLogComponent);
export class GURPSChatLog extends Base {
  get shadowInit() {
    return false as const;
  }
  getProps(options: Application.RenderOptions = {}) {
    if (game instanceof Game) {
      return {
        chatLog: this,
        messages: game.messages?.contents ?? [],
        user: game.user,
        isStream: false,
        game,
        rollMode: game.settings.get("core", "rollMode"),
        rollModes: CONFIG.Dice.rollModes,
        lastId: this._lastId,
      };
    } else {
      throw new Error("");
    }
  }
}
