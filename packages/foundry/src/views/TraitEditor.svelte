<script>
  import { Input, Label, Image } from "../components/form/index.js"
  import { Tabs, Tab, TabList, TabPanel } from "../components/tabs/index.js"
  import FeatureEditor from "../widgets/FeatureEditor.svelte"
  export let document
  export let application
  const trait = document
  const data = document.$data
</script>

<Tabs key={document.id}>
  <TabList>
    <Tab>Data</Tab>
    <Tab>Features</Tab>
  </TabList>
  <TabPanel>
    <div class="flex">
      <div class="flex flex-col gap-2">
        <Input bind:value={$trait.name} />
        <Image bind:src={$trait.img} width="120px" />
      </div>
    </div>
    <div class="flex">
      <div class="col flex-1">
        <Label
          label="base point cost"
          type="number"
          bind:value={$trait.data.basePointCost}
        />
      </div>
      <fieldset class="flex-1">
        <legend class="w-full text-center">Types</legend>
        <div class="col">
          <Label
            label="mental"
            type="checkbox"
            bind:checked={$trait.data.type.mental}
          />
          <Label
            label="physical"
            type="checkbox"
            bind:checked={$trait.data.type.physical}
          />
          <Label
            label="social"
            type="checkbox"
            bind:checked={$trait.data.type.social}
          />
          <Label
            label="exotic"
            type="checkbox"
            bind:checked={$trait.data.type.exotic}
          />
          <Label
            label="supernatural"
            type="checkbox"
            bind:checked={$trait.data.type.supernatural}
          />
        </div>
      </fieldset>
    </div>
  </TabPanel>
  <TabPanel>
    <FeatureEditor {document} />
  </TabPanel>
</Tabs>
