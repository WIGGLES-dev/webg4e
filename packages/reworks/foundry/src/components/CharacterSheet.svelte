<script>
  import DataTable from './DataTable.svelte'
  import { filepicker} from '../util.js'
  import {Tabs, TabPanel, TabList, Tab} from './tabs/index'
  import Observe from "./Observe.svelte";
  import Input from "./form/Input.svelte";
  export let document;
  let character = document
  const items = character.$items;
  async function changeImage(e) {
    filepicker({
      callback: (path) => {
        document.update({ img: path })
      },
    })
  }
</script>

<main class="m-3 p-3">
  <section class="sheet-section">
    <div class="flex">
      <img on:click={changeImage} width="225px" src="{$character.img}" alt="" />
      <div>
        <Input bind:value={$character.name} />
      </div>
    </div>
  </section>

  <Tabs>
    <TabList>
      <Tab>Skills</Tab>
      <Tab>Equipment</Tab>
      <Tab>Traits</Tab>
      <Tab>Weapons</Tab>
    </TabList>
    <TabPanel>
      <DataTable {document} type="skill">
        <svelte:fragment slot="header">
          <th>name</th>
          <th>points</th>
          <th>level</th>
          <th>ref</th>
        </svelte:fragment>
        <svelte:fragment let:row={skill}>
          <Observe let:value={src} store={skill}>
            <td>{src.name}</td>
            <td>{src.data.points}</td>
            <td>{src.data.level}</td>
            <td>{src.flags[game.system.id]?.ref ?? ''}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable {document} type="equipment">
        <svelte:fragment slot="header">
          <th>name</th>
          <th>quantity</th>
          <th>weight</th>
          <th>value</th>
        </svelte:fragment>
        <svelte:fragment let:row={item}>
          <Observe let:value={src} store={item}>
            <td>{src.name}</td>
            <td>{src.data.quantity}</td>
            <td>{src.data.weight}</td>
            <td>{src.data.value}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable {document} type="trait">
        <svelte:fragment slot="header">
          <th>name</th>
          <th>cost</th>
        </svelte:fragment>
        <svelte:fragment let:row={item}>
          <Observe let:value={src} store={item}>
            <td>{src.name}</td>
            <td>0</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <!--  -->
    </TabPanel>
  </Tabs>
</main>

<style lang="postcss">
  
</style>
