<script lang="ts">
  export let createdOn: string;
  export let modifiedOn: string;
  export let playerName: string;
</script>

<label>
  <span>Created</span>
  <input type="text" readonly value={createdOn} />
</label>
<label>
  <span>Modified</span>
  <input type="text" readonly value={modifiedOn} />
</label>
<label>
  <span>Player</span>
  <input type="text" name="profile.playerName" value={playerName} />
</label>
