<script lang="ts">
  import { Readable } from "svelte/store";
  type T = $$Generic;
  interface $$Slots {
    default: {
      value: T;
    };
  }
  export let store: Readable<T>;
</script>

<slot value="{$store}" />
