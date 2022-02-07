<script>
  import { Form, Label, Input, Image } from "../components/form/index.js"
  import { Tabs, Tab, TabPanel, TabList } from "../components/tabs/index.js"
  import TextEditor from "../components/TextEditor.svelte"
  import WeaponTable from "../widgets/WeaponTable.svelte"
  export let document
  export let application
  let equipment = document
  const ref = equipment.$getSystemFlag("pdfreference")
  const desc = equipment.$getSystemFlag("desc")
</script>

<Form>
  <Tabs key={document.id}>
    <TabList>
      <Tab>Data</Tab>
      <Tab>Features</Tab>
      <Tab>Weapons</Tab>
      <Tab>Notes</Tab>
    </TabList>
    <TabPanel>
      <div class="flex">
        <Image bind:src={$equipment.img} width="120px" />
        <Input bind:value={$equipment.name} />
      </div>
      <div class="flex">
        <div class="col">
          <label>
            <span>Equipped</span>
            <Input type="checkbox" bind:checked={$equipment.data.equipped} />
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
            <Input
              type="number"
              readonly={true}
              value={$equipment.data.eWeight}
            />
          </label>
          <label>
            <span>eValue</span>
            <Input
              type="number"
              readonly={true}
              value={$equipment.data.eValue}
            />
          </label>
        </div>
      </div>
    </TabPanel>
    <TabPanel>
      <!--  -->
    </TabPanel>
    <TabPanel>
      <WeaponTable {document} />
    </TabPanel>
    <TabPanel>
      <TextEditor bind:value={$desc} />
    </TabPanel>
  </Tabs>
</Form>

<style lang="postcss">
</style>
