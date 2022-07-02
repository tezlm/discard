<script>
import Popup from "../atoms/Popup.svelte";
let focusedRoom = state.focusedRoom;
let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;
let rooms = state.rooms;
let showPopup = false;

state.focusedRoom.subscribe(() => {
	rooms = state.rooms; // hacky svelte ;)
});

function getClasses(room) {
	const classes = ["room"];
	if (state.focusedRoomId === room.roomId) classes.push("selected");
	if (room.hasUserReadEvent(state.client.getUserId())) classes.push("unread");
	return classes;
}
</script>
<style>
.nav {
	flex: 1;
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	width: 240px;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
}

.room {
	margin: 2px 8px;
	padding: 6px 10px;
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
}

.room:hover {
	background: rgba(79,84,92,0.4);
  color: var(--fg-light);
}

.room.selected {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.room::before {
	content: "# ";
	font-weight: bold;
}

.home::before {
	content: "";
}

.header {
  display: flex;
  align-items: center;
  padding: 8px 1rem;
  height: 48px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2),
    0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
  z-index: 1;
	margin-bottom: 1em;
	font-weight: bold;
}
</style>
<div class="nav">
	<div class="header" on:click={() => showPopup = true}>
	  <span>{$focusedSpace ? state.client.getRoom($focusedSpace).name : "Home"}</span>
	  <Popup bind:show={showPopup} title="todo">nothing here right now</Popup>
	</div>
	{#if !$focusedSpace}
  <div
		class={$focusedRoom ? "room home" : "room home selected"}
		on:click={() => actions.rooms.focus(null)}>
		Home
	</div>
	{/if}
	{#each $rooms.filter(i => $spaceMap.get($focusedSpace ?? "orphanRooms").includes(i.roomId)) as room}
	  <div
			class={getClasses(room).join(" ")}
			on:click={() => actions.rooms.focus(room)}>
			{room.name}
		</div>
	{/each}
</div>
