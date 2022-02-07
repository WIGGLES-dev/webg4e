<script>
  import { fly } from "svelte/transition"
  import DataTable from "../components/DataTable.svelte"
  import Popper from "../components/Popper.svelte"
  import Rolling from "./Rolling.svelte"
  import Observe from "../components/Observe.svelte"
  import AttributeEditor from "./AttributeEditor.svelte"
  import SizeSpeedRange from "../widgets/SizeSpeedRange.svelte"
  import { portal } from "../components/Portal.svelte"
  import { Tabs, TabPanel, TabList, Tab } from "../components/tabs/index"
  import { Form, Input, Image } from "../components/form/index.js"
  import { speedRange } from "../formula.js"
  import { pdFoundryInstalled, openPDF } from "../pdfoundry"
  import { capitalize } from "../util.js"
  import { SvelteApplication } from "../application.js"
  import { SYSTEM_LINKS } from "../constants.js"
  export let application
  export let document
  const items = document.$items
  let character = document
  let speedRangeTool = 0
  const openApps = new Set()
  function openApp({ component, props = {}, title = "", options }) {
    if (openApps.has(component)) return
    openApps.add(component)
    const app = new SvelteApplication(
      {
        application,
        document,
        ...props,
      },
      {
        title,
        ...options,
        links: SYSTEM_LINKS,
        component,
      }
    )
    app.on("close", () => {
      openApps.delete(component)
    })
    app.render(true)
  }
  function log(e) {
    console.log(document)
  }
  function setItemData(type) {
    return function (row) {
      const command = `
        await game.system.executeMacro(
          {
            uuid: "${row.uuid}"
          }, 
          ...arguments
        )
      `
      const macro = {
        type: "Macro",
        data: {
          name: `roll ${row.name}`,
          type: "script",
          command,
          img: row.img,
        },
      }
      return {
        "text/plain": JSON.stringify(macro),
      }
    }
  }
  function setWeaponData(weapon) {
    const command = `
    
    `
    const macro = {
      name: `roll`,
      type: "script",
      command,
    }
    return {
      "text/plain": macro,
    }
  }
  function addEmbedded(type) {
    return function (e) {
      document.createEmbeddedDocuments("Item", [
        {
          type,
          name: `New ${capitalize(type)}`,
          data: {},
          flags: {
            [game.system.id]: {},
          },
        },
      ])
    }
  }
  function sortEmbedded() {
    return async function ({
      detail: { dragging, target, siblings, sortBefore },
    }) {
      const sort = SortingHelpers.performIntegerSort(dragging, {
        target,
        siblings,
        sortBefore,
      })
      const updates = sort.map((u) => ({
        _id: u.target.data._id,
        ...u.update,
      }))
      await document.updateEmbeddedDocuments("Item", updates)
    }
  }
  $: rows = (type) =>
    $items
      .filter((item) => item.type === type)
      .sort((a, b) => a.data.sort - b.data.sort)
  function menuItems(row) {
    const isContainer = row.getSystemFlag("container")
    return [
      {
        label: "Edit",
        click() {
          row.sheet?.render(true)
        },
      },
      {
        can: false,
        label: isContainer ? "Unset Container" : "Set Container",
        click() {
          row.setSystemFlag("container", !isContainer)
        },
      },
      {
        label: "Open PDF",
        get can() {
          return pdFoundryInstalled()
        },
        click() {
          const ref = row.getSystemFlag("pdfreference")
          if (ref) {
            const split = ref.search(/\d/)
            const [code, page] = [ref.slice(0, split), ref.slice(split)]
            openPDF(code, { page: +page })
          } else {
            ui.notifications.warn(`${ref} is not a valid page reference`)
          }
        },
      },
      {
        label: "Log",
        click() {
          console.log(row)
        },
      },
      {
        warn: true,
        label: "Delete",
        click() {
          row.delete()
        },
      },
    ]
  }
</script>

<Form>
  <menu class="sidebar">
    <button type="button" class="action" on:click={log}>Log To Console</button>
    <button
      type="button"
      on:click={() =>
        openApp({
          component: SizeSpeedRange,
          props: {},
          title: "Size Speed & Range Tool",
        })}
      class="action"
    >
      Size/Speed
    </button>
    <button
      type="button"
      on:click={() => {
        openApp({
          component: Rolling,
          props: {},
          title: "Rolling Tool",
        })
      }}
      class="action"
    >
      Rolling
    </button>
  </menu>
  <menu class="toolbar">
    <div class="flex flex-col w-min">
      <label>
        <output>{speedRange(speedRangeTool)}</output>
        <span>Distance Penalty</span>
      </label>
      <input
        min="0"
        placeholder="distance"
        type="number"
        bind:value={speedRangeTool}
      />
    </div>
  </menu>
  <div class="attributes">
    <div class="m-3">
      <menu class="mb-3">
        <i
          on:click={() =>
            openApp({
              component: AttributeEditor,
              props: {
                document,
                application,
              },
              title: "Attribute Editor",
            })}
          class="fas fa-cogs hover:outline p-1"
        />
        <i class="fas fa-gavel hover:outline p-1" />
      </menu>
      <ul style:max-height="700px">
        {#each $character.data.attributes as attr, i (attr.id)}
          <li transition:fly={{ x: 100, duration: 250 }} class="mb-1">
            <div class="flex">
              <input
                on:change={(e) => {
                  attr.increasedLevel =
                    attr.increasedLevel + (+e.target.value - attr.level)
                }}
                step={attr.type === "decimal" ? "0.25" : "1"}
                class="w-12 mr-1"
                type="number"
                value={attr.level}
              />
              <span class="rollable hover:underline self-center flex-1">
                {attr.full_name || attr.name}
              </span>
              <Popper
                portal={(node) => node.getRootNode()}
                placement="right-start"
                offset={[0, 40]}
                let:reference
                let:popper
                let:referenceState
              >
                <i
                  use:reference
                  class="fas fa-info-circle self-center ml-3 justify-self-end hover:text-green-500"
                />
                {#key i}
                  <div use:popper use:portal={(node) => node.getRootNode()}>
                    {#if referenceState.hovered}
                      <ul class="denim sheet-shadow p-3">
                        <li>points spent: {attr.pointsSpent}</li>
                        <li>levels increased: {attr.increasedLevel}</li>
                        <li>feature bonus: {attr.featureBonus}</li>
                      </ul>
                    {/if}
                  </div>
                {/key}
              </Popper>
            </div>
            {#if attr.type === "pool"}
              <div class="flex">
                <input
                  min="0"
                  max={attr.level}
                  step="1"
                  type="range"
                  bind:value={attr.current}
                />
                <span class=" flex-1 text-xs self-center text-center">
                  {attr.current}
                </span>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="m-3 p-3">
    <section class="sheet-section">
      <div class="flex gap-3">
        <div>
          <Input class="w-full" bind:value={$character.name} />
          <Image bind:src={$character.img} width="175px" />
        </div>
        <div class="col">
          <label>
            <span>Carried Weight</span>
            <output>{$character.data.carriedWeight}</output>
          </label>
          <label>
            <span>Encumbrance</span>
            <output>{$character.data.encumbranceLevel}</output>
          </label>
          <label>
            <span>Swing</span>
            <output class="rollable">{$character.data.swing}</output>
          </label>
          <label>
            <span>Thrust</span>
            <output class="rollable">{$character.data.thrust}</output>
          </label>
        </div>
        <div class="col">
          <label>
            <span class="whitespace-nowrap">Basic Lift</span>
            <output>{$character.data.basicLift}</output>
          </label>
        </div>
        <div class="col">
          <label>
            <span>Point Total</span>
            <Input type="number" bind:value={$character.data.points} />
          </label>
        </div>
      </div>
    </section>
  </div>
  <Tabs key={document.id}>
    <TabList>
      <Tab>Skills</Tab>
      <Tab>Equipment</Tab>
      <Tab>Traits</Tab>
      <Tab>Weapons</Tab>
    </TabList>
    <TabPanel>
      <DataTable
        menu={{ add: true }}
        ctxmenu={menuItems}
        setData={setItemData("skill")}
        key="character skill table"
        rows={rows("skill")}
        draggable
        sortable
        {document}
        on:add={addEmbedded("skill")}
        on:sort={sortEmbedded()}
      >
        <svelte:fragment slot="header">
          <th class="w-full">name</th>
          <th>points</th>
          <th>level</th>
          <th>ref</th>
        </svelte:fragment>
        <svelte:fragment let:row={skill}>
          <Observe let:value={src} store={skill}>
            <td>{src.name}</td>
            <td>{src.data.points}</td>
            <td class="rollable">{src.data.level}</td>
            <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable
        menu={{ add: true }}
        ctxmenu={menuItems}
        setData={setItemData("equipment")}
        key="character equipment table"
        rows={rows("equipment")}
        draggable
        sortable
        {document}
        on:add={addEmbedded("equipment")}
        on:sort={sortEmbedded()}
      >
        <svelte:fragment slot="header">
          <th>name</th>
          <th>quantity</th>
          <th>weight</th>
          <th>eWeight</th>
          <th>value</th>
          <th>eValue</th>
          <th>ref</th>
        </svelte:fragment>
        <svelte:fragment let:row={item}>
          <Observe let:value={src} store={item}>
            <td>{src.name}</td>
            <td>{src.data.quantity}</td>
            <td>{src.data.weight}</td>
            <td>{src.data.containedWeight}</td>
            <td>{src.data.value}</td>
            <td>{src.data.containedValue}</td>
            <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable
        menu={{ add: true }}
        ctxmenu={menuItems}
        setData={setItemData("trait")}
        key="character trait table"
        rows={rows("trait")}
        draggable
        sortable
        {document}
        on:add={addEmbedded("trait")}
        on:sort={sortEmbedded()}
      >
        <svelte:fragment slot="header">
          <th>name</th>
          <th>cost</th>
          <th>ref</th>
        </svelte:fragment>
        <svelte:fragment let:row={item}>
          <Observe let:value={src} store={item}>
            <td>{src.name}</td>
            <td>0</td>
            <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable
        key="character weapons table"
        setData={setWeaponData}
        rows={$character.data.allWeapons}
        {document}
      >
        <svelte:fragment slot="header">
          <th>Name</th>
          <th>Usage</th>
          <th>Damage</th>
        </svelte:fragment>
        <svelte:fragment let:row={weapon}>
          <td>{weapon.name}</td>
          <td>{weapon.usage}</td>
          <td class="rollable">
            {weapon.damage}
          </td>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
  </Tabs>
</Form>

<style lang="postcss">
  .sheet-shadow {
    box-shadow: 0 0 20px #000;
  }
  .denim {
    background: url("/ui/denim.png");
  }
  .sidebar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    clip-path: inset(-20px 0px -20px -20px);
    right: calc(100% - 2px);
    top: 30px;
    @apply absolute w-max flex flex-col;
  }
  .attributes {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    clip-path: inset(-20px -20px -20px 0px);
    left: calc(100% - 2px);
    top: 30px;
    @apply absolute w-max overflow-y-scroll;
  }
  .sidebar .action {
    @apply p-3 hover:outline;
  }
  .toolbar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    //clip-path: inset(0px -20px -20px -20px);
    right: 0px;
    top: calc(100% + 15px);
    @apply absolute w-full;
  }
</style>
