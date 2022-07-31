<script>
export let room;
$: name = room.name;
$: topic = room.topic;

function edit() {
  state.selectedRoom.set(room);
  state.scene.set("room-settings");
}
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

.edit {
  display: inline-flex;
  padding: 4px;
  margin-top: 16px;
  border-radius: 4px;
  color: var(--color-link);
  cursor: pointer;
}

.edit .icon {
  margin-right: 8px;
}

.edit:hover {
  background: rgba(220, 220, 250, .1);
}
</style>
<div class="top">
  <h1>Welcome to {name}!</h1>
  <div class="info">This is the start of the {name} room. {#if topic}{topic}{/if}</div>
  <div class="edit" on:click={edit}>
    <div class="icon">edit</div>
    Edit Room
  </div>
</div>
