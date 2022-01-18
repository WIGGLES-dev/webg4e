<script>
  import Observe from "./Observe.svelte";
  import Input from "./form/Input.svelte";
  export let character;
  const items = character.$items;
</script>

<main class="sheet">
  <section class="sheet-section">
    <div class="flex">
      <img width="225px" src="{$character.img}" alt="" />
      <div>
        <Input class="bg-transparent border border-white p-1" bind:value={$character.name} />
        <button on:click="{() => console.log(character)}">Log</button>
      </div>
    </div>
  </section>

  <section class="sheet-section">
    <table class="w-full">
      <caption>Skills</caption>
      <thead>
        <tr class="bg-white children:text-left text-black">
          <th>name</th>
          <th>points</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each $items.filter((item) => item.type === "skill") as skill, i (skill.id)}
          <tr>
            <Observe let:value="{src}" store="{skill}">
              <td>{src.name}</td>
              <td>{src.data.points}</td>
              <td>
                <button on:click="{() => skill?.sheet.render(true)}">
                  Edit
                </button>
              </td>
              <td>
                <button on:click="{() => skill.delete()}">Delete</button>
              </td>
            </Observe>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>

<style lang="postcss">
  .sheet {
    @apply text-white;
  }
  .sheet-section {
    @apply m-3 p-3 border border-white;
  }
</style>
