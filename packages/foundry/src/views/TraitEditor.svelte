<script>
  import { Form, Input } from "../components/form/index.js"
  import { Tabs, Tab, TabList, TabPanel } from "../components/tabs/index.js"
  export let document
  export let application
  let trait = document
</script>

<Form>
  <Tabs key={document.id}>
    <TabList>
      <Tab>Data</Tab>
    </TabList>
    <TabPanel>
      <!--  -->
    </TabPanel>
  </Tabs>
</Form>
