<script>
  let classList = ""
  export { classList as class }
  export let column = false
</script>

<nav class={classList}>
  <ul class:flex-col={column} class="tab-list">
    <slot />
  </ul>
</nav>

<style>
  .tab-list {
    @apply flex justify-start;
  }
  nav {
    @apply mb-1;
  }
</style>
