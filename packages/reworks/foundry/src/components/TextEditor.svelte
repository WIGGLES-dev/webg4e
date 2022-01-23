<script>
  export let editor
  export let value
  async function mount(node) {
    const height = 500
    editor = await TextEditor.create({ target: node, height })
    return {
      destroy() {
        editor.destroy()
      },
    }
  }
  function save() {
    value = editor.getContent()
  }
</script>

<div use:mount></div>
<button
  class="w-full p-1 hover:bg-green-500 bg-white text-black hover:text-white"
  on:click="{save}">
  Save
</button>
