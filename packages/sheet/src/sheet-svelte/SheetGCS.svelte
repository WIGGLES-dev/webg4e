<script lang="ts">
  import Section from "./sections/Section.svelte";
  import Portrait from "./sections/Portrait.svelte";
  import Identity from "./sections/Identity.svelte";
  import Miscellaneous from "./sections/Miscellaneous.svelte";
  import Description from "./sections/Description.svelte";
  import PointSummary from "./grids/PointSummary.svelte";
  import AdvantageTable from "./tables/AdvantageTable.svelte";
  import EquipmentTable from "./tables/EquipmentTable.svelte";
  import SkillTable from "./tables/SkillTable.svelte";
  import SpellTable from "./tables/SpellTable.svelte";
  import MeleeWeaponTable from "./tables/MeleeWeaponTable.svelte";
  import RangedWeaponTable from "./tables/RangedWeaponTable.svelte";
  import EncumbranceTable from "./tables/EncumbranceTable.svelte";
  import LiftingGrid from "./grids/LiftingGrid.svelte";
  import HitLocationTable from "./tables/HitLocationTable.svelte";
  import AttributeGrid from "./grids/AttributeGrid.svelte";
  import PoolGrid from "./grids/PoolGrid.svelte";
  import { has, set } from "prop";
  import { getSheetContext } from "./Sheet.svelte";
  function handleChange(e: Event) {
    const target = e.target as HTMLElement;
    const path = target.getAttribute("name");
    if (!path || !has(character, path)) return;
    let value: any;
    if (target instanceof HTMLInputElement) {
      if (target.type === "checkbox") {
        value = target.checked;
      } else if (target.type === "number") {
        value = +target.value;
      } else if (target.type === "text") {
        value = target.value;
      }
    } else if (target instanceof HTMLSelectElement) {
      value = target.value;
    } else if (target instanceof HTMLTextAreaElement) {
      value = target.value;
    } else {
      value = target.textContent;
    }
    set(character, path, value);
    character.set(character);
  }
  const { character: character, dispatch } = getSheetContext();
  const { editItemNotifier, editNotifier } = character;
  $: settings = $character.settings;
  $: bl = $character.getBasicLift();
  $: dodge = $character.getDodge();
  $: move = $character.getMove();
  $: el = $character.getEncumbranceLevel();
  $: primaryAttributes = $character.primaryAttributes;
  $: secondaryAttributes = $character.secondaryAttributes;
  $: poolAttributes = $character.pools;
</script>

<form
  class="sheet flex flex-col gap-1 mb-10"
  on:change={handleChange}
  on:submit|preventDefault
>
  <div class="flex gap-1">
    <Section>
      <span slot="title">Portrait</span>
      <Portrait
        height="200px"
        on:change={({ detail: src }) => ($character.profile.portrait = src)}
        src={$character.getWebProfileSrc()}
      />
    </Section>
    <div class="flex flex-col gap-1 flex-1">
      <div class="flex gap-1">
        <div class="flex-1">
          <Section>
            <span slot="title">Identity</span>
            <div class="form-grid">
              <Identity character={$character} />
            </div>
          </Section>
        </div>
        <Section>
          <span slot="title">Miscellaneous</span>
          <div class="form-grid">
            <Miscellaneous
              createdOn={$character.createdOn}
              modifiedOn={$character.modifiedOn}
              playerName={$character.profile.playerName}
            />
          </div>
        </Section>
      </div>
      <div class="flex gap-1">
        <div class="flex-1">
          <Section>
            <span slot="title">Description</span>
            <div class="description flex">
              <Description character={$character} />
            </div>
          </Section>
        </div>
      </div>
    </div>
    <Section>
      <span slot="title">{$character.totalPoints} Points</span>
      <PointSummary character={$character} />
    </Section>
  </div>
  <div class="flex gap-1">
    <div class="flex justify-between flex-col">
      <div class="flex gap-1 mb-1">
        <AttributeGrid character={$character} attributes={primaryAttributes} />
        <AttributeGrid
          character={$character}
          attributes={secondaryAttributes}
        />
      </div>
      <div class="grid gap-2 grid-cols-2 my-3">
        <div data-roll class="text-right font-bold">
          {$character.getThrust().toString()}
        </div>
        <div>Thrust Damage</div>
        <div data-roll class="text-right font-bold">
          {$character.getSwing().toString()}
        </div>
        <div>Swing Damage</div>
      </div>
      <PoolGrid {character} attributes={poolAttributes} />
    </div>
    <div class="flex-1">
      <HitLocationTable {settings} />
    </div>
    <div class="flex flex-col gap-1 children:last:flex-1">
      <EncumbranceTable {bl} {move} {dodge} {el} />
      <LiftingGrid {bl} />
    </div>
  </div>
  {#each $character.settings.blockLayout as block}
    {#if block === "advantages skills"}
      <div class="flex gap-1 children:flex-1">
        <AdvantageTable {character} on:delete on:edit on:sort />
        <SkillTable {character} on:delete on:edit on:sort />
      </div>
    {:else if block === "equipment"}
      <EquipmentTable character={$character} on:delete on:edit on:sort />
    {:else if block === "melee"}
      <MeleeWeaponTable {character} />
    {:else if block === "notes"}
      <!--  -->
    {:else if block === "ranged"}
      <RangedWeaponTable {character} />
    {:else if block === "reaction conditional_modifiers"}
      <!--  -->
    {:else if block === "spells"}
      <SpellTable {character} on:delete on:edit on:sort />
    {/if}
  {/each}
</form>

<style lang="postcss">
  [slot="title"] {
    @apply block bg-black text-white text-center w-full p-1;
  }
  .form-grid {
    @apply grid gap-1;
    grid-template-columns: min-content 1fr;
  }
  .form-grid :global(label) {
    @apply contents;
  }
  .description :global(fieldset) {
    @apply flex-1 grid gap-1;
    grid-template-columns: min-content 1fr;
  }
  .description :global(label) {
    @apply contents;
  }
  .sheet :global(input) {
    @apply text-blue-500 border-b;
  }
</style>
