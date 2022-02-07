<script>
  import { Form, Image, Input } from "../components/form/index.js"
  import { Tabs, Tab, TabList, TabPanel } from "../components/tabs/index.js"
  import WeaponTable from "../widgets/WeaponTable.svelte"
  export let document
  export let application
  let skill = document
  const parent = skill.parent
  const pdfref = skill.$getSystemFlag("pdfreference")
</script>

<Form>
  <Tabs key={document.id}>
    <TabList>
      <Tab>Data</Tab>
      <Tab>Weapons</Tab>
    </TabList>
    <TabPanel>
      <div class="flex gap-3">
        <Image bind:src={$skill.img} width="120px" />
        <Input bind:value={$skill.name} />
      </div>
      <div class="flex">
        <div class="col">
          <label>
            <span>points</span>
            <input type="number" bind:value={$skill.data.points} />
          </label>
          <label>
            <span>difficulty</span>
            <select bind:value={$skill.data.difficulty}>
              <option value={0}>Easy</option>
              <option value={-1}>Average</option>
              <option value={-2}>Hard</option>
              <option value={-3}>Very Hard</option>
              <option value={-4}>Wildcard</option>
            </select>
          </label>
          {#if parent}
            <label>
              <span>Attr</span>
              <select bind:value={$skill.data.attr}>
                <option value={null}>10</option>
                {#each $parent.data.attributes as attr, i (attr.id)}
                  <option value={attr.id}>{attr.name}</option>
                {/each}
              </select>
            </label>
          {/if}
          <label>
            <span>Reference</span>
            <Input bind:value={$pdfref} />
          </label>
        </div>
        <div class="col">
          <label>
            <span>level</span>
            <input type="text" readonly value={$skill.data.level} />
          </label>
        </div>
      </div>
    </TabPanel>
    <TabPanel>
      <WeaponTable {document} />
    </TabPanel>
  </Tabs>
</Form>
