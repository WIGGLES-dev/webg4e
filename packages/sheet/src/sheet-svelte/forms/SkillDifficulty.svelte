<script lang="ts">
  import { SkillDifficulty } from "gurpsjs";
  export let difficulty: SkillDifficulty;
  export let name = "";
</script>

<select {name} bind:value={difficulty}>
  <option value={SkillDifficulty.Easy}>E</option>
  <option value={SkillDifficulty.Average}>A</option>
  <option value={SkillDifficulty.Hard}>H</option>
  <option value={SkillDifficulty.VeryHard}>VH</option>
  <option value={SkillDifficulty.Wildcard}>W</option>
</select>
