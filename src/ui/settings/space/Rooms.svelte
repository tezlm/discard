<script>
export let room;
const children = $room.state
  .filter(i => i.type === "m.space.child")
  .filter(i => Object.keys(i.content).length)
</script>
<p>todo: list rooms, create rooms, remove rooms</p>
<br />
<table>
  <tr><th>id</th><th>suggested</th></tr>
{#each children as child}
  <tr><td>{child.state_key}</td><td>{child.content.suggested}</td></tr>
{:else}
  <tr><i>no rooms</i></tr>
{/each}
</table>
