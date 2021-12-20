<script lang="ts">
  import { SvelteComponentTyped, onMount } from "svelte";
  export let component: typeof SvelteComponentTyped | undefined = undefined;
  export let props: object | undefined = undefined;
  export let events: Record<string, () => void> = {};
  let instance: SvelteComponentTyped | undefined;
  onMount(() => {
    if (instance) {
      for (const [event, cb] of Object.entries(events)) {
        instance.$on(event, cb);
      }
    }
  });
</script>

<slot>
  <svelte:component this="{component}" {...props} bind:this="{instance}" />
</slot>

<style lang="postcss" global>
  @tailwind base;
  @tailwind utilities;
  @tailwind components;
  [contenteditable] {
    @apply outline-none;
  }
  .grid {
    height: min-content;
  }
  menu {
    @apply pl-0 m-0;
  }
  button {
    @apply focus:outline-none p-1 bg-black text-white;
  }
  select,
  input {
    @apply focus:outline-none;
  }
  table {
    height: min-content;
    @apply whitespace-nowrap w-full;
  }
  caption {
    @apply bg-black text-white text-center whitespace-nowrap;
  }
  th {
    @apply bg-black text-white px-2;
  }
  tr {
    @apply even:bg-green-100;
    @apply hover:bg-blue-200;
  }
  tr.active {
    @apply underline bg-blue-200;
  }
  td[data-roll] {
    @apply hover:bg-green-500 hover:text-white;
  }
</style>
