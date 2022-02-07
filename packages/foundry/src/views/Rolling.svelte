<script>
  import { Form, Input, Select } from "../components/form/index.js"
  let rollType = "general"
  let flavor = ""
  export let modifiers = []
  function roll() {}
</script>

<Form>
  <Input bind:value={flavor} />
  <Select bind:value={rollType}>
    <option value="genderal">General</option>
    <option value="attack">Attack</option>
  </Select>
  {#if rollType === "general"}
    <fieldset class="col">
      <label>
        <span>Modifier</span>
        <Input />
      </label>
    </fieldset>
  {:else if rollType === "attack"}
    <fieldset class="col">
      <label>
        <span>Modifier</span>
        <Input />
      </label>
    </fieldset>
  {/if}
  <ul>
    {#each modifiers as mod, i (i)}
      <li>
        <!--  -->
      </li>
    {/each}
  </ul>
  <button on:click={roll}>Roll</button>
</Form>
