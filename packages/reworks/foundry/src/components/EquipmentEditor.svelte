<script>
  import Form from "./form/Form.svelte"
  import Input from "./form/Input.svelte"
  import { Tabs, Tab, TabPanel, TabList } from "./tabs/index.js"
  import TextEditor from "./TextEditor.svelte"
  export let document
  export let application
  let equipment = document
</script>

<style lang="postcss">
  .col {
    @apply grid gap-2 grid-cols-2 children:contents h-min;
  }
</style>

<Form>
  <Tabs>
    <TabList>
      <Tab>Data</Tab>
      <Tab>Features</Tab>
      <Tab>Notes</Tab>
    </TabList>
    <TabPanel>
      <div class="flex">
        <img width="120px" src="{$equipment.img}" />
        <Input bind:value="{$equipment.name}" />
      </div>
      <div class="flex">
        <div class="col">
          <label>
            <span>Equipped</span>
            <Input type="checkbox" bind:value="{$equipment.data.equipped}" />
          </label>
          <label>
            <span>Quantity</span>
            <Input type="number" bind:value="{$equipment.data.quantity}" />
          </label>
          <label>
            <span>Weight</span>
            <Input type="number" bind:value="{$equipment.data.weight}" />
          </label>
          <label>
            <span>Value</span>
            <Input type="number" bind:value="{$equipment.data.value}" />
          </label>
        </div>
        <div class="col">
          <label>
            <span>eWeight</span>
            <Input
              type="number"
              readonly="{true}"
              value="{$equipment.data.eWeight}" />
          </label>
          <label>
            <span>eValue</span>
            <Input
              type="number"
              readonly="{true}"
              value="{$equipment.data.eValue}" />
          </label>
        </div>
      </div>
    </TabPanel>
    <TabPanel>
      <!--  -->
    </TabPanel>
    <TabPanel>
      <TextEditor bind:value="{$equipment.data.desc}" />
    </TabPanel>
  </Tabs>
</Form>
