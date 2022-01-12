<script lang="ts">
  export type T = $$Generic; // extends Record<string, any>
  interface $$Slots {
    default: {
      row: T;
      i: number;
    };
  }
  export let rows: T[];
</script>

<table>
  {#if $$slots.caption}
    <caption>
      <slot name="caption" />
    </caption>
  {/if}
  {#if $$slots.thead}
    <thead>
      <slot name="thead">
        <tr>
          {#each Object.keys(rows[0] || {}) as key}
            <th class="uppercase">{key}</th>
          {/each}
        </tr>
      </slot>
    </thead>
  {/if}
  <tbody>
    {#each rows as row, i}
      <tr>
        <slot row="{row}" i="{i}">
          {#each Object.values(row) as value}
            <td> {value}</td>
          {/each}
        </slot>
      </tr>
    {/each}
  </tbody>
  {#if $$slots.tfoot}
    <tfoot>
      <slot name="tfoot" />
    </tfoot>
  {/if}
</table>

<style>
</style>
