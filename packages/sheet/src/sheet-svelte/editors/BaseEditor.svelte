<script lang="ts">
  import { Item, Character } from "gurpsjs";
  import { Tabs, TabList, Tab, TabPanel } from "../shared/tabs";
  import WeaponPanel from "../panels/WeaponPanel.svelte";
  const hasData = $$slots.data;
  const hasPrerequisites = $$slots.prerequisites;
  const hasFeatures = $$slots.features;
  const hasDefaults = $$slots.defaults;
  const hasModifiers = $$slots.modifiers;
  const hasMeleeWeapons = $$slots["melee weapons"];
  const hasRangedWeapons = $$slots["ranged weapons"];
  const hasUserDescription = $$slots["user description"];
  export let character: Character | undefined = undefined;
  export let item: Item;
</script>

<Tabs>
  <TabList>
    {#if hasData}
      <Tab>Data</Tab>
    {/if}
    {#if hasPrerequisites}
      <Tab>Prerequisites</Tab>
    {/if}
    {#if hasFeatures}
      <Tab>Features</Tab>
    {/if}
    {#if hasDefaults}
      <Tab>Defaults</Tab>
    {/if}
    {#if hasModifiers}
      <Tab>Modifiers</Tab>
    {/if}
    <Tab>Melee Weapons</Tab>
    <Tab>Ranged Weapons</Tab>
    <Tab>User Description</Tab>
  </TabList>
  {#if hasData}
    <TabPanel>
      <slot name="data">
        <!--  -->
      </slot>
    </TabPanel>
  {/if}
  {#if hasPrerequisites}
    <TabPanel>
      <slot name="prerequisites">
        <!--  -->
      </slot>
    </TabPanel>
  {/if}
  {#if hasFeatures}
    <TabPanel>
      <slot name="features">
        <!--  -->
      </slot>
    </TabPanel>
  {/if}
  {#if hasDefaults}
    <TabPanel>
      <slot name="defaults">
        <!--  -->
      </slot>
    </TabPanel>
  {/if}
  {#if hasModifiers}
    <TabPanel>
      <slot name="modifiers">
        <!--  -->
      </slot>
    </TabPanel>
  {/if}
  <TabPanel>
    <slot name="melee weapons">
      <WeaponPanel item="{item}" character="{character}" type="melee" />
    </slot>
  </TabPanel>
  <TabPanel>
    <slot name="ranged weapons">
      <WeaponPanel item="{item}" character="{character}" type="ranged" />
    </slot>
  </TabPanel>
  <TabPanel>
    <slot name="user description">
      <div contenteditable="true">
        {item.userDesc}
      </div>
    </slot>
  </TabPanel>
</Tabs>
