<script>
  import { shadow } from "../directive.js"
  export let editor
  export let value
  export let editing = false
  function mount(node) {
    const height = 625
    requestAnimationFrame(async () => {
      editor = await TextEditor.create({ target: node, height })
      editor.setContent(value)
    })
    return {
      destroy() {
        editor.destroy()
      },
    }
  }
  function save() {
    value = editor.getContent()
    editing = false
  }
  function edit() {
    editing = true
  }
  export function focus() {}
</script>

{#if editing}
  <div use:mount />
{:else}
  <div use:shadow={{ mode: "open" }}>
    {@html value}
  </div>
{/if}
<menu>
  {#if editing}
    <button
      type="button"
      class="w-full p-1 hover:bg-green-500 bg-white text-black hover:text-white"
      on:click={save}
    >
      Save
    </button>
  {:else}
    <button
      type="button"
      class="w-full hover:bg-green-500 bg-white text-black hover:text-white"
      on:click={edit}
    >
      Edit
    </button>
  {/if}
</menu>
