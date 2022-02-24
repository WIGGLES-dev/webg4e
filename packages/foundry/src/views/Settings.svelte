<script>
  import { Input, Label } from "../components/form/index.js"
  import { Tabs, TabList, Tab, TabPanel } from "../components/tabs/index.js"
  export let application
  export let document
  const preferences = document.$getSystemFlag(`${document.type} preferences`)
</script>

<Tabs>
  <TabList>
    <Tab>Preferences</Tab>
  </TabList>
  <TabPanel>
    <div class="col">
      <Label label="dev mode" type="checkbox" />
      <Label label="strength attribute" type="text" />
    </div>
  </TabPanel>
</Tabs>
