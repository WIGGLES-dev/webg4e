<script lang="ts">
  import { Character } from "gurpsjs";
  export let character: Character;
</script>

<label>
  <span>Name</span>
  <input type="text" name="profile.name" value={character.profile.name} />
</label>
<label>
  <span>Title</span>
  <input type="text" name="profile.title" value={character.profile.title} />
</label>
<label>
  <span>Organization</span>
  <input
    type="text"
    name="profile.organization"
    value={character.profile.organization}
  />
</label>
