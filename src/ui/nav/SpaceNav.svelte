<script>
let spaces = [];
state.rooms.subscribe((newRooms) => spaces = newRooms.filter(i => i.isSpaceRoom()));
// TODO: focused space
// <div class={focusedRoom?.roomId === room.roomId ? "space selected" : "space"} on:click={actions.rooms.focus(room)}>{room.name}</div>
// let focusedRoom = null;
// state.focusedRoom.subscribe((newRoom) => focusedRoom = newRoom);
</script>
<style>
.nav {
  background: var(--bg-spaces);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  width: 72px;
}

.space {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.space:hover {
  border-radius: 35%;
}

.separator {
  border: solid #ffffff10 1px;
  width: 45%;
  margin-top: 8px;
}
</style>
<div class="nav">
  <img class="space selected" src={state.client.mxcUrlToHttp("mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx")}>
  <div class="separator"></div>
	{#each spaces as space}
  <img class="space" src={space.getAvatarUrl(state.client.baseUrl)}>
	{/each}
</div>

