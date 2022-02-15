<script context="module">
  import ModifierBucket from "./ModifierBucket.svelte"
  import { SYSTEM_LINKS } from "../constants.js"
  Hooks.on("ready", () => {
    const links = SYSTEM_LINKS.map((href) =>
      Object.assign(document.createElement("link"), { href, rel: "stylesheet" })
    )
    const wrapper = document.createElement("div")
    const target = wrapper.attachShadow({ mode: "open" })
    target.append(...links)
    const actionBar = document.querySelector("#action-bar")
    actionBar.append(wrapper)
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

<Popper let:reference let:popper placement="top" offset={[0, 80]}>
  <div class="flex h-full items-center text-xl" use:reference>
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
</Popper>
