<script>
  import { filepicker } from "../util.js"
  import { Input } from "../components/form/index.js"
  import { Tabs, TabList, TabPanel, Tab } from "../components/tabs/index.js"
  export let document
  export let application
  async function changeImage(e) {
    filepicker({
      callback: (path) => {
        document.update({ img: path })
      },
    })
  }
</script>

<Tabs>
  <TabList>
    <Tab>Data</Tab>
    <Tab>Flags</Tab>
    <Tab>Effects</Tab>
  </TabList>
  <TabPanel>
    <fieldset class="flex">
      <img on:click={changeImage} width="120px" src={$document.img} alt="" />
      <label>
        <span>Name</span>
        <Input bind:value={$document.name} />
      </label>
    </fieldset>
    <hr class="my-3" />
    <fieldset class="children:m-3 flex flex-col">
      {#each Object.entries($document.data) as [key, value], i (key)}
        <label>
          <span class="mr-1">{key}</span>
          <!--  -->
        </label>
      {/each}
    </fieldset>
  </TabPanel>
  <TabPanel>
    {#each Object.entries($document.flags) as [scope, value], i (scope)}
      <fieldset class="ml-3">
        <legend>{scope}</legend>
        <fieldset class="ml-3">
          {#each Object.entries(value) as [key, value], i (scope)}
            <label class="flex ml-6">
              <span class="mr-1">{key}</span>
              <div class="text-white">
                {JSON.stringify(value, undefined, 2)}
              </div>
            </label>
          {/each}
        </fieldset>
      </fieldset>
    {/each}
  </TabPanel>
  <TabPanel>
    <!--  -->
  </TabPanel>
</Tabs>

<style>
</style>
