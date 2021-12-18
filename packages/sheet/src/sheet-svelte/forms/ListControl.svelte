<script lang="ts">
  export let list: string[];
  export let seperator = ",";
  export let name = "";
  let commaString = list.join(seperator + " ");
  $: {
    list = commaString.split(seperator);
  }
</script>

<input {name} type="text" bind:value={commaString} />
