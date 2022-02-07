<script>
  export let value
  function set(v) {
    value = v
  }
</script>

<slot {value} {set} />
