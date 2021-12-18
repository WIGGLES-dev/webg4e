<script lang="ts">
  import { onMount } from "svelte";
  import { Character } from "gurpsjs";
  import { GURPSActor } from "./documents/actor";
  import { GURPSItem } from "./documents/item";
  import { GURPSActorSheet } from "./svelte-actor-sheet";
  import {
    Sheet,
    TailwindProvider,
    AttackCalculator,
    SettingsEditor,
  } from "sheet";
  import Application, { ApplicationComponent } from "./Application.svelte";
  export let sheet: ActorSheet & { object: GURPSActor };
  let actor: GURPSActor = sheet.actor;
  let view = actor.getFlagStore<string>("gurps4e", "view");
  let character: Character = new Character().loadFoundry(actor.data);
  const { editItemNotifier, removeItemNotifier, addItemNotifier } = character;
  $: actor.update($character.saveFoundry());
  $: character.set($character.loadFoundry($actor));
  onMount(() => {
    const sub = editItemNotifier.subscribe(async (id) => {
      let item = character.getItem(id);
      if (item) {
        const itemI = actor.getEmbeddedDocument("Item", item.id);
        if (!itemI) return;
        const res = await itemI.update(item.saveFoundry());
      }
    });
    return () => sub.unsubscribe();
  });
  $: {
    let item = $addItemNotifier;
    if (item) {
      actor.createEmbeddedDocuments("Item", [item.saveFoundry()]);
    }
  }
  $: actor.deleteEmbeddedDocuments("Item", $removeItemNotifier);
  function handleRoll(e: CustomEvent<{ formula: string; data?: any }>) {
    const { formula, data } = e.detail;
    new Roll(formula, data).toMessage();
  }
  function handleNotify(e: CustomEvent<string>) {
    const message = e.detail;
    ui.notifications?.notify(message);
  }
  function handleEdit(e: CustomEvent<string>) {
    const id = e.detail;
    (actor.getEmbeddedDocument("Item", id) as Item | undefined)?.sheet?.render(
      true
    );
  }
  function handleSort(e: CustomEvent<string[]>) {
    const ids = e.detail;
    const updates = ids
      .map((id, i) => actor.getEmbeddedDocument("Item", id))
      .filter((item): item is GURPSItem => item instanceof GURPSItem)
      .map((item, i) => ({
        _id: item.id,
        sort: i,
      }));
    actor.updateEmbeddedDocuments("Item", updates);
  }

  $: attackPenaltyToolRendered = false;
  const attackPenaltyTool: ApplicationComponent<AttackCalculator> = {
    component: AttackCalculator,
    props: {},
    events: {
      roll({ detail: { modifier, target } }) {
        new Roll(`3d6ms${target + modifier}`).toMessage();
      },
    },
  };
  $: settingsEditorRendered = false;
  const settingsEditor: ApplicationComponent<SettingsEditor> = {
    component: SettingsEditor,
    props: {
      character,
    },
    events: {},
  };
</script>

<TailwindProvider>
  <div class="m-3">
    {#if actor.type === "character"}
      <menu
        class="absolute whitespace-nowrap flex flex-col"
        style="right: 100%;"
      >
        <button on:click={() => (settingsEditorRendered = true)}>
          Edit Settings
        </button>
        <select bind:value={$view}>
          <option value="gcs">GCS</option>
          <option value="tabbed">Tabbed</option>
        </select>
        <button on:click={() => (attackPenaltyToolRendered = true)}>
          Attack
        </button>
        <button>Speed Range Finder</button>
      </menu>
      <Sheet
        {character}
        view={$view}
        on:notify={handleNotify}
        on:roll={handleRoll}
        on:edit={handleEdit}
        on:sort={handleSort}
      />
    {:else if actor.type === "party"}
      <!--  -->
    {/if}
  </div>
</TailwindProvider>

<Application
  class="m-3"
  component={attackPenaltyTool}
  bind:rendered={attackPenaltyToolRendered}
/>

<Application
  class="m-3"
  component={settingsEditor}
  bind:rendered={settingsEditorRendered}
/>
