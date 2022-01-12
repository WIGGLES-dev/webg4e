<script lang="ts">
  export let type: "number" | "text" | "textarea";
  export let disabled = false;
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let cols = 30;
  export let rows = 30;
  export let value: any = undefined;
  type FormControl = HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;
  function change(e: Event) {
    const target = e.target as FormControl;
    if (target.type === "number") {
      value = Number(target.value);
    } else if (target.type === "text") {
      value = target.value;
    }
  }
  function input(e: Event) {
    const target = e.target as FormControl;
  }
</script>

<label>
  <span>
    <slot value="{value}" />
  </span>
  {#if $$slots}
    <select
      on:change="{change}"
      on:input="{input}"
      name="{name}"
      disabled="{disabled}"
      id="{id}"
      value="{value}"
    >
      <slot />
    </select>
  {:else if type === "number" || type === "text"}
    <input
      on:change="{change}"
      on:input="{input}"
      value="{value}"
      disabled="{disabled}"
      type="{type}"
      id="{id}"
    />
  {:else if type === "textarea"}
    <textarea
      on:change="{change}"
      on:input="{input}"
      value="{value}"
      disabled="{disabled}"
      name="{name}"
      id="{id}"
      cols="{cols}"
      rows="{rows}"></textarea>
  {/if}
</label>
