<script>
import Room from "./room/Room.svelte";
import Create from "./room/Create.svelte";
import Home from "./room/Home.svelte";
import Category from "./room/Category.svelte";
let focusedSpace = state.focusedSpace;
let focusedRoom = state.focusedRoom;
let navRooms = state.navRooms;
let pushRules = state.pushRules;

function isMuted(room) {
	const rule = $pushRules.rules.find(i => i.id === room.roomId);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
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
  scrollbar-width: thin;
}

.nav > .spacer {
	margin-top: 16px;
}
</style>
<div class="nav scroll" tabindex=-1>
	<div class="spacer"></div>
	<Home />
	{#if !$focusedSpace}
	<Create />
	{/if}
	{#each $navRooms as room}
		{#if room.type === "space"}
		<Category {room} />
		{:else}
		<Room {room} muted={isMuted(room)} />
		{/if}
	{/each}
	<div class="spacer"></div>
</div>
<svelte:window on:keydown={(e) => {
	// TODO: move into proper keybind handler
	if (!(e.altKey && !e.ctrlKey && !e.shiftKey) || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
	const rooms = state.spaces.get(state.focusedSpaceId ?? "orphanRooms");
	const idx = rooms.findIndex(i => i.roomId === state.focusedRoomId);
	const newRoom = rooms[(idx + (e.key === "ArrowUp" ? -1 : 1) + rooms.length) % rooms.length];
	actions.rooms.focus(newRoom);
}} />
