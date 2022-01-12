<script lang="ts">
  type T = $$Generic; // extends Record<string, any>;
  interface $$Slots {
    default: {
      row: T;
      depth: number;
      i: number;
    };
  }
  import Table from "./Table.svelte";
  export let rows: [depth: number, open: boolean | undefined, data: T][];
  function pluck(key: string | number) {
    return function (value: any): T {
      return value[key];
    };
  }
  function depth(i: number): number {
    return rows[i][0];
  }
  function open(i: number): boolean | undefined {
    return rows[i][1];
  }
</script>

<Table rows="{rows.map(pluck(2))}">
  <svelte:fragment slot="caption">
    <slot name="caption" />
  </svelte:fragment>
  <svelte:fragment slot="thead">
    <tr>
      <th>
        <!-- Toggle Header -->
      </th>
      <slot name="thead" />
    </tr>
  </svelte:fragment>
  <svelte:fragment let:row let:i>
    <td>
      <!-- TODO: Toggle -->
    </td>
    <slot row="{row}" depth="{depth(i)}" i="{i}" />
  </svelte:fragment>
  <svelte:fragment slot="tfoot">
    <slot name="tfoot" />
  </svelte:fragment>
</Table>
