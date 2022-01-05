<script lang="ts">
  import ChatMessageComponent from "./Message.svelte";
  export let chatLog: ChatLog;
  export let messages: ChatMessage[];
  export let user: User;
  export let isStream = false;
  export let game: Game;
  export let rollMode: string;
  export let rollModes: Record<string, string>;
  export let lastId: string | undefined = undefined;
  const localize = game.i18n.localize;
  $: batchedMessages = messages.slice(
    messages.length - CONFIG.ChatMessage.batchSize
  );
</script>

<section class="tab sidebar-tab directory flexcol" id="chat" data-tab="chat">
  <ol id="chat-log">
    {#each batchedMessages as message, i (message.id)}
      <ChatMessageComponent {message} author={user} />
    {/each}
  </ol>
  {#if !isStream}
    <div class="flexrow" id="chat-controls">
      <label class="chat-control-icon">
        <i class="fas fa-dice-d20" />
      </label>
      <select name="rollMode" class="roll-type-select">
        <optgroup>
          {#each Object.entries(rollModes) as [rt, name]}
            <option value={rt}>{localize(name)}</option>
          {/each}
        </optgroup>
      </select>
      {#if user.isGM}
        <div class="control-button">
          <a class="button export-log" title={localize("CHAT.Export")}>
            <i class="fas fa-save" />
          </a>
          <a class="delete button chat-flush" title={localize("CHAT.Clear")}>
            <i class="fas fa-trash" />
          </a>
        </div>
      {/if}
    </div>
    <form id="chat-form">
      <textarea id="chat-message" autocomplete="nope" />
    </form>
  {/if}
</section>
