<script>
  import Input from './form/Input.svelte'
  import Select from './form/Select.svelte'
  import { FEATURE_TYPES } from '../constants.js'
  export let document
  const features = document.$getFlag(game.system.id, 'features')
  async function addFeature() {
    features.update((features) => {
      const feature = { type: 'skill bonus', amount: 0 }
      if (features) return [...features, feature]
      return [feature]
    })
  }
  async function deleteFeature(index) {
    features.update((features) => {
      return features?.filter((feature, i) => i !== index)
    })
  }
</script>

<menu>
  <button on:click={addFeature}>Add Effect</button>
</menu>
<table>
  <thead>
    <tr>
      <th>type</th>
      <th>amount</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#if $features}
      {#each $features as feature, i (i)}
        <tr>
          <td>
            <Select bind:value={feature.type}>
              {#each Object.entries(FEATURE_TYPES) as [type, label], i (type)}
                <option value={type}>{label}</option>
              {/each}
            </Select>
          </td>
          <td>
            <Input type="number" on="input" bind:value={feature.amount} />
          </td>
          <td>
            <button on:click={() => deleteFeature(i)}>Delete</button>
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
