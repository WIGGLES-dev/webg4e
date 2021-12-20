<script lang="ts">
</script>

<form on:submit|preventDefault class="grid gap-2 whitespace-nowrap">
  <slot />
</form>

<style lang="postcss">
  form {
    grid-template-columns: min-content 1fr;
  }
  form :global(label) {
    @apply contents;
  }
  form :global(span:first-child) {
    @apply text-right font-semibold;
  }
  form :global(fieldset) {
    @apply col-span-2;
  }
  form :global(input) {
    @apply border-b;
  }
</style>
