<script>
export let room;
export let event;
export let shiftKey;
$: name = room.name;
$: topic = room.topic;

function edit() {
  state.selectedRoom.set(room);
  state.scene.set("room-settings");
}

function invite() {
  state.popup.set({ id: "invite", room });
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

.action {
  display: inline-flex;
  padding: 6px;
  margin-top: 16px;
  border-radius: 4px;
  color: var(--color-link);
  cursor: pointer;
}

.action .icon {
  margin-right: 8px;
}

.action:hover {
  background: rgba(220, 220, 250, .1);
}
</style>
<div class="top">
  <h1>Welcome to {name}!</h1>
  <div class="info">This is the start of the {name} room. {#if topic}{topic}{/if}</div>
  {#if room.power.me >= room.power.getBase("invite")}
  <div class="action" on:click={invite}>
    <div class="icon">person_add</div>
    Invite User
  </div>
  {/if}
  <div class="action" on:click={edit}>
    <div class="icon">edit</div>
    Edit Room
  </div>
  <!--
  {#if shiftKey}
  <div class="action" on:click={() => state.popup.set({ id: "source", event })}>
    <div class="icon">terminal</div>
    View Source
  </div>
  {/if}
  -->
</div>
