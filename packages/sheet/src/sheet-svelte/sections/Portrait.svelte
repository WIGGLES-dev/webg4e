<script lang="ts">
  import { upload, toBase64 } from "dom-utils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{ change: string }>();
  export let src = "";
  export let height: string = "initial";
  async function handleChangeImage() {
    const file = await upload();
    const base64 = await toBase64(file);
    src = base64;
    dispatch("change", src);
  }
</script>

<img
  {src}
  on:dblclick={handleChangeImage}
  name="profile.portrait"
  alt="portrait"
  style="height:{height};"
/>
