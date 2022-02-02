<script>
  import PropertyEditor from "./PropertyEditor.svelte"
  export let object = {}
</script>

<div>
  <menu>
    <!--  -->
  </menu>
  {#each Object.entries(object) as [key, value], i (i)}
    <PropertyEditor {key} {value} />
  {/each}
</div>
