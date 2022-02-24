<script>
  import { Label, Input } from "../components/form/index.js"
  import { Tabs, Tab, TabPanel, TabList } from "../components/tabs/index.js"
  import TextEditor from "../widgets/TextEditor.svelte"
  import WeaponTable from "../widgets/WeaponTable.svelte"
  import FeatureEditor from "../widgets/FeatureEditor.svelte"
  export let document
  export let application
  const equipment = document
  const data = equipment.$data
  const ref = equipment.$getSystemFlag("pdfreference")
  const desc = equipment.$getSystemFlag("desc")
</script>

<Tabs key={document.id}>
  <TabList>
    <Tab>Data</Tab>
    <Tab>Features</Tab>
    <Tab>Weapons</Tab>
    <Tab>Notes</Tab>
  </TabList>
  <TabPanel>
    <div class="flex">
      <div class="flex flex-col gap-2">
        <input name="name" type="text" value={$equipment.name} />
        <img data-edit src={$equipment.img} width="225x" />
      </div>
    </div>
    <div class="flex">
      <div class="col">
        <label>
          <span>Equipped</span>
          <Input
            class="w-full"
            type="checkbox"
            bind:checked={$equipment.data.equipped}
          />
        </label>
        <label>
          <span>Quantity</span>
          <Input type="number" bind:value={$equipment.data.quantity} />
        </label>
        <label>
          <span>Weight</span>
          <Input type="number" bind:value={$equipment.data.weight} />
        </label>
        <label>
          <span>Value</span>
          <Input type="number" bind:value={$equipment.data.value} />
        </label>
        <label>
          <span>Ref</span>
          <Input type="text" bind:value={$ref} />
        </label>
      </div>
      <div class="col">
        <label>
          <span>eWeight</span>
          <Input type="number" readonly={true} value={$data.data.eWeight} />
        </label>
        <label>
          <span>eValue</span>
          <Input type="number" readonly={true} value={$data.data.eValue} />
        </label>
      </div>
    </div>
  </TabPanel>
  <TabPanel>
    <FeatureEditor {document} />
  </TabPanel>
  <TabPanel>
    <WeaponTable {document} />
  </TabPanel>
  <TabPanel>
    <TextEditor bind:value={$desc} />
  </TabPanel>
</Tabs>

<style>
</style>
