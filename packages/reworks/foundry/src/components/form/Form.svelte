<script>
  let classList
  export { classList as class }
  function submit(e) {
    e.preventDefault()
  }
</script>

<form class={classList} on:submit={submit}>
  <slot />
</form>
