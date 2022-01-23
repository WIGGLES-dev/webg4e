<script>
  import StandardItemEditor from "./StandardItemEditor.svelte"
  export let document
  export let application
  let skill = document
  const typeHints = {
    difficulty: {
      element: "select",
      options: [
        [0, "Easy"],
        [-1, "Average"],
        [-2, "Hard"],
        [-3, "Very Hard"],
        [-4, "Wildcard"],
      ],
    },
  }
</script>

<StandardItemEditor {typeHints} {document} {application} />
