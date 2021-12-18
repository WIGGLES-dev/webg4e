<script lang="ts">
  import { Character } from "gurpsjs";
  export let character: Character;
  let profile = character.profile;
</script>

<fieldset>
  <label>
    <span>Gender</span>
    <input type="text" name="profile.gender" value={profile.gender} />
  </label>
  <label>
    <span>Age</span>
    <input type="text" name="profile.age" value={profile.age} />
  </label>
  <label>
    <span>Birthday</span>
    <input type="text" name="profile.birthday" value={profile.birthday} />
  </label>
  <label>
    <span>Religion</span>
    <input type="text" name="profile.religion" value={profile.religion} />
  </label>
</fieldset>
<fieldset>
  <label>
    <span>Height</span>
    <input type="text" name="profile.height" value={profile.height} />
  </label>
  <label>
    <span>Weight</span>
    <input type="text" name="profile.weight" value={profile.weight} />
  </label>
  <label>
    <span>Size</span>
    <input
      type="number"
      name="profile.sizeModifier"
      value={profile.sizeModifier}
    />
  </label>
  <label>
    <span>TL</span>
    <input type="text" name="profile.sizeModifier" value={profile.techLevel} />
  </label>
</fieldset>
<fieldset>
  <label>
    <span>Hair</span>
    <input type="text" name="profile.hair" value={profile.hair} />
  </label>
  <label>
    <span>Eyes</span>
    <input type="text" name="profile.eyeColor" value={profile.eyeColor} />
  </label>
  <label>
    <span>Skin</span>
    <input type="text" name="profile.skinColor" value={profile.skinColor} />
  </label>
  <label>
    <span>Hand</span>
    <input type="text" name="profile.handedness" value={profile.handedness} />
  </label>
</fieldset>

<style lang="postcss">
</style>
