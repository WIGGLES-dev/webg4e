<script lang="ts">
  import { CharacterSettings } from "gurpsjs";
  export let settings = CharacterSettings.global;
  $: table = settings.hitLocations;
  $: locations = table.locations;
</script>

<table>
  <caption>
    <slot name="caption">{table.name}</slot>
  </caption>
  <thead>
    <tr>
      <th>Roll</th>
      <th>Where</th>
      <th>Penalty</th>
      <th>DR</th>
    </tr>
  </thead>
  {#each locations as location, i (location.id)}
    <tr>
      <td>
        <slot name="roll" {location}>
          {location.rollRange}
        </slot>
      </td>
      <td>
        <slot name="where" {location}>
          {location.choiceName}
        </slot>
      </td>
      <td>
        <slot name="penalty" {location}>
          {location.hitPenalty}
        </slot>
      </td>
      <td>
        <slot name="dr" {location}>
          {location.DRBonus}
        </slot>
      </td>
    </tr>
  {/each}
</table>
