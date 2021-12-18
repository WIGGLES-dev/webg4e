<script lang="ts">
  import { getSheetContext } from "./Sheet.svelte";
  import { Tabs, TabList, Tab, TabPanel } from "./shared/tabs";
  import AdvantageTable from "./tables/AdvantageTable.svelte";
  import SkillTable from "./tables/SkillTable.svelte";
  import EquipmentTable from "./tables/EquipmentTable.svelte";
  import SpellTable from "./tables/SpellTable.svelte";
  import MeleeWeaponTable from "./tables/MeleeWeaponTable.svelte";
  import RangedWeaponTable from "./tables/RangedWeaponTable.svelte";
  import AttributeGrid from "./grids/AttributeGrid.svelte";
  import PoolGrid from "./grids/PoolGrid.svelte";
  import EncumbranceTable from "./tables/EncumbranceTable.svelte";
  import LiftingTable from "./grids/LiftingGrid.svelte";
  import PointStats from "./grids/PointSummary.svelte";
  import HitLocationTable from "./tables/HitLocationTable.svelte";
  import HumanSilhouette from "./silhouette/Human.svelte";
  const { character, dispatch } = getSheetContext();
  $: primaryAttributes = $character.primaryAttributes;
  $: secondaryAttributes = $character.secondaryAttributes;
  $: attributes = [...primaryAttributes, ...secondaryAttributes];
  $: pools = $character.pools;
  $: bl = $character.getBasicLift();
  $: move = $character.getMove();
  $: dodge = $character.getDodge();
  $: el = $character.getEncumbranceLevel();
  $: settings = $character.settings;
  $: locations = settings.hitLocations.locations;
</script>

<Tabs>
  <TabList>
    <Tab>General</Tab>
    <Tab>Traits</Tab>
    <Tab>Bio/Misc</Tab>
    <Tab>Skills</Tab>
    <Tab>Combat</Tab>
    <Tab>Silhouette</Tab>
    <Tab>Inventory</Tab>
    <Tab>Grimoire</Tab>
    <Tab>Updates</Tab>
  </TabList>
  <TabPanel>
    <div class="flex flex-wrap gap-1">
      <div class="flex flex-col gap-1">
        <AttributeGrid attributes={primaryAttributes} {character} />
        <hr class="my-2" />
        <AttributeGrid attributes={secondaryAttributes} {character} />
      </div>
      <div>
        <PoolGrid attributes={pools} {character} />
      </div>
      <div>
        <HitLocationTable {settings} />
      </div>
      <div class="flex-1">
        <EncumbranceTable {bl} {move} {dodge} {el} />
        <LiftingTable {bl} />
      </div>
      <div>
        <PointStats character={$character} />
      </div>
    </div>
  </TabPanel>
  <TabPanel>
    <AdvantageTable {character} on:delete on:edit on:sort />
  </TabPanel>
  <TabPanel>
    <!--  -->
  </TabPanel>
  <TabPanel>
    <SkillTable {character} on:delete on:edit on:sort />
  </TabPanel>
  <TabPanel>
    <div>
      <div class="flex flex-col">
        <MeleeWeaponTable {character} />
        <RangedWeaponTable {character} />
      </div>
    </div>
  </TabPanel>
  <TabPanel>
    <HumanSilhouette maxHeight="500" {locations} />
  </TabPanel>
  <TabPanel>
    <EquipmentTable character={$character} on:delete on:edit on:sort />
  </TabPanel>
  <TabPanel>
    <SpellTable {character} on:delete on:edit on:sort />
  </TabPanel>
  <TabPanel>
    <!--  -->
  </TabPanel>
</Tabs>
