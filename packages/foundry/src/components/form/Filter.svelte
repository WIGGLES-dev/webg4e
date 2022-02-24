<script>
  import Popper from "../Popper.svelte"
  import { fly } from "svelte/transition"
  import { portal } from "../Portal.svelte"
  import { createEventDispatcher } from "svelte"
  import { Input, Label } from "./index.js"
  const dispatch = createEventDispatcher()
  export let value = []
  export let stopPropagation = false
  let open = false
  let element
  let innerElement

  function ignoreClick(target) {
    if (element?.contains(target) || element?.isSameNode(target)) return true
    if (innerElement?.contains(target) || innerElement?.isSameNode(target))
      return true
    return false
  }

  async function closeSelect(e) {
    const target = e.composedPath()[0]
    if (!ignoreClick(target)) {
      open = false
    }
  }
  function openSelect(e) {
    open = true
  }
  function add(e) {
    dispatch("add")
  }
</script>

<svelte:window on:click={closeSelect} />

<div class="filter" bind:this={element} on:click={openSelect}>
  <div class="filter-label">
    <slot name="label">Edit</slot>
  </div>
  <Popper referenceElement={element} let:popper placement="bottom">
    {#if open}
      <div
        style:z-index="1000"
        style:min-width="700px"
        bind:this={innerElement}
        use:popper
        class="filter-list"
      >
        <menu>
          <i class="fas fa-plus contrast" on:click={add} />
        </menu>
        <ul>
          {#each value as filter, i}
            <li class="filter-item">
              <slot value={filter} {i}>
                {filter}
              </slot>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </Popper>
</div>

<style>
  .filter-label {
    @apply bg-white text-black p-1;
  }
  .filter-label:hover {
  }
  .filter {
  }
  .filter-list {
    @apply p-2 bg-black opacity-75;
  }
  .filter-item {
    @apply flex;
  }
</style>
