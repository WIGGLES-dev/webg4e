<script>
  import { Input } from "../components/form/index.js"
  import { Tabs, Tab, TabList, TabPanel } from "../components/tabs/index.js"
  import WeaponTable from "../widgets/WeaponTable.svelte"
  import FeatureEditor from "../widgets/FeatureEditor.svelte"
  import DefaultEditor from "../widgets/DefaultEditor.svelte"
  export let document
  export let application
  const skill = document
  const data = document.$data
  const parent = skill.parent.$data
  const pdfref = skill.$getSystemFlag("pdfreference")
</script>

<Tabs key={document.id}>
  <TabList>
    <Tab>Data</Tab>
    <Tab>Defaults</Tab>
    <Tab>Features</Tab>
    <Tab>Weapons</Tab>
  </TabList>
  <TabPanel>
    <div class="flex">
      <div class="flex flex-col gap-2">
        <input type="text" value={$skill.name} name="name" />
        <img data-edit src={$skill.img} width="225px" />
      </div>
    </div>
    <div class="flex">
      <div class="col">
        <label>
          <span>points</span>
          <input type="number" min="0" bind:value={$skill.data.points} />
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
            <span>attr</span>
            <select bind:value={$skill.data.attr}>
              <option value={null}>10</option>
              {#each Object.entries($parent.data.attributes) as [id, attr], i (id)}
                <option value={id}>{attr.name}</option>
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
          <input type="text" readonly value={$data.data.level} />
        </label>
      </div>
    </div>
  </TabPanel>
  <TabPanel>
    <DefaultEditor {document} />
  </TabPanel>
  <TabPanel>
    <FeatureEditor {document} />
  </TabPanel>
  <TabPanel>
    <WeaponTable {document} />
  </TabPanel>
</Tabs>
