<script>
let rooms = [];
let focusedRoom = null;
state.rooms.subscribe((newRooms) => rooms = newRooms);
state.focusedRoom.subscribe((newRoom) => focusedRoom = newRoom);
</script>
<style>
.nav {
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	width: 240px;
}

.room {
	margin: 4px 8px;
	padding: 4px 8px;
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
}

.room:hover {
	background: rgba(79,84,92,0.4);
}

.room.selected {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.room:before {
	content: "# ";
	font-weight: bold;
}
</style>
<div class="nav">
	{#each rooms as room}
  <div class={focusedRoom?.roomId === room.roomId ? "room selected" : "room"} on:click={actions.rooms.switch(room)}>{room.name}</div>
	{/each}
</div>
