<script>
  import { filepicker } from "../../util.js"
  export let src = ""
  export let alt = ""
  export let width = "150px"
  async function changeImage(e) {
    filepicker({
      callback: (path) => {
        src = path
      },
    })
  }
</script>

<img {src} {alt} {width} on:click={changeImage} />
