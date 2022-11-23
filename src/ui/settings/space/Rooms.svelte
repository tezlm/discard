<script>
export let room;
const children = room.state
  .filter(i => i.type === "m.space.child")
  .filter(i => i.content.via?.length);
</script>
<p>todo: list rooms, create rooms, remove rooms</p>
<div style="height: 1em"></div>
<table style="width: 100%">
  <tr><th>id</th><th>suggested</th><th>order</th><th>name</th></tr>
{#each children as child (child.id)}
  <tr><td>{child.stateKey}</td><td>{child.content.suggested}</td><td>{child.content.order}</td><td>{state.rooms.get(child.stateKey)?.name}</td></tr>
{:else}
  <tr><i>no rooms</i></tr>
{/each}
</table>
