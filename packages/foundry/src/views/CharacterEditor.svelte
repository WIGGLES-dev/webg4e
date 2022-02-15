<script>
  import DataTable from "../components/DataTable.svelte"
  import ItemGrid from "../widgets/ItemGrid.svelte"
  import Popper from "../components/Popper.svelte"
  import Rolling from "./Rolling.svelte"
  import Observe from "../components/Observe.svelte"
  import Settings from "./Settings.svelte"
  import SizeSpeedRange from "../widgets/SizeSpeedRange.svelte"
  import Silhouette from "../widgets/silhouette/Silhouette.svelte"
  import { portal } from "../components/Portal.svelte"
  import { Tabs, TabPanel, TabList, Tab } from "../components/tabs/index"
  import { Input, Image } from "../components/form/index.js"
  import { speedRange } from "../formula.js"
  import { pdFoundryInstalled, openPDF } from "../pdfoundry"
  import { capitalize } from "../util.js"
  import { SvelteApplication } from "../application.js"
  import { SYSTEM_LINKS } from "../constants.js"
  export let application
  export let document
  const items = document.$items
  const character = document
  const data = document.$data
  let speedRangeTool = 0
  const openApps = new Set()
  function openApp({ props = {}, options }) {
    if (openApps.has(options.component)) return
    openApps.add(options.component)
    const app = new SvelteApplication(
      {
        document,
        ...props,
      },
      {
        ...options,
        links: SYSTEM_LINKS,
        shadow: { mode: "open" },
      }
    )
    app.on("close", () => {
      openApps.delete(options.component)
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
        [`foundry/${game.system.id}/hotbar`]: JSON.stringify(macro),
        [`foundry/${game.system.id}/sheet2sheet`]: row.uuid,
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
  async function sortTable({
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
  async function sortHeader() {}
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

<menu class="sidebar">
  <button type="button" class="contrast" on:click={log}>Log To Console</button>
  <button
    type="button"
    on:click={() =>
      openApp({
        options: {
          title: "Size Speed & Range Tool",
          component: SizeSpeedRange,
        },
      })}
    class="contrast"
  >
    Size/Speed
  </button>
  <button
    type="button"
    on:click={() => {
      openApp({
        options: {
          title: "Rolling Tool",
          component: Rolling,
        },
      })
    }}
    class="contrast"
  >
    Rolling
  </button>
  <button
    type="button"
    on:click={() =>
      openApp({
        options: {
          title: "Attribute Editor",
          component: Settings,
        },
      })}
    class="contrast"
  >
    <i class="fas fa-cogs" />
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
<section class="right-sidebar">
  <Tabs key="right-sidebar {document.id}">
    <TabList>
      <Tab>Attributes</Tab>
      <Tab>Body</Tab>
      <Tab>Silhouette</Tab>
    </TabList>
    <TabPanel>
      <ul>
        {#each Object.entries($data.data.attributes) as [id, attr], i (id)}
          <li class="mb-1">
            <div class="flex">
              <input
                on:change={(e) => {
                  const increase = +e.target.value - attr.level
                  const data = attr.item.toObject()
                  const increasedLevel =
                    (data.data.increasedLevel || 0) + increase
                  attr.item.update({
                    data: { increasedLevel },
                  })
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
                placement="right-start"
                offset={[0, 25]}
                let:reference
                let:popper
                let:referenceState
              >
                <i
                  use:reference
                  style:font-size="10px"
                  class="fas fa-info self-center ml-3 justify-self-end contrast"
                />
                {#key i}
                  <div use:popper use:portal={(node) => node.getRootNode()}>
                    {#if referenceState.hovered}
                      <ul class="denim sheet-shadow p-3">
                        <li>points spent: {attr.pointsSpent}</li>
                        <li>levels increased: {attr.increasedLevel}</li>
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
                  bind:value={$character.data.attributes[i].current}
                />
                <span class=" flex-1 text-xs self-center text-center">
                  {attr.current}
                </span>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </TabPanel>
    <TabPanel>
      <div class="m-2">
        <table class="m-auto">
          <caption>Hit Location Table</caption>
          <tr>
            <th>Roll</th>
            <th>Location</th>
            <th>DR</th>
          </tr>
          {#each [] as part}
            <tr>
              <td>{part.calc.rollRange}</td>
              <td>{part.tableName}</td>
              <td>{part.drBonus || 0}</td>
            </tr>
          {/each}
        </table>
      </div>
    </TabPanel>
    <TabPanel>
      <Silhouette
        locations={[]}
        viewBox={[200, 0, 400, 800]}
        height="500px"
        width="200px"
      >
        <div
          style:width="250px"
          class="bg-black p-3 rounded opacity-75"
          slot="tooltip"
          let:location
        >
          <p>id: {location.id}</p>
          <p>name: {location.tableName}</p>
          <p>slots: {location.slots}</p>
          <p>hit penalty: {location.hitPenalty}</p>
          <p>dr: {location.drBonus}</p>
          <p>description: {location.description}</p>
        </div>
      </Silhouette>
    </TabPanel>
  </Tabs>
</section>

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
          <output>{$data.data.carriedWeight}</output>
        </label>
        <label>
          <span>Encumbrance</span>
          <output>{$data.data.encumbranceLevel}</output>
        </label>
        <label>
          <span>Swing</span>
          <output
            class="rollable"
            data-formula={$data.data.swing}
            data-uuid={character.uuid}
          >
            {$data.data.swing}
          </output>
        </label>
        <label>
          <span>Thrust</span>
          <output
            class="rollable"
            data-formula={$data.data.thrust}
            data-uuid={character.uuid}
          >
            {$data.data.thrust}
          </output>
        </label>
      </div>
      <div class="col">
        <label>
          <span class="whitespace-nowrap">Basic Lift</span>
          <output>{$data.data.basicLift}</output>
        </label>
      </div>
      <div class="col">
        <label>
          <span>
            Point Total
            <br />
            [{$data.data.unspentPoints} unspent]
          </span>
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
    <ItemGrid
      setData={setItemData("skill")}
      type="skill"
      {document}
      let:item={skill}
      menu={{ add: true }}
    >
      <div
        class="rollable"
        data-formula="3d6ms{skill.model.level}"
        data-uuid={character.uuid}
      >
        <div class="text-center">{skill.name}</div>
        <div class="text-2xl text-center">{skill.model.level}</div>
      </div>
    </ItemGrid>
    <!-- <DataTable
      menu={{ add: true }}
      ctxmenu={menuItems}
      setData={setItemData("skill")}
      key="character skill table"
      rows={rows("skill")}
      draggable
      sortable
      on:add={addEmbedded("skill")}
      on:sort={sortTable}
      on:order={sortHeader}
      let:row={skill}
    >
      <svelte:fragment slot="header">
        <th data-sort="name" class="w-full">name</th>
        <th data-sort="data.points">points</th>
        <th data-sort="data.level">level</th>
        <th data-sort="flags.{game.system.id}.pdfreference">ref</th>
      </svelte:fragment>
      <Observe let:value={src} store={skill.$data}>
        <td>{src.name}</td>
        <td>{src.data.points}</td>
        <td
          class="rollable"
          data-formula="3d6ms{src.data.level}"
          data-uuid={character.uuid}
        >
          {src.data.level}
        </td>
        <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
      </Observe>
    </DataTable> -->
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
      on:add={addEmbedded("equipment")}
      on:sort={sortTable}
      on:order={sortHeader}
      let:row={equipment}
      let:i
    >
      <svelte:fragment slot="header">
        <th data-sort="name">name</th>
        <th data-sort="data.quantity">quantity</th>
        <th data-sort="data.weight">weight</th>
        <th data-sort="data.eWeight">eWeight</th>
        <th data-sort="data.value">value</th>
        <th data-sort="data.eValue">eValue</th>
        <th data-sort="flags.{game.system.id}.pdfreference">ref</th>
      </svelte:fragment>
      <Observe let:value={src} store={equipment.$data}>
        <td>{src.name}</td>
        <td>{src.data.quantity}</td>
        <td>{src.data.weight}</td>
        <td>{src.data.containedWeight}</td>
        <td>{src.data.value}</td>
        <td>{src.data.containedValue}</td>
        <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
      </Observe>
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
      on:add={addEmbedded("trait")}
      on:sort={sortTable}
      on:order={sortHeader}
      let:row={trait}
    >
      <svelte:fragment slot="header">
        <th data-sort="name">name</th>
        <th data-sort="data.points">cost</th>
        <th data-sort="flags.{game.system.id}.pdfreference">ref</th>
      </svelte:fragment>
      <Observe let:value={src} store={trait.$data}>
        <td>{src.name}</td>
        <td>{src.data.points}</td>
        <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
      </Observe>
    </DataTable>
  </TabPanel>
  <TabPanel>
    <DataTable
      key="character weapons table"
      setData={setWeaponData}
      rows={$data.data.allWeapons}
      let:row={weapon}
    >
      <svelte:fragment slot="header">
        <th>Name</th>
        <th>Usage</th>
        <th>Damage</th>
      </svelte:fragment>
      <td>{weapon.ownerName}</td>
      <td>{weapon.usage}</td>
      <td
        class="rollable"
        data-formula={weapon.damage}
        data-uuid={character.uuid}
      >
        {weapon.damage}
      </td>
    </DataTable>
  </TabPanel>
</Tabs>

<style>
  .sheet-shadow {
    box-shadow: 0 0 20px #000;
  }
  .denim {
    background-color: rgb(35, 34, 29);
  }
  .sidebar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    right: calc(100% + 15px);
    top: 30px;
    width: max-content;
    @apply absolute flex flex-col;
  }
  .right-sidebar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    left: calc(100% + 15px);
    top: 30px;
    width: max-content;
    @apply absolute overflow-y-auto;
  }
  .toolbar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    right: 0px;
    top: calc(100% + 15px);
    @apply absolute w-full;
  }
</style>
