<script>
export let event;
$: room = state.client.getRoom(event.roomId);
$: name = room?.name;
$: topic = room?.currentState.getStateEvents("m.room.topic")[0]?.getContent().topic;
</script>
<style>
.create {
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
<div class="create">
  <h1>Welcome to {name}!</h1>
  <div class="info">This is the start of the {name} room. {topic}</div>
</div>
