<script>
  export let application
  export let document
</script>

<ul>
  {#each $document.data.members as id (id)}
    <!--  -->
  {/each}
</ul>
