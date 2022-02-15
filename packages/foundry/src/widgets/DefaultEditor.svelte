<script>
  export let document
</script>

<ul>
  <li>
    <!--  -->
  </li>
  {#each $document.data.defaults || [] as d, i (i)}
    <li>
      <!--  -->
    </li>
  {/each}
</ul>
