<script>
  import DataTable from "../widgets/DataTable.svelte"
  import ItemGrid from "../widgets/ItemGrid.svelte"
  import Popper from "../components/Popper.svelte"
  import Rolling from "./Rolling.svelte"
  import Settings from "./Settings.svelte"
  import SizeSpeedRange from "../widgets/SizeSpeedRange.svelte"
  import Silhouette from "../widgets/silhouette/Silhouette.svelte"
  import { portal } from "../components/Portal.svelte"
  import { Tabs, TabPanel, TabList, Tab } from "../components/tabs/index"
  import { render } from "../components/ContextMenu.svelte"
  import { openApp } from "../application.js"
  export let application
  export let document
  const character = document
  const data = document.$data
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
</script>

<menu class="sidebar">
  <i
    class="fas fa-ruler"
    on:click={() => {
      openApp({
        props: {
          document,
        },
        options: {
          title: "Size Speed & Range Tool",
          component: SizeSpeedRange,
        },
      })
    }}
  />
  <i
    class="fas fa-dice"
    on:click={() => {
      openApp({
        props: {
          document,
        },
        options: {
          title: "Rolling Tool",
          component: Rolling,
        },
      })
    }}
  />
  <i
    class="fas fa-cogs"
    on:click={() =>
      openApp({
        props: {
          document,
        },
        options: {
          title: "Attribute Editor",
          component: Settings,
        },
      })}
  />
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
          <li
            on:contextmenu={render([
              {
                label: "Edit",
                click() {
                  attr.item.sheet.render(true)
                },
              },
              {
                label: "Delete",
                warn: true,
                click() {
                  attr.item.delete()
                },
              },
            ])}
            class="mb-1"
          >
            <div class="flex">
              <input
                on:change={(e) => {
                  const increase = +e.target.value - attr.level
                  const data = attr.item.toObject()
                  const increasedLevel =
                    (data.data.increasedLevel || 0) + increase
                  attr.item.update({
                    "data.increasedLevel": increasedLevel,
                  })
                }}
                step={attr.type === "decimal" ? "0.25" : "1"}
                class="w-12 mr-1"
                type="number"
                value={attr.level}
              />
              <span class="rollable hover:underline self-center flex-1 mx-2">
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
                  class="fas fa-info self-center justify-self-end contrast"
                />
                {#if referenceState.hovered}
                  <div use:portal class="tooltip" use:popper>
                    <ul>
                      <li>points spent: {attr.pointsSpent}</li>
                      <li>levels increased: {attr.increasedLevel}</li>
                    </ul>
                  </div>
                {/if}
              </Popper>
            </div>
            {#if attr.type === "pool"}
              <div class="flex">
                <input
                  min="0"
                  max={attr.level}
                  step="1"
                  type="range"
                  value={attr.current}
                  on:input={(e) => {
                    attr.item.update({
                      "data.current": +e.target.value,
                    })
                  }}
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
        <table class="text-center">
          <tr>
            <th>Roll</th>
            <th>Location</th>
            <th>DR</th>
          </tr>
          {#each Object.values($data.data.body) as part}
            <tr
              on:contextmenu={render([
                {
                  label: "Edit",
                  click() {
                    part.item.sheet.render(true)
                  },
                },
                {
                  label: "Delete",
                  warn: true,
                  click() {
                    part.item.delete()
                  },
                },
              ])}
            >
              <td>{part.rollRange}</td>
              <td>{part.tableName}</td>
              <td>{part.drBonus || 0}</td>
            </tr>
          {/each}
        </table>
      </div>
    </TabPanel>
    <TabPanel>
      <Silhouette
        locations={Object.values($data.data.body)}
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
      <div class="flex flex-col">
        <input name="name" type="text" class="w-full" value={$character.name} />
        <img data-edit src={$character.img} width="225px" />
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
      <div class="col flex-1">
        <label>
          <span>
            Point Total
            <Popper
              placement="right-start"
              offset={[0, 25]}
              let:reference
              let:popper
              let:referenceState
            >
              <i
                class="fas fa-info contrast"
                style:font-size="10px"
                use:reference
              />
              {#if referenceState.hovered}
                <div use:portal use:popper class="col tooltip">
                  <label>
                    <span>unspent points</span>
                    <output>{$data.data.unspentPoints}</output>
                  </label>
                  {#each Object.entries($data.data.pointSummary) as [label, value]}
                    <label>
                      <span>{label}</span>
                      <output>{value}</output>
                    </label>
                  {/each}
                </div>
              {/if}
            </Popper>
          </span>
          <input
            type="number"
            name="data.points"
            value={$character.data.points}
          />
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
      menu={{ add: true, delete: true, edit: true, embed: true }}
    >
      <div>
        <div
          data-formula="3d6ms{skill.model.level}"
          data-uuid={character.uuid}
          class="text-2xl text-center rollable"
        >
          {skill.model.level}
        </div>
      </div>
    </ItemGrid>
  </TabPanel>
  <TabPanel>
    <ItemGrid
      setData={setItemData("equipment")}
      type="equipment"
      {document}
      let:item={equipment}
      menu={{ add: true, delete: true, edit: true, embed: true }}
    >
      <div>
        <div class="flex">
          <div class="flex flex-col">
            <span>{equipment.model.weight} lb</span>
          </div>
          <span
            class="text-xl text-center flex-1 self-center"
            style:min-width="4rem"
          >
            {equipment.model.quantity}
          </span>
        </div>
      </div>
    </ItemGrid>
  </TabPanel>
  <TabPanel>
    <ItemGrid
      setData={setItemData("trait")}
      type="trait"
      {document}
      let:item={trait}
      menu={{ add: true, delete: true, edit: true, embed: true }}
    >
      <div class="flex flex-col">
        {#if trait.model.hasLevels}
          <span class="text-2xl text-center">{trait.model.levels}</span>
        {/if}
      </div>
    </ItemGrid>
  </TabPanel>
  <TabPanel>
    <DataTable
      {document}
      path="data.allWeapons"
      setData={setWeaponData}
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
  .sidebar .fas {
    @apply p-2;
  }
  .sidebar .fas:hover {
    @apply bg-black;
  }
  .right-sidebar {
    background: url("/ui/denim.png");
    box-shadow: 0 0 20px #000;
    left: calc(100% + 15px);
    top: 30px;
    width: max-content;
    @apply absolute overflow-y-auto;
  }
</style>
