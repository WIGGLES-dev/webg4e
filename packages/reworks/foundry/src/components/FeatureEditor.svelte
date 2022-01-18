<script>
  import Input from './form/Input.svelte'
  export let document
  const effects = document.$effects
  function expand(effect) {
    return { effect, feature: effect.getFlag(game.system.id, 'feature') }
  }
  const path = (...segments) => [
    'flags',
    game.system.id,
    'feature',
    ...segments,
  ]
</script>

<table>
  <thead>
    <tr>
      <th>type</th>
      <th>amount</th>
    </tr>
  </thead>
  <tbody>
    {#each $effects.map(expand) as { effect, feature }, i (effect.id)}
      <tr>
        <td>{feature.type}</td>
        <td>
          <Input type="number" on="input" path={path('type')} store={effect} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
