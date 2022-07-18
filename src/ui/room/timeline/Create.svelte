<script>
export let event;
$: room = state.rooms.get(event.roomId);
$: name = room?.name;
$: topic = room?.topic;
</script>
<style>
.top {
  margin-top: 48px;
  padding: 2px 16px;
}

h1 {
  font-family: var(--font-display);
}

.info {
  color: var(--fg-light);
  margin-top: 8px;
}
</style>
<div class="top">
  <h1>Welcome to {name}!</h1>
  <div class="info">This is the start of the {name} room. {#if topic}{topic}{/if}</div>
</div>
