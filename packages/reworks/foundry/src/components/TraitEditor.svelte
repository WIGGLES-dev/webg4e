<script>
  import StandardItemEditor from "./StandardItemEditor.svelte"
  export let document
  export let application
  let trait = document
  const typeHints = {}
</script>

<StandardItemEditor {typeHints} {document} {application} />
