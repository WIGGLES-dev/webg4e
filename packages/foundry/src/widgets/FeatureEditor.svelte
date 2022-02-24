<script>
  import DataTable from "./DataTable.svelte"
  import { Input, Select, Label, Filter } from "../components/form/index.js"
  import { schema, Schema } from "../constants.js"
  export let document
  function createFeature() {
    return {
      enabled: false,
      amount: 0,
      target: document.type,
      property: "name",
      operation: "+",
      leveled: false,
      qualifiers: [],
    }
  }
  function createQualifier() {
    return {
      key: "name",
      or: false,
      not: false,
      operator: "startsWith",
      qualifier: "",
      sensitive: false,
    }
  }
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
  {document}
  create={createFeature}
  path={`flags.${game.system.id}.features`}
  menu={{ add: true, delete: true }}
  let:i
  let:set
  let:filter
  let:append
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
  </svelte:fragment>
  <td>
    <input
      class="w-full"
      checked={feature.enabled}
      type="checkbox"
      on:change={set("enabled")}
    />
  </td>
  <td>
    <select value={feature.target} on:change={set("target")}>
      <option value="this">this</option>
      {#each targets as target}
        <option value={target}>{target}</option>
      {/each}
    </select>
  </td>
  <td>
    <select value={feature.property} on:change={set("property")}>
      <option value="_id">id</option>
      <option value="name">name</option>
      <option value="img">img</option>
      {#each properties(feature.target) as path, i (path)}
        <option value="data.{path}">{path}</option>
      {/each}
    </select>
  </td>
  <td>
    <Filter
      value={feature.qualifiers || []}
      on:add={() => append("qualifiers", createQualifier())}
      let:i={qi}
      let:value={qualifier}
    >
      <Label class="flex" label="or">
        <input
          data-checked={qualifier.or}
          checked={qualifier.or}
          type="checkbox"
          on:change={set(`qualifiers.${qi}.or`)}
        />
      </Label>
      <select value={qualifier.key} on:change={set(`qualifiers.${qi}.key`)}>
        <option value="_id">id</option>
        <option value="name">name</option>
        <option value="img">img</option>
        {#each properties(feature.target) as path, i (path)}
          <option value="data.{path}">{path}</option>
        {/each}
      </select>
      <Label class="flex" label="not">
        <input
          type="checkbox"
          checked={qualifier.not}
          on:change={set(`qualifiers.${qi}.not`)}
        />
      </Label>
      <Select
        on:change={set(`qualifiers.${qi}.operator`)}
        value={qualifier.operator}
        options={comps}
      />
      <Label class="flex" label="sensitive">
        <input
          type="checkbox"
          checked={qualifier.sensitive}
          on:change={set(`qualifiers.${qi}.sensitive`)}
        />
      </Label>
      <input
        value={qualifier.qualifier}
        on:change={set(`qualifiers.${qi}.qualifier`)}
        type="text"
        placeholder="Compare Against"
      />
      <i
        class="fas fa-trash p-2 hover:bg-red-500"
        on:click={() => filter("qualifiers", (v, i) => i !== qi)}
      />
    </Filter>
  </td>
  <td>
    <Select
      value={feature.operation}
      on:change={set("operation")}
      options={ops}
    />
  </td>
  <td>
    <input value={feature.amount} type="text" on:change={set("amount")} />
  </td>
  <td>
    <select value={feature.leveled} on:change={set("leveled")}>
      <option default value={false}>No</option>
      {#each properties(document.type) as path, i (path)}
        <option value={path}>{path}</option>
      {/each}
    </select>
  </td>
</DataTable>
