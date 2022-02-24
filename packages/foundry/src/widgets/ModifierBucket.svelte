<script context="module">
  import ModifierBucket from "./ModifierBucket.svelte"
  Hooks.on("ready", () => {
    const actionBar = document.querySelector("#action-bar")
    new ModifierBucket({
      target: actionBar,
    })
  })
</script>

<script>
  import Popper from "../components/Popper.svelte"
  let showBucket = false
  function clickReference(e) {
    showBucket = true
  }
  function leaveBucket(e) {
    showBucket = false
  }
</script>

<Popper let:reference let:popper placement="top" offset={[0, 80]}>
  <div class="tailwind">
    <div class="text-white flex h-full items-center text-2xl" use:reference>
      <span on:click={clickReference}>+0</span>
      <i class="fas fa-trash" />
    </div>
    <div class="bg-white text-black" use:popper>
      {#if showBucket}
        <div on:mouseleave={leaveBucket}>
          <h3>WOOHOO</h3>
        </div>
      {/if}
    </div>
  </div>
</Popper>
