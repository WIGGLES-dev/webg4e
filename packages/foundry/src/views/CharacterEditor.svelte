<script>
  import DataTable from "../components/DataTable.svelte"
  import Application from "../components/Application.svelte"
  import SizeSpeedRange from "../components/SizeSpeedRange.svelte"
  import Rolling from "../components/Rolling.svelte"
  import { Tabs, TabPanel, TabList, Tab } from "../components/tabs/index"
  import { pdFoundryInstalled, openPDF } from "../pdfoundry"
  import { capitalize } from "../util.js"
  import Observe from "../components/Observe.svelte"
  import { Form, Input, Image } from "../components/form/index.js"
  import { FOUNDRY_CSS } from "../constants"
  export let document
  const items = document.$items
  let character = document
  let apps = []
  function openApp(app) {
    if (!apps.some((value) => value.component === app.component))
      apps = [...apps, app]
  }
  function closeApp(component) {
    apps = apps.filter((value) => value.component !== component)
  }
  function log(e) {
    console.log(document)
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
    <button class="action" on:click={log}>Log To Console</button>
    <button
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
  <div class="m-3 p-3">
    <section class="sheet-section">
      <div class="flex gap-3">
        <Image bind:src={$character.img} width="225px" />
        <div>
          <Input bind:value={$character.name} />
        </div>
        <div class="col">
          <label>
            <span>Carried Weight</span>
            <output>{$character.data.carriedWeight}</output>
          </label>
          <label>
            <span>Encumbrance Level</span>
            <output>{$character.data.encumbranceLevel}</output>
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
            <td>{src.data.level}</td>
            <td>{src.flags[game.system.id]?.pdfreference ?? ""}</td>
          </Observe>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
    <TabPanel>
      <DataTable
        menu={{ add: true }}
        ctxmenu={menuItems}
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
          <td class="cursor-pointer">
            {weapon.damage}
          </td>
        </svelte:fragment>
      </DataTable>
    </TabPanel>
  </Tabs>
</Form>

{#each apps as { component, props, ...appProps }, i (component)}
  <Application
    width={1000}
    height={700}
    links={FOUNDRY_CSS}
    on:close={() => closeApp(component)}
    {...appProps}
  >
    <svelte:component this={component} {...props} />
  </Application>
{/each}

<style lang="postcss">
  .sidebar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    clip-path: inset(-20px 0px -20px -20px);
    right: calc(100% - 1px);
    @apply w-max absolute flex flex-col;
  }
  .sidebar .action {
    @apply p-3 hover:outline;
  }
</style>
