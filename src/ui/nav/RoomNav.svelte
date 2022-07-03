<script>
import Popup from "../atoms/Popup.svelte";
let focusedRoom = state.focusedRoom;
let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;
let rooms = state.rooms;

state.focusedRoom.subscribe(() => {
	rooms = state.rooms; // hacky svelte ;)
});

function getClasses(room) {
	const classes = ["room"];
	if (state.focusedRoomId === room.roomId) classes.push("selected");
	if (!room.hasUserReadEvent(state.client.getUserId())) classes.push("unread");
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
	font-weight: 500;
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

.room.unread {
	color: var(--fg-content); 
}

.room::before {
	content: "# ";
	font-weight: 700;
	color: var(--fg-dim); 
}

.home::before {
	content: "";
}

.spacer {
	margin: 4px;
}
</style>
<div class="nav">
	<div class="spacer"></div>
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
	<div class="spacer"></div>
</div>
