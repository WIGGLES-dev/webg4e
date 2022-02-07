<script context="module">
  import ModifierBucket from "./ModifierBucket.svelte"
  Hooks.on("ready", () => {
    const target = document.querySelector("#action-bar")
    new ModifierBucket({
      target,
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

<Popper let:reference let:popper placement="top" offset={[0, 30]}>
  <div style:font-size="2rem" style:display="flex" use:reference>
    <span on:click={clickReference}>+0</span>
    <i class="fas fa-trash" />
  </div>
  <div use:popper>
    {#if showBucket}
      <div on:mouseleave={leaveBucket}>
        <h3>WOOHOO</h3>
      </div>
    {/if}
  </div>
</Popper>
