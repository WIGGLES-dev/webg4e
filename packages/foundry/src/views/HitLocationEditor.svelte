<script>
  export let document
  export let application
</script>

<div class="col">
  <label>
    <span>id</span>
    <input type="text" name="data.id" value={$document.data.id} />
  </label>
  <label>
    <span>choice name</span>
    <input
      type="text"
      name="data.choiceName"
      value={$document.data.choiceName}
    />
  </label>
  <label>
    <span>table name</span>
    <input type="text" name="data.tableName" value={$document.data.tableName} />
  </label>
  <label>
    <span>slots</span>
    <input type="number" name="data.slots" value={$document.data.hitPenalty} />
  </label>
  <label>
    <span>hit penalty</span>
    <input
      type="number"
      name="data.hitPenalty"
      value={$document.data.hitPenalty}
    />
  </label>
  <label>
    <span>dr bonus</span>
    <input type="number" name="data.drBonus" value={$document.data.drBonus} />
  </label>
  <label>
    <span>roll range</span>
    <input type="text" name="data.rollRange" value={$document.data.rollRange} />
  </label>
</div>
<textarea data-edit name="description" value={$document.data.description} />
