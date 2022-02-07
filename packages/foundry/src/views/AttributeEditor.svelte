<script>
  export let document
  export let application
  $: attributes = [...$document.data.attributes]
  async function reorder(from, to) {
    to = Math.max(0, to)
    to = Math.min(attributes.length - 1, to)
    const newAttributes = [...attributes]
    newAttributes.splice(to, 0, ...newAttributes.splice(from, 1))
    const res = await document.update({
      data: {
        attributes: newAttributes,
      },
    })
  }
  async function create(at) {
    const newAttributes = [...attributes]
    newAttributes.splice(at, 0, {
      id: `new attribute ${newAttributes.length + 1}`,
      type: "integer",
      name: "",
      full_name: "",
      attribute_base: "10",
      cost_per_point: 0,
      cost_Adj_percent_per_sm: 0,
    })
    const res = await document.update({
      data: {
        attributes: newAttributes,
      },
    })
  }
  async function remove(index) {
    const res = await document.update({
      data: {
        attributes: document.model.attributes.filter((attr, i) => i !== index),
      },
    })
  }
</script>

<ul>
  {#each attributes as attr, i (`${attr.id}${i}`)}
    <li class="flex">
      <div>
        <menu class="flex flex-col gap-2 mr-2">
          <i
            on:click={() => reorder(i, i - 1)}
            class="fas fa-arrow-up hover:outline p-1"
          />
          <i
            on:click={() => reorder(i, i + 1)}
            class="fas fa-arrow-down hover:outline p-1"
          />
          <i on:click={() => create(i)} class="fas fa-plus hover:outline p-1" />
        </menu>
      </div>
      <div class="flex flex-col gap-2">
        <div>
          <label>
            <span>ID</span>
            <input bind:value={attr.id} />
          </label>
          <label>
            <span>Name</span>
            <input bind:value={attr.name} />
          </label>
          <label>
            <span>Full Name</span>
            <input bind:value={attr.full_name} />
          </label>
        </div>
        <div>
          <select bind:value={attr.type}>
            <option value="integer">Integer</option>
            <option value="decimal">Decimal</option>
            <option value="pool">Pool</option>
          </select>
          <label>
            <span>Base</span>
            <input type="text" bind:value={attr.attribute_base} />
          </label>
          <label>
            <span>Cost</span>
            <input type="number" bind:value={attr.cost_per_point} />
          </label>
          <label>
            <span>SM Reduction</span>
            <input type="number" bind:value={attr.cost_adj_percent_per_sm} />
          </label>
        </div>
      </div>
      <div>
        <menu class="flex flex-col">
          <i
            on:click={() => remove(i)}
            class="fas fa-trash hover:bg-red-500 p-3"
          />
        </menu>
      </div>
    </li>
  {/each}
</ul>

<style>
  ul {
    @apply text-white;
  }
  li {
    @apply m-12;
  }
</style>
