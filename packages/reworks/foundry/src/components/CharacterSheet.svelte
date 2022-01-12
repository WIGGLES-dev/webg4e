<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import TreeTable from "./TreeTable.svelte";
  import Observe from "./Observe.svelte";
  import { derived } from "svelte/store";
  import { Character } from "../actor";
  import { Skill, Trait, Equipment } from "../item";
  import { CompositionContext } from "../composition";
  import { AnyDocument, tuple } from "../util";
  export let character: Character;
  const viewType = character.$getFlag<string>("g4e", "view");
  const descendants = character.$descendants({ embedded: true });
  function intoTree<T extends AnyDocument>(ctor: new (...args: any[]) => T) {
    return function (values: CompositionContext[]) {
      return values
        .filter((v): v is CompositionContext<T> => v.document instanceof ctor)
        .map((v) => tuple(v.cursor, undefined, v.document));
    };
  }
  const skills = derived(descendants, intoTree(Skill));
  const equipment = derived(descendants, intoTree(Equipment));
  const traits = derived(descendants, intoTree(Trait));

  $: console.log($skills);
</script>

<Tailwind>
  <button on:click="{() => console.log(character)}">Log Character</button>
  <section>
    <div class="flex">
      <img height="auto" width="160px" src="{$character.img}" alt="" />
      <input type="text" bind:value="{$character.name}" />
    </div>
  </section>
  <TreeTable rows="{$skills}">
    <svelte:fragment slot="caption">"Skills"</svelte:fragment>
    <svelte:fragment slot="thead">
      <tr class="children:Uppercase">
        <th>name</th>
        <th>points</th>
        <th>level</th>
        <th>difficulty</th>
        <th>rsl</th>
        <th>ref</th>
      </tr>
    </svelte:fragment>
    <svelte:fragment let:row>
      <Observe store="{row}" let:value>
        <td on:click="{() => row.sheet?.render(true)}">
          {value.name}
        </td>
        <td>{value.data.points}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </Observe>
    </svelte:fragment>
  </TreeTable>
</Tailwind>
