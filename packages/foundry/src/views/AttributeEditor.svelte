<script>
  import { Form, Select, Label } from "../components/form/index.js"
  export let document
  export let application
</script>

<Form>
  <div class="col">
    <Label bind:value={$document.data.id} label="id" />
    <Label label="type">
      <Select bind:value={$document.data.type}>
        <option value="integer">Integer</option>
        <option value="decimal">Decimal</option>
        <option value="pool">Pool</option>
      </Select>
    </Label>
    <Label bind:value={$document.data.name} label="name" />
    <Label bind:value={$document.data.fullName} label="fullName" />
    <Label bind:value={$document.data.formula} label="formula" />
    <Label
      type="number"
      bind:value={$document.data.costPerPoint}
      label="cost per point"
    />
  </div>
</Form>
