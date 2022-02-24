<script>
  export let value
  export let parent = undefined
  export let index = 0
  export let depth = 0
  export let children = (v) => v?.children ?? []
  export let key = (v, i) => v?.id ?? i
  export let rootOnly = false
</script>

{#if rootOnly}
  <slot {value} {depth} />
{:else if value instanceof Array}
  {#each value as root, i (key(root, i))}
    <svelte:self index={index + 1} value={root} {children} let:value let:depth>
      <slot {value} {depth} i={index + i} />
    </svelte:self>
  {/each}
{:else}
  <slot {value} {depth} i={index} />
  {#each children(value) as child, i (key(child, i))}
    <svelte:self
      index={index + 1}
      depth={depth + 1}
      {children}
      value={child}
      let:value
      let:depth
    >
      <slot {value} {depth} i={index + i} />
    </svelte:self>
  {/each}
{/if}
