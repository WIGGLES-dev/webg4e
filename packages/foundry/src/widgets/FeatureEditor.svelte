<script>
  import DataTable from "../components/DataTable.svelte"
  import { Input, Select, Label, Filter } from "../components/form/index.js"
  import { schema, Schema } from "../constants.js"
  export let document
  const features = document.$getSystemFlag("features")
  async function addFeature() {
    features.update((features) => {
      const feature = {
        enabled: false,
        amount: 0,
        target: document.type,
        property: "name",
        qualifiers: [],
      }
      if (features) return [...features, feature]
      return [feature]
    })
  }
  async function deleteFeature(index) {
    features.update((features) => {
      return features?.filter((feature, i) => i !== index)
    })
  }
  async function addQualifier(index) {
    features.update((features) => {
      return features.map((feature, i) => {
        if (i === index) {
          const qualifiers = feature.qualifiers || []
          const qualifier = {
            key: "name",
            or: false,
            not: false,
            operator: "startswith",
            qualifier: "",
            sensitive: false,
          }
          return {
            ...feature,
            qualifiers: [...qualifiers, qualifier],
          }
        }
        return feature
      })
    })
  }
  async function removeQualifier(featureIndex, qualifierIndex) {
    features.update((features) => {
      return features.map((feature, i) => {
        if (i === featureIndex) {
          const qualifiers = feature.qualifiers?.filter(
            (qualifier, i) => i !== qualifierIndex
          )
          return {
            ...feature,
            qualifiers,
          }
        }
        return feature
      })
    })
  }
  async function addProperty(index) {}
  async function removeProperty(featureIndex, propertyIndex) {}
  const itemTypes = game.system.template.Item.types
  const actorTypes = game.system.template.Actor.types
  const targets = itemTypes.concat(actorTypes)
  function properties(type) {
    if (type === "this") type = document.type
    const root = schema.Actor[type] || schema.Item[type]
    if (!root) return []
    const paths = []
    function traverse(obj, path = []) {
      for (const [key, value] of Object.entries(obj)) {
        let subPath = [...path, key]
        if (value instanceof Schema) {
          paths.push(subPath)
        } else if (value instanceof Array) {
          traverse(value[0], subPath)
        } else {
          traverse(value, subPath)
        }
      }
    }
    traverse(root)
    return paths.map((path) => path.join("."))
  }
  function operations(type, path) {}
  function amountType(type, path) {
    return "text"
  }
  const ops = [
    ["x", "Multiply"],
    ["+", "Add"],
    ["-", "Subtract"],
    ["%", "Modulo"],
    ["^2", "Square"],
    ["=", "Assign"],
  ]
  const comps = [
    ["startswith", "Starts With"],
    ["endswith", "Ends With"],
    ["includes", "Includes"],
    [">"],
    [">="],
    ["<"],
    ["<="],
    ["=="],
    ["==="],
  ]
</script>

<DataTable
  on:add={addFeature}
  rows={$features}
  menu={{ add: true }}
  let:i
  let:row={feature}
>
  <svelte:fragment slot="header">
    <th>enabled</th>
    <th>target</th>
    <th>property</th>
    <th>filters</th>
    <th>operation</th>
    <th>amount</th>
    <th>leveled</th>
    <th />
  </svelte:fragment>
  {#if $features[i]}
    <td>
      <Input
        class="w-full"
        type="checkbox"
        bind:checked={$features[i].enabled}
      />
    </td>
    <td>
      <Select bind:value={$features[i].target}>
        <option value="this">this</option>
        {#each targets as target}
          <option value={target}>{target}</option>
        {/each}
      </Select>
    </td>
    <td>
      {#if true}
        <Select bind:value={$features[i].property}>
          <option value="_id">id</option>
          <option value="name">name</option>
          <option value="img">img</option>
          {#each properties(feature.target) as path, i (path)}
            <option value="data.{path}">{path}</option>
          {/each}
        </Select>
      {:else}
        <Filter
          on:add={() => addProperty(i)}
          bind:value={$features[i].properties}
          let:i={pi}
        >
          <Input type="text" bind:value={$features[i].properties[pi].key} />
          <Select
            bind:value={$features[i].properties[pi].operator}
            options={comps}
          />
          <i class="fas fa-trash" on:click={() => removeProperty(i, pi)} />
        </Filter>
      {/if}
    </td>
    <td>
      <Filter
        value={feature.qualifiers || []}
        on:add={() => addQualifier(i)}
        let:i={qi}
      >
        <Label label="or">
          <Input
            type="checkbox"
            bind:checked={$features[i].qualifiers[qi].or}
          />
        </Label>
        <Select bind:value={$features[i].qualifiers[qi].key}>
          <option value="_id">id</option>
          <option value="name">name</option>
          <option value="img">img</option>
          {#each properties(feature.target) as path, i (path)}
            <option value="data.{path}">{path}</option>
          {/each}
        </Select>
        <Label label="not">
          <Input
            bind:checked={$features[i].qualifiers[qi].not}
            type="checkbox"
          />
        </Label>
        <Select
          bind:value={$features[i].qualifiers[qi].operator}
          options={comps}
        />
        <Label label="sensitive">
          <Input
            type="checkbox"
            bind:checked={$features[i].qualifiers[qi].sensitive}
          />
        </Label>
        <Input
          bind:value={$features[i].qualifiers[qi].qualifier}
          type="text"
          placeholder="Compare Against"
        />
        <i
          class="fas fa-trash p-2 hover:bg-red-500"
          on:click={() => removeQualifier(i, qi)}
        />
      </Filter>
    </td>
    <td>
      <Select bind:value={$features[i].operation} options={ops} />
    </td>
    <td>
      <Input type="text" on="input" bind:value={$features[i].amount} />
    </td>
    <td>
      <Select bind:value={$features[i].leveled}>
        <option default value={false}>No</option>
        {#each properties(document.type) as path, i (path)}
          <option value={path}>{path}</option>
        {/each}
      </Select>
    </td>
    <td>
      <i
        class="fas fa-trash  p-2 hover:bg-red-500"
        on:click={() => deleteFeature(i)}
      />
    </td>
  {/if}
</DataTable>
