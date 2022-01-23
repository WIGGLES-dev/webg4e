<script>
  import { filepicker } from "../util.js"
  import Form from "./form/Form.svelte"
  import Input from "./form/Input.svelte"
  import FeatureEditor from "./FeatureEditor.svelte"
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/index.js"
  export let document
  export let application
  export let typeHints = {}
  async function changeImage(e) {
    filepicker({
      callback: (path) => {
        document.update({ img: path })
      },
    })
  }
</script>

<style lang="postcss">

</style>

<Tabs>
  <TabList>
    <Tab class="text-white">Data</Tab>
    <Tab class="text-white">Features</Tab>
  </TabList>
  <TabPanel>
    <Form>
      <fieldset class="flex">
        <img
          on:click="{changeImage}"
          width="120px"
          src="{$document.img}"
          alt="" />
        <label>
          <span>Name</span>
          <Input bind:value="{$document.name}" />
        </label>
      </fieldset>
      <hr class="my-3" />
      <fieldset class="children:m-3 flex flex-col">
        {#each Object.entries($document.data) as [key, value], i (key)}
          <label>
            <span class="mr-1">{key}</span>
            {#if typeHints[document.type]?.element === 'select'}
              <select bind:value="{$document.data[key]}">
                {#each typeHints[document.type].options as [value, label], i (label)}
                  <option {value}>{label}</option>
                {/each}
              </select>
            {:else}
              <Input bind:value="{$document.data[key]}" />
            {/if}
          </label>
        {/each}
      </fieldset>
      <hr class="my-3" />
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
    </Form>
  </TabPanel>
  <TabPanel>
    <FeatureEditor {document} />
  </TabPanel>
</Tabs>
