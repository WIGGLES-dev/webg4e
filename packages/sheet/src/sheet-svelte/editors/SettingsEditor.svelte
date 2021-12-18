<script lang="ts">
  import AceEditor from "../shared/AceEditor.svelte";
  import BaseForm from "../forms/BaseForm.svelte";
  import { Tab, TabList, TabPanel, Tabs } from "../shared/tabs";
  import { Character } from "gurpsjs";
  export let character: Character;
  $: settings = $character.settings.saveGcs();
  $: attributes = settings.attributes;
  $: locations = settings.hit_locations;
  function saveAttributes({ detail: code }: CustomEvent<string>) {
    const attributes = JSON.parse(code);
    console.log(attributes);
    const newSettings = { ...settings, attributes };
    character.settings.loadGcs(newSettings);
    character.set(character);
  }
  function saveHitlocations({ detail: code }: CustomEvent<string>) {
    const hit_locations = JSON.parse(code);
    const newSettings = { ...settings, hit_locations };
    character.settings.loadGcs(newSettings);
    character.set(character);
  }
</script>

<Tabs>
  <TabList>
    <Tab>Options</Tab>
    <Tab>Attributes</Tab>
    <Tab>HitLocations</Tab>
  </TabList>
  <TabPanel>
    <BaseForm>
      <label>
        <!--  -->
      </label>
    </BaseForm>
  </TabPanel>
  <TabPanel>
    <AceEditor
      width="100%"
      height="600px"
      lang="json"
      theme="chrome"
      value={JSON.stringify(attributes, undefined, 4)}
      on:save={saveAttributes}
    />
  </TabPanel>
  <TabPanel>
    <AceEditor
      width="100%"
      height="600px"
      lang="json"
      theme="chrome"
      value={JSON.stringify(locations, undefined, 4)}
      on:save={saveHitlocations}
    />
  </TabPanel>
</Tabs>
