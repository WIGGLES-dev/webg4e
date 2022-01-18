<script>
  import Form from './form/Form.svelte'
  import Input from './form/Input.svelte'
  import FeatureEditor from './FeatureEditor.svelte'
  export let skill
  export let application
</script>

<style lang="postcss">
  label > span {
    @apply text-white;
  }
</style>

<Form>
  <fieldset class="flex">
    <img width="120px" src={$skill.img} alt="" />
    <label>
      <span>Name</span>
      <Input bind:value={$skill.name} />
    </label>
  </fieldset>

  <hr class="my-3" />
  <fieldset class="children:m-3">
    {#each Object.entries($skill.data) as [key, value], i (key)}
      <label>
        <span>{key}</span>
        <Input {value} />
      </label>
    {/each}
  </fieldset>
  <hr class="my-3" />
  {#each Object.entries($skill.flags) as [system, value], i (key)}
    {#each Object.entries(value) as [scope, scopeValue], i (scope)}
      <fieldset>
        <label>
          <span>{scope}</span>
          <div>{JSON.stringify(scopeValue, undefined, 2)}</div>
        </label>
      </fieldset>
    {/each}
  {/each}
</Form>
