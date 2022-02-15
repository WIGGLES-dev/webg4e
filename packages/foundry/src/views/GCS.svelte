<script>
  import { Image, Label, Input } from "../components/form/index.js"
  export let blocks = [
    "reactions",
    "melee",
    "ranged",
    "advantages skills",
    "spells",
    "equipment",
    "other_equipment",
    "notes",
  ]
  let pointSummary = {}
</script>

<div data-section-name="portrait">
  <h3 class="section-title">portrait</h3>
  <slot name="portrait">
    <Image />
  </slot>
</div>
<div data-section-name="identity">
  <h3 class="section-title">identity</h3>
  <slot name="identity">
    <div class="col">
      <Label label="name" type="text" />
      <Label label="title" type="text" />
      <Label label="organization" type="text" />
    </div>
  </slot>
</div>
<div data-section-name="miscellaneous">
  <h3 class="section-title">miscellaneous</h3>
  <slot name="miscellaneous">
    <div class="col">
      <Label label="created" type="date" readonly />
      <Label label="modified" type="date" readonly />
      <Label label="player" type="text" />
    </div>
  </slot>
</div>
<div data-section-name="points">
  <h3 class="section-title">{0} points</h3>
  <slot>
    <ul class="col contents">
      <li class="contents">
        <Input />
        <span>Unspent</span>
      </li>
      {#each Object.entries(pointSummary) as [key, value] (key)}
        <li class="contents">
          <span>{value}</span>
          <span class="capitalize">{key}</span>
        </li>
      {/each}
    </ul>
  </slot>
</div>
<div data-section-name="description">
  <h3 class="section-title">description</h3>
  <slot name="description">
    <div class="flex">
      <div class="col">
        <Label label="gender" type="text" />
      </div>
      <div class="col">
        <Label label="height" type="text" />
      </div>
      <div class="col">
        <Label label="Hair" type="text" />
      </div>
    </div>
  </slot>
</div>
<div data-section-name="primary attributes">
  <h3 class="section-title">primary attributes</h3>
</div>
<div data-section-name="secondary attributes">
  <h3 class="section-title">secondary attributes</h3>
</div>
<div data-section-name="hit locations">
  <h3 class="section-title">
    <!--  -->
  </h3>
</div>
<div data-section-name="encumbrance">
  <h3 class="section-title">encumbrance, move & dodge</h3>
</div>
<div data-section-name="point pools">
  <h3 class="section-title">point pools</h3>
</div>
<div data-section-name="lifting">
  <h3 class="section-title">lifting & moving things</h3>
</div>
{#each blocks as block (block)}
  <div data-section-name={block}>
    {#if block === "reactions"}
      <!--  -->
    {:else if block === "melee"}
      <!--  -->
    {:else if block === "ranged"}
      <!--  -->
    {:else if block === "advantages skills"}
      <!--  -->
    {:else if block === "spells"}
      <!--  -->
    {:else if block === "equipment"}
      <!--  -->
    {:else if block === "other_equipment"}
      <!--  -->
    {:else if block === "notes"}
      <!--  -->
    {/if}
  </div>
{/each}

<style>
  .sheet {
    @apply grid bg-white p-5 gap-1;
  }
  .section-title {
    @apply bg-black text-white capitalize;
  }
  [data-section-name] {
    @apply border-2 border-black border-solid;
  }
  [data-section-name="portrait"] {
  }
  [data-section-name="identity"] {
  }
  [data-section-name="miscellaneous"] {
  }
  [data-section-name="points"] {
  }
  [data-section-name="description"] {
  }
  [data-section-name="primary attributes"] {
  }
  [data-section-name="secondary attributes"] {
  }
  [data-section-name="hit locations"] {
  }
  [data-section-name="encumbrance"] {
  }
  [data-section-name="point pools"] {
  }
  [data-section-name="lifting"] {
  }
  [data-section-name="reactions"] {
  }
  [data-section-name="melee"] {
  }
  [data-section-name="ranged"] {
  }
  [data-section-name="advantages skills"] {
  }
  [data-section-name="spells"] {
  }
  [data-section-name="equipment"] {
  }
  [data-section-name="other_equipment"] {
  }
  [data-section-name="notes"] {
  }
</style>
