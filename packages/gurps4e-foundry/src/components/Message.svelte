<script lang="ts">
  export let message: ChatMessage;
  if (!(game instanceof Game)) throw new Error("");
  const flavor = message.data.flavor;
  const content = message.data.content;
  const timestamp = message.data.timestamp;
  const user = game.user;
  const localize = game.i18n.localize;
  function timeSince(timestamp: number) {
    return timestamp;
  }
  export let author = message.user;
  export let alias = message.alias;
  const isInCharacter = message.data.type === CONST.CHAT_MESSAGE_TYPES.IC;
  const isEmote = message.data.type === CONST.CHAT_MESSAGE_TYPES.EMOTE;
  const isWhisper = !!message.data.whisper.length;
  const whisperTo = message.data.whisper
    .map((u) => (game as Game).users?.get(u)?.name ?? null)
    .filterJoin(", ");
  const isBlind = message.data.blind;
</script>

<li
  class="chat-message message flexcol"
  class:ic={isInCharacter}
  class:emote={isEmote}
  class:whisper={isWhisper}
  class:blind={isBlind}
  data-message-id={message._id}
>
  <header class="message-header flexrow">
    <h4 class="message-sender">{alias}</h4>
    <span class="message-metadata">
      <time class="message-timestamp">
        {timeSince(timestamp)}
      </time>
      {#if user?.isGM}
        <a class="button message-delete" on:click={() => message.delete()}>
          <i class="fas fa-trash" />
        </a>
      {/if}
    </span>
    {#if isWhisper}
      <span class="whisper-to">
        {localize("CHAT.To")}: {whisperTo}
      </span>
    {/if}
    {#if flavor}
      <span class="flavor-tex">{flavor}</span>
    {/if}
  </header>
  <div class="message-content">
    {@html content}
  </div>
</li>
